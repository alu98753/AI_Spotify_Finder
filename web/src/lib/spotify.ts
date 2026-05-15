/**
 * Generates the Spotify OAuth authorization URL.
 * 
 * @param clientId - The Spotify Developer App Client ID
 * @param redirectUri - The URL to redirect to after authorization
 * @returns The complete Spotify authorization URL
 */
export function getSpotifyAuthUrl(clientId: string, redirectUri: string): string {
  const scopes = [
    'user-read-playback-state',
    'user-modify-playback-state',
    'playlist-modify-private',
    'playlist-modify-public'
  ];

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: scopes.join(' '),
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}
