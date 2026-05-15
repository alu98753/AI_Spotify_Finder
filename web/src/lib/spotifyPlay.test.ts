import { describe, it, expect, vi, beforeEach } from 'vitest';
import { playSpotifyTrack } from './spotifyPlay';

global.fetch = vi.fn();

describe('Spotify API Utility: playSpotifyTrack', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should call Spotify player API with track URI', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true
    });

    await playSpotifyTrack('spotify:track:12345', 'mock_access_token');
    
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.spotify.com/v1/me/player/play',
      expect.objectContaining({
        method: 'PUT',
        headers: expect.objectContaining({
          Authorization: 'Bearer mock_access_token',
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
          uris: ['spotify:track:12345']
        })
      })
    );
  });
});
