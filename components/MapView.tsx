'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Pin } from '@/utils/types';
import { KOLKATA_CENTER, DEFAULT_ZOOM, OSM_TILE_URL, OSM_ATTRIBUTION, GEM_CATEGORIES, type GemCategory } from '@/utils/constants';
import { ExternalLink, Share2, Filter, X, Trees, Waves, Utensils, Coffee, Pizza, Landmark, Building2, Palette, Paintbrush, Sunset, Church, ShoppingBag, BookOpen, Bridge, Eye, Theater, Music, Building, Trophy, GraduationCap, MapPin } from 'lucide-react';
import LikeButton from './LikeButton';
import CommentSection from './CommentSection';

// Icon component map
const iconMap: Record<string, any> = {
  Trees, Waves, Utensils, Coffee, Pizza, Landmark, Building2, Palette, Paintbrush, 
  Sunset, Church, ShoppingBag, BookOpen, Bridge, Eye, Theater, Music, Building, 
  Trophy, GraduationCap, MapPin
};

// Create custom icon with Lucide icon
const createCategoryIcon = (category?: string) => {
  const cat = (category || 'other') as GemCategory;
  const { icon, color } = GEM_CATEGORIES[cat] || GEM_CATEGORIES.other;
  const IconComponent = iconMap[icon] || MapPin;
  
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        ${getIconPath(icon)}
      </svg>
    </div>`,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Helper to get SVG paths for icons
const getIconPath = (iconName: string): string => {
  const paths: Record<string, string> = {
    Trees: '<path d="M12 2v20M6 18V6l6-4 6 4v12M4 14h16"/>',
    Waves: '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
    Utensils: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
    Coffee: '<path d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>',
    Pizza: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M12 2v20"/>',
    Landmark: '<line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/>',
    Building2: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
    Palette: '<circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>',
    Paintbrush: '<path d="m14.622 17.897-10.68-2.913M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0l4.02-4.02z"/><path d="M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15"/>',
    Sunset: '<path d="M12 10V2M12 18v-4"/><path d="M8 22h8"/><path d="M5.45 17.9A10 10 0 0 1 12 14a10 10 0 0 1 6.55 3.9"/>',
    Church: '<path d="m18 7 4 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9l4-2"/><path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"/><path d="M18 22V5l-6-3-6 3v17"/><path d="M12 7v5"/><path d="M10 9h4"/>',
    ShoppingBag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    BookOpen: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    Bridge: '<path d="M6 19h12"/><path d="M4 19V8"/><path d="M20 19V8"/><path d="M2 8h20"/><path d="M6 8v11"/><path d="M10 8v11"/><path d="M14 8v11"/><path d="M18 8v11"/>',
    Eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    Theater: '<path d="M2 10s3-3 3-8M22 10s-3-3-3-8M10 2c0 4.4-3.6 8-8 8M22 2c0 4.4-3.6 8-8 8"/><path d="M18 10v2a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4v-2M6 14v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4M6 10h12"/>',
    Music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    Building: '<rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>',
    Trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
    GraduationCap: '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    MapPin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  };
  return paths[iconName] || paths.MapPin;
};

const selectedIcon = L.divIcon({
  html: `<div style="background-color: #dc2626; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 12px rgba(220,38,38,0.5); animation: pulse 2s infinite;">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  </div>`,
  className: 'selected-marker',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
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

  return (
    <div className="relative h-full w-full">
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .custom-marker, .selected-marker { background: transparent !important; border: none !important; }
      `}</style>
      
      <button onClick={() => setShowFilters(!showFilters)} className="absolute top-4 right-4 z-[1000] bg-white shadow-lg rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-gray-50">
        <Filter size={18} /> Filter {selectedCategories.size > 0 && <span className="bg-[#C46C24] text-white rounded-full px-2 py-0.5 text-xs">{selectedCategories.size}</span>}
      </button>

      {showFilters && (
        <div className="absolute top-16 right-4 z-[1000] bg-white shadow-xl rounded-lg p-4 w-80 max-h-96 overflow-y-auto">
          <div className="flex justify-between mb-3">
            <h3 className="font-semibold">Categories</h3>
            <button onClick={() => setShowFilters(false)}><X size={18} /></button>
          </div>
          {selectedCategories.size > 0 && <button onClick={() => setSelectedCategories(new Set())} className="text-sm text-[#C46C24] mb-3">Clear all</button>}
          <div className="space-y-2">
            {Object.entries(GEM_CATEGORIES).map(([key, { label, color }]) => {
              const category = key as GemCategory;
              const isSelected = selectedCategories.has(category);
              return (
                <button key={key} onClick={() => toggleCategory(category)} className={`w-full text-left px-3 py-2 rounded-lg ${isSelected ? 'bg-[#C46C24] text-white' : 'bg-gray-50 hover:bg-gray-100'}`}>
                  <span className="flex items-center gap-2">
                    <span style={{ backgroundColor: color }} className="w-4 h-4 rounded-full"></span>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <MapContainer center={[mapCenter.lat, mapCenter.lng]} zoom={mapZoom} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
        <TileLayer url={OSM_TILE_URL} attribution={OSM_ATTRIBUTION} />
        <MapClickHandler onMapClick={onMapClick} />
        <MapUpdater center={mapCenter} zoom={mapZoom} />

        {filteredPins.map((pin) => (
          <Marker key={pin.id} position={[pin.latitude, pin.longitude]} icon={createCategoryIcon(pin.category)}>
            <Popup maxWidth={400}>
              <div className="p-2">
                <h3 className="font-semibold text-lg mb-3">{pin.name}</h3>
                {pin.image_url && <img src={pin.image_url} alt={pin.name} className="w-full h-32 object-cover rounded-lg mb-3" />}
                <p className="text-sm text-gray-700 mb-4">{pin.description}</p>
                <div className="flex gap-2 mb-4">
                  <LikeButton pinId={pin.id} initialLikes={pin.likes || 0} />
                  <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/map?pin=${pin.id}`); alert('Link copied!'); }} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                    <Share2 size={18} /> Share
                  </button>
                </div>
                <div className="mb-4 max-h-64 overflow-y-auto border-t pt-4">
                  <CommentSection pinId={pin.id} />
                </div>
                <a href={`https://www.google.com/maps?q=${pin.latitude},${pin.longitude}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-[#C46C24] hover:text-[#A05A1D] font-medium">
                  <ExternalLink size={14} /> Google Maps
                </a>
              </div>
            </Popup>
          </Marker>
        ))}

        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={selectedIcon}>
            <Popup><p className="text-sm font-medium">Selected Location</p></Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
