'use client';

import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../ui/table';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import type { Trait } from '../../backend/lib/supabase';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

interface TraitsTableProps {
  traits: Trait[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  fetchNextPage: () => void;
  fetchTraits: () => void;
  exportTraits: () => void;
  scrapeStatus: string | null;
  scrapeLoading: boolean;
  onScrape: () => void;
}

export default function TraitsTable({
  traits,
  loading,
  error,
  hasMore,
  fetchNextPage,
  fetchTraits,
  exportTraits,
  scrapeStatus,
  scrapeLoading,
  onScrape,
}: TraitsTableProps) {
  const [search, setSearch] = React.useState('');

  const visibleTraits = traits.filter(trait => !trait.is_replaced);

  return (
    <section className="w-full max-w-5xl mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold mb-4">Traits Data</h2>
      {/* Key/Legend for legacy icon */}
      <div className="flex items-center gap-2 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5 text-yellow-500"
          aria-label="Legacy trait - caution"
        >
          <path fillRule="evenodd" d="M8.257 3.099c.764-1.36 2.722-1.36 3.486 0l6.516 11.614c.75 1.338-.213 3.037-1.742 3.037H3.483c-1.53 0-2.492-1.7-1.742-3.037L8.257 3.1zm1.743.902L3.484 15.615c-.217.387.062.885.516.885h12c.454 0 .733-.498.516-.885L9.999 4.001zm-.75 5.249a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0v-3.5zm.75 6.25a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
        <span className="text-sm text-muted-foreground">Indicates a legacy trait</span>
      </div>
      <div className="mb-4 flex flex-col sm:flex-row gap-2 items-center justify-between">
        <Input
          placeholder="Search traits... (not implemented)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-xs"
          disabled
        />
        <div className="flex gap-2">
          <Button onClick={onScrape} disabled={scrapeLoading} variant="secondary">
            {scrapeLoading ? 'Scraping...' : 'Scrape Traits'}
          </Button>
          <Button onClick={fetchTraits} disabled={loading} variant="outline">
            {loading ? 'Loading...' : 'Fetch Traits'}
          </Button>
          <Button onClick={exportTraits} disabled={traits.length === 0} variant="outline">
            Export
          </Button>
        </div>
      </div>
      {scrapeStatus && <div className="mb-4 text-blue-600">{scrapeStatus}</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-8 justify-center">
        {loading ? (
          <div className="col-span-full text-center">Loading...</div>
        ) : visibleTraits.length === 0 ? (
          <div className="col-span-full text-center">No traits found.</div>
        ) : (
          visibleTraits.map(trait => (
            <Card key={trait.id} className="w-full min-w-[320px] max-w-2xl mx-auto">
              <CardHeader className="flex flex-row items-center justify-between gap-2 p-0 px-8 pb-2 pt-6">
                <CardTitle className="flex-1 text-lg font-semibold">
                  <a
                    href={`https://2e.aonprd.com${trait.source_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {trait.name}
                  </a>
                </CardTitle>
                {trait.is_legacy && (
                  <span className="flex items-center ml-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5 text-yellow-500 mr-1"
                      aria-label="Legacy trait - caution"
                    >
                      <path fillRule="evenodd" d="M8.257 3.099c.764-1.36 2.722-1.36 3.486 0l6.516 11.614c.75 1.338-.213 3.037-1.742 3.037H3.483c-1.53 0-2.492-1.7-1.742-3.037L8.257 3.1zm1.743.902L3.484 15.615c-.217.387.062.885.516.885h12c.454 0 .733-.498.516-.885L9.999 4.001zm-.75 5.249a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0v-3.5zm.75 6.25a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    <Badge variant="destructive">Legacy</Badge>
                  </span>
                )}
                <span className="ml-auto text-xs text-muted-foreground font-medium">
                  {trait.primary_source_raw || '—'}
                </span>
              </CardHeader>
              <CardContent className="pt-0 pb-6 px-8 break-words whitespace-pre-line">
                <div className="text-base text-muted-foreground break-words whitespace-pre-line">
                  {trait.summary || '—'}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      {hasMore && !loading && (
        <div className="flex justify-center mt-4">
          <Button onClick={fetchNextPage} variant="outline">Load More</Button>
        </div>
      )}
    </section>
  );
} 