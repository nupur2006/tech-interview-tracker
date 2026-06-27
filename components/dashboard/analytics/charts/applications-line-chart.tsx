"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface ApplicationsLineChartProps {
  data: { name: string; count: number }[];
}

export function ApplicationsLineChart({ data }: ApplicationsLineChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
            formatter={(value: any) => [`${value} Applications`, "Count"]}
            labelStyle={{ color: "#374151", fontWeight: 600, marginBottom: "4px" }}
          />
          <Area 
            type="monotone" 
            dataKey="count" 
            stroke="#3b82f6" // blue-500
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorCount)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
