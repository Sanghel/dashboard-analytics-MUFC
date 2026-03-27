import { useState } from 'react';
import { useRecentFixtures } from '@/presentation/hooks/useFixtures';
import { useFixtureDetail } from '@/presentation/hooks/useFixtureDetail';
import { MatchStatsChart } from '@/presentation/components/charts/MatchStatsChart';
import { LoadingPage } from '@/presentation/components/feedback/LoadingSpinner';
import { EmptyState } from '@/presentation/components/feedback/EmptyState';
import { Badge } from '@/components/ui/badge';
import type { FixtureStatTeam } from '@/shared/types/football';

function parseStatValue(value: number | string | boolean | null): number {
  if (value === null || value === false) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'boolean') return value ? 1 : 0;
  return parseInt(value.replace('%', ''), 10) || 0;
}

function buildMatchStats(stats: FixtureStatTeam[], homeTeamId: number) {
  const homeStats = stats.find((s) => s.team.id === homeTeamId);
  const awayStats = stats.find((s) => s.team.id !== homeTeamId);
  if (!homeStats || !awayStats) return [];

  const statTypes = [
    'Ball Possession',
    'Total Shots',
    'Shots on Goal',
    'Corner Kicks',
    'Fouls',
    'Yellow Cards',
  ];
  return statTypes.map((type) => {
    const homeStat = homeStats.statistics.find((s) => s.type === type);
    const awayStat = awayStats.statistics.find((s) => s.type === type);
    return {
      label: type === 'Ball Possession' ? 'Possession' : type,
      home: parseStatValue(homeStat?.value ?? null),
      away: parseStatValue(awayStat?.value ?? null),
    };
  });
}

export function LiveMatchPage() {
  const [now] = useState(() => Math.floor(Date.now() / 1000));
  const { data: recent, isLoading } = useRecentFixtures(now);
  const lastMatch = recent?.[0];
  const { events, statistics, isLoading: detailLoading } = useFixtureDetail(lastMatch?.id);

  if (isLoading) return <LoadingPage />;
  if (!lastMatch)
    return (
      <EmptyState title="No match data available" description="No recent or live matches found." />
    );

  const homeTeamName = lastMatch.homeTeam.name;
  const awayTeamName = lastMatch.awayTeam.name;
  const matchStats = statistics ? buildMatchStats(statistics, lastMatch.homeTeam.id) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Live Match</h1>
        <p className="text-sm text-muted-foreground">Latest match details</p>
      </div>

      {/* Match header */}
      <div className="bg-card border border-white/5 rounded-xl p-6">
        <div className="text-center mb-2">
          <span className="text-xs text-muted-foreground">
            {lastMatch.league.name} · {lastMatch.league.round}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <p className="text-lg font-bold text-foreground">{homeTeamName}</p>
            <p className="text-xs text-muted-foreground">Home</p>
          </div>
          <div className="text-center px-6">
            <p className="text-4xl font-bold text-foreground">
              {lastMatch.homeGoals ?? '-'} - {lastMatch.awayGoals ?? '-'}
            </p>
            <Badge className="mt-1 bg-muted text-muted-foreground">{lastMatch.status.long}</Badge>
          </div>
          <div className="text-center flex-1">
            <p className="text-lg font-bold text-foreground">{awayTeamName}</p>
            <p className="text-xs text-muted-foreground">Away</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Match Stats */}
        <div className="bg-card border border-white/5 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-foreground mb-4">Match Statistics</h2>
          {detailLoading ? (
            <p className="text-sm text-muted-foreground">Loading statistics...</p>
          ) : matchStats.length > 0 ? (
            <MatchStatsChart stats={matchStats} homeTeam={homeTeamName} awayTeam={awayTeamName} />
          ) : (
            <p className="text-sm text-muted-foreground">No statistics available</p>
          )}
        </div>

        {/* Timeline */}
        <div className="bg-card border border-white/5 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-foreground mb-4">Match Events</h2>
          {detailLoading ? (
            <p className="text-sm text-muted-foreground">Loading events...</p>
          ) : events && events.length > 0 ? (
            <div className="space-y-3">
              {events.map((event, i) => {
                const isHome = event.team.id === lastMatch.homeTeam.id;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 text-sm ${isHome ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    <span className="text-muted-foreground w-8 text-center font-mono text-xs">
                      {event.time.elapsed}&apos;
                    </span>
                    <div
                      className={`flex-1 p-2 rounded-lg bg-muted/30 ${isHome ? 'text-left' : 'text-right'}`}
                    >
                      <p className="font-medium text-foreground">{event.player.name ?? '—'}</p>
                      <p className="text-xs text-muted-foreground">
                        {event.type} · {event.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No events available</p>
          )}
        </div>
      </div>
    </div>
  );
}
