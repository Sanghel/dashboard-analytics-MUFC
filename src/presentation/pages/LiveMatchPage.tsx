import { useState } from 'react';
import { useRecentFixtures } from '@/presentation/hooks/useFixtures';
import { MatchStatsChart } from '@/presentation/components/charts/MatchStatsChart';
import { LoadingPage } from '@/presentation/components/feedback/LoadingSpinner';
import { EmptyState } from '@/presentation/components/feedback/EmptyState';
import { Badge } from '@/components/ui/badge';

const MOCK_MATCH_EVENTS = [
  { time: 12, type: 'Goal', player: 'Rashford', team: 'home', detail: 'Normal Goal' },
  { time: 34, type: 'Yellow Card', player: 'Salah', team: 'away', detail: 'Foul' },
  { time: 45, type: 'Goal', player: 'Fernandes', team: 'home', detail: 'Penalty' },
  { time: 67, type: 'Goal', player: 'Núñez', team: 'away', detail: 'Normal Goal' },
  { time: 78, type: 'Substitution', player: 'Højlund', team: 'home', detail: 'In' },
];

const MOCK_MATCH_STATS = [
  { label: 'Possession', home: 54, away: 46 },
  { label: 'Shots', home: 14, away: 9 },
  { label: 'Shots on Target', home: 6, away: 3 },
  { label: 'Corners', home: 7, away: 4 },
  { label: 'Fouls', home: 8, away: 12 },
  { label: 'Yellow Cards', home: 1, away: 2 },
];

export function LiveMatchPage() {
  const [now] = useState(() => Math.floor(Date.now() / 1000));
  const { data: recent, isLoading } = useRecentFixtures(now);
  const lastMatch = recent?.[0];

  if (isLoading) return <LoadingPage />;
  if (!lastMatch)
    return (
      <EmptyState title="No match data available" description="No recent or live matches found." />
    );

  const homeTeamName = lastMatch.homeTeam.name;
  const awayTeamName = lastMatch.awayTeam.name;

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
          <MatchStatsChart
            stats={MOCK_MATCH_STATS}
            homeTeam={homeTeamName}
            awayTeam={awayTeamName}
          />
        </div>

        {/* Timeline */}
        <div className="bg-card border border-white/5 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-foreground mb-4">Match Events</h2>
          <div className="space-y-3">
            {MOCK_MATCH_EVENTS.map((event, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 text-sm ${event.team === 'home' ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <span className="text-muted-foreground w-8 text-center font-mono text-xs">
                  {event.time}&apos;
                </span>
                <div
                  className={`flex-1 p-2 rounded-lg bg-muted/30 ${event.team === 'home' ? 'text-left' : 'text-right'}`}
                >
                  <p className="font-medium text-foreground">{event.player}</p>
                  <p className="text-xs text-muted-foreground">{event.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
