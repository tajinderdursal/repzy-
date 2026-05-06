"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function PostPage() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState({});

  const params = useParams();
  const router = useRouter();
  const postId = params?.postId;

  // 🔥 LOAD DATA
  useEffect(() => {
    if (!postId) return;

    const loadData = async () => {
      try {
        const postRes = await fetch(`/api/post/${postId}`);
        const postData = await postRes.json();

        // 🔥 handle both cases (important)
        setPost(postData?.post || postData);

        const likeRes = await fetch(`/api/like/${postId}`);
        const likeData = await likeRes.json();

        setLikes({
          [postId]: likeData
        });

        const commentRes = await fetch(`/api/comment/${postId}`);
        const commentData = await commentRes.json();
        setComments(commentData);

      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, [postId]);

  // 🔥 LIKE
  const handleLike = async (photoId) => {
    if (!photoId) return;

    const current = likes[photoId];
    if (!current) return;

    const updated = {
      totalLikes: current.isLiked
        ? Math.max(0, current.totalLikes - 1)
        : current.totalLikes + 1,
      isLiked: !current.isLiked
    };

    setLikes(prev => ({
      ...prev,
      [photoId]: updated
    }));

    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ photoId })
      });

      const data = await res.json();

      setLikes(prev => ({
        ...prev,
        [photoId]: {
          totalLikes: data.count,
          isLiked: data.liked
        }
      }));

    } catch {
      setLikes(prev => ({
        ...prev,
        [photoId]: current
      }));
    }
  };

  // 🔥 COMMENT
  const addComment = async (photoId, text) => {
    if (!text.trim() || !photoId) return;

    const tempComment = {
      _id: Date.now(),
      text,
      userId: { name: "You" }
    };

    setComments(prev => [...prev, tempComment]);

    try {
      const res = await fetch("/api/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ photoId, text })
      });

      if (!res.ok) throw new Error("Failed");

      const newComment = await res.json();

      setComments(prev =>
        prev.map(c =>
          c._id === tempComment._id
            ? {
                ...c,
                _id: newComment?._id || c._id,
                userId: {
                  name: newComment?.userId?.name || "You"
                }
              }
            : c
        )
      );

    } catch (err) {
      console.error(err);
      setComments(prev => prev.filter(c => c._id !== tempComment._id));
    }
  };

  // ✅ 🔥 CRITICAL FIX (prevents crash)
  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-10 py-24 relative">

      {/* 🔥 BACKGROUND GLOW */}
      <div className="absolute w-[400px] h-[400px] bg-blue-500/20 blur-[140px] rounded-full top-10 left-10"></div>
      <div className="absolute w-[400px] h-[400px] bg-green-500/20 blur-[140px] rounded-full bottom-10 right-10"></div>

      {/* 🔙 BACK BUTTON */}
      <button
        onClick={() => router.back()}
        className="relative z-10 mb-6 px-4 py-2 text-sm rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition"
      >
        ← Back
      </button>

      {/* 🔥 MAIN CONTAINER */}
      <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-6">

        {/* 📸 IMAGE CARD */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 overflow-hidden shadow-xl flex items-center justify-center">
          {post?.image && (
            <img
              src={post.image}
              className="w-full h-full object-contain"
              alt="Post"
            />
          )}
        </div>

        {/* 🧾 RIGHT PANEL */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl p-5 flex flex-col h-[80vh]">

          {/* 👤 USER */}
          <Link href={`/profile/${post?.userId?._id || ""}`}>
            <p className="font-bold text-lg hover:text-blue-400 transition cursor-pointer">
              {post?.userId?.name || "Unknown"}
            </p>
          </Link>

          {/* 📝 CAPTION */}
          <p className="mt-3 text-gray-300">
            {post?.caption || ""}
          </p>

          {/* ❤️ LIKE */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => handleLike(post?._id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                likes[post?._id]?.isLiked
                  ? "bg-red-500/20 text-red-400"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {likes[post?._id]?.isLiked ? "❤️ Liked" : "🤍 Like"}
            </button>

            <span className="text-sm text-gray-400">
              {likes[post?._id]?.totalLikes ?? 0} likes
            </span>
          </div>

          {/* 💬 COMMENTS */}
          <div className="flex-1 overflow-y-auto mt-5 space-y-3 pr-1">
            {comments.length > 0 ? (
              comments.map((c) => (
                <div
                  key={c._id}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2"
                >
                  <span className="font-semibold text-blue-400">
                    {c.userId?.name}
                  </span>{" "}
                  <span className="text-sm text-gray-300">{c.text}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No comments yet</p>
            )}
          </div>

          {/* ✍️ COMMENT INPUT */}
          <div className="mt-4">
            <input
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-blue-400 text-white placeholder-gray-400"
              placeholder="Write a comment..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addComment(post?._id, e.target.value);
                  e.target.value = "";
                }
              }}
            />
          </div>

        </div>
      </div>
    </div>
  );
}