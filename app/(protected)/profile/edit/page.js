"use client";

import React, { useState, useEffect } from "react";



const EditProfile = () => {






  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("");
  const [genderpopup, setgenderpopup] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔥 FETCH PROFILE
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile", {
          credentials: "include",
        });

        if (!res.ok) return;

        const data = await res.json();

        setName(data.name || "");
        setEmail(data.email || "");
        setAge(data.age || "");
        setHeight(data.height || "");
        setWeight(data.weight || "");
        setGender(data.gender || "");
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          age,
          height,
          weight,
          gender,
        }),
      });

      if (!res.ok) throw new Error();

      router.push("/profile");
    } catch {
      alert("Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (



    
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-10 relative">

      {/* 🔥 BACKGROUND GLOW */}
      <div className="absolute w-[300px] h-[300px] bg-blue-500/20 blur-[120px] rounded-full top-10 left-10"></div>
      <div className="absolute w-[300px] h-[300px] bg-purple-500/20 blur-[120px] rounded-full bottom-10 right-10"></div>

      {/* 🔥 CARD */}
      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">

        {/* TITLE */}
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          Edit Profile
        </h1>

        <form onSubmit={updateProfile} className="space-y-4">

          {/* NAME */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-blue-400"
          />

          {/* EMAIL */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-blue-400"
          />

          {/* GRID FOR AGE/HEIGHT/WEIGHT */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Age"
              className="p-3 rounded-lg bg-white/10 border border-white/20"
            />

            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Height"
              className="p-3 rounded-lg bg-white/10 border border-white/20"
            />

            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Weight"
              className="p-3 rounded-lg bg-white/10 border border-white/20"
            />

          </div>

          {/* GENDER */}
          <div className="relative">

            <button
              type="button"
              onClick={() => setgenderpopup(!genderpopup)}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-left"
            >
              {gender || "Select Gender"}
            </button>

            {genderpopup && (
              <div className="absolute w-full mt-2 bg-black border border-white/20 rounded-lg overflow-hidden z-50">

                {["Male", "Female", "Other"].map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      setGender(g);
                      setgenderpopup(false);
                    }}
                    className="w-full p-3 hover:bg-white/10 text-left"
                  >
                    {g}
                  </button>
                ))}

              </div>
            )}

          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 p-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg font-semibold hover:scale-[1.02] transition"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>

        </form>

      </div>
    </div>
  );
};

export default EditProfile;