"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  defs,
  linearGradient,
  stop
} from "recharts";

export default function ProgressChart({ data }) {
  return (
    <div className="bg-white/5 backdrop-blur border border-white/10 p-6 rounded-2xl mt-10">

      <h2 className="text-lg font-semibold mb-4 text-white">
        📈 Weekly Progress
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>

          {/* 🔥 GRADIENT DEFINITIONS */}
          <defs>
            <linearGradient id="greenLine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0.2} />
            </linearGradient>

            <linearGradient id="blueLine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.2} />
            </linearGradient>
          </defs>

          {/* 🔥 LIGHT GRID (SUBTLE) */}
          <CartesianGrid
            stroke="#222"
            strokeDasharray="3 3"
            vertical={false}
          />

          {/* 🔥 AXIS */}
          <XAxis
            dataKey="date"
            stroke="#666"
            tick={{ fontSize: 12 }}
          />

          <YAxis
            stroke="#666"
            tick={{ fontSize: 12 }}
          />

          {/* 🔥 TOOLTIP (CLEAN) */}
          <Tooltip
            contentStyle={{
              backgroundColor: "#111",
              border: "1px solid #333",
              borderRadius: "10px",
              color: "#fff"
            }}
            cursor={{ stroke: "#444", strokeWidth: 1 }}
          />

          {/* 🔥 GREEN LINE */}
          <Line
            type="monotone"
            dataKey="calories"
            stroke="#22c55e"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6 }}
            fill="url(#greenLine)"
          />

          {/* 🔥 BLUE LINE */}
          <Line
            type="monotone"
            dataKey="protein"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6 }}
            fill="url(#blueLine)"
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}