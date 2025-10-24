'use client';

import { useState } from 'react';
import { Sparkles, Loader2, MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AITrailSuggestion } from '@/utils/types';
import { fetchGemini } from '@/lib/fetchGemini';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

const TrailMapModal = dynamic(() => import('@/components/TrailMapModal'), {
  ssr: false,
});

export default function DiscoverPage() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestion, setSuggestion] = useState<AITrailSuggestion | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);

  const generateTrail = async () => {
    if (!prompt.trim()) {
      toast.error('Please describe the trail you want to explore');
      return;
    }

    setIsGenerating(true);

    try {
      const systemPrompt = `You are a local Kolkata trail guide AI. Generate a walking trail suggestion based on the user's request.
Return a JSON object with this structure:
{
  "title": "Trail Name",
  "description": "Brief description of the trail",
  "stops": [
    {
      "name": "Stop Name",
      "lat": 22.5726,
      "lng": 88.3639,
      "caption": "What makes this stop special"
    }
  ]
}

Focus on Kolkata landmarks, cafes, art spots, heritage sites, and hidden gems. Include 3-5 stops. Use real Kolkata coordinates.`;

      const response = await fetchGemini(systemPrompt + '\n\nUser request: ' + prompt);

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setSuggestion(parsed);
        toast.success('Trail suggestion generated!');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      toast.error('Failed to generate trail. Please try again.');
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickPrompt = (quickPrompt: string) => {
    setPrompt(quickPrompt);
  };

  const quickPrompts = [
    'Suggest a 3-stop walking trail near South Kolkata with art, chai stalls, and sunset views',
    'Create a heritage trail covering colonial architecture and historical landmarks',
    'Plan a food trail with street food spots and iconic restaurants',
    'Design a cultural trail with museums, galleries, and craft shops',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-mint-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-teal-500" />
            Discover Trails
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Let AI suggest personalized walking trails based on your interests. Explore Kolkata's
            hidden gems, heritage sites, food spots, and more.
          </p>
        </div>

        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle>What kind of trail are you looking for?</CardTitle>
            <CardDescription>
              Describe your interests and preferences, or try one of our quick suggestions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
              {quickPrompts.map((qp, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickPrompt(qp)}
                  className="text-left h-auto py-2 px-3 justify-start"
                >
                  <Navigation className="w-3 h-3 mr-2 flex-shrink-0" />
                  <span className="text-xs">{qp}</span>
                </Button>
              ))}
            </div>

            <Textarea
              placeholder="E.g., I want to explore street art, grab chai, and see the sunset over the Hooghly River..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="resize-none"
            />

            <Button
              onClick={generateTrail}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-gradient-to-r from-teal-500 to-mint-500 hover:from-teal-600 hover:to-mint-600"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Trail...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Trail
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {suggestion && (
          <Card className="shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500 to-mint-500 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">{suggestion.title}</h2>
              <p className="text-white/90">{suggestion.description}</p>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary" className="text-sm">
                    {suggestion.stops.length} Stops
                  </Badge>
                </div>

                {suggestion.stops.map((stop, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-teal-500 to-mint-500 text-white rounded-full flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 mb-1">{stop.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{stop.caption}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span>
                          {stop.lat.toFixed(4)}, {stop.lng.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(suggestion, null, 2));
                    toast.success('Trail copied to clipboard');
                  }}
                >
                  Copy Trail
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-teal-500 to-mint-500"
                  onClick={() => setShowMapModal(true)}
                >
                  View on Map
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!suggestion && !isGenerating && (
          <div className="text-center py-12 text-gray-400">
            <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Your AI-generated trail will appear here</p>
          </div>
        )}
      </div>

      {showMapModal && suggestion && (
        <TrailMapModal trail={suggestion} onClose={() => setShowMapModal(false)} />
      )}
    </div>
  );
}
