/**
 * Tells the user's active Spotify device to start playing a specific track.
 * 
 * @param trackUri - The Spotify URI of the track to play
 * @param accessToken - The user's Spotify access token
 */
export async function playSpotifyTrack(trackUri: string, accessToken: string): Promise<void> {
  const response = await fetch('https://api.spotify.com/v1/me/player/play', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      uris: [trackUri]
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to play track: ${response.statusText}`);
  }
}
