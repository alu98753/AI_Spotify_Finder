import { NextRequest, NextResponse } from 'next/server';
import { generateSearchQuery } from '@/lib/llm';
import { searchSpotifyTracks } from '@/lib/spotifySearch';

export async function POST(req: NextRequest) {
  try {
    const tokenCookie = req.cookies.get('spotify_access_token');
    
    if (!tokenCookie?.value) {
      return NextResponse.json({ error: 'Unauthorized. Please log in with Spotify.' }, { status: 401 });
    }

    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      return NextResponse.json({ error: 'Server configuration error: Missing LLM API Key' }, { status: 500 });
    }

    // 1. LLM extracts query
    const searchQuery = await generateSearchQuery(prompt, openaiKey);

    // 2. Spotify Search
    const searchResults = await searchSpotifyTracks(searchQuery, tokenCookie.value);

    return NextResponse.json(searchResults);
  } catch (error: any) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
