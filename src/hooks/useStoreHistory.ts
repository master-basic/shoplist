import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/api/client';

export function useStoreHistory() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['store-history'],
    queryFn: async () => {
      const res = await apiFetch('/api/purchase-sessions/stores');
      const json = await res.json();
      return (json.stores || []) as string[];
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    stores: data ?? [],
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
}
