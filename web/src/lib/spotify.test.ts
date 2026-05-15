import { describe, it, expect } from 'vitest';
import { getSpotifyAuthUrl } from './spotify';

describe('Spotify Auth Utility', () => {
  it('should generate a correct Spotify OAuth URL with required scopes', () => {
    const clientId = 'test_client_id';
    const redirectUri = 'http://localhost:3000/api/auth/callback/spotify';
    const expectedScopes = [
      'user-read-playback-state',
      'user-modify-playback-state',
      'playlist-modify-private',
      'playlist-modify-public'
    ].join(' ');

    const url = getSpotifyAuthUrl(clientId, redirectUri);
    
    const parsedUrl = new URL(url);
    
    expect(parsedUrl.origin + parsedUrl.pathname).toBe('https://accounts.spotify.com/authorize');
    expect(parsedUrl.searchParams.get('client_id')).toBe(clientId);
    expect(parsedUrl.searchParams.get('redirect_uri')).toBe(redirectUri);
    expect(parsedUrl.searchParams.get('scope')).toBe(expectedScopes);
    expect(parsedUrl.searchParams.get('response_type')).toBe('code');
  });
});
