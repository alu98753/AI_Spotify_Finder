'use client';

import { useState } from 'react';

export default function SearchInterface() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query.trim() })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to search');
      
      setResults(data.tracks?.items || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = async (trackUri: string) => {
    try {
      const res = await fetch('/api/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackUri })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to play track');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="w-full max-w-2xl flex flex-col gap-8 animate-in fade-in zoom-in duration-500">
      <form onSubmit={handleSearch} className="flex flex-col gap-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe the vibe... (e.g., late night coding focus)"
          className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all shadow-xl"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="w-full sm:w-auto px-8 py-4 bg-green-500 text-black font-bold rounded-xl hover:bg-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed self-end shadow-lg"
        >
          {loading ? 'Consulting AI...' : 'Find Music'}
        </button>
      </form>

      {error && (
        <div className="text-red-400 text-center p-4 bg-red-950/30 border border-red-900/50 rounded-xl">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="flex flex-col gap-3 animate-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-xl font-bold text-zinc-300 mb-2 px-2">Curated Tracks</h2>
          {results.map((track) => (
            <div key={track.id} className="flex items-center justify-between p-4 bg-zinc-900/80 hover:bg-zinc-800 rounded-xl border border-zinc-800/50 transition-all hover:scale-[1.02] hover:shadow-2xl group">
              <div className="flex items-center gap-4">
                {track.album?.images?.[0] && (
                  <img src={track.album.images[0].url} alt={track.name} className="w-14 h-14 rounded-md object-cover shadow-md" />
                )}
                <div className="flex flex-col">
                  <span className="font-bold text-zinc-100 text-lg group-hover:text-green-400 transition-colors">{track.name}</span>
                  <span className="text-sm text-zinc-400">{track.artists.map((a: any) => a.name).join(', ')}</span>
                </div>
              </div>
              <button
                onClick={() => handlePlay(track.uri)}
                className="p-4 rounded-full bg-zinc-950 hover:bg-green-500 hover:text-black text-green-400 transition-all shadow-md active:scale-95"
                title="Play on Spotify Desktop"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
