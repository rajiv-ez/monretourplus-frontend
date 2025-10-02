import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

interface UsePaginatedApiReturn<T> {
  data: T[];
  next: string | null;
  previous: string | null;
  count: number;
  loading: boolean;
  setPageUrl: (url: string) => void;
  reset: () => void;
}

export function usePaginatedApi<T = any>(initialEndpoint: string): UsePaginatedApiReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageUrl, setPageUrl] = useState<string>(initialEndpoint);

  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const headers = { Authorization: `Bearer ${token}` };
      // Si pageUrl est absolue, on l'utilise telle quelle, sinon on la concatène au baseUrl
      const url = pageUrl.startsWith('http') ? pageUrl : baseUrl + pageUrl;
      const res = await api.get(url, { headers });
      setData(res.data.results);
      setNext(res.data.next);
      setPrevious(res.data.previous);
      setCount(res.data.count);
    } catch (err) {
      setData([]);
      setNext(null);
      setPrevious(null);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, [pageUrl, baseUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const reset = () => setPageUrl(initialEndpoint);

  return { data, next, previous, count, loading, setPageUrl, reset };
}
