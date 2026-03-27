import { cn } from '@/lib/utils';
import type { Standing } from '@/shared/types/football';

interface StandingsTableProps {
  standings: Standing[];
  highlightTeamId?: number;
  compact?: boolean;
}

function FormBadge({ result }: { result: string }) {
  const color = result === 'W' ? 'bg-green-500' : result === 'L' ? 'bg-red-500' : 'bg-yellow-500';
  return (
    <span
      className={cn(
        'inline-flex w-4 h-4 rounded-sm text-[10px] font-bold text-white items-center justify-center',
        color
      )}
    >
      {result}
    </span>
  );
}

export function StandingsTable({
  standings,
  highlightTeamId = 33,
  compact = false,
}: StandingsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-muted-foreground border-b border-white/5">
            <th className="text-left py-2 px-2 w-8">#</th>
            <th className="text-left py-2 px-2">Team</th>
            <th className="text-center py-2 px-2">PJ</th>
            <th className="text-center py-2 px-2">W</th>
            <th className="text-center py-2 px-2">D</th>
            <th className="text-center py-2 px-2">L</th>
            {!compact && <th className="text-center py-2 px-2">GF</th>}
            {!compact && <th className="text-center py-2 px-2">GA</th>}
            <th className="text-center py-2 px-2">GD</th>
            <th className="text-center py-2 px-2 font-bold">Pts</th>
            {!compact && <th className="text-center py-2 px-2">Form</th>}
          </tr>
        </thead>
        <tbody>
          {standings.map((s) => {
            const isMU = s.team.id === highlightTeamId;
            return (
              <tr
                key={s.rank}
                className={cn(
                  'border-b border-white/5 transition-colors',
                  isMU ? 'bg-mufc-red/10 border-mufc-red/20' : 'hover:bg-white/5'
                )}
              >
                <td className="py-2 px-2 text-center text-muted-foreground">{s.rank}</td>
                <td className="py-2 px-2">
                  <span className={cn('font-medium', isMU ? 'text-white' : 'text-foreground')}>
                    {s.team.name}
                  </span>
                </td>
                <td className="py-2 px-2 text-center text-muted-foreground">{s.all.played}</td>
                <td className="py-2 px-2 text-center text-green-400">{s.all.win}</td>
                <td className="py-2 px-2 text-center text-yellow-400">{s.all.draw}</td>
                <td className="py-2 px-2 text-center text-red-400">{s.all.lose}</td>
                {!compact && (
                  <td className="py-2 px-2 text-center text-muted-foreground">{s.all.goals.for}</td>
                )}
                {!compact && (
                  <td className="py-2 px-2 text-center text-muted-foreground">
                    {s.all.goals.against}
                  </td>
                )}
                <td
                  className={cn(
                    'py-2 px-2 text-center',
                    s.goalsDiff > 0
                      ? 'text-green-400'
                      : s.goalsDiff < 0
                        ? 'text-red-400'
                        : 'text-muted-foreground'
                  )}
                >
                  {s.goalsDiff > 0 ? '+' : ''}
                  {s.goalsDiff}
                </td>
                <td
                  className={cn(
                    'py-2 px-2 text-center font-bold',
                    isMU ? 'text-mufc-red' : 'text-foreground'
                  )}
                >
                  {s.points}
                </td>
                {!compact && (
                  <td className="py-2 px-2">
                    <div className="flex gap-0.5 justify-center">
                      {s.form
                        ?.split('')
                        .slice(-5)
                        .map((r, i) => (
                          <FormBadge key={i} result={r} />
                        ))}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
