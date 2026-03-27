import { useQuery } from '@tanstack/react-query';
import { fetchFixtureEvents } from '@/infrastructure/api/endpoints/fixtureEvents.api';
import { fetchFixtureStatistics } from '@/infrastructure/api/endpoints/fixtureStatistics.api';
import type { FixtureEvent, FixtureStatTeam } from '@/shared/types/football';

/**
 * Fetches fixture events and statistics for a given fixture ID.
 *
 * Both queries are disabled when `fixtureId` is `undefined`.
 * Note: `events` and `statistics` are `undefined` both while loading
 * AND when `fixtureId` is `undefined` — consumers must handle both cases.
 */
export function useFixtureDetail(fixtureId: number | undefined) {
  const eventsQuery = useQuery<FixtureEvent[]>({
    queryKey: ['fixture', 'events', fixtureId],
    queryFn: () => fetchFixtureEvents(fixtureId!),
    enabled: fixtureId !== undefined,
    staleTime: 5 * 60 * 1000,
  });

  const statisticsQuery = useQuery<FixtureStatTeam[]>({
    queryKey: ['fixture', 'statistics', fixtureId],
    queryFn: () => fetchFixtureStatistics(fixtureId!),
    enabled: fixtureId !== undefined,
    staleTime: 5 * 60 * 1000,
  });

  return {
    events: eventsQuery.data,
    statistics: statisticsQuery.data,
    isLoading: eventsQuery.isLoading || statisticsQuery.isLoading,
    isError: eventsQuery.isError || statisticsQuery.isError,
  };
}
