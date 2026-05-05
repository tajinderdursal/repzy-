"use client";

import React, { useState } from "react";

const Signup = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmpassword) {
      setMessage("Passwords do not match");
      return;
    }

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Signup successful");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } else {
      setMessage(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 relative">

      {/* 🔥 BACKGROUND GLOW */}
      <div className="absolute w-[350px] h-[350px] bg-blue-500/20 blur-[120px] rounded-full top-10 left-10"></div>
      <div className="absolute w-[350px] h-[350px] bg-purple-500/20 blur-[120px] rounded-full bottom-10 right-10"></div>

      {/* 🔥 CARD */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-xl">

        {/* 🔥 TITLE */}
        <h1 className="text-3xl font-bold mb-6 text-center">
          Create Account 
        </h1>

        {/* 🔥 FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 bg-white/10 border border-white/20 rounded-lg outline-none focus:border-blue-400"
            type="text"
            placeholder="Enter your name"
            required
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 bg-white/10 border border-white/20 rounded-lg outline-none focus:border-blue-400"
            type="email"
            placeholder="Enter your email"
            required
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 bg-white/10 border border-white/20 rounded-lg outline-none focus:border-blue-400"
            type="password"
            placeholder="Enter your password"
            required
          />

          <input
            value={confirmpassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-3 bg-white/10 border border-white/20 rounded-lg outline-none focus:border-blue-400"
            type="password"
            placeholder="Confirm your password"
            required
          />

          <button
            type="submit"
            className="p-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg font-semibold hover:scale-[1.02] transition"
          >
            Sign Up
          </button>

        </form>

        {/* 🔥 MESSAGE */}
        {message && (
          <p className="mt-4 text-center text-green-400 text-sm">
            {message}
          </p>
        )}

        {/* 🔥 LOGIN LINK */}
        <p className="mt-6 text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Login
          </a>
        </p>

      </div>

    </div>
  );
};

export default Signup;