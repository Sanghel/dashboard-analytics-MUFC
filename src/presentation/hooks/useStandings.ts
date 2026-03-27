import { useQuery } from '@tanstack/react-query';
import { fetchStandings } from '@/infrastructure/api/endpoints/standings.api';
import { useAppStore } from '@/presentation/store/appStore';

export function useStandings() {
  const { selectedLeagueId, selectedSeason } = useAppStore();

  return useQuery({
    queryKey: ['standings', selectedLeagueId, selectedSeason],
    queryFn: () => fetchStandings(selectedLeagueId, selectedSeason),
    staleTime: 5 * 60 * 1000,
  });
}
