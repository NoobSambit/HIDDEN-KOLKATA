'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Pin, HiddenGem } from '@/utils/types';
import MapComponent from '@/components/MapComponent';
import { searchLocation, NominatimResult } from '@/lib/fetchNominatim';
import { Search, Dice5, Loader2, X, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import AddHiddenGemModal from '@/components/AddHiddenGemModal';

export default function MapPage() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [hiddenGems, setHiddenGems] = useState<HiddenGem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | undefined>();
  const [mapZoom, setMapZoom] = useState<number | undefined>();
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();

  useEffect(() => {
    checkUser();
    fetchPins();
    fetchHiddenGems();
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setCurrentUserId(user?.id);
  };

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

  const fetchHiddenGems = async () => {
    try {
      const { data } = await supabase
        .from('hidden_gems')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setHiddenGems(data as HiddenGem[]);
      }
    } catch (error) {
      console.error('Error fetching hidden gems:', error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setSearching(true);
    try {
      const results = await searchLocation(searchQuery);
      setSearchResults(results);

      if (results.length === 0) {
        toast.error('No results found');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed');
    } finally {
      setSearching(false);
    }
  };

  const handleSelectLocation = (result: NominatimResult) => {
    setMapCenter({ lat: parseFloat(result.lat), lng: parseFloat(result.lon) });
    setMapZoom(15);
    setSearchResults([]);
    setSearchQuery('');
    toast.success(`Showing ${result.display_name}`);
  };

  const handleRandomGem = () => {
    const allGems = [...pins, ...hiddenGems];
    if (allGems.length === 0) {
      toast.error('No gems available yet');
      return;
    }

    const randomGem = allGems[Math.floor(Math.random() * allGems.length)];
    setMapCenter({ lat: randomGem.latitude, lng: randomGem.longitude });
    setMapZoom(15);
    toast.success(`Random gem: ${randomGem.name}`);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-[#C46C24] mx-auto mb-4" />
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  const allMarkers = [
    ...pins.map((pin) => ({ ...pin, type: 'pin' as const })),
    ...hiddenGems.map((gem) => ({ ...gem, type: 'gem' as const })),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Explore Hidden Gems</h1>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a location in Kolkata..."
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
              />
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
            </form>

            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-64 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectLocation(result)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <p className="text-sm font-medium text-gray-900">{result.display_name}</p>
                    <p className="text-xs text-gray-500 mt-1">{result.type}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleRandomGem}
            disabled={allMarkers.length === 0}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-mint-500 text-white rounded-xl font-medium hover:from-teal-600 hover:to-mint-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Dice5 size={20} />
            Random Gem
          </button>

          <AddHiddenGemModal currentUserId={currentUserId} onGemAdded={fetchHiddenGems} />
        </div>

        <div className="mt-4 flex gap-6 text-sm text-gray-600">
          <span>
            <span className="font-medium">{pins.length}</span> pins
          </span>
          <span className="flex items-center gap-1">
            <Sparkles size={14} className="text-teal-500" />
            <span className="font-medium">{hiddenGems.length}</span> hidden gems
          </span>
        </div>
      </div>

      <MapComponent pins={allMarkers} center={mapCenter} zoom={mapZoom} height="h-[calc(100vh-18rem)]" />
    </div>
  );
}
