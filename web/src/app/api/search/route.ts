import { NextRequest, NextResponse } from 'next/server';
import { LLMFactory } from '@/lib/llm';
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

    const providerName = (process.env.LLM_PROVIDER || 'openai') as 'openai' | 'gemini';
    const apiKey = providerName === 'gemini' ? process.env.GEMINI_API_KEY : process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: `Server configuration error: Missing API Key for ${providerName}` }, { status: 500 });
    }

    // 1. LLM extracts query
    const llmProvider = LLMFactory.getProvider(providerName);
    const searchQuery = await llmProvider.generateSearchQuery(prompt, apiKey);

    // 2. Spotify Search
    const searchResults = await searchSpotifyTracks(searchQuery, tokenCookie.value);

    return NextResponse.json(searchResults);
  } catch (error: any) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
