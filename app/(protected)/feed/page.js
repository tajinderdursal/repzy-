"use client";

import { useEffect, useState } from "react";
import Link from "next/link";



export default function Feed() {


  


  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [showComments, setShowComments] = useState({});
  

  const getProfileImage = (user) => {
    if (
      user?.profilePhoto &&
      typeof user.profilePhoto === "string" &&
      user.profilePhoto.trim() !== ""
    ) {
      return user.profilePhoto;
    }

    const gender = user?.gender?.toLowerCase();

    if (gender === "male") return "/avatar-male.png";
    if (gender === "female") return "/avatar-female.png";

    return "/default-profile.jpg";
  };

  useEffect(() => {
    const loadPosts = async () => {
      const res = await fetch("/api/feed");
      const data = await res.json();
      setPosts(data);
    };
    loadPosts();
  }, []);

  useEffect(() => {
    posts.forEach(async (post) => {
      const res = await fetch(`/api/like/${post._id}`);
      const data = await res.json();

      setLikes((prev) => ({
        ...prev,
        [post._id]: data,
      }));
    });
  }, [posts]);

  useEffect(() => {
    posts.forEach(async (post) => {
      const res = await fetch(`/api/comment/${post._id}`);
      const data = await res.json();

      setComments((prev) => ({
        ...prev,
        [post._id]: data,
      }));
    });
  }, [posts]);

  const handleLike = async (photoId) => {
    const current = likes[photoId];
    if (!current) return;

    const updated = {
      totalLikes: current.isLiked
        ? Math.max(0, current.totalLikes - 1)
        : current.totalLikes + 1,
      isLiked: !current.isLiked,
    };

    setLikes((prev) => ({
      ...prev,
      [photoId]: updated,
    }));

    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ photoId }),
      });

      const data = await res.json();

      setLikes((prev) => ({
        ...prev,
        [photoId]: {
          totalLikes: data.count,
          isLiked: data.liked,
        },
      }));
    } catch {
      setLikes((prev) => ({
        ...prev,
        [photoId]: current,
      }));
    }
  };

  const addComment = async (photoId, text) => {
    if (!text.trim()) return;

    await fetch("/api/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ photoId, text }),
    });

    const res = await fetch(`/api/comment/${photoId}`);
    const data = await res.json();

    setComments((prev) => ({
      ...prev,
      [photoId]: data,
    }));
  };

  return (
    <div className="bg-black min-h-screen px-4 md:px-10 py-10 relative">

      {/* 🔥 TITLE */}
     <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-32 mt-32 text-center">
        see what others are lifting,{" "}
            <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
             and get inspired by their fitness journey.
            </span>
          </h1>

      {/* GRID */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">

        {posts.map((post) => (
          <div
            key={post._id}
            className="break-inside-avoid bg-white/5 backdrop-blur border border-white/10 rounded-2xl overflow-hidden shadow-lg"
          >

            {/* IMAGE */}
            <div className="relative group">
              <Link href={`/post/${post._id}`}>
                <img
                  src={post.image}
                  className="w-full object-cover rounded-t-2xl"
                />
              </Link>

              <button
                onClick={() => handleLike(post._id)}
               className="absolute top-3 right-3 bg-black/60 p-2 rounded-full text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition"
              >
                {likes[post._id]?.isLiked ? "❤️" : "🤍"}
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-3 text-white">

              {/* USER */}
              <Link href={`/profile/${post.userId._id}`}>
                <div className="flex items-center gap-2 cursor-pointer">

                  <img
                    src={getProfileImage(post.userId)}
                    className="w-8 h-8 rounded-full"
                  />

                  <p className="font-semibold text-sm">
                    {post.userId.name}
                  </p>

                </div>
              </Link>

              {/* CAPTION */}
              <p className="text-sm text-gray-300 mt-2">
                {post.caption}
              </p>

              {/* LIKES */}
              <p className="text-xs text-gray-400 mt-1">
                {likes[post._id]?.totalLikes ?? 0} likes
              </p>

              {/* TOGGLE */}
              <button
                onClick={() =>
                  setShowComments((prev) => ({
                    ...prev,
                    [post._id]: !prev[post._id],
                  }))
                }
                className="text-xs text-blue-400 mt-2"
              >
                {showComments[post._id]
                  ? "Hide comments"
                  : "View comments"}
              </button>

              {/* 🔥 INSTAGRAM STYLE COMMENTS */}
              {showComments[post._id] && (
                <div className="mt-3 space-y-3">

                  {comments[post._id]?.map((c) => (
                    <div key={c._id} className="flex gap-2 items-start">

                      <img
                        src={getProfileImage(c.userId)}
                        className="w-7 h-7 rounded-full"
                      />

                      <p className="text-xs">
                        <span className="font-semibold mr-1">
                          {c.userId?.name}
                        </span>
                        {c.text}
                      </p>

                    </div>
                  ))}

                  {/* INPUT */}
                  <div className="flex items-center gap-2 mt-2">

                    <input
                      placeholder="Add a comment..."
                      className="flex-1 p-2 text-xs bg-white/10 border border-white/20 rounded-full outline-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          addComment(post._id, e.target.value);
                          e.target.value = "";
                        }
                      }}
                    />

                  </div>

                </div>
              )}

            </div>

          </div>
        ))}
      </div>

    </div>
  );
}