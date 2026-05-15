import { NextResponse } from 'next/server';
import { getSpotifyAuthUrl } from '@/lib/spotify';

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  if (!clientId) {
    return NextResponse.json(
      { error: 'Server configuration error: Missing Spotify Client ID' },
      { status: 500 }
    );
  }

  const redirectUri = `${baseUrl}/api/auth/callback`;
  const url = getSpotifyAuthUrl(clientId, redirectUri);

  return NextResponse.redirect(url);
}
