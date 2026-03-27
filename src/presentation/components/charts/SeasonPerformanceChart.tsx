import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface PerformanceDataPoint {
  matchday: string;
  goals: number;
  goalsAgainst: number;
  points: number;
}

interface SeasonPerformanceChartProps {
  data: PerformanceDataPoint[];
}

export function SeasonPerformanceChart({ data }: SeasonPerformanceChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="goalsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#DA291C" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#DA291C" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="goalsAgainstGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6b7280" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6b7280" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="matchday"
          tick={{ fill: '#6b7280', fontSize: 11 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
          tickLine={false}
        />
        <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1E1E1E',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: '#fff',
          }}
        />
        <Legend wrapperStyle={{ color: '#6b7280', fontSize: 12 }} />
        <Area
          type="monotone"
          dataKey="goals"
          stroke="#DA291C"
          strokeWidth={2}
          fill="url(#goalsGradient)"
          name="Goals For"
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="goalsAgainst"
          stroke="#6b7280"
          strokeWidth={2}
          fill="url(#goalsAgainstGradient)"
          name="Goals Against"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
