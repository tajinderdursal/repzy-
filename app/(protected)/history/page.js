"use client";
import { useEffect, useState } from "react";
import Link from "next/link";



/* ─── Helpers ─── */
const formatDate = (iso) => {
  const d    = new Date(iso);
  const now  = new Date();
  const diff = Math.floor((now - d) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};

const groupByDate = (list) => {
  const groups = {};
  for (const w of list) {
    const key = formatDate(w.date ?? new Date().toISOString());
    if (!groups[key]) groups[key] = [];
    groups[key].push(w);
  }
  return groups;
};

export default function History() {






  const [workouts, setWorkouts] = useState([]);
  const [search,   setSearch]   = useState("");
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const res  = await fetch("/api/workout/history");
      const data = await res.json();
      setWorkouts(data);
      
      setLoading(false);
    };
    fetchHistory();
  }, []);

  const filtered = workouts.filter((w) =>
    w.exercise.toLowerCase().includes(search.toLowerCase())
  );
  const grouped    = groupByDate(filtered);
  const totalSets  = filtered.reduce((a, w) => a + Number(w.sets), 0);
  const totalVolume= filtered.reduce((a, w) => a + Number(w.weight) * Number(w.sets) * Number(w.reps), 0);
  const uniqueDays = Object.keys(grouped).length;

  return (
    <div
      className="relative min-h-screen bg-[#080c10] text-white overflow-x-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* AMBIENT GLOWS */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-32 -left-20 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 -right-32 w-96 h-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(34,197,94,0.13) 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)" }} />
      </div>

    <div className="mb-32 mt-30"></div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* HEADER */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-1">Workout Log</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-1">
            Your{" "}
            <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              History.
            </span>
          </h1>
          <p className="text-sm text-white/40">Every rep you've ever logged, all in one place.</p>
        </div>

        {/* SUMMARY STATS */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Sessions",  value: uniqueDays,                              gradient: "from-blue-400 to-cyan-400",    icon: "📅" },
            { label: "Total Sets",value: totalSets,                               gradient: "from-purple-400 to-pink-400",  icon: "💪" },
            { label: "Volume",    value: `${(totalVolume / 1000).toFixed(1)}t`,   gradient: "from-green-400 to-emerald-400",icon: "⚖️" },
          ].map((s) => (
            <div key={s.label} className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-center">
              <p className="text-lg mb-1">{s.icon}</p>
              <p className={`text-2xl font-black bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent`}>
                {s.value}
              </p>
              <p className="text-xs text-white/35 mt-1 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>

        {/* SEARCH */}
        <div className="relative mb-8">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search exercises…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/25 outline-none focus:border-blue-500/50 backdrop-blur-xl transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="py-16 text-center">
            <div className="inline-block w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mb-3" />
            <p className="text-sm text-white/30">Loading history…</p>
          </div>
        )}

        {/* EMPTY */}
        {!loading && filtered.length === 0 && (
          <div className="py-16 text-center rounded-2xl bg-white/[0.03] border border-dashed border-white/[0.08]">
            <p className="text-4xl mb-3">{search ? "🔍" : "🏋️"}</p>
            <p className="text-sm font-semibold text-white/40">
              {search ? `No exercises matching "${search}"` : "No workout history yet."}
            </p>
            <p className="text-xs text-white/20 mt-1">
              {search ? "Try a different search term." : "Start logging workouts on the Dashboard."}
            </p>
          </div>
        )}

        {/* GROUPED LIST */}
        {!loading && Object.keys(grouped).length > 0 && (
          <div className="flex flex-col gap-8">
            {Object.entries(grouped).map(([day, dayWorkouts]) => (
              <section key={day}>
                {/* DATE DIVIDER */}
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      day === "Today"
                        ? "bg-gradient-to-r from-blue-500/20 to-green-500/20 border-blue-500/30 text-blue-400"
                        : day === "Yesterday"
                        ? "bg-purple-500/10 border-purple-500/20 text-purple-400"
                        : "bg-white/5 border-white/10 text-white/40"
                    }`}
                  >
                    {day}
                  </span>
                  <span className="text-xs text-white/25">
                    {dayWorkouts.length} exercise{dayWorkouts.length !== 1 ? "s" : ""}
                  </span>
                  <div className="flex-1 h-px bg-white/[0.06]" />
                </div>

                {/* WORKOUT CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dayWorkouts.map((w) => {
                    const volume = Number(w.weight) * Number(w.sets) * Number(w.reps);
                    return (
                      <div
                        key={w._id}
                        className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-white/20 transition"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="font-bold text-white">{w.exercise}</h3>
                          {volume > 0 && (
                            <span className="text-xs text-white/25 font-mono bg-white/[0.04] px-2 py-1 rounded-lg border border-white/[0.06]">
                              {volume} kg vol
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
                            {w.sets} sets
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-xs font-semibold text-green-400">
                            {w.reps} reps
                          </span>
                          {w.weight > 0 ? (
                            <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-400">
                              {w.weight} kg
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs font-semibold text-white/30">
                              Bodyweight
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}