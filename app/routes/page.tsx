'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabaseClient';
import { Pin } from '@/utils/types';
import HiddenRouteGenerator from '@/components/HiddenRouteGenerator';
import { formatDistance, formatDuration } from '@/lib/fetchOSRM';
import { Loader2, Route as RouteIcon, Clock, Navigation, Save, X } from 'lucide-react';
import { toast } from 'sonner';

const RouteMapView = dynamic(() => import('@/components/RouteMapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#FAF9F6]">
      <Loader2 size={48} className="animate-spin text-[#C46C24]" />
    </div>
  ),
});

type GeneratedRouteData = {
  title: string;
  description: string;
  path: [number, number][];
  distance: number;
  duration: number;
  orderedPins: Pin[];
};

export default function RoutesPage() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatedRoute, setGeneratedRoute] = useState<GeneratedRouteData | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPins();
  }, []);

  const fetchPins = async () => {
    try {
      const { data, error } = await supabase
        .from('pins')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPins(data || []);
    } catch (error) {
      console.error('Error fetching pins:', error);
      toast.error('Failed to load pins');
    } finally {
      setLoading(false);
    }
  };

  const handleRouteGenerated = (route: GeneratedRouteData) => {
    setGeneratedRoute(route);
  };

  const handleSaveRoute = async () => {
    if (!generatedRoute) return;

    setSaving(true);

    try {
      const { error } = await supabase.from('trails').insert({
        title: generatedRoute.title,
        description: generatedRoute.description,
        pin_ids: generatedRoute.orderedPins.map((p) => p.id),
        path: generatedRoute.path,
      });

      if (error) throw error;

      toast.success('Route saved successfully!');
    } catch (error) {
      console.error('Error saving route:', error);
      toast.error('Failed to save route');
    } finally {
      setSaving(false);
    }
  };

  const handleClearRoute = () => {
    setGeneratedRoute(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-[#C46C24] mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hidden Routes</h1>
        <p className="text-gray-600">
          Create AI-powered walking routes connecting Kolkata&apos;s hidden gems
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <HiddenRouteGenerator pins={pins} onRouteGenerated={handleRouteGenerated} />

          {generatedRoute && (
            <div className="bg-white rounded-xl p-6 shadow-lg space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {generatedRoute.title}
                </h3>
                <button
                  onClick={handleClearRoute}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed">
                {generatedRoute.description}
              </p>

              <div className="space-y-2 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Navigation size={16} className="text-[#C46C24]" />
                  <span className="font-medium">
                    {formatDistance(generatedRoute.distance)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={16} className="text-[#C46C24]" />
                  <span className="font-medium">
                    {formatDuration(generatedRoute.duration)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <RouteIcon size={16} className="text-[#C46C24]" />
                  <span className="font-medium">
                    {generatedRoute.orderedPins.length} stops
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-semibold mb-2 text-gray-900">Route Order:</h4>
                <ol className="space-y-2">
                  {generatedRoute.orderedPins.map((pin, index) => (
                    <li key={pin.id} className="flex items-start gap-2 text-sm">
                      <span className="bg-[#C46C24] text-white text-xs font-bold px-2 py-1 rounded min-w-[24px] text-center">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{pin.name}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <button
                onClick={handleSaveRoute}
                disabled={saving}
                className="w-full px-6 py-3 bg-[#C46C24] text-white rounded-lg font-medium hover:bg-[#A05A1D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Route
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl overflow-hidden shadow-lg h-[calc(100vh-12rem)] sticky top-8">
            {generatedRoute ? (
              <RouteMapView
                pins={generatedRoute.orderedPins}
                routePath={generatedRoute.path}
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-[#FAF9F6]">
                <div className="text-center">
                  <RouteIcon size={64} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Select pins and generate a route to see it visualized here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
