export interface ILLMProvider {
  generateSearchQuery(prompt: string, apiKey: string): Promise<string>;
}

export class OpenAIProvider implements ILLMProvider {
  async generateSearchQuery(prompt: string, apiKey: string): Promise<string> {
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
      throw new Error('Failed to generate search query from OpenAI');
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }
}

export class GeminiProvider implements ILLMProvider {
  async generateSearchQuery(prompt: string, apiKey: string): Promise<string> {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: 'You are a music curator. Convert the user prompt into a short 1-4 word Spotify search query. Output ONLY the query string, nothing else. For example: "japanese city pop" or "lofi focus".' }]
        },
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7
        }
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate search query from Gemini');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text.trim();
  }
}

export class LLMFactory {
  static getProvider(provider: 'openai' | 'gemini'): ILLMProvider {
    switch (provider) {
      case 'openai':
        return new OpenAIProvider();
      case 'gemini':
        return new GeminiProvider();
      default:
        throw new Error(`Unsupported LLM provider: ${provider}`);
    }
  }
}
