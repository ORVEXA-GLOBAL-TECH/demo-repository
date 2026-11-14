'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@alleviare/api-client';

/** Loads data once and on demand; exposes a human-readable error and a reload function. */
export function useLoad<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(fn, deps);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setData(await run());
      setError('');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [run]);

  useEffect(() => { void reload(); }, [reload]);
  return { data, error, loading, reload, setError };
}

export function messageOf(e: unknown): string {
  return e instanceof ApiError ? e.message : 'Something went wrong';
}
