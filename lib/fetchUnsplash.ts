export async function fetchUnsplashImage(query: string): Promise<string> {
  const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    return '';
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query + ' Kolkata'
      )}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
      }
    );

    if (!response.ok) {
      return '';
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    }

    return '';
  } catch (error) {
    console.error('Unsplash fetch error:', error);
    return '';
  }
}
