"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface FunnelChartProps {
  data: { name: string; value: number }[];
}

export function ApplicationFunnelChart({ data }: FunnelChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#374151" opacity={0.2} />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            axisLine={false} 
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            width={80}
          />
          <Tooltip
            cursor={{ fill: "rgba(107, 114, 128, 0.1)" }}
            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
            formatter={(value: any) => [`${value} Applications`, "Count"]}
          />
          <Bar 
            dataKey="value" 
            fill="#8b5cf6" // violet-500
            radius={[0, 4, 4, 0]}
            barSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
