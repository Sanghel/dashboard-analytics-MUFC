import { footballApiClient } from '../footballApi';
import { env } from '@/shared/config/env';
import playersMock from '../mocks/players.mock.json';
import type { PlayerStats } from '@/shared/types/football';

export async function fetchPlayers(teamId = env.teamId, season = 2024): Promise<PlayerStats[]> {
  if (env.useMockData) {
    return playersMock.response as unknown as PlayerStats[];
  }

  const allPlayers: PlayerStats[] = [];
  let currentPage = 1;
  let totalPages = 1;

  do {
    const { data } = await footballApiClient.get('/players', {
      params: { team: teamId, season, page: currentPage },
    });
    allPlayers.push(...(data.response as PlayerStats[]));
    totalPages = data.paging.total as number;
    currentPage++;
  } while (currentPage <= totalPages);

  return allPlayers;
}
