import { useQuery } from '@tanstack/react-query';
import { fetchLiveFixtures } from '@/infrastructure/api/endpoints/liveFixtures.api';
import type { Fixture } from '@/shared/types/football';

export function useLiveFixtures() {
  const { data, isLoading } = useQuery<Fixture[]>({
    queryKey: ['fixtures', 'live'],
    queryFn: fetchLiveFixtures,
    refetchInterval: 30_000,
    staleTime: 0,
  });

  const fixtures = data ?? [];
  const hasLiveMatch = fixtures.length > 0;

  return { fixtures, hasLiveMatch, isLoading };
}
