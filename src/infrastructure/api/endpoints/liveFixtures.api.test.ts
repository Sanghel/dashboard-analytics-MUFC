import { describe, it, expect, vi, afterEach } from 'vitest';

const mockGet = vi.hoisted(() => vi.fn());
vi.mock('../footballApi', () => ({ footballApiClient: { get: mockGet } }));

const mockEnv = vi.hoisted(() => ({ useMockData: false, teamId: 33 }));
vi.mock('@/shared/config/env', () => ({ env: mockEnv }));

vi.mock('@/infrastructure/api/endpoints/fixtures.api');

import { fetchLiveFixtures } from './liveFixtures.api';

describe('fetchLiveFixtures', () => {
  afterEach(() => {
    mockGet.mockReset();
    mockEnv.useMockData = false;
  });

  it('returns empty array when using mock data', async () => {
    mockEnv.useMockData = true;
    const result = await fetchLiveFixtures();
    expect(result).toEqual([]);
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('calls /fixtures with live=all and team param', async () => {
    mockGet.mockResolvedValueOnce({ data: { response: [{ fixture: { id: 1 } }] } });
    await fetchLiveFixtures();
    expect(mockGet).toHaveBeenCalledWith('/fixtures', {
      params: { live: 'all', team: 33 },
    });
  });

  it('returns fixtures from API response', async () => {
    const fixtures = [{ fixture: { id: 1 } }, { fixture: { id: 2 } }];
    mockGet.mockResolvedValueOnce({ data: { response: fixtures } });
    const result = await fetchLiveFixtures();
    expect(result).toEqual(fixtures);
  });
});
