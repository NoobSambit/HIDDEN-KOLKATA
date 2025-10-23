'use client';

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Pin } from '@/utils/types';
import { OSM_TILE_URL, OSM_ATTRIBUTION } from '@/utils/constants';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

type RouteMapViewProps = {
  pins: Pin[];
  routePath?: [number, number][];
  center?: { lat: number; lng: number };
  zoom?: number;
};

export default function RouteMapView({ pins, routePath, center, zoom = 13 }: RouteMapViewProps) {
  const mapCenter = center || (pins.length > 0 ? [pins[0].latitude, pins[0].longitude] : [22.5726, 88.3639]);

  return (
    <MapContainer
      center={mapCenter as [number, number]}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer url={OSM_TILE_URL} attribution={OSM_ATTRIBUTION} />

      {routePath && routePath.length > 0 && (
        <Polyline
          positions={routePath}
          color="#C46C24"
          weight={4}
          opacity={0.8}
        />
      )}

      {pins.map((pin, index) => (
        <Marker key={pin.id} position={[pin.latitude, pin.longitude]} icon={defaultIcon}>
          <Popup>
            <div className="p-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#C46C24] text-white text-xs font-bold px-2 py-1 rounded">
                  {index + 1}
                </span>
                <h3 className="font-semibold text-sm">{pin.name}</h3>
              </div>
              {pin.image_url && (
                <img
                  src={pin.image_url}
                  alt={pin.name}
                  className="w-full h-24 object-cover rounded mb-2"
                />
              )}
              <p className="text-xs text-gray-700">{pin.description}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
