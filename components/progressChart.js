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

  // 🔥 FIX DATE
  const formattedData = data.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    }),
  }));

  return (
    <div className="bg-white/5 backdrop-blur border border-white/10 p-6 rounded-2xl">

      <h2 className="text-lg font-semibold mb-4 text-white">
        Strength Progress
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>

          {/* 🔥 CLEAN GRID */}
          <CartesianGrid
            stroke="#333"
            strokeDasharray="4 4"
            vertical={false}
          />

          {/* AXIS */}
          <XAxis
            dataKey="date"
            stroke="#777"
            tick={{ fontSize: 12 }}
          />

          <YAxis
            stroke="#777"
            tick={{ fontSize: 12 }}
          />

          {/* 🔥 PREMIUM TOOLTIP */}
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid #333",
              borderRadius: "10px",
              color: "#fff",
            }}
            labelStyle={{ color: "#aaa" }}
          />

          {/* 🔥 LINE */}
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#a855f7"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6 }}
            style={{
              filter: "drop-shadow(0px 0px 6px rgba(168,85,247,0.6))",
            }}
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}