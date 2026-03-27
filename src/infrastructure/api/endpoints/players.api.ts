import { footballApiClient } from '../footballApi';
import { env } from '@/shared/config/env';
import playersMock from '../mocks/players.mock.json';
import type { PlayerStats } from '@/shared/types/football';

export async function fetchPlayers(teamId = env.teamId, season = 2024): Promise<PlayerStats[]> {
  if (env.useMockData) {
    return playersMock.response as unknown as PlayerStats[];
  }
  const { data } = await footballApiClient.get('/players', {
    params: { team: teamId, season },
  });
  return data.response as PlayerStats[];
}
