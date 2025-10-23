'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MapComponent from '@/components/MapComponent';
import AddGemForm from '@/components/AddGemForm';
import { KOLKATA_CENTER } from '@/utils/constants';

export default function AddPage() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
  };

  const handleSuccess = () => {
    setTimeout(() => {
      router.push('/map');
    }, 1500);
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
              Click anywhere on the map to select the location of your hidden gem.
            </p>
            <MapComponent
              pins={[]}
              center={selectedLocation || KOLKATA_CENTER}
              zoom={selectedLocation ? 15 : 12}
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
