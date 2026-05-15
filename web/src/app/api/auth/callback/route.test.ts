import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { NextRequest } from 'next/server';

process.env.SPOTIFY_CLIENT_ID = 'test_client_id';
process.env.SPOTIFY_CLIENT_SECRET = 'test_client_secret';
process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000';

// Mock global fetch for the Spotify token exchange
global.fetch = vi.fn();

describe('GET /api/auth/callback', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return 400 if code is missing', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/callback');
    const response = await GET(req);
    expect(response.status).toBe(400);
  });

  it('should exchange code for token and redirect to home', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: 'mock_access_token',
        refresh_token: 'mock_refresh_token',
        expires_in: 3600
      })
    });

    const req = new NextRequest('http://localhost:3000/api/auth/callback?code=mock_code');
    const response = await GET(req);

    // Should redirect to home with 307
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toContain('http://localhost:3000/');

    // Should set cookies
    const cookies = response.headers.get('set-cookie');
    expect(cookies).not.toBeNull();
    expect(cookies).toContain('spotify_access_token=mock_access_token');
    expect(cookies).toContain('spotify_refresh_token=mock_refresh_token');
  });
});
