"use client";

import { useEffect, useState } from "react";
import Link from "next/link";


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
        setPost(postData);

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
    if (!text.trim()) return;

    const res = await fetch("/api/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ photoId, text })
    });

    const newComment = await res.json();
    setComments(prev => [...prev, newComment]);
  };

  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
   <div className="mt-32 mb-30">

      </div>
      {/* 🔥 BACK BUTTON */}
      <button
        onClick={() => router.back()}
        className="mb-4 bg-gray-800 px-4 py-2 rounded hover:bg-gray-700"
      >
        ← Back
      </button>

      {/* 🔥 MAIN LAYOUT */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">

        {/* 🔥 IMAGE */}
        <div className="bg-gray-900 rounded-xl overflow-hidden flex justify-center items-center">
          <img
            src={post.image}
            className="w-full h-full object-contain"
          />
        </div>

        {/* 🔥 RIGHT PANEL */}
        <div className="bg-gray-900 rounded-xl p-4 flex flex-col h-[80vh]">

          {/* USER */}
          <div className="mb-4">
            <Link href={`/profile/${post.userId?._id}`}>
              <p className="font-bold text-lg hover:text-purple-400">
                {post.userId?.name || "Unknown"}
              </p>
            </Link>
          </div>

          {/* CAPTION */}
          <p className="mb-4 text-gray-300">
            {post.caption}
          </p>

          {/* LIKE */}
          <div className="mb-4">
            <button
              onClick={() => handleLike(post._id)}
              className="text-lg"
            >
              {likes[post._id]?.isLiked ? "❤️ Liked" : "🤍 Like"}
            </button>

            <p className="text-sm text-gray-400">
              {likes[post._id]?.totalLikes ?? 0} likes
            </p>
          </div>

          {/* COMMENTS (SCROLLABLE) */}
          <div className="flex-1 overflow-y-auto space-y-2 mb-3">
            {comments.length > 0 ? (
              comments.map((c) => (
                <p key={c._id} className="text-sm">
                  <b>{c.userId?.name}</b> {c.text}
                </p>
              ))
            ) : (
              <p className="text-gray-400">No comments yet</p>
            )}
          </div>

          {/* COMMENT INPUT */}
          <input
            className="border p-2 rounded text-black"
            placeholder="Write a comment..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addComment(post._id, e.target.value);
                e.target.value = "";
              }
            }}
          />

        </div>

      </div>

    </div>
  );
}