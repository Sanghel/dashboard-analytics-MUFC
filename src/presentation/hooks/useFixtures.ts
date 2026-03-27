import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchFixtures } from '@/infrastructure/api/endpoints/fixtures.api';

export function useFixtures() {
  return useQuery({
    queryKey: ['fixtures', 33],
    queryFn: () => fetchFixtures(33),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpcomingFixtures(nowSeconds: number) {
  const query = useFixtures();
  const upcoming = useMemo(
    () =>
      query.data
        ?.filter((f) => f.timestamp > nowSeconds)
        .sort((a, b) => a.timestamp - b.timestamp)
        .slice(0, 5),
    [query.data, nowSeconds]
  );
  return { ...query, data: upcoming };
}

export function useRecentFixtures(nowSeconds: number) {
  const query = useFixtures();
  const recent = useMemo(
    () =>
      query.data
        ?.filter((f) => f.timestamp <= nowSeconds)
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 5),
    [query.data, nowSeconds]
  );
  return { ...query, data: recent };
}
