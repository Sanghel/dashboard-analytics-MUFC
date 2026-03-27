import { useQuery } from '@tanstack/react-query';
import { fetchTeamStatistics } from '@/infrastructure/api/endpoints/teams.api';
import { useAppStore } from '@/presentation/store/appStore';

export function useTeamStats() {
  const { selectedLeagueId, selectedSeason } = useAppStore();

  return useQuery({
    queryKey: ['teamStats', selectedLeagueId, selectedSeason],
    queryFn: () => fetchTeamStatistics(33, selectedLeagueId, selectedSeason),
    staleTime: 5 * 60 * 1000,
  });
}
