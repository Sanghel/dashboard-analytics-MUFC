import { StandingsTable } from '@/presentation/components/stats/StandingsTable';
import { LoadingPage } from '@/presentation/components/feedback/LoadingSpinner';
import { ErrorMessage } from '@/presentation/components/feedback/ErrorMessage';
import { EmptyState } from '@/presentation/components/feedback/EmptyState';
import { useStandings } from '@/presentation/hooks/useStandings';
import { useAppStore } from '@/presentation/store/appStore';

const LEAGUES = [
  { id: 39, name: 'Premier League' },
  { id: 2, name: 'UEFA Champions League' },
  { id: 3, name: 'UEFA Europa League' },
];

export function StandingsPage() {
  const { selectedLeagueId, setSelectedLeagueId } = useAppStore();
  const { data: standings, isLoading, error, refetch } = useStandings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Standings</h1>
        <p className="text-sm text-muted-foreground">Current league table</p>
      </div>

      {/* League selector */}
      <div className="flex gap-2 flex-wrap">
        {LEAGUES.map((league) => (
          <button
            key={league.id}
            onClick={() => setSelectedLeagueId(league.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedLeagueId === league.id
                ? 'bg-mufc-red text-white'
                : 'bg-card border border-white/5 text-muted-foreground hover:text-foreground'
            }`}
          >
            {league.name}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-white/5 rounded-xl p-4">
        {isLoading ? (
          <LoadingPage />
        ) : error ? (
          <ErrorMessage message="Failed to load standings" onRetry={refetch} />
        ) : !standings?.length ? (
          <EmptyState
            title="No standings available"
            description="Standings data is not available for this competition."
          />
        ) : (
          <StandingsTable standings={standings} highlightTeamId={33} />
        )}
      </div>
    </div>
  );
}
