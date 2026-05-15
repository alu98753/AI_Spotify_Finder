import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';
import * as spotifyPlay from '@/lib/spotifyPlay';

vi.mock('@/lib/spotifyPlay');

describe('POST /api/play', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return 401 if user is not authenticated', async () => {
    const req = new NextRequest('http://localhost:3000/api/play', {
      method: 'POST',
      body: JSON.stringify({ trackUri: 'spotify:track:123' })
    });

    const response = await POST(req);
    expect(response.status).toBe(401);
  });

  it('should call play API and return success', async () => {
    vi.spyOn(spotifyPlay, 'playSpotifyTrack').mockResolvedValue(undefined);

    const req = new NextRequest('http://localhost:3000/api/play', {
      method: 'POST',
      body: JSON.stringify({ trackUri: 'spotify:track:123' }),
      headers: {
        cookie: 'spotify_access_token=mock_access_token'
      }
    });

    const response = await POST(req);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(spotifyPlay.playSpotifyTrack).toHaveBeenCalledWith('spotify:track:123', 'mock_access_token');
  });
});
