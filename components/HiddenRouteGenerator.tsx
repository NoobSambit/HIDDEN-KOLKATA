'use client';

import { useState } from 'react';
import { Pin } from '@/utils/types';
import { generateHiddenRoute, GeneratedRoute } from '@/lib/fetchGemini';
import { fetchWalkingRoute, formatDistance, formatDuration } from '@/lib/fetchOSRM';
import { Sparkles, Loader2, Route, Clock, Navigation } from 'lucide-react';
import { toast } from 'sonner';

type HiddenRouteGeneratorProps = {
  pins: Pin[];
  onRouteGenerated: (route: {
    title: string;
    description: string;
    path: [number, number][];
    distance: number;
    duration: number;
    orderedPins: Pin[];
  }) => void;
};

export default function HiddenRouteGenerator({
  pins,
  onRouteGenerated,
}: HiddenRouteGeneratorProps) {
  const [selectedPins, setSelectedPins] = useState<Set<string>>(new Set());
  const [generating, setGenerating] = useState(false);

  const togglePin = (pinId: string) => {
    const newSelected = new Set(selectedPins);
    if (newSelected.has(pinId)) {
      newSelected.delete(pinId);
    } else {
      if (newSelected.size >= 5) {
        toast.error('Maximum 5 pins allowed per route');
        return;
      }
      newSelected.add(pinId);
    }
    setSelectedPins(newSelected);
  };

  const handleGenerateRoute = async () => {
    if (selectedPins.size < 2) {
      toast.error('Please select at least 2 pins');
      return;
    }

    setGenerating(true);

    try {
      const selectedPinObjects = pins.filter((p) => selectedPins.has(p.id));

      const geminiRoute = await generateHiddenRoute(
        selectedPinObjects.map((p) => ({
          name: p.name,
          latitude: p.latitude,
          longitude: p.longitude,
        }))
      );

      if (!geminiRoute) {
        toast.error('Failed to generate route description');
        setGenerating(false);
        return;
      }

      const orderedPins: Pin[] = [];
      for (const name of geminiRoute.order) {
        const pin = selectedPinObjects.find(
          (p) => p.name.toLowerCase() === name.toLowerCase()
        );
        if (pin) orderedPins.push(pin);
      }

      if (orderedPins.length === 0) {
        orderedPins.push(...selectedPinObjects);
      }

      const osrmRoute = await fetchWalkingRoute(
        orderedPins.map((p) => ({ lat: p.latitude, lng: p.longitude }))
      );

      if (!osrmRoute) {
        toast.error('Failed to generate walking directions');
        setGenerating(false);
        return;
      }

      onRouteGenerated({
        title: geminiRoute.title,
        description: geminiRoute.description,
        path: osrmRoute.coordinates,
        distance: osrmRoute.distance,
        duration: osrmRoute.duration,
        orderedPins,
      });

      toast.success('Route generated successfully!');
      setSelectedPins(new Set());
    } catch (error) {
      console.error('Error generating route:', error);
      toast.error('Failed to generate route');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Sparkles size={24} className="text-[#C46C24]" />
          Create Hidden Route
        </h2>
        <span className="text-sm text-gray-500">
          {selectedPins.size}/5 selected
        </span>
      </div>

      <p className="text-sm text-gray-600">
        Select 2-5 hidden gems to create an AI-powered walking route through Kolkata.
      </p>

      <div className="max-h-64 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-3">
        {pins.map((pin) => (
          <button
            key={pin.id}
            onClick={() => togglePin(pin.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
              selectedPins.has(pin.id)
                ? 'bg-[#C46C24] text-white'
                : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-sm">{pin.name}</p>
                <p
                  className={`text-xs mt-1 ${
                    selectedPins.has(pin.id) ? 'text-white/80' : 'text-gray-500'
                  }`}
                >
                  {pin.description.substring(0, 60)}
                  {pin.description.length > 60 ? '...' : ''}
                </p>
              </div>
              {selectedPins.has(pin.id) && (
                <span className="text-xs font-bold bg-white text-[#C46C24] px-2 py-1 rounded">
                  {Array.from(selectedPins).indexOf(pin.id) + 1}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={handleGenerateRoute}
        disabled={generating || selectedPins.size < 2}
        className="w-full px-6 py-3 bg-[#C46C24] text-white rounded-lg font-medium hover:bg-[#A05A1D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {generating ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Generating Route...
          </>
        ) : (
          <>
            <Sparkles size={20} />
            Generate Hidden Route
          </>
        )}
      </button>
    </div>
  );
}
