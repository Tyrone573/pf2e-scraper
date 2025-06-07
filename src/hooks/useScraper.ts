import { useState } from 'react';
import type { Trait } from '../backend/lib/supabase';

interface PaginatedResponse {
  traits: Trait[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export const useScraper = () => {
  const [traits, setTraits] = useState<Trait[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchTraits = async () => {
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
  };

  const fetchPage = async (page: number, isInitialFetch: boolean = false) => {
    try {
      const response = await fetch(`/api/traits?page=${page}&limit=20`, {
        signal: AbortSignal.timeout(610000), // 10 minutes 10 seconds
      });
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
      const data: PaginatedResponse = await response.json();
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

  const exportTraits = () => {
    const dataStr = JSON.stringify(traits, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = 'pathfinder-2e-traits-dictionary.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return {
    traits,
    loading,
    error,
    hasMore,
    currentPage,
    fetchTraits,
    fetchNextPage: () => fetchPage(currentPage + 1),
    exportTraits,
  };
}; 