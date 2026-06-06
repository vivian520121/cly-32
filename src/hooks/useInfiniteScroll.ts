import { useRef, useCallback, useEffect, useState } from 'react';

interface UseInfiniteScrollOptions<T> {
  loadMore: (page: number) => Promise<{ items: T[]; hasMore: boolean }>;
  threshold?: number;
  rootMargin?: string;
  initialPage?: number;
  pageSize?: number;
}

export function useInfiniteScroll<T>(options: UseInfiniteScrollOptions<T>) {
  const {
    loadMore,
    threshold = 0.1,
    rootMargin = '100px',
    initialPage = 1,
  } = options;

  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMoreItems = useCallback(async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    setIsError(false);
    
    try {
      const result = await loadMore(page);
      setItems((prev) => [...prev, ...result.items]);
      setHasMore(result.hasMore);
      setPage((prev) => prev + 1);
    } catch (e) {
      setIsError(true);
      console.error('Failed to load more items', e);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, page, loadMore]);

  useEffect(() => {
    loadMoreItems();
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore && !isLoading) {
            loadMoreItems();
          }
        });
      },
      { threshold, rootMargin }
    );

    observerRef.current.observe(sentinel);

    return () => {
      if (observerRef.current && sentinel) {
        observerRef.current.unobserve(sentinel);
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, threshold, rootMargin, loadMoreItems]);

  const reset = useCallback(() => {
    setItems([]);
    setPage(initialPage);
    setHasMore(true);
    setIsLoading(false);
    setIsError(false);
  }, [initialPage]);

  const prependItems = useCallback((newItems: T[]) => {
    setItems((prev) => [...newItems, ...prev]);
  }, []);

  return {
    items,
    isLoading,
    isError,
    hasMore,
    sentinelRef,
    loadMore: loadMoreItems,
    reset,
    prependItems,
  };
}
