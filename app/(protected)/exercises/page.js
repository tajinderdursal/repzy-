

"use client";

import React, { useState,useEffect } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";


// 🔥 MUSCLE → IMAGE MAP
const muscleImages = {
  Chest: "/exercises/chest.avif",
  Back: "/exercises/back.avif",
  Legs: "/exercises/legs.avif",
  Shoulders: "/exercises/shoulder.avif",
  Biceps: "/exercises/biceps.avif",
  Triceps: "/exercises/triceps.avif",
  Abs: "/exercises/abs.avif",
};


const exercises = [

  // CHEST
  { name: "Bench Press", muscle: "Chest", image: "/exercises/benchpress.avif", slug: "bench-press" },
  { name: "Incline Bench Press", muscle: "Chest", image: "/exercises/inclinebench.avif", slug: "incline-bench-press" },
  { name: "Decline Bench Press", muscle: "Chest", image: "/exercises/declinebench.avif", slug: "decline-bench-press" },
  { name: "Dumbbell Press", muscle: "Chest", image: "/exercises/dumbbellpress.avif", slug: "dumbbell-press" },
  { name: "Chest Fly", muscle: "Chest", image: "/exercises/chestfly.avif", slug: "chest-fly" },
  { name: "Cable Fly", muscle: "Chest", image: "/exercises/cablefly.avif", slug: "cable-fly" },
  { name: "Push Ups", muscle: "Chest", image: "/exercises/pushups.avif", slug: "push-ups" },

  // BACK
  { name: "Deadlift", muscle: "Back", image: "/exercises/deadlift.avif", slug: "deadlift" },
  { name: "Pull Ups", muscle: "Back", image: "/exercises/pullups.avif", slug: "pull-ups" },
  { name: "Lat Pulldown", muscle: "Back", image: "/exercises/latpulldown.avif", slug: "lat-pulldown" },
  { name: "Seated Row", muscle: "Back", image: "/exercises/seatedrow.avif ", slug: "seated-row" },
  { name: "Bent Over Row", muscle: "Back", image: "/exercises/bentrow.avif", slug: "bent-over-row" },
  { name: "T-Bar Row", muscle: "Back", image: "/exercises/tbarrow.avif", slug: "t-bar-row" },

  // LEGS
  { name: "Squat", muscle: "Legs", image: "/exercises/squat.avif", slug: "squat" },
  { name: "Leg Press", muscle: "Legs", image: "/exercises/legpress.avif", slug: "leg-press" },
  { name: "Lunges", muscle: "Legs", image: "/exercises/lunges.avif", slug: "lunges" },
  { name: "Leg Extension", muscle: "Legs", image: "/exercises/legextension.avif", slug: "leg-extension" },
  { name: "Leg Curl", muscle: "Legs", image: "/exercises/legcurl.avif", slug: "leg-curl" },
  { name: "Calf Raise", muscle: "Legs", image: "/exercises/calfraise.avif   ", slug: "calf-raise" },

  // SHOULDERS
  { name: "Shoulder Press", muscle: "Shoulders", image: "/exercises/shoulderpress.avif", slug: "shoulder-press" },
  { name: "Arnold Press", muscle: "Shoulders", image: "/exercises/arnoldpress.avif", slug: "arnold-press" },
  { name: "Lateral Raise", muscle: "Shoulders", image: "/exercises/lateralraise.avif", slug: "lateral-raise" },
  { name: "Front Raise", muscle: "Shoulders", image: "/exercises/frontraise.avif", slug: "front-raise" },
  { name: "Rear Delt Fly", muscle: "Shoulders", image: "/exercises/reardeltfly.avif", slug: "rear-delt-fly" },

  // BICEPS
  { name: "Barbell Curl", muscle: "Biceps", image: "/exercises/barbellcurl.avif", slug: "barbell-curl" },
  { name: "Dumbbell Curl", muscle: "Biceps", image: "/exercises/dumbbellcurl.avif", slug: "dumbbell-curl" },
  { name: "Hammer Curl", muscle: "Biceps", image: "/exercises/hammercurl.avif", slug: "hammer-curl" },
  { name: "Preacher Curl", muscle: "Biceps", image: "/exercises/preachercurl.avif", slug: "preacher-curl" },

  // TRICEPS
  { name: "Tricep Pushdown", muscle: "Triceps", image: "/exercises/triceppushdown.avif", slug: "tricep-pushdown" },
  { name: "Overhead Tricep Extension", muscle: "Triceps", image: "/exercises/overheadtricep.avif", slug: "overhead-tricep-extension" },
  { name: "Close Grip Bench Press", muscle: "Triceps", image: "/exercises/closegripbench.avif", slug: "close-grip-bench-press" },
  { name: "Dips", muscle: "Triceps", image: "/exercises/dips.avif", slug: "dips" },

  // CORE
  { name: "Crunches", muscle: "Abs", image: "/exercises/crunches.avif", slug: "crunches" },
  { name: "Leg Raises", muscle: "Abs", image: "/exercises/legraises.avif", slug: "leg-raises" },
  { name: "Plank", muscle: "Abs", image: "/exercises/plank.avif", slug: "plank" },
  { name: "Russian Twist", muscle: "Abs", image: "/exercises/russiantwist.avif", slug: "russian-twist" }

];

export default function Exercises() {



  const [showModal, setShowModal] = useState(false);
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [isCustom, setIsCustom] = useState(false);


  


  const addWorkout = async (e) => {
    e.preventDefault();

    await fetch("/api/workout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        exercise: exerciseName,
        sets,
        reps,
        weight
      })
    });

    setExerciseName("");
    setSets("");
    setReps("");
    setWeight("");
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-10 py-10">


  <div className="mt-32 mb-30">

  </div>

      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">

        <h1 className="text-3xl font-bold">
          Exercise Library 💪
        </h1>

        <div className="flex gap-3">
          <Link href="/dashboard">
            <button className="bg-white text-black px-4 py-2 rounded-full">
              Dashboard
            </button>
          </Link>

          <Link href="/progress">
            <button className="bg-white text-black px-4 py-2 rounded-full">
              Progress
            </button>
          </Link>
        </div>

      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">

        {/* ADD */}
        <div
          onClick={() => {
            setShowModal(true);
            setExerciseName("");
            setIsCustom(true);
          }}
          className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer"
        >
          <div className="h-40 flex items-center justify-center bg-gradient-to-r from-blue-400 to-green-400 ">
            ➕
          </div>

          <div className="p-4 text-center">
            Add Exercise
          </div>
        </div>

        {/* 🔥 EXERCISES */}
        {exercises.map((exercise, index) => (

          <div
            key={index}
            onClick={() => {
              setShowModal(true);
              setExerciseName(exercise.name);
              setIsCustom(false);
            }}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition"
          >

            {/* 🔥 IMAGE BASED ON MUSCLE */}
            <img
              src={muscleImages[exercise.muscle] || "/default-exercise.jpg"}
              className="w-full h-40 object-cover"
            />

            <div className="p-4 text-center">

              <h2 className="font-semibold">
                {exercise.name}
              </h2>

              <p className="text-gray-400 text-sm">
                {exercise.muscle}
              </p>

            </div>

          </div>

        ))}

      </div>

      {/* MODAL (UNCHANGED) */}
  {showModal && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
    onClick={() => setShowModal(false)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-md rounded-2xl p-6 sm:p-7 bg-[#0f1520]/95 border border-white/10 backdrop-blur-2xl shadow-2xl"
      style={{
        boxShadow:
          "0 32px 80px rgba(0,0,0,0.8), 0 0 60px rgba(59,130,246,0.1)",
      }}
    >
      {/* HEADER */}
      <h2 className="text-xl font-black mb-1">
        Log Workout
      </h2>

      <p className="text-sm text-white/40 mb-6">
        Add a new exercise to today's log
      </p>

      {/* FORM */}
      <form onSubmit={addWorkout} className="flex flex-col gap-3">

        {/* EXERCISE */}
        <div>
          <label className="block text-xs text-white/35 mb-1.5 uppercase tracking-wider">
            Exercise Name
          </label>

          <input
            type="text"
            placeholder="e.g. Bench Press"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            disabled={!isCustom}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm placeholder-white/25 outline-none focus:border-blue-500/60 transition disabled:opacity-60"
            required
          />
        </div>

        {/* GRID INPUTS */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Sets", value: sets, setter: setSets, ph: "4" },
            { label: "Reps", value: reps, setter: setReps, ph: "10" },
            { label: "Weight (kg)", value: weight, setter: setWeight, ph: "80" },
          ].map((f) => (
            <div key={f.label}>
              <label className="block text-xs text-white/35 mb-1.5 uppercase tracking-wider">
                {f.label}
              </label>

              <input
                type="number"
                placeholder={f.ph}
                value={f.value}
                onChange={(e) => f.setter(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm placeholder-white/25 outline-none focus:border-blue-500/60 transition"
                required
              />
            </div>
          ))}
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 mt-3">
          <button
            type="submit"
            className="flex-1 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-500 to-green-500 hover:opacity-90 active:scale-95 transition shadow-lg shadow-blue-500/20"
          >
            Add Workout
          </button>

          <button
            type="button"
            onClick={() => setShowModal(false)}
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