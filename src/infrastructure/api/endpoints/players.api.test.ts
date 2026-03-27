import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchPlayers } from './players.api';
import { footballApiClient } from '../footballApi';
import { env } from '@/shared/config/env';

vi.mock('../footballApi', () => ({
  footballApiClient: { get: vi.fn() },
}));

vi.mock('@/shared/config/env', () => ({
  env: { useMockData: false, teamId: 33 },
}));

const mockGet = vi.mocked(footballApiClient.get);

describe('fetchPlayers', () => {
  beforeEach(() => vi.clearAllMocks());

  afterEach(() => {
    vi.mocked(env).useMockData = false;
  });

  it('fetches a single page when total pages is 1', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        paging: { current: 1, total: 1 },
        response: [{ player: { id: 1 }, statistics: [] }],
      },
    });

    const result = await fetchPlayers(33, 2024);
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(1);
  });

  it('fetches all pages when total > 1', async () => {
    mockGet
      .mockResolvedValueOnce({
        data: {
          paging: { current: 1, total: 2 },
          response: [{ player: { id: 1 }, statistics: [] }],
        },
      })
      .mockResolvedValueOnce({
        data: {
          paging: { current: 2, total: 2 },
          response: [{ player: { id: 2 }, statistics: [] }],
        },
      });

    const result = await fetchPlayers(33, 2024);
    expect(mockGet).toHaveBeenCalledTimes(2);
    expect(mockGet).toHaveBeenNthCalledWith(1, '/players', {
      params: { team: 33, season: 2024, page: 1 },
    });
    expect(mockGet).toHaveBeenNthCalledWith(2, '/players', {
      params: { team: 33, season: 2024, page: 2 },
    });
    expect(result).toHaveLength(2);
  });

  it('combines players from all pages into a single array', async () => {
    mockGet
      .mockResolvedValueOnce({
        data: {
          paging: { current: 1, total: 3 },
          response: [
            { player: { id: 1 }, statistics: [] },
            { player: { id: 2 }, statistics: [] },
          ],
        },
      })
      .mockResolvedValueOnce({
        data: {
          paging: { current: 2, total: 3 },
          response: [{ player: { id: 3 }, statistics: [] }],
        },
      })
      .mockResolvedValueOnce({
        data: {
          paging: { current: 3, total: 3 },
          response: [{ player: { id: 4 }, statistics: [] }],
        },
      });

    const result = await fetchPlayers(33, 2024);
    expect(mockGet).toHaveBeenCalledTimes(3);
    expect(result).toHaveLength(4);
  });

  it('returns mock data without calling API when useMockData is true', async () => {
    vi.mocked(env).useMockData = true;
    const result = await fetchPlayers(33, 2024);
    expect(mockGet).not.toHaveBeenCalled();
    expect(Array.isArray(result)).toBe(true);
  });
});
