export type GeneratedRoute = {
  title: string;
  description: string;
  order: string[];
};

export async function generateHiddenRoute(
  pins: Array<{ name: string; latitude: number; longitude: number }>
): Promise<GeneratedRoute | null> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey || pins.length < 2) {
    return null;
  }

  try {
    const pinNames = pins.map((p) => p.name).join(', ');
    const prompt = `You are a Kolkata local guide. Create a walking trail connecting these hidden gems: ${pinNames}.

Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks):
{
  "title": "A creative 3-5 word trail name",
  "description": "A 2-3 sentence description of the route highlighting what makes it special and why someone should walk it",
  "order": ["exact pin name 1", "exact pin name 2", ...]
}

The order should be the most logical walking sequence. Use the exact pin names provided.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const parsed = JSON.parse(text);

    return {
      title: parsed.title || 'Hidden Trail',
      description: parsed.description || 'Explore hidden corners of Kolkata.',
      order: Array.isArray(parsed.order) ? parsed.order : pins.map((p) => p.name),
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    return null;
  }
}

export async function generateTrailSuggestion(pins: Array<{name: string, latitude: number, longitude: number}>): Promise<string> {
  const result = await generateHiddenRoute(pins);
  return result ? `${result.title}: ${result.description}` : '';
}

export async function generateRandomGemDescription(): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return 'Discover a hidden gem in Kolkata!';
  }

  try {
    const prompt = 'Suggest one lesser-known, hidden gem location in Kolkata (not tourist traps). Provide just the name and one sentence description.';

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        }),
      }
    );

    if (!response.ok) {
      return 'Discover a hidden gem in Kolkata!';
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Discover a hidden gem in Kolkata!';
  } catch (error) {
    console.error('Gemini API error:', error);
    return 'Discover a hidden gem in Kolkata!';
  }
}

export async function fetchGemini(prompt: string): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Gemini API request failed');
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}
