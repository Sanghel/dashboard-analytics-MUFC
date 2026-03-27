import { useQuery } from '@tanstack/react-query';
import { fetchPlayers } from '@/infrastructure/api/endpoints/players.api';
import { useAppStore } from '@/presentation/store/appStore';

export function usePlayerStats() {
  const { selectedSeason } = useAppStore();

  return useQuery({
    queryKey: ['players', 33, selectedSeason],
    queryFn: () => fetchPlayers(33, selectedSeason),
    staleTime: 10 * 60 * 1000,
  });
}
