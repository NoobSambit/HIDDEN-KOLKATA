const GEMINI_DEFAULT_MODEL = 'gemini-2.0-flash';
const GEMINI_MODEL_PRIORITY = ['gemini-2.0-flash', 'gemini-2.0-flash-exp', 'gemini-1.5-flash-latest'];

function resolveGeminiModel(): string {
  return (
    process.env.NEXT_PUBLIC_GEMINI_MODEL ||
    process.env.GEMINI_MODEL ||
    GEMINI_DEFAULT_MODEL
  );
}

function getModelCandidates(): string[] {
  const preferred = resolveGeminiModel();
  const fallbacks = GEMINI_MODEL_PRIORITY.filter((model) => model !== preferred);
  return [preferred, ...fallbacks];
}

async function requestGemini({
  apiKey,
  body,
}: {
  apiKey: string;
  body: Record<string, unknown>;
}): Promise<{ data: any; model: string }> {
  const candidates = getModelCandidates();
  let lastNotFound: { body: string; model: string } | null = null;

  for (const model of candidates) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (response.ok) {
      return { data: await response.json(), model };
    }

    const errorBody = await response.text();

    if (response.status === 404) {
      lastNotFound = { body: errorBody, model };
      continue;
    }

    throw new Error(
      errorBody
        ? `Gemini API responded with ${response.status} for model ${model}: ${errorBody}`
        : `Gemini API responded with ${response.status} for model ${model}`
    );
  }

  if (lastNotFound) {
    throw new Error(
      `Gemini API responded with 404 for model ${lastNotFound.model}: ${lastNotFound.body}`
    );
  }

  throw new Error('Gemini API request failed for all candidate models');
}

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
    const pinNames = pins.map((p) => p.name);
    const pinsList = pins
      .map((p, index) => `${index + 1}. ${p.name} (${p.latitude}, ${p.longitude})`)
      .join('\n');

    const systemInstruction = `You are a Kolkata local guide. Create a walking trail connecting the provided hidden gems and respond ONLY with a JSON object matching this schema:
{
  "title": "A creative 3-5 word trail name",
  "description": "A 2-3 sentence description highlighting why the trail is special",
  "order": ["exact pin name 1", "exact pin name 2", "..."]
}

Use the exact pin names supplied by the user and produce the most logical walking sequence.`;

    const model = resolveGeminiModel();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            role: 'system',
            parts: [
              {
                text: systemInstruction,
              },
            ],
          },
          generationConfig: {
            responseMimeType: 'application/json',
          },
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Plan an engaging walking trail for these pins:\n${pinsList}`,
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
      order: Array.isArray(parsed.order) ? parsed.order : pinNames,
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

    const model = resolveGeminiModel();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            role: 'system',
            parts: [
              {
                text: 'You are a Kolkata local guide who shares concise hidden gem recommendations.',
              },
            ],
          },
          contents: [
            {
              role: 'user',
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
      return 'Discover a hidden gem in Kolkata!';
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Discover a hidden gem in Kolkata!';
  } catch (error) {
    console.error('Gemini API error:', error);
    return 'Discover a hidden gem in Kolkata!';
  }
}

type FetchGeminiOptions = {
  system?: string;
  responseMimeType?: string | null;
};

export async function fetchGemini(
  prompt: string,
  options: FetchGeminiOptions = {}
): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  try {
    const model = resolveGeminiModel();

    const body: Record<string, unknown> = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    if (options.system) {
      body.systemInstruction = {
        role: 'system',
        parts: [
          {
            text: options.system,
          },
        ],
      };
    }

    if (options.responseMimeType !== null) {
      body.generationConfig = {
        responseMimeType: options.responseMimeType ?? 'application/json',
      };
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
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
