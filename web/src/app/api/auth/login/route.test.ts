import { describe, it, expect } from 'vitest';
import { GET } from './route';
import { NextRequest } from 'next/server';

// Mock environment variables for testing
process.env.SPOTIFY_CLIENT_ID = 'test_client_id';
process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000';

describe('GET /api/auth/login', () => {
  it('should redirect to Spotify authorization URL with status 307 (Next.js default)', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/login');
    const response = await GET();

    expect(response.status).toBe(307);
    
    const redirectUrl = response.headers.get('location');
    expect(redirectUrl).not.toBeNull();
    
    if (redirectUrl) {
      const parsedUrl = new URL(redirectUrl);
      expect(parsedUrl.origin + parsedUrl.pathname).toBe('https://accounts.spotify.com/authorize');
      expect(parsedUrl.searchParams.get('client_id')).toBe('test_client_id');
      expect(parsedUrl.searchParams.get('redirect_uri')).toBe('http://localhost:3000/api/auth/callback');
    }
  });

  it('should return 500 if SPOTIFY_CLIENT_ID is missing', async () => {
    // Temporarily remove the env variable
    const originalClientId = process.env.SPOTIFY_CLIENT_ID;
    delete process.env.SPOTIFY_CLIENT_ID;

    const req = new NextRequest('http://localhost:3000/api/auth/login');
    const response = await GET();

    expect(response.status).toBe(500);

    // Restore
    process.env.SPOTIFY_CLIENT_ID = originalClientId;
  });
});
