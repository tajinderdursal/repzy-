"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";


export default function Dashboard() {





  

  const [workouts,       setWorkouts]       = useState([]);
  const [showModal,      setShowModal]      = useState(false);
  const [exercise,       setExercise]       = useState("");
  const [sets,           setSets]           = useState("");
  const [reps,           setReps]           = useState("");
  const [weight,         setWeight]         = useState("");
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [streak,         setStreak]         = useState(0);
  const [calories,       setCalories]       = useState(0);
  const [user,           setUser]           = useState({});
  const [status,         setStatus]         = useState({});
  const [bmi,            setBmi]            = useState(null);
  const [mbimodal,       setBmiModal]       = useState(false);
  const [calPeriod,      setCalPeriod]      = useState("today");



  // STATUS
  const fetchStatus = async () => {
    const res  = await fetch("/api/workout/status");
    const data = await res.json();
    setStatus(data);
  };
  useEffect(() => { fetchStatus(); }, []);

  // WORKOUTS
  const fetchWorkouts = async () => {
    const res  = await fetch("/api/workout");
    const data = await res.json();
    setWorkouts(data);
   
  };
  useEffect(() => { fetchWorkouts(); }, []);

  // USER
  const fetchUser = async () => {
    const res  = await fetch("/api/profile");
    const data = await res.json();
    setUser(data);
    if (data.height && data.weight) {
      const heightMeters   = data.height / 100;
      const calculatedBMI  = data.weight / (heightMeters * heightMeters);
      setBmi(calculatedBMI.toFixed(1));
    }
  };
  useEffect(() => { fetchUser(); }, []);

  // ADD WORKOUT
  const addWorkout = async (e) => {
    e.preventDefault();
    const res  = await fetch("/api/workout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exercise, sets, reps, weight }),
    });
    const data = await res.json();
    setWorkouts((prev) => [data, ...prev]);
    setExercise(""); setSets(""); setReps(""); setWeight("");
    setShowModal(false);
  };

  // DELETE WORKOUT
  const deleteWorkout = async (id) => {
    const res = await fetch(`/api/workout/${id}`, { method: "DELETE" });
    if (res.ok) setWorkouts(workouts.filter((w) => w._id !== id));
  };

  // EDIT
  const openEdit = (workout) => {
    setExercise(workout.exercise);
    setSets(workout.sets);
    setReps(workout.reps);
    setWeight(workout.weight);
    setEditingWorkout(workout._id);
    setShowModal(true);
  };

  const updateWorkout = async (e) => {
    e.preventDefault();
    const res     = await fetch(`/api/workout/${editingWorkout}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exercise, sets, reps, weight }),
    });
    const updated = await res.json();
    setWorkouts(workouts.map((w) => (w._id === editingWorkout ? updated : w)));
    setShowModal(false);
    setEditingWorkout(null);
  };

  // STREAK
  useEffect(() => {
    const fetchStreak = async () => {
      const res  = await fetch("/api/workout/streak");
      const data = await res.json();
      setStreak(data.streak);
    };
    fetchStreak();
  }, []);

  // CALORIES
  const fetchCalories = async (period) => {
    const res  = await fetch(`/api/workout/calories?period=${period}`);
    const data = await res.json();
    setCalories(Math.round(data.calories));
    setCalPeriod(period);
  };
  useEffect(() => { fetchCalories("today"); }, []);

  // BMI category helper
  const getBmiCategory = (b) => {
    if (!b) return { label: "–", color: "text-white/40" };
    const n = parseFloat(b);
    if (n < 18.5) return { label: "Underweight", color: "text-blue-400"   };
    if (n < 25)   return { label: "Normal",       color: "text-green-400"  };
    if (n < 30)   return { label: "Overweight",   color: "text-yellow-400" };
    return               { label: "Obese",         color: "text-red-400"    };
  };
  const bmiCat = getBmiCategory(bmi);

  return (
    <div
      className="relative min-h-screen bg-[#080c10] text-white overflow-x-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* AMBIENT GLOWS */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute -top-32 -left-20 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-1/2 -right-32 w-96 h-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(34,197,94,0.13) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)" }}
        />
      </div>

      <div className="mt-30 mb-32">

      </div>
      

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* HERO */}
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-1">Good morning</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-1">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              {user.name?.split(" ")[0] || "Athlete"}.
            </span>
          </h1>
          <p className="text-sm text-white/40">Here's your fitness overview for today.</p>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">

          {/* CALORIES */}
          <div className="relative group col-span-2 sm:col-span-1 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-[#0d1520]/95 flex flex-col items-center justify-center gap-2 z-10 rounded-2xl">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Select period</p>
              {["today", "week", "month"].map((p) => (
                <button
                  key={p}
                  onClick={() => fetchCalories(p)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold border transition w-28 ${
                    calPeriod === p
                      ? "bg-gradient-to-r from-blue-500 to-green-500 border-transparent text-white"
                      : "bg-white/5 border-white/10 text-white/60 hover:border-blue-400/50"
                  }`}
                >
                  {p === "today" ? "Today" : p === "week" ? "Last 7 Days" : "Last Month"}
                </button>
              ))}
            </div>
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">🔥 Calories Burned</p>
            <p className="text-3xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">{calories}</p>
            <p className="text-xs text-white/25 mt-1">kcal · hover to change</p>
          </div>

          {/* STREAK */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">🔥 Streak</p>
            <p className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{streak}</p>
            <p className="text-xs text-white/25 mt-1">{streak === 1 ? "day" : "days"} in a row</p>
          </div>

          {/* BMI */}
          <div
            className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl cursor-pointer hover:border-white/20 transition"
            onClick={() => setBmiModal(true)}
          >
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">⚖️ BMI</p>
            <p className="text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{bmi ?? "–"}</p>
            <p className={`text-xs mt-1 font-semibold ${bmiCat.color}`}>{bmiCat.label}</p>
          </div>

          {/* TOTAL WORKOUTS */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">💪 Total Workouts</p>
            <p className="text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">{status.totalWorkouts ?? "–"}</p>
            <p className="text-xs text-white/25 mt-1">all time</p>
          </div>
        </div>
        

        {/* USER INFO + STATUS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

          {/* USER INFO */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-5">👤 Profile</h2>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-xl font-black shadow-lg shadow-blue-500/20">
                {user.name?.charAt(0) || "A"}
              </div>
              <div>
                <p className="font-bold text-white">{user.name || "–"}</p>
                <p className="text-xs text-white/35">{user.email || "–"}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Age",    val: user.age    ? `${user.age} yrs`   : "–" },
                { label: "Height", val: user.height ? `${user.height} cm` : "–" },
                { label: "Weight", val: user.weight ? `${user.weight} kg` : "–" },
              ].map((s) => (
                <div key={s.label} className="text-center py-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                  <p className="text-sm font-bold text-white">{s.val}</p>
                  <p className="text-xs text-white/35 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* STATUS CARD */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-5">📊 Status</h2>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center py-3 border-b border-white/[0.06]">
                <span className="text-sm text-white/55">Total Workouts</span>
                <span className="text-sm font-bold text-white">{status.totalWorkouts ?? "–"}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/[0.06]">
                <span className="text-sm text-white/55">Last Workout</span>
                <span className="text-sm font-bold text-white">
                  {status.lastWorkout ? new Date(status.lastWorkout).toLocaleDateString() : "None"}
                </span>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/55">Consistency</span>
                  <span className="font-bold text-green-400">{status.consistency ?? 0}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-700"
                    style={{ width: `${status.consistency ?? 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

   <button
            onClick={() => {
              setEditingWorkout(null);
              setExercise(""); setSets(""); setReps(""); setWeight("");
              setShowModal(true);
            }}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-500 to-green-500 hover:opacity-90 active:scale-95 transition shadow-lg shadow-blue-500/20"
          >
            + Add Workout
          </button>
          
        </div>

        {/* WORKOUT LIST */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-black tracking-tight">💪 Today's Workouts</h2>
            <Link href="/history" className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition">
              View History →
            </Link>
          </div>

          {workouts.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-white/[0.03] border border-dashed border-white/[0.08]">
              <p className="text-4xl mb-3">🏋️</p>
              <p className="text-sm font-semibold text-white/40">No workouts yet today.</p>
              <p className="text-xs text-white/20 mt-1">Hit the button above to log your first set.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {workouts.map((w) => (
                <div
                  key={w._id}
                  className="group p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-white/20 transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-sm text-white truncate pr-2">{w.exercise}</h3>
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
                      <button
                        onClick={() => openEdit(w)}
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-xs bg-blue-500/15 text-blue-400 border border-blue-500/20 hover:bg-blue-500/25 transition"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => deleteWorkout(w._id)}
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-xs bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25 transition"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
                      {w.sets} sets
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-xs font-semibold text-green-400">
                      {w.reps} reps
                    </span>
                    {w.weight > 0 && (
                      <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-400">
                        {w.weight} kg
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* BMI MODAL */}
      {mbimodal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setBmiModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[90vw] max-w-[400px] rounded-2xl p-7 bg-[#0f1520]/95 border border-white/10 backdrop-blur-2xl shadow-2xl"
            style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 60px rgba(59,130,246,0.1)" }}
          >
            <h2 className="text-xl font-black mb-1">BMI Details</h2>
            <p className="text-sm text-white/40 mb-6">Body Mass Index breakdown</p>

            <div className="text-center mb-6">
              <p className="text-5xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{bmi ?? "–"}</p>
              <p className={`text-sm font-bold mt-2 ${bmiCat.color}`}>{bmiCat.label}</p>
            </div>

            <img src="bmi.png" alt="BMI Chart" className="w-full rounded-xl mb-5 border border-white/10" />

            <div className="flex flex-col gap-2 mb-6">
              {[
                { label: "Underweight", range: "< 18.5",      color: "text-blue-400"   },
                { label: "Normal",      range: "18.5 – 24.9", color: "text-green-400"  },
                { label: "Overweight",  range: "25 – 29.9",   color: "text-yellow-400" },
                { label: "Obese",       range: "≥ 30",         color: "text-red-400"    },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between items-center py-2.5 px-4 rounded-xl bg-white/[0.04] border border-white/[0.06]"
                >
                  <span className={`text-sm font-semibold ${row.color}`}>{row.label}</span>
                  <span className="text-xs text-white/35 font-mono">{row.range}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setBmiModal(false)}
              className="w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-500 to-green-500 hover:opacity-90 active:scale-95 transition shadow-lg shadow-blue-500/20"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ADD / EDIT WORKOUT MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[90vw] max-w-[420px] rounded-2xl p-7 bg-[#0f1520]/95 border border-white/10 backdrop-blur-2xl shadow-2xl"
            style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 60px rgba(59,130,246,0.1)" }}
          >
            <h2 className="text-xl font-black mb-1">
              {editingWorkout ? "Edit Workout" : "Log Workout"}
            </h2>
            <p className="text-sm text-white/40 mb-6">
              {editingWorkout ? "Update your exercise details" : "Add a new exercise to today's log"}
            </p>

            <form onSubmit={editingWorkout ? updateWorkout : addWorkout} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs text-white/35 mb-1.5 uppercase tracking-wider">Exercise Name</label>
                <input
                  type="text"
                  placeholder="e.g. Bench Press"
                  value={exercise}
                  onChange={(e) => setExercise(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm placeholder-white/25 outline-none focus:border-blue-500/60 transition"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Sets",        val: sets,   setter: setSets,   ph: "4"  },
                  { label: "Reps",        val: reps,   setter: setReps,   ph: "10" },
                  { label: "Weight (kg)", val: weight, setter: setWeight, ph: "80" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-xs text-white/35 mb-1.5 uppercase tracking-wider">{f.label}</label>
                    <input
                      type="number"
                      placeholder={f.ph}
                      value={f.val}
                      onChange={(e) => f.setter(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm placeholder-white/25 outline-none focus:border-blue-500/60 transition"
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-500 to-green-500 hover:opacity-90 active:scale-95 transition shadow-lg shadow-blue-500/20"
                >
                  {editingWorkout ? "Update" : "Add Workout"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingWorkout(null); }}
                  className="px-5 py-3 rounded-xl text-sm text-white/40 border border-white/[0.08] hover:bg-white/5 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}