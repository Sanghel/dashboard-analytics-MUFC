import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchFixtureEvents } from './fixtureEvents.api';
import { footballApiClient } from '../footballApi';
import { env } from '@/shared/config/env';

vi.mock('../footballApi', () => ({
  footballApiClient: { get: vi.fn() },
}));

vi.mock('@/shared/config/env', () => ({
  env: { useMockData: false },
}));

const mockGet = vi.mocked(footballApiClient.get);

describe('fetchFixtureEvents', () => {
  beforeEach(() => vi.clearAllMocks());

  afterEach(() => {
    vi.mocked(env).useMockData = false;
  });

  it('calls /fixtures/events with fixtureId', async () => {
    mockGet.mockResolvedValueOnce({ data: { response: [] } });
    await fetchFixtureEvents(215662);
    expect(mockGet).toHaveBeenCalledWith('/fixtures/events', {
      params: { fixture: 215662 },
    });
  });

  it('returns mapped events array', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        response: [
          {
            time: { elapsed: 12, extra: null },
            team: { id: 33, name: 'Manchester United', logo: '' },
            player: { id: 19185, name: 'M. Rashford' },
            assist: { id: null, name: null },
            type: 'Goal',
            detail: 'Normal Goal',
            comments: null,
          },
        ],
      },
    });

    const result = await fetchFixtureEvents(215662);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('Goal');
    expect(result[0].player.name).toBe('M. Rashford');
    expect(result[0].time.elapsed).toBe(12);
  });

  it('returns empty array when API returns no events', async () => {
    mockGet.mockResolvedValueOnce({ data: { response: [] } });
    const result = await fetchFixtureEvents(99999);
    expect(result).toEqual([]);
  });

  it('returns mock data when useMockData is true', async () => {
    vi.mocked(env).useMockData = true;
    const result = await fetchFixtureEvents(1);
    expect(mockGet).not.toHaveBeenCalled();
    expect(result.length).toBeGreaterThan(0);
  });
});
