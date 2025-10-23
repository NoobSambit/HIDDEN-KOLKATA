'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Pin } from '@/utils/types';
import { KOLKATA_CENTER, DEFAULT_ZOOM, OSM_TILE_URL, OSM_ATTRIBUTION } from '@/utils/constants';
import { ExternalLink, Share2 } from 'lucide-react';
import LikeButton from './LikeButton';
import CommentSection from './CommentSection';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const selectedIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

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

  return (
    <MapContainer
      center={[mapCenter.lat, mapCenter.lng]}
      zoom={mapZoom}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer url={OSM_TILE_URL} attribution={OSM_ATTRIBUTION} />
      <MapClickHandler onMapClick={onMapClick} />
      <MapUpdater center={mapCenter} zoom={mapZoom} />

      {pins.map((pin) => (
        <Marker
          key={pin.id}
          position={[pin.latitude, pin.longitude]}
          icon={defaultIcon}
        >
          <Popup maxWidth={400}>
            <div className="p-2">
              <h3 className="font-semibold text-lg mb-3">{pin.name}</h3>
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
  );
}
