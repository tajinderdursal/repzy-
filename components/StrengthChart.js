"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function StrengthChart({ data }) {
  return (
    <div className="w-full">

      {/* TITLE */}
      <h2 className="text-lg font-semibold mb-4 text-white/80">
        Strength Progress
      </h2>

      {/* CHART */}
      <div className="w-full h-[220px] sm:h-[260px] overflow-hidden">

        <ResponsiveContainer width="100%" height="100%">
          <LineChart
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
              dataKey="date"
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

            {/* LINE */}
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ r: 4, fill: "#8b5cf6" }}
              activeDot={{ r: 6 }}
              style={{
                filter: "drop-shadow(0 0 8px rgba(139,92,246,0.7))",
              }}
            />

          </LineChart>
        </ResponsiveContainer>

      </div>
    </div>
  );
}