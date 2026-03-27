import { useState } from 'react';
import { Trophy, Target, TrendingUp, Shield, Activity } from 'lucide-react';
import { StatCard } from '@/presentation/components/stats/StatCard';
import { MatchCard } from '@/presentation/components/stats/MatchCard';
import { SeasonPerformanceChart } from '@/presentation/components/charts/SeasonPerformanceChart';
import { LoadingPage } from '@/presentation/components/feedback/LoadingSpinner';
import { ErrorMessage } from '@/presentation/components/feedback/ErrorMessage';
import { EmptyState } from '@/presentation/components/feedback/EmptyState';
import { useTeamStats } from '@/presentation/hooks/useTeamStats';
import { useUpcomingFixtures, useRecentFixtures } from '@/presentation/hooks/useFixtures';
import { useSeasonPerformance } from '@/presentation/hooks/useSeasonPerformance';
import { useStandings } from '@/presentation/hooks/useStandings';

export function OverviewPage() {
  const [now] = useState(() => Math.floor(Date.now() / 1000));
  const {
    data: teamStats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useTeamStats();
  const { data: upcoming, isLoading: upcomingLoading } = useUpcomingFixtures(now);
  const { data: recent, isLoading: recentLoading } = useRecentFixtures(now);
  const { data: performance, isLoading: perfLoading } = useSeasonPerformance();
  const { data: standings } = useStandings();

  if (statsLoading) return <LoadingPage />;
  if (statsError)
    return <ErrorMessage message="Failed to load team statistics" onRetry={refetchStats} />;

  const muStanding = standings?.find((s) => s.team.id === 33);
  const goalDiff = teamStats
    ? teamStats.goals.for.total.total - teamStats.goals.against.total.total
    : 0;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Season Overview</h1>
        <p className="text-sm text-muted-foreground">2024/25 Premier League Season</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          title="League Position"
          value={
            muStanding
              ? `${muStanding.rank}${muStanding.rank === 1 ? 'st' : muStanding.rank === 2 ? 'nd' : muStanding.rank === 3 ? 'rd' : 'th'}`
              : '-'
          }
          subtitle="Premier League"
          icon={<Trophy className="w-4 h-4" />}
          highlight={muStanding ? muStanding.rank <= 4 : false}
        />
        <StatCard
          title="Wins"
          value={teamStats?.fixtures.wins.total ?? '-'}
          subtitle={`of ${teamStats?.fixtures.played.total ?? '-'} played`}
          trend="up"
          trendLabel="+2 vs last season"
          icon={<Activity className="w-4 h-4" />}
        />
        <StatCard
          title="Goals Scored"
          value={teamStats?.goals.for.total.total ?? '-'}
          subtitle={`${teamStats?.goals.for.average.total ?? '-'} per game`}
          icon={<Target className="w-4 h-4" />}
        />
        <StatCard
          title="Goal Difference"
          value={teamStats ? `${goalDiff >= 0 ? '+' : ''}${goalDiff}` : '-'}
          trend={teamStats ? (goalDiff > 0 ? 'up' : 'down') : undefined}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <StatCard
          title="Clean Sheets"
          value={teamStats?.cleanSheets.total ?? '-'}
          subtitle={`${teamStats?.cleanSheets.home ?? 0} home, ${teamStats?.cleanSheets.away ?? 0} away`}
          icon={<Shield className="w-4 h-4" />}
        />
      </div>

      {/* Season Performance Chart */}
      {!perfLoading && performance && (
        <div className="bg-card border border-white/5 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-foreground mb-1">Season Performance</h2>
          <p className="text-xs text-muted-foreground mb-4">
            Goals scored and conceded per matchday
          </p>
          <SeasonPerformanceChart data={performance} />
        </div>
      )}

      {/* Upcoming Matches + Recent Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Upcoming */}
        <div className="bg-card border border-white/5 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">Upcoming Matches</h2>
          </div>
          {upcomingLoading ? (
            <LoadingPage />
          ) : !upcoming?.length ? (
            <EmptyState title="No upcoming matches" />
          ) : (
            <div className="space-y-2">
              {upcoming.map((f) => (
                <MatchCard key={f.id} fixture={f} />
              ))}
            </div>
          )}
        </div>

        {/* Recent Results */}
        <div className="bg-card border border-white/5 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">Recent Results</h2>
          </div>
          {recentLoading ? (
            <LoadingPage />
          ) : !recent?.length ? (
            <EmptyState title="No recent results" />
          ) : (
            <div className="space-y-2">
              {recent.map((f) => (
                <MatchCard key={f.id} fixture={f} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
