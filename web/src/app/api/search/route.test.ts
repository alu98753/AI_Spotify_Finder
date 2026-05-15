import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';
import { LLMFactory } from '@/lib/llm';
import * as spotifySearch from '@/lib/spotifySearch';

// Mock dependencies
vi.mock('@/lib/llm');
vi.mock('@/lib/spotifySearch');

process.env.LLM_PROVIDER = 'openai';
process.env.OPENAI_API_KEY = 'test_openai_key';

describe('POST /api/search', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return 401 if user is not authenticated (missing cookie)', async () => {
    const req = new NextRequest('http://localhost:3000/api/search', {
      method: 'POST',
      body: JSON.stringify({ prompt: 'study music' })
    });
    // No cookies set on req

    const response = await POST(req);
    expect(response.status).toBe(401);
  });

  it('should process prompt, extract query, and return spotify tracks', async () => {
    const mockProvider = { generateSearchQuery: vi.fn().mockResolvedValue('lofi focus') };
    vi.spyOn(LLMFactory, 'getProvider').mockReturnValue(mockProvider as any);
    
    vi.spyOn(spotifySearch, 'searchSpotifyTracks').mockResolvedValue({ tracks: { items: [{ name: 'Lofi Girl' }] } });

    // NextRequest parses the cookie header into req.cookies automatically
    const req = new NextRequest('http://localhost:3000/api/search', {
      method: 'POST',
      body: JSON.stringify({ prompt: 'I want to study late at night' }),
      headers: {
        cookie: 'spotify_access_token=mock_access_token'
      }
    });

    const response = await POST(req);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.tracks.items[0].name).toBe('Lofi Girl');
    expect(LLMFactory.getProvider).toHaveBeenCalledWith('openai');
    expect(mockProvider.generateSearchQuery).toHaveBeenCalledWith('I want to study late at night', 'test_openai_key');
    expect(spotifySearch.searchSpotifyTracks).toHaveBeenCalledWith('lofi focus', 'mock_access_token');
  });
});
