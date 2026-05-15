import { NextRequest, NextResponse } from 'next/server';
import { playSpotifyTrack } from '@/lib/spotifyPlay';

export async function POST(req: NextRequest) {
  try {
    const tokenCookie = req.cookies.get('spotify_access_token');
    
    if (!tokenCookie?.value) {
      return NextResponse.json({ error: 'Unauthorized. Please log in with Spotify.' }, { status: 401 });
    }

    const body = await req.json();
    const { trackUri } = body;

    if (!trackUri) {
      return NextResponse.json({ error: 'Missing trackUri' }, { status: 400 });
    }

    await playSpotifyTrack(trackUri, tokenCookie.value);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Play API error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
