/**
 * Searches for tracks on Spotify using the Web API.
 * 
 * @param query - The search query (e.g., 'lofi focus')
 * @param accessToken - The user's Spotify access token
 * @returns The JSON response from Spotify containing the search results
 */
export async function searchSpotifyTracks(query: string, accessToken: string) {
  const params = new URLSearchParams({
    q: query,
    type: 'track',
    limit: '10'
  });

  const response = await fetch(`https://api.spotify.com/v1/search?${params.toString()}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to search Spotify tracks: ${response.statusText}`);
  }

  return response.json();
}
