import { useState } from 'react';
import { PlayerCard } from '@/presentation/components/stats/PlayerCard';
import { LoadingPage } from '@/presentation/components/feedback/LoadingSpinner';
import { ErrorMessage } from '@/presentation/components/feedback/ErrorMessage';
import { EmptyState } from '@/presentation/components/feedback/EmptyState';
import { usePlayerStats } from '@/presentation/hooks/usePlayerStats';
import type { PlayerStats } from '@/shared/types/football';

type SortKey = 'goals' | 'assists' | 'appearances';

const POSITIONS = ['All', 'Goalkeeper', 'Defender', 'Midfielder', 'Attacker'];

const POSITION_MAP: Record<string, string[]> = {
  Goalkeeper: ['G'],
  Defender: ['D'],
  Midfielder: ['M'],
  Attacker: ['F'],
};

export function PlayerStatsPage() {
  const { data: players, isLoading, error, refetch } = usePlayerStats();
  const [sortBy, setSortBy] = useState<SortKey>('goals');
  const [positionFilter, setPositionFilter] = useState<string>('All');

  const sortedPlayers = players
    ?.filter((p) => {
      const pos = p.statistics[0]?.games?.position;
      if (positionFilter === 'All') return true;
      return POSITION_MAP[positionFilter]?.includes(pos);
    })
    .sort((a: PlayerStats, b: PlayerStats) => {
      const aStats = a.statistics[0];
      const bStats = b.statistics[0];
      if (sortBy === 'goals') return (bStats.goals.total ?? 0) - (aStats.goals.total ?? 0);
      if (sortBy === 'assists') return (bStats.goals.assists ?? 0) - (aStats.goals.assists ?? 0);
      return bStats.games.appearances - aStats.games.appearances;
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Player Stats</h1>
        <p className="text-sm text-muted-foreground">2024/25 Season squad statistics</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap items-center">
        <div className="flex gap-2 flex-wrap">
          {POSITIONS.map((pos) => (
            <button
              key={pos}
              onClick={() => setPositionFilter(pos)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                positionFilter === pos
                  ? 'bg-mufc-red text-white'
                  : 'bg-card border border-white/5 text-muted-foreground hover:text-foreground'
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-2 items-center">
          <span className="text-xs text-muted-foreground">Sort by:</span>
          {(['goals', 'assists', 'appearances'] as SortKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                sortBy === key
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* Players grid */}
      {isLoading ? (
        <LoadingPage />
      ) : error ? (
        <ErrorMessage message="Failed to load player statistics" onRetry={refetch} />
      ) : !sortedPlayers?.length ? (
        <EmptyState title="No players found" description="Try adjusting your filters." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedPlayers.map((p) => (
            <PlayerCard key={p.player.id} playerStats={p} />
          ))}
        </div>
      )}
    </div>
  );
}
