'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { searchTools } from '@/lib/toolsService';
import { ToolCard } from '@/components/ToolCard';
import { SearchBar } from '@/components/SearchBar';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const results = query ? searchTools(query) : [];

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">Search Results</h1>
          <SearchBar />
        </div>

        {/* Results */}
        {query && (
          <div className="mb-6">
            <p className="text-slate-600">
              Found <span className="font-semibold">{results.length}</span> tools matching "<span className="font-semibold">{query}</span>"
            </p>
          </div>
        )}

        {results.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">No tools found for "{query}"</p>
            <p className="text-sm text-slate-500">Try searching for categories like "CRM", "project management", or specific tools</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600">Enter a search term to find tools</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Searching...</div>}>
      <SearchContent />
    </Suspense>
  );
}
