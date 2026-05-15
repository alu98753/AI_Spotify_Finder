import { cookies } from 'next/headers';
import SearchInterface from '@/components/SearchInterface';

export default async function Home() {
  const cookieStore = await cookies();
  const hasToken = cookieStore.has('spotify_access_token');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-zinc-950 text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-center flex flex-col gap-8 font-mono text-sm">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
          AI Spotify Finder
        </h1>
        
        <p className="text-zinc-400 text-center max-w-lg text-lg">
          Describe the vibe, and let AI curate the perfect playlist for your Spotify Desktop.
        </p>

        {hasToken ? (
          <SearchInterface />
        ) : (
          <a
            href="/api/auth/login"
            className="group rounded-full border border-transparent px-8 py-4 bg-green-500 text-black font-bold hover:bg-green-400 transition-all flex items-center gap-2"
          >
            <span>Login with Spotify</span>
          </a>
        )}
      </div>
    </main>
  );
}
