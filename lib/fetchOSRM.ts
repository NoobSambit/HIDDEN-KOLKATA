export type OSRMRoute = {
  coordinates: [number, number][];
  distance: number;
  duration: number;
};

export async function fetchWalkingRoute(
  points: Array<{ lat: number; lng: number }>
): Promise<OSRMRoute | null> {
  if (points.length < 2) {
    return null;
  }

  const osrmUrl = process.env.NEXT_PUBLIC_OSRM_URL || 'https://router.project-osrm.org';

  const coordString = points.map((p) => `${p.lng},${p.lat}`).join(';');

  try {
    const response = await fetch(
      `${osrmUrl}/route/v1/foot/${coordString}?overview=full&geometries=geojson&steps=false`,
      {
        headers: {
          'User-Agent': 'HiddenKolkata/1.0',
        },
      }
    );

    if (!response.ok) {
      console.error('OSRM API error:', response.status);
      return null;
    }

    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      return null;
    }

    const route = data.routes[0];
    const coordinates = route.geometry.coordinates.map(([lng, lat]: [number, number]) => [
      lat,
      lng,
    ]);

    return {
      coordinates,
      distance: route.distance,
      duration: route.duration,
    };
  } catch (error) {
    console.error('Error fetching OSRM route:', error);
    return null;
  }
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

export function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}
