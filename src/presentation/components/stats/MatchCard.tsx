import { Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Fixture } from '@/shared/types/football';

interface MatchCardProps {
  fixture: Fixture;
  muTeamId?: number;
  className?: string;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getResultBadge(fixture: Fixture, muTeamId: number) {
  if (fixture.homeGoals === null || fixture.awayGoals === null) return null;
  const muIsHome = fixture.homeTeam.id === muTeamId;
  const muGoals = muIsHome ? fixture.homeGoals : fixture.awayGoals;
  const oppGoals = muIsHome ? fixture.awayGoals : fixture.homeGoals;
  if (muGoals > oppGoals)
    return <Badge className="bg-green-500/20 text-green-400 border-green-500/20">W</Badge>;
  if (muGoals < oppGoals)
    return <Badge className="bg-red-500/20 text-red-400 border-red-500/20">L</Badge>;
  return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/20">D</Badge>;
}

export function MatchCard({ fixture, muTeamId = 33, className }: MatchCardProps) {
  const isFinished = fixture.status.short === 'FT' || fixture.status.short === 'AET';
  const isLive =
    fixture.status.short === '1H' || fixture.status.short === '2H' || fixture.status.short === 'HT';

  return (
    <div className={cn('bg-card border border-white/5 rounded-xl p-4', className)}>
      {/* League + date */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {formatDate(fixture.date)}
        </span>
        <div className="flex items-center gap-2">
          {isLive && (
            <Badge className="bg-mufc-red/20 text-mufc-red border-mufc-red/20 animate-pulse">
              LIVE {fixture.status.elapsed}&apos;
            </Badge>
          )}
          {!isLive && getResultBadge(fixture, muTeamId)}
          <span className="text-xs text-muted-foreground">{fixture.league.name}</span>
        </div>
      </div>

      {/* Teams + Score */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <span
            className={cn(
              'text-sm font-medium',
              fixture.homeTeam.id === muTeamId ? 'text-white' : 'text-foreground'
            )}
          >
            {fixture.homeTeam.name}
          </span>
        </div>

        <div className="flex items-center gap-3 mx-4">
          {isFinished || isLive ? (
            <span className="text-lg font-bold text-foreground">
              {fixture.homeGoals} - {fixture.awayGoals}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(fixture.date).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-1 justify-end">
          <span
            className={cn(
              'text-sm font-medium text-right',
              fixture.awayTeam.id === muTeamId ? 'text-white' : 'text-foreground'
            )}
          >
            {fixture.awayTeam.name}
          </span>
        </div>
      </div>

      {/* Round/Venue */}
      <div className="mt-2">
        <span className="text-xs text-muted-foreground">{fixture.league.round}</span>
      </div>
    </div>
  );
}
