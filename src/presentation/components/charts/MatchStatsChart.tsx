interface StatItem {
  label: string;
  home: number;
  away: number;
}

interface MatchStatsChartProps {
  stats: StatItem[];
  homeTeam: string;
  awayTeam: string;
}

export function MatchStatsChart({ stats, homeTeam, awayTeam }: MatchStatsChartProps) {
  return (
    <div className="space-y-3">
      {stats.map((stat) => {
        const total = stat.home + stat.away || 1;
        const homePercent = Math.round((stat.home / total) * 100);
        const awayPercent = 100 - homePercent;
        return (
          <div key={stat.label} className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{stat.home}</span>
              <span>{stat.label}</span>
              <span>{stat.away}</span>
            </div>
            <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
              <div
                className="bg-mufc-red rounded-full transition-all"
                style={{ width: `${homePercent}%` }}
              />
              <div
                className="bg-muted rounded-full transition-all"
                style={{ width: `${awayPercent}%` }}
              />
            </div>
          </div>
        );
      })}
      <div className="flex justify-between text-xs text-muted-foreground pt-1">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-mufc-red inline-block" />
          {homeTeam}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-muted inline-block" />
          {awayTeam}
        </span>
      </div>
    </div>
  );
}
