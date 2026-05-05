"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const Footer = () => {

  const { data: session } = useSession(); // NextAuth
  const [jwtLoggedIn, setJwtLoggedIn] = useState(false);

  // 🔥 Check JWT login
  const checkJWT = async () => {
    try {
      const res = await fetch("/api/profile");
      setJwtLoggedIn(res.ok);
    } catch {
      setJwtLoggedIn(false);
    }
  };

  useEffect(() => {
    checkJWT();
  }, []);

  const loggedIn = !!session || jwtLoggedIn;

  return (
    <footer className="bg-black text-white border-t border-white/10">

      <div className="max-w-6xl mx-auto px-6 md:px-20 py-16">

        <div className="grid md:grid-cols-3 gap-10">

          {/* 🔥 BRAND */}
          <div>
            <h1 className="text-2xl font-bold mb-4">
              <span className="text-white">Rep</span>
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                zy
              </span>
            </h1>

            <p className="text-gray-400 text-sm">
              Your all-in-one fitness companion to track workouts, monitor
              progress, and stay consistent.
            </p>
          </div>

          {/* 🔗 LINKS */}
          <div>
            <h2 className="font-semibold mb-4 text-gray-300">Quick Links</h2>

            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
              <li><Link href="/progress" className="hover:text-white">Progress</Link></li>
              <li><Link href="/feed" className="hover:text-white">Feed</Link></li>
              <li><Link href="/nutrition" className="hover:text-white">Nutrition</Link></li>
            </ul>
          </div>

          {/* 🚀 CTA */}
          {!loggedIn && (
            <div>
              <h2 className="font-semibold mb-4 text-gray-300">
                Start Your Journey
              </h2>

              <p className="text-gray-400 text-sm mb-4">
                Join Repzy and take control of your fitness today.
              </p>

              <Link href="/signup">
                <button className="bg-white text-black px-5 py-2 rounded-full hover:scale-105 transition">
                  Get Started
                </button>
              </Link>
            </div>
          )}

        </div>

        {/* 🔥 BOTTOM */}
        <div className="border-t border-white/10 mt-12 pt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Repzy. All rights reserved.
        </div>

      </div>

    </footer>
  );
};

export default Footer;