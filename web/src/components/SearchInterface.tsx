'use client';

import { useState } from 'react';

interface SearchInterfaceProps {
  onSearch: (query: string) => void;
}

export default function SearchInterface({ onSearch }: SearchInterfaceProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl flex flex-col gap-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Describe the vibe... (e.g., lofi study focus)"
        className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
      />
      <button
        type="submit"
        className="w-full sm:w-auto px-8 py-4 bg-green-500 text-black font-bold rounded-xl hover:bg-green-400 transition-all self-end"
      >
        Find Music
      </button>
    </form>
  );
}
