/**
 * Converts a user's natural language prompt into a short Spotify search query.
 */
export async function generateSearchQuery(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a music curator. Convert the user prompt into a short 1-4 word Spotify search query. Output ONLY the query string, nothing else. For example: "japanese city pop" or "lofi focus".',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate search query from LLM');
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}
