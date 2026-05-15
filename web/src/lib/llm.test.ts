import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateSearchQuery } from './llm';

global.fetch = vi.fn();

describe('LLM Utility: generateSearchQuery', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should extract a short search query from natural language prompt', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'lofi study focus' } }]
      })
    });

    const query = await generateSearchQuery('I need some quiet music to read my thesis', 'mock_api_key');
    
    expect(query).toBe('lofi study focus');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer mock_api_key'
        })
      })
    );
  });
});
