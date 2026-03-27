import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchFixtureStatistics } from './fixtureStatistics.api';
import { footballApiClient } from '../footballApi';
import { env } from '@/shared/config/env';

vi.mock('../footballApi', () => ({
  footballApiClient: { get: vi.fn() },
}));

vi.mock('@/shared/config/env', () => ({
  env: { useMockData: false },
}));

const mockGet = vi.mocked(footballApiClient.get);

describe('fetchFixtureStatistics', () => {
  beforeEach(() => vi.clearAllMocks());

  afterEach(() => {
    vi.mocked(env).useMockData = false;
  });

  it('calls /fixtures/statistics with fixtureId', async () => {
    mockGet.mockResolvedValueOnce({ data: { response: [] } });
    await fetchFixtureStatistics(215662);
    expect(mockGet).toHaveBeenCalledWith('/fixtures/statistics', {
      params: { fixture: 215662 },
    });
  });

  it('returns two team stat objects', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        response: [
          {
            team: { id: 33, name: 'Manchester United', logo: '' },
            statistics: [
              { type: 'Ball Possession', value: '54%' },
              { type: 'Total Shots', value: 14 },
            ],
          },
          {
            team: { id: 40, name: 'Liverpool', logo: '' },
            statistics: [
              { type: 'Ball Possession', value: '46%' },
              { type: 'Total Shots', value: 9 },
            ],
          },
        ],
      },
    });

    const result = await fetchFixtureStatistics(215662);
    expect(result).toHaveLength(2);
    expect(result[0].team.id).toBe(33);
    expect(result[0].statistics[0].type).toBe('Ball Possession');
    expect(result[0].statistics[0].value).toBe('54%');
    expect(result[1].team.id).toBe(40);
  });

  it('returns empty array when API returns no stats', async () => {
    mockGet.mockResolvedValueOnce({ data: { response: [] } });
    const result = await fetchFixtureStatistics(99999);
    expect(result).toEqual([]);
  });

  it('returns mock data when useMockData is true', async () => {
    vi.mocked(env).useMockData = true;
    const result = await fetchFixtureStatistics(1);
    expect(mockGet).not.toHaveBeenCalled();
    expect(result).toHaveLength(2);
    expect(result[0].team.id).toBe(33);
  });
});
