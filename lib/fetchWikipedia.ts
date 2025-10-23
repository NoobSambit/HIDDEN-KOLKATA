export async function fetchWikipediaSummary(placeName: string): Promise<string> {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(placeName)}`,
      {
        headers: {
          'User-Agent': 'HiddenKolkata/1.0',
        },
      }
    );

    if (!response.ok) {
      return '';
    }

    const data = await response.json();
    return data.extract || '';
  } catch (error) {
    console.error('Wikipedia fetch error:', error);
    return '';
  }
}
