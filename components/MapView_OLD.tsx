'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Pin } from '@/utils/types';
import { KOLKATA_CENTER, DEFAULT_ZOOM, OSM_TILE_URL, OSM_ATTRIBUTION, GEM_CATEGORIES, MARKER_ICONS, type GemCategory } from '@/utils/constants';
import { ExternalLink, Share2, Filter, X } from 'lucide-react';
import LikeButton from './LikeButton';
import CommentSection from './CommentSection';

// Create icon for each category
const createCategoryIcon = (category?: string) => {
  const cat = (category || 'other') as GemCategory;
  const color = GEM_CATEGORIES[cat]?.color || 'blue';
  const iconUrl = MARKER_ICONS[color as keyof typeof MARKER_ICONS] || MARKER_ICONS.blue;
  
  return L.icon({
    iconUrl,
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

const selectedIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = createCategoryIcon('other');

type MapViewProps = {
  pins: Pin[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onMapClick?: (lat: number, lng: number) => void;
  selectedLocation?: { lat: number; lng: number } | null;
};

function MapClickHandler({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

function MapUpdater({ center, zoom }: { center: { lat: number; lng: number }; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView([center.lat, center.lng], zoom);
  }, [center.lat, center.lng, zoom, map]);
  
  return null;
}

export default function MapView({ pins, center, zoom, onMapClick, selectedLocation }: MapViewProps) {
  const mapCenter = center || KOLKATA_CENTER;
  const mapZoom = zoom || DEFAULT_ZOOM;
  const [selectedCategories, setSelectedCategories] = useState<Set<GemCategory>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // Filter pins based on selected categories
  const filteredPins = selectedCategories.size === 0 
    ? pins 
    : pins.filter(pin => selectedCategories.has((pin.category || 'other') as GemCategory));

  const toggleCategory = (category: GemCategory) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const clearFilters = () => {
    setSelectedCategories(new Set());
  };

  return (
    <div className="relative h-full w-full">
      {/* Filter Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="absolute top-4 right-4 z-[1000] bg-white shadow-lg rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-gray-50 transition-colors"
      >
        <Filter size={18} />
        Filter by Category
        {selectedCategories.size > 0 && (
          <span className="bg-[#C46C24] text-white rounded-full px-2 py-0.5 text-xs font-semibold">
            {selectedCategories.size}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {showFilters && (
        <div className="absolute top-16 right-4 z-[1000] bg-white shadow-xl rounded-lg p-4 max-w-sm w-80">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg">Filter by Category</h3>
            <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-gray-100 rounded">
              <X size={18} />
            </button>
          </div>
          
          {selectedCategories.size > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-[#C46C24] hover:text-[#A05A1D] mb-3 font-medium"
            >
              Clear all filters
            </button>
          )}

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {Object.entries(GEM_CATEGORIES).map(([key, { label, icon }]) => {
              const category = key as GemCategory;
              const isSelected = selectedCategories.has(category);
              return (
                <button
                  key={key}
                  onClick={() => toggleCategory(category)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    isSelected 
                      ? 'bg-[#C46C24] text-white' 
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{icon}</span>
                    <span className="font-medium">{label.split(' ').slice(1).join(' ')}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer url={OSM_TILE_URL} attribution={OSM_ATTRIBUTION} />
        <MapClickHandler onMapClick={onMapClick} />
        <MapUpdater center={mapCenter} zoom={mapZoom} />

        {filteredPins.map((pin) => (
          <Marker
            key={pin.id}
            position={[pin.latitude, pin.longitude]}
            icon={createCategoryIcon(pin.category)}
          >
          <Popup maxWidth={400}>
            <div className="p-2">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-lg flex-1">{pin.name}</h3>
                {pin.category && (
                  <span className="text-2xl ml-2">{GEM_CATEGORIES[pin.category as GemCategory]?.icon}</span>
                )}
              </div>
              {pin.image_url && (
                <img
                  src={pin.image_url}
                  alt={pin.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
              )}
              <p className="text-sm text-gray-700 mb-4 leading-relaxed">{pin.description}</p>

              <div className="flex items-center gap-2 mb-4">
                <LikeButton pinId={pin.id} initialLikes={pin.likes || 0} />
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/map?pin=${pin.id}`;
                    navigator.clipboard.writeText(url);
                    alert('Link copied to clipboard!');
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  <Share2 size={18} />
                  Share
                </button>
              </div>

              <div className="mb-4 max-h-64 overflow-y-auto border-t pt-4">
                <CommentSection pinId={pin.id} />
              </div>

              <a
                href={`https://www.google.com/maps?q=${pin.latitude},${pin.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-[#C46C24] hover:text-[#A05A1D] font-medium"
              >
                <ExternalLink size={14} />
                Open in Google Maps
              </a>
            </div>
          </Popup>
          </Marker>
        ))}

        {selectedLocation && (
          <Marker
            position={[selectedLocation.lat, selectedLocation.lng]}
            icon={selectedIcon}
          >
            <Popup>
              <div className="text-center p-1">
                <p className="text-sm font-medium">Selected Location</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
