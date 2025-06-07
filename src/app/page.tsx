'use client';
import React, { useState, useCallback } from 'react';
import TraitsTable from '../components/traits/TraitsTable';
import Image from 'next/image';
import type { Trait } from '../backend/lib/supabase';

export default function Home() {
  const [traits, setTraits] = useState<Trait[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [scrapeStatus, setScrapeStatus] = useState<string | null>(null);
  const [scrapeLoading, setScrapeLoading] = useState(false);

  const fetchTraits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setTraits([]);
      setCurrentPage(1);
      setHasMore(true);
      await fetchPage(1, true);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPage = async (page: number, isInitialFetch: boolean = false) => {
    try {
      const response = await fetch(`/api/traits?page=${page}&limit=20`);
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
          const error = new Error(errorData.message || 'Failed to fetch traits');
          (error as any).code = errorData.code;
          throw error;
        } catch (parseError) {
          throw new Error(errorText || 'Failed to fetch traits');
        }
      }
      const data = await response.json();
      if (!data || !Array.isArray(data.traits)) {
        throw new Error('Invalid response format from server');
      }
      if (data.traits.length === 0) {
        setHasMore(false);
        if (page === 1) {
          throw new Error('No traits were found');
        }
        return;
      }
      setTraits(prev => [...prev, ...data.traits]);
      setHasMore(data.pagination.hasMore);
      setCurrentPage(data.pagination.page);
      if (data.pagination.hasMore && isInitialFetch) {
        await fetchPage(page + 1, true);
      }
    } catch (err) {
      handleError(err);
      throw err;
    }
  };

  const handleError = (err: any) => {
    let errorMessage = err instanceof Error ? err.message : 'Failed to fetch traits. Please try again later.';
    if (err.name === 'TimeoutError') {
      errorMessage = 'Request timed out. Please try again in a few minutes.';
    } else if (err.name === 'AbortError') {
      errorMessage = 'Request was aborted. Please check your internet connection and try again.';
    } else if (err.code === 'WORKER_LIMIT') {
      errorMessage = 'Server is busy. Please wait 15 seconds before trying again.';
    }
    setError(errorMessage);
    console.error('Error fetching traits:', err);
  };

  const fetchNextPage = async () => {
    await fetchPage(currentPage + 1);
  };

  const exportTraits = () => {
    const dataStr = JSON.stringify(traits, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = 'pathfinder-2e-traits-dictionary.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleScrape = async () => {
    setScrapeLoading(true);
    setScrapeStatus(null);
    try {
      const res = await fetch('/api/scrape', { method: 'POST' });
      const data = await res.json();
      if (data.status === 'done') {
        setScrapeStatus('Scraping complete!');
        await fetchTraits();
      } else {
        setScrapeStatus(data.message || 'An error occurred.');
      }
    } catch (err: any) {
      setScrapeStatus(err.message || 'An error occurred.');
    } finally {
      setScrapeLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTraits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-background to-muted items-center justify-between">
      <TraitsTable
        traits={traits}
        loading={loading}
        error={error}
        hasMore={hasMore}
        fetchNextPage={fetchNextPage}
        fetchTraits={fetchTraits}
        exportTraits={exportTraits}
        scrapeStatus={scrapeStatus}
        scrapeLoading={scrapeLoading}
        onScrape={handleScrape}
      />
      {/* Footer */}
      <footer className="w-full flex flex-col items-center justify-center py-8 border-t mt-8 bg-background/80">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Created with &lt;3 by</span>
          <Image src="/images/chaosmonkey.png" alt="chaosmonkey" width={28} height={28} className="rounded-full" />
        </div>
      </footer>
    </main>
  );
}
