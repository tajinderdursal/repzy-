"use client";


import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function Home() {


const { data: session, status } = useSession();
const [jwtLoggedIn, setJwtLoggedIn] = useState(false);

const checkJWT = async () => {
  try {
    const res = await fetch("/api/profile", {
      credentials: "include",
    });

    setJwtLoggedIn(res.ok);
  } catch {
    setJwtLoggedIn(false);
  }
};

useEffect(() => {
  checkJWT();
}, []);

const loggedIn = status === "authenticated" || jwtLoggedIn;


  return (
    <div className="bg-black text-white min-h-screen">

    

      {/* 🔥 HERO (FULL SIZE) */}
      <section className="relative min-h-screen flex items-center">

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `
              linear-gradient(to left, rgba(0,0,0,0.2) 20%, black 80%),
              url('/hero.avif')
            `
          }}
        />

        <div className="relative z-10 px-6 md:px-20 max-w-xl">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Next. <br />
            <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              Generation.
            </span>
            <br />
            Fitness.
          </h1>

          <p className="text-gray-400 mt-6">
            Repzy helps you track workouts, monitor progress, visualize growth,
            and stay consistent with your fitness journey.
          </p>
{!loggedIn && (
          <Link href="/signup">
            <button className="mt-8 border px-6 py-3 rounded-full hover:bg-white hover:text-black transition">
              Get Started ↓
            </button>
          </Link>
)}
{loggedIn && (
          <Link href="/profile">
            <button className="mt-8 bg-gradient-to-r from-blue-500 to-green-500 px-6 py-3 rounded-full hover:scale-[1.02] transition">
             Go to profile 
            </button>
          </Link>
)}
        </div>
      </section>

      {/* 🏋️ WORKOUT */}
      <section className="relative min-h-[70vh] flex items-center">

        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.4) 20%, black 80%),
              url('/workout.avif')
            `
          }}
        />

        <div className="relative z-10 px-6 md:px-20 max-w-lg ml-auto">
          <h2 className="text-3xl font-bold mb-3">Track Workouts</h2>
          <p className="text-gray-400 text-sm">
            Log exercises, sets, reps, and weights easily to build consistency
            and improve performance.
          </p>
        </div>
      </section>

      {/* 📊 PROGRESS */}
      <section className="relative min-h-[70vh] flex items-center">

        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage: `
              linear-gradient(to left, rgba(0,0,0,0.4) 20%, black 80%),
              url('/progress.avif')
            `
          }}
        />

        <div className="relative z-10 px-6 md:px-20 max-w-lg">
          <h2 className="text-3xl font-bold mb-3">Visual Progress</h2>
          <p className="text-gray-400 text-sm">
            Track your improvement through graphs and performance insights.
          </p>
        </div>
      </section>

      {/* 📸 PHOTOS */}
      <section className="relative min-h-[70vh] flex items-center">

        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.4) 20%, black 80%),
              url('/photos.avif')
            `
          }}
        />

        <div className="relative z-10 px-6 md:px-20 max-w-lg ml-auto">
          <h2 className="text-3xl font-bold mb-3">Progress Photos</h2>
          <p className="text-gray-400 text-sm">
            Compare transformation and see real body changes.
          </p>
        </div>
      </section>

      {/* 🍎 NUTRITION */}
      <section className="relative min-h-[70vh] flex items-center">

        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage: `
              linear-gradient(to left, rgba(0,0,0,0.4) 20%, black 80%),
              url('/nutrition.avif')
            `
          }}
        />

        <div className="relative z-10 px-6 md:px-20 max-w-lg">
          <h2 className="text-3xl font-bold mb-3">Track Nutrition</h2>
          <p className="text-gray-400 text-sm">
            Monitor calories and maintain a balanced diet for better results.
          </p>
        </div>
       
      </section>

      {/* 🌍 FEED */}
      <section className="relative min-h-[70vh] flex items-center">

        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.4) 20%, black 80%),
              url('/feed.avif')
            `
          }} 
        />

        <div className="relative z-10 px-6 md:px-20 max-w-lg ml-auto">
          <h2 className="text-3xl font-bold mb-3">Community Feed</h2>
          <p className="text-gray-400 text-sm">
            Stay motivated by exploring other users and sharing your journey.
          </p>
        </div>
        
      </section>

      {/* 🔥 CTA */}
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold mb-6">
          Start Your Fitness Journey Today
        </h2>
      {!loggedIn && (
        <Link href="/signup">
          <button className="bg-white text-black px-8 py-4 rounded-full hover:scale-105 transition">
            Join Repzy
          </button>
        </Link>
      )}
      {loggedIn && (
        <Link href="/dashboard">
          <button className="bg-gradient-to-r from-blue-500 to-green-500 px-8 py-4 rounded-full hover:scale-105 transition">
            Go to Dashboard
          </button>
        </Link>
      )}
      </div>

    </div>
  );
}