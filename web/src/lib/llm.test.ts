import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LLMFactory, OpenAIProvider, GeminiProvider } from './llm';

global.fetch = vi.fn();

describe('LLM Strategy Pattern', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('Factory should return correct provider instances', () => {
    expect(LLMFactory.getProvider('openai')).toBeInstanceOf(OpenAIProvider);
    expect(LLMFactory.getProvider('gemini')).toBeInstanceOf(GeminiProvider);
    expect(() => LLMFactory.getProvider('unknown' as any)).toThrow('Unsupported LLM provider');
  });

  it('OpenAIProvider should extract query correctly', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'lofi study focus' } }]
      })
    });

    const provider = LLMFactory.getProvider('openai');
    const query = await provider.generateSearchQuery('I need quiet music', 'mock_openai_key');
    
    expect(query).toBe('lofi study focus');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer mock_openai_key' })
      })
    );
  });

  it('GeminiProvider should extract query correctly', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: 'japanese city pop' }] } }]
      })
    });

    const provider = LLMFactory.getProvider('gemini');
    const query = await provider.generateSearchQuery('Upbeat 80s Tokyo music', 'mock_gemini_key');
    
    expect(query).toBe('japanese city pop');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=mock_gemini_key',
      expect.objectContaining({ method: 'POST' })
    );
  });
});
