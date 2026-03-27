import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';

const mockFetchLiveFixtures = vi.hoisted(() => vi.fn());
vi.mock('@/infrastructure/api/endpoints/liveFixtures.api', () => ({
  fetchLiveFixtures: mockFetchLiveFixtures,
}));

vi.mock('@/infrastructure/api/endpoints/fixtures.api');

import { useLiveFixtures } from './useLiveFixtures';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useLiveFixtures', () => {
  beforeEach(() => {
    mockFetchLiveFixtures.mockReset();
  });

  it('returns empty array and hasLiveMatch false when no live fixtures', async () => {
    mockFetchLiveFixtures.mockResolvedValueOnce([]);
    const { result } = renderHook(() => useLiveFixtures(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.fixtures).toEqual([]);
    expect(result.current.hasLiveMatch).toBe(false);
  });

  it('returns fixtures and hasLiveMatch true when live fixtures exist', async () => {
    const liveFixture = {
      id: 1,
      homeTeam: { id: 33 },
      awayTeam: { id: 10 },
      status: { short: '1H', long: 'First Half', elapsed: 23 },
      homeGoals: 1,
      awayGoals: 0,
    };
    mockFetchLiveFixtures.mockResolvedValueOnce([liveFixture]);
    const { result } = renderHook(() => useLiveFixtures(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.fixtures).toEqual([liveFixture]);
    expect(result.current.hasLiveMatch).toBe(true);
  });

  it('sets isLoading true initially', () => {
    mockFetchLiveFixtures.mockResolvedValueOnce([]);
    const { result } = renderHook(() => useLiveFixtures(), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(true);
  });
});
