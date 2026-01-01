"use client"

import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Define the shape of data we expect
interface ChartProps {
  data: any[]
}

export function IntensityChart({ data }: ChartProps) {
  // If no data, show a subtle empty state or just render empty
  if (!data || data.length === 0) return <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">No activity recorded yet.</div>

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis 
            dataKey="day" 
            tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} 
            axisLine={false} 
            tickLine={false} 
            interval={6}
          />
          <YAxis 
            tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} 
            axisLine={false} 
            tickLine={false} 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--card)', 
              borderColor: 'var(--border)', 
              borderRadius: '12px',
              color: 'var(--foreground)'
            }}
            itemStyle={{ color: 'var(--foreground)' }}
          />
          <Area 
            type="monotone" 
            dataKey="intensity" 
            stroke="var(--primary)" 
            fillOpacity={1} 
            fill="url(#colorIntensity)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function CompletionBarChart({ data }: ChartProps) {
  if (!data || data.length === 0) return <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">No data.</div>

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} 
            axisLine={false} 
            tickLine={false} 
          />
          <Tooltip 
            cursor={{ fill: 'var(--muted)' }}
            contentStyle={{ 
              backgroundColor: 'var(--card)', 
              borderColor: 'var(--border)', 
              borderRadius: '8px',
              color: 'var(--foreground)'
            }}
          />
          <Bar dataKey="completed" fill="var(--primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}