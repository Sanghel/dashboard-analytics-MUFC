import { useState } from 'react';
import { PlayerRadarChart } from '@/presentation/components/charts/PlayerRadarChart';
import { LoadingPage } from '@/presentation/components/feedback/LoadingSpinner';
import { usePlayerStats } from '@/presentation/hooks/usePlayerStats';
import type { PlayerStats } from '@/shared/types/football';

interface RadarDataPoint {
  attribute: string;
  value: number;
  fullMark: number;
}

function getRadarData(playerStats: PlayerStats | null): RadarDataPoint[] {
  if (!playerStats) return [];
  const s = playerStats.statistics[0];
  return [
    {
      attribute: 'Shooting',
      value: Math.min(100, ((s.shots?.on ?? 0) / Math.max(s.shots?.total ?? 1, 1)) * 100),
      fullMark: 100,
    },
    {
      attribute: 'Passing',
      value: parseInt(s.passes?.accuracy ?? '0', 10),
      fullMark: 100,
    },
    {
      attribute: 'Dribbling',
      value: Math.min(100, (s.goals?.assists ?? 0) * 10),
      fullMark: 100,
    },
    {
      attribute: 'Defending',
      value: Math.min(100, ((s.tackles?.interceptions ?? 0) + (s.tackles?.total ?? 0)) * 2),
      fullMark: 100,
    },
    {
      attribute: 'Goals',
      value: Math.min(100, (s.goals?.total ?? 0) * 5),
      fullMark: 100,
    },
    {
      attribute: 'Appearances',
      value: Math.min(100, s.games.appearances * 3),
      fullMark: 100,
    },
  ];
}

export function TacticalAnalysisPage() {
  const { data: players, isLoading } = usePlayerStats();
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);

  if (isLoading) return <LoadingPage />;

  const selectedPlayer =
    players?.find((p) => p.player.id === selectedPlayerId) ?? players?.[0] ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tactical Analysis</h1>
        <p className="text-sm text-muted-foreground">Player performance radar and statistics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Player selector */}
        <div className="bg-card border border-white/5 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-foreground mb-3">Select Player</h2>
          <div className="space-y-1">
            {players?.map((p) => (
              <button
                key={p.player.id}
                onClick={() => setSelectedPlayerId(p.player.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedPlayer?.player.id === p.player.id
                    ? 'bg-mufc-red text-white'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                <span className="font-medium">{p.player.name}</span>
                <span className="ml-2 text-xs opacity-60">{p.statistics[0]?.games?.position}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Radar chart */}
        <div className="lg:col-span-2 bg-card border border-white/5 rounded-xl p-4">
          {selectedPlayer ? (
            <>
              <h2 className="text-sm font-semibold text-foreground mb-1">
                {selectedPlayer.player.name}
              </h2>
              <p className="text-xs text-muted-foreground mb-2">
                {selectedPlayer.player.nationality} ·{' '}
                {selectedPlayer.statistics[0]?.games?.position}
              </p>
              <PlayerRadarChart data={getRadarData(selectedPlayer)} />
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/5">
                <div className="text-center">
                  <p className="text-xl font-bold text-foreground">
                    {selectedPlayer.statistics[0]?.goals?.total ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Goals</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-foreground">
                    {selectedPlayer.statistics[0]?.goals?.assists ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Assists</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-foreground">
                    {selectedPlayer.statistics[0]?.games?.appearances ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Apps</p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a player
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
