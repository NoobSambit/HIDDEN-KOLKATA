export type NominatimResult = {
  lat: string;
  lon: string;
  display_name: string;
  type: string;
};

export async function searchLocation(query: string): Promise<NominatimResult[]> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query + ', Kolkata'
      )}&format=json&limit=5`,
      {
        headers: {
          'User-Agent': 'HiddenKolkata/1.0',
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Nominatim search error:', error);
    return [];
  }
}

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: {
          'User-Agent': 'HiddenKolkata/1.0',
        },
      }
    );

    if (!response.ok) {
      return 'Unknown location';
    }

    const data = await response.json();
    return data.display_name || 'Unknown location';
  } catch (error) {
    console.error('Reverse geocode error:', error);
    return 'Unknown location';
  }
}
