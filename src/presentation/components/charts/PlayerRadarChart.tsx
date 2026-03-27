import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface RadarDataPoint {
  attribute: string;
  value: number;
  fullMark: number;
}

interface PlayerRadarChartProps {
  data: RadarDataPoint[];
  color?: string;
}

export function PlayerRadarChart({ data, color = '#DA291C' }: PlayerRadarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <RadarChart data={data}>
        <PolarGrid stroke="rgba(255,255,255,0.1)" />
        <PolarAngleAxis dataKey="attribute" tick={{ fill: '#6b7280', fontSize: 11 }} />
        <Radar
          name="Player"
          dataKey="value"
          stroke={color}
          fill={color}
          fillOpacity={0.2}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
