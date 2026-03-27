import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import { useFixtureDetail } from './useFixtureDetail';
import type { FixtureEvent, FixtureStatTeam } from '@/shared/types/football';

const { mockFetchFixtureEvents, mockFetchFixtureStatistics } = vi.hoisted(() => ({
  mockFetchFixtureEvents: vi.fn(),
  mockFetchFixtureStatistics: vi.fn(),
}));

vi.mock('@/infrastructure/api/endpoints/fixtureEvents.api', () => ({
  fetchFixtureEvents: mockFetchFixtureEvents,
}));
vi.mock('@/infrastructure/api/endpoints/fixtureStatistics.api', () => ({
  fetchFixtureStatistics: mockFetchFixtureStatistics,
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useFixtureDetail', () => {
  beforeEach(() => {
    mockFetchFixtureEvents.mockReset();
    mockFetchFixtureStatistics.mockReset();
  });

  it('does not fetch when fixtureId is undefined', () => {
    const { result } = renderHook(() => useFixtureDetail(undefined), {
      wrapper: createWrapper(),
    });
    expect(result.current.events).toBeUndefined();
    expect(result.current.statistics).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(mockFetchFixtureEvents).not.toHaveBeenCalled();
    expect(mockFetchFixtureStatistics).not.toHaveBeenCalled();
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

    mockFetchFixtureEvents.mockResolvedValue([mockEvent]);
    mockFetchFixtureStatistics.mockResolvedValue([mockStat]);

    const { result } = renderHook(() => useFixtureDetail(215662), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.events).toHaveLength(1);
    expect(result.current.events![0].player.name).toBe('Rashford');
    expect(result.current.statistics).toHaveLength(1);
    expect(result.current.statistics![0].team.id).toBe(33);
    expect(mockFetchFixtureEvents).toHaveBeenCalledWith(215662);
    expect(mockFetchFixtureStatistics).toHaveBeenCalledWith(215662);
  });

  it('reflects error state when events query fails', async () => {
    mockFetchFixtureEvents.mockRejectedValue(new Error('API error'));
    mockFetchFixtureStatistics.mockResolvedValue([]);

    const { result } = renderHook(() => useFixtureDetail(99999), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isError).toBe(true);
  });
});
