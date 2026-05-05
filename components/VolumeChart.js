"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function VolumeChart({ data }) {
  return (
    <div className="w-full">

      {/* TITLE */}
      <h2 className="text-lg font-semibold mb-4 text-white/80">
        Workout Volume
      </h2>

      {/* CHART */}
      <div className="w-full h-[220px] sm:h-[260px] overflow-hidden">

        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
          >

            {/* GRID */}
            <CartesianGrid
              strokeDasharray="3 6"
              stroke="rgba(255,255,255,0.08)"
            />

            {/* X AXIS */}
            <XAxis
              dataKey="week"
              stroke="#888"
              tick={{ fill: "#aaa", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            {/* Y AXIS (WITH KG) */}
            <YAxis
              stroke="#888"
              tick={{ fill: "#aaa", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v} kg`}
            />

            {/* TOOLTIP */}
            <Tooltip
              formatter={(value) => `${value} kg`}
              contentStyle={{
                background: "#0b0f14",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
              }}
            />

            {/* BARS */}
            <Bar
              dataKey="volume"
              fill="url(#gradient)"
              radius={[10, 10, 0, 0]}
            />

            {/* GRADIENT */}
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
            </defs>

          </BarChart>
        </ResponsiveContainer>

      </div>
    </div>
  );
}