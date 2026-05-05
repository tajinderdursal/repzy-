"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [urlMessage, setUrlMessage] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ SAFE way to read query params (prevents build crash)
  useEffect(() => {
    if (searchParams) {
      const msg = searchParams.get("message");
      if (msg) setUrlMessage(msg);
    }
  }, [searchParams]);

  const handleCheck = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Login successful");

        // ✅ safer redirect
        window.location.href = "/profile";
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">

      {/* Glow Effects */}
      <div className="absolute w-[400px] h-[400px] bg-blue-500/20 blur-[120px] rounded-full top-10 left-10"></div>
      <div className="absolute w-[400px] h-[400px] bg-green-500/20 blur-[120px] rounded-full bottom-10 right-10"></div>

      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-xl">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Welcome Back 👋
        </h1>

        {/* 🔴 MESSAGE FROM MIDDLEWARE */}
        {urlMessage && (
          <div className="mb-4 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500 text-red-400 text-sm">
            {urlMessage}
          </div>
        )}

        {/* 🔐 FORM */}
        <form onSubmit={handleCheck} className="flex flex-col gap-4">

          <input
            className="p-3 bg-white/10 border border-white/20 rounded-lg outline-none focus:border-blue-400"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="p-3 bg-white/10 border border-white/20 rounded-lg outline-none focus:border-blue-400"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="p-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg font-semibold hover:scale-[1.02] transition"
          >
            Login
          </button>

        </form>

        {/* LOCAL MESSAGE */}
        {message && (
          <p className="mt-4 text-center text-green-400 text-sm">
            {message}
          </p>
        )}

        {/* DIVIDER */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/20"></div>
          <span className="text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-white/20"></div>
        </div>

        {/* GOOGLE LOGIN */}
        <button
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center gap-3 p-3 bg-white text-black rounded-lg hover:bg-gray-200 transition"
        >
          <img src="/google.png" className="w-5 h-5" alt="Google" />
          Continue with Google
        </button>

      </div>
    </div>
  );
};

export default Login;