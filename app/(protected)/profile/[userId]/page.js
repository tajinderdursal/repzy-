"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { div } from "framer-motion/client";

export default function Profile() {






  const params = useParams();
  const userId = params?.userId || "";

  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  const [stats, setStats] = useState({
    totalWorkouts: 0,
    consistency: 0,
  });

  const [loading, setLoading] = useState(true);

  // 🔥 Avatar Logic (SAFE)
  const getProfileImage = (user) => {
    if (
      user?.profilePhoto &&
      typeof user.profilePhoto === "string" &&
      user.profilePhoto.trim() !== ""
    ) {
      return user.profilePhoto;
    }

    if (user?.gender === "Male") return "/avatar-male.png";
    if (user?.gender === "Female") return "/avatar-female.png";

    return "/default-profile.jpg";
  };

  // 🔹 Fetch posts
  useEffect(() => {
    if (!userId) return;

    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/userposts/${userId}`);

        if (!res.ok) return;

        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Posts fetch error:", err);
      }
    };

    fetchPosts();
  }, [userId]);

  // 🔹 Fetch user (SAFE)
  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/profile/${userId}`);

        if (!res.ok) {
          console.error("User fetch failed");
          setLoading(false);
          return;
        }

        const data = await res.json();

        if (data.error) {
          console.error(data.error);
          setLoading(false);
          return;
        }

        setUser(data);
        setLoading(false);
      } catch (err) {
        console.error("User fetch error:", err);
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  // 🔹 Fetch stats (optional)
  useEffect(() => {
    if (!userId) return;

    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/workout/status?userId=${userId}`);

        if (!res.ok) return;

        const data = await res.json();

        setStats({
          totalWorkouts: data.totalWorkouts || 0,
          consistency: data.consistency || 0,
        });
      } catch {
        console.log("Stats not available");
      }
    };

    fetchStats();
  }, [userId]);

  // 🔥 Loading UI
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white text-xl">
        Loading profile...
      </div>
    );
  }

  // 🔥 No user found
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 text-xl">
        User not found
      </div>
    );
  }

  return (
  
    <div className="bg-black min-h-screen text-white p-4">
      <div className="mt-32 mb-30">

      </div>

      {/* 🔥 PROFILE HEADER */}
      <div className="flex flex-col items-center mb-8">

        <img
          src={getProfileImage(user)}
          onError={(e) => {
            e.currentTarget.src = "/default-profile.jpg";
          }}
          className="w-28 h-28 rounded-full object-cover border-4 border-purple-500 shadow-lg"
        />

        <h1 className="text-2xl font-bold mt-3">
          {user.name}
        </h1>

        <p className="text-gray-400 text-sm">
          Member since{" "}
          {user.createdAt &&
            new Date(user.createdAt).toLocaleDateString()}
        </p>

        {/* 🔥 STATS */}
        <div className="flex gap-6 mt-4 text-center">

          <div>
            <p className="text-xl font-bold">{posts.length}</p>
            <p className="text-gray-400 text-sm">Posts</p>
          </div>

          <div>
            <p className="text-xl font-bold">{stats.totalWorkouts}</p>
            <p className="text-gray-400 text-sm">Workouts</p>
          </div>

          <div>
            <p className="text-xl font-bold">{stats.consistency}%</p>
            <p className="text-gray-400 text-sm">Consistency</p>
          </div>

        </div>
      </div>

      {/* 🔥 PINTEREST GRID */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">

        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post._id}`}>

            <div className="break-inside-avoid relative group cursor-pointer">

              <img
                src={post.image}
                onError={(e) => {
                  e.currentTarget.src = "/default-profile.jpg";
                }}
                className="w-full rounded-xl object-cover transition group-hover:scale-[1.03]"
              />

              {/* 🔥 Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center">
                <p className="text-white text-sm">View</p>
              </div>

            </div>

          </Link>
        ))}

      </div>

    </div>
  );
}