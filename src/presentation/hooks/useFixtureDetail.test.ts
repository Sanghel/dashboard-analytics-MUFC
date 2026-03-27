import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import { useFixtureDetail } from './useFixtureDetail';
import * as fixtureEventsApi from '@/infrastructure/api/endpoints/fixtureEvents.api';
import * as fixtureStatsApi from '@/infrastructure/api/endpoints/fixtureStatistics.api';
import type { FixtureEvent, FixtureStatTeam } from '@/shared/types/football';

vi.mock('@/infrastructure/api/endpoints/fixtureEvents.api');
vi.mock('@/infrastructure/api/endpoints/fixtureStatistics.api');

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useFixtureDetail', () => {
  it('does not fetch when fixtureId is undefined', () => {
    const { result } = renderHook(() => useFixtureDetail(undefined), {
      wrapper: createWrapper(),
    });
    expect(result.current.events).toBeUndefined();
    expect(result.current.statistics).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(fixtureEventsApi.fetchFixtureEvents).not.toHaveBeenCalled();
    expect(fixtureStatsApi.fetchFixtureStatistics).not.toHaveBeenCalled();
  });

  it('fetches events and statistics when fixtureId is provided', async () => {
    const mockEvent: FixtureEvent = {
      time: { elapsed: 12, extra: null },
      team: { id: 33, name: 'Manchester United', logo: '' },
      player: { id: 1, name: 'Rashford' },
      type: 'Goal',
      detail: 'Normal Goal',
      comments: null,
    };
    const mockStat: FixtureStatTeam = {
      team: { id: 33, name: 'Manchester United', logo: '' },
      statistics: [{ type: 'Ball Possession', value: '54%' }],
    };

    vi.mocked(fixtureEventsApi.fetchFixtureEvents).mockResolvedValue([mockEvent]);
    vi.mocked(fixtureStatsApi.fetchFixtureStatistics).mockResolvedValue([mockStat]);

    const { result } = renderHook(() => useFixtureDetail(215662), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.events).toHaveLength(1);
    expect(result.current.events![0].player.name).toBe('Rashford');
    expect(result.current.statistics).toHaveLength(1);
    expect(result.current.statistics![0].team.id).toBe(33);
    expect(fixtureEventsApi.fetchFixtureEvents).toHaveBeenCalledWith(215662);
    expect(fixtureStatsApi.fetchFixtureStatistics).toHaveBeenCalledWith(215662);
  });

  it('reflects error state when events query fails', async () => {
    vi.mocked(fixtureEventsApi.fetchFixtureEvents).mockRejectedValue(new Error('API error'));
    vi.mocked(fixtureStatsApi.fetchFixtureStatistics).mockResolvedValue([]);

    const { result } = renderHook(() => useFixtureDetail(99999), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isError).toBe(true);
  });
});
