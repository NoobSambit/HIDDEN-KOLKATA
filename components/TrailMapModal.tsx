'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { X, Navigation, Clock, MapPin, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AITrailSuggestion } from '@/utils/types';
import { fetchWalkingRoute, formatDistance, formatDuration } from '@/lib/fetchOSRM';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);
const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
);

type TrailMapModalProps = {
  trail: AITrailSuggestion;
  onClose: () => void;
};

export default function TrailMapModal({ trail, onClose }: TrailMapModalProps) {
  const [routeData, setRouteData] = useState<{
    path: [number, number][];
    distance: number;
    duration: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStop, setSelectedStop] = useState<number | null>(null);

  useEffect(() => {
    const loadRoute = async () => {
      setLoading(true);
      const route = await fetchWalkingRoute(trail.stops);
      if (route) {
        setRouteData({
          path: route.coordinates,
          distance: route.distance,
          duration: route.duration,
        });
      }
      setLoading(false);
    };

    loadRoute();
  }, [trail]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const L = require('leaflet');
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
    }
  }, []);

  const center: [number, number] = trail.stops.length > 0
    ? [trail.stops[0].lat, trail.stops[0].lng]
    : [22.5726, 88.3639];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-mint-500 p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{trail.title}</h2>
              <p className="text-white/90 text-sm">{trail.description}</p>
              {routeData && (
                <div className="flex gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-lg">
                    <Navigation className="w-4 h-4" />
                    <span className="text-sm font-medium">{formatDistance(routeData.distance)}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-lg">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">{formatDuration(routeData.duration)}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-lg">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">{trail.stops.length} stops</span>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Map */}
          <div className="flex-1 relative">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-gray-600">Loading route...</p>
                </div>
              </div>
            )}
            {!loading && (
              <MapContainer
                center={center}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                {routeData && routeData.path.length > 0 && (
                  <Polyline
                    positions={routeData.path}
                    color="#14b8a6"
                    weight={5}
                    opacity={0.7}
                  />
                )}

                {trail.stops.map((stop, index) => (
                  <Marker
                    key={index}
                    position={[stop.lat, stop.lng]}
                    eventHandlers={{
                      click: () => setSelectedStop(index),
                    }}
                  >
                    <Popup>
                      <div className="p-2 min-w-[200px]">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-gradient-to-r from-teal-500 to-mint-500 text-white text-xs font-bold px-2 py-1 rounded">
                            Stop {index + 1}
                          </span>
                          <h3 className="font-semibold text-sm">{stop.name}</h3>
                        </div>
                        <p className="text-xs text-gray-700">{stop.caption}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-gray-50 overflow-y-auto border-l">
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-teal-500" />
                Route Details
              </h3>

              <div className="space-y-3">
                {trail.stops.map((stop, index) => (
                  <Card
                    key={index}
                    className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedStop === index
                        ? 'ring-2 ring-teal-500 bg-teal-50'
                        : 'bg-white'
                    }`}
                    onClick={() => setSelectedStop(index)}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-mint-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1">{stop.name}</h4>
                        <p className="text-xs text-gray-600 line-clamp-2">{stop.caption}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                          <MapPin className="w-3 h-3" />
                          <span>
                            {stop.lat.toFixed(4)}, {stop.lng.toFixed(4)}
                          </span>
                        </div>
                      </div>
                      {index < trail.stops.length - 1 && (
                        <ChevronRight className="w-4 h-4 text-gray-400 self-center" />
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t">
                <Button
                  className="w-full bg-gradient-to-r from-teal-500 to-mint-500 hover:from-teal-600 hover:to-mint-600"
                  onClick={() => {
                    const url = `https://www.google.com/maps/dir/${trail.stops
                      .map((s) => `${s.lat},${s.lng}`)
                      .join('/')}`;
                    window.open(url, '_blank');
                  }}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Open in Google Maps
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
