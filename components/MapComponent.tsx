'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Pin } from '@/utils/types';

const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#FAF9F6]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C46C24] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

type MapComponentProps = {
  pins: Pin[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onMapClick?: (lat: number, lng: number) => void;
  selectedLocation?: { lat: number; lng: number } | null;
  height?: string;
};

export default function MapComponent({
  pins,
  center,
  zoom,
  onMapClick,
  selectedLocation,
  height = 'h-[600px]',
}: MapComponentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-full ${height} flex items-center justify-center bg-[#FAF9F6] rounded-xl`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C46C24] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${height} rounded-xl overflow-hidden shadow-md`}>
      <MapView
        pins={pins}
        center={center}
        zoom={zoom}
        onMapClick={onMapClick}
        selectedLocation={selectedLocation}
      />
    </div>
  );
}
