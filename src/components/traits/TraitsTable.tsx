'use client';

import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../ui/table';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import type { Trait } from '../../backend/lib/supabase';
import { Button } from '../ui/button';

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

  return (
    <section className="w-full max-w-5xl mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold mb-4">Traits Data</h2>
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
      <div className="overflow-x-auto rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Legacy?</TableHead>
              <TableHead>Primary Source (Raw)</TableHead>
              <TableHead>Summary</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : traits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">No traits found.</TableCell>
              </TableRow>
            ) : (
              traits.map(trait => (
                <TableRow key={trait.id}>
                  <TableCell className="font-medium">{trait.name}</TableCell>
                  <TableCell>
                    {trait.is_legacy ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-destructive text-destructive-foreground text-xs font-semibold">Legacy</span>
                    ) : (
                      <span className="text-muted-foreground">No</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {trait.primary_source_raw ? trait.primary_source_raw : <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell>
                    {trait.summary ? trait.summary : <span className="text-muted-foreground">—</span>}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {hasMore && !loading && (
        <div className="flex justify-center mt-4">
          <Button onClick={fetchNextPage} variant="outline">Load More</Button>
        </div>
      )}
    </section>
  );
} 