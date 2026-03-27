import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { PlayerStats } from '@/shared/types/football';

interface PlayerCardProps {
  playerStats: PlayerStats;
  className?: string;
}

const positionColors: Record<string, string> = {
  Goalkeeper: 'bg-yellow-500/20 text-yellow-400',
  Defender: 'bg-blue-500/20 text-blue-400',
  Midfielder: 'bg-green-500/20 text-green-400',
  Attacker: 'bg-red-500/20 text-red-400',
};

export function PlayerCard({ playerStats, className }: PlayerCardProps) {
  const { player } = playerStats;
  const stats = playerStats.statistics[0];
  const position = stats?.games?.position || 'Unknown';
  const positionColor = positionColors[position] || 'bg-muted text-muted-foreground';

  return (
    <div
      className={cn(
        'bg-card border border-white/5 rounded-xl p-4 flex flex-col gap-3 hover:border-white/10 transition-colors',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg font-bold text-muted-foreground flex-shrink-0 overflow-hidden">
          {player.photo ? (
            <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
          ) : (
            player.name.charAt(0)
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm truncate">{player.name}</p>
          <p className="text-xs text-muted-foreground">{player.nationality}</p>
          <Badge className={cn('text-[10px] mt-1', positionColor)}>{position}</Badge>
        </div>
        <span className="text-2xl font-bold text-white/20">#{stats?.games?.number || '-'}</span>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{stats.goals.total ?? 0}</p>
            <p className="text-[10px] text-muted-foreground uppercase">Goals</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{stats.goals.assists ?? 0}</p>
            <p className="text-[10px] text-muted-foreground uppercase">Assists</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{stats.games.appearances ?? 0}</p>
            <p className="text-[10px] text-muted-foreground uppercase">Apps</p>
          </div>
        </div>
      )}
    </div>
  );
}
