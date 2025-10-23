'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MapComponent from '@/components/MapComponent';
import AddGemForm from '@/components/AddGemForm';
import { KOLKATA_CENTER } from '@/utils/constants';
import { Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AddPage() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [mapCenter, setMapCenter] = useState(KOLKATA_CENTER);
  const [mapZoom, setMapZoom] = useState(12);

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
  };

  const handleSuccess = () => {
    setTimeout(() => {
      router.push('/map');
    }, 1500);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      // Use Nominatim (OpenStreetMap) geocoding API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchQuery + ', Kolkata'
        )}&format=json&limit=1`,
        {
          headers: {
            'User-Agent': 'HiddenKolkata/1.0',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newCenter = { lat: parseFloat(lat), lng: parseFloat(lon) };
        setMapCenter(newCenter);
        setMapZoom(15);
        toast.success(`Found: ${data[0].display_name}`);
      } else {
        toast.error('Location not found. Try a different search term.');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search location');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Add a Hidden Gem</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <AddGemForm selectedLocation={selectedLocation} onSuccess={handleSuccess} />
        </div>

        <div>
          <div className="sticky top-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Select Location on Map</h2>
            <p className="text-sm text-gray-600 mb-4">
              Search for a locality or click anywhere on the map to select the location.
            </p>
            
            {/* Location Search Bar */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search locality (e.g., Salt Lake, Park Street)..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C46C24] focus:border-transparent outline-none transition"
                />
                <button
                  type="submit"
                  disabled={searching || !searchQuery.trim()}
                  className="px-4 py-2 bg-[#C46C24] text-white rounded-lg hover:bg-[#A05A1D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {searching ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Search size={18} />
                  )}
                  Search
                </button>
              </div>
            </form>

            <MapComponent
              pins={[]}
              center={selectedLocation || mapCenter}
              zoom={selectedLocation ? 15 : mapZoom}
              onMapClick={handleMapClick}
              selectedLocation={selectedLocation}
              height="h-[600px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
