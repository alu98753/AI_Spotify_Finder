import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchSpotifyTracks } from './spotifySearch';

global.fetch = vi.fn();

describe('Spotify API Utility: searchSpotifyTracks', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should search tracks using the Spotify Web API with correct URL encoding', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        tracks: {
          items: [
            { id: '1', name: 'Lofi Girl', artists: [{ name: 'ChilledCow' }] }
          ]
        }
      })
    });

    const result = await searchSpotifyTracks('lofi focus', 'mock_access_token');
    
    expect(result.tracks.items[0].name).toBe('Lofi Girl');
    
    // URLSearchParams encodes space as '+'
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.spotify.com/v1/search?q=lofi+focus&type=track&limit=10',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer mock_access_token'
        })
      })
    );
  });
});
