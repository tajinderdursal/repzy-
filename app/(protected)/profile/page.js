"use client";

import { useEffect, useState } from "react";
import { Camera, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Profile() {



  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const router = useRouter();

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

  const uploadPhoto = async (file) => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/profile/photo", {
        method: "POST",
        body: formData,
        credentials: "include"
      });

      const data = await res.json();

      setUser((prev) => ({
        ...prev,
        profilePhoto: data.profilePhoto
      }));

    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
      setShowOptions(false);
    }
  };

  const removePhoto = async () => {
    try {
      await fetch("/api/profile/photo", {
        method: "DELETE",
        credentials: "include"
      });

      setUser((prev) => ({
        ...prev,
        profilePhoto: ""
      }));

    } catch (err) {
      console.error(err);
    } finally {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/profile", {
        credentials: "include"
      });

      const data = await res.json();
      setUser(data);
    };

    fetchUser();
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative px-4 md:px-10 py-10">
      <div className="mb-32 mt-30">

      </div>

      {/* 🔥 BACKGROUND GLOW */}
      <div className="absolute w-[300px] h-[300px] bg-blue-500/20 blur-[120px] rounded-full top-10 left-10"></div>
      <div className="absolute w-[300px] h-[300px] bg-purple-500/20 blur-[120px] rounded-full bottom-10 right-10"></div>

      {/* 🔥 PROFILE CARD */}
      <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 md:p-10 shadow-xl">

        {/* 🔥 IMAGE */}
        <div className="flex flex-col items-center gap-4">

          <div
            onClick={() => setShowOptions(true)}
            className="relative cursor-pointer group"
          >
            <img
              src={getProfileImage(user)}
              onError={(e) => {
                e.currentTarget.src = "/default-profile.jpg";
              }}
              className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-2 border-white/20"
            />

            <div className="absolute bottom-0 right-0 bg-black p-2 rounded-full border border-gray-600">
              <Camera size={18} />
            </div>

            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-full flex items-center justify-center text-sm">
              Change
            </div>
          </div>

          {/* 🔥 NAME */}
          <h1 className="text-2xl font-bold">{user.name}</h1>

        </div>

<button
  onClick={() => router.push("/profile/edit")}
  className="p-3 mt-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg font-semibold hover:scale-[1.02] transition"
>
  Edit Profile
</button>



        {/* 🔥 OPTIONS MODAL */}
        {showOptions && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 flex flex-col gap-4 w-64">

              <input
                type="file"
                id="profileUpload"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  const preview = URL.createObjectURL(file);

                  setUser((prev) => ({
                    ...prev,
                    profilePhoto: preview
                  }));

                  uploadPhoto(file);
                }}
              />

              <label
                htmlFor="profileUpload"
                className="cursor-pointer flex items-center gap-2 hover:text-blue-400"
              >
                <Camera size={16} /> Change Photo
              </label>

              <button
                onClick={removePhoto}
                className="flex items-center gap-2 text-red-400 hover:text-red-500"
              >
                <Trash2 size={16} /> Remove Photo
              </button>

              <button
                onClick={() => setShowOptions(false)}
                className="text-gray-400 hover:text-white text-sm"
              >
                Cancel
              </button>

            </div>
          </div>
        )}

        {/* 🔥 INFO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 text-sm md:text-base">

          <div className="bg-white/5 p-4 rounded-xl">
            <span className="text-gray-400">Email</span>
            <p className="font-semibold">{user.email}</p>
          </div>

          <div className="bg-white/5 p-4 rounded-xl">
            <span className="text-gray-400">Age</span>
            <p className="font-semibold">{user.age || "Not set"}</p>
          </div>

          <div className="bg-white/5 p-4 rounded-xl">
            <span className="text-gray-400">Height</span>
            <p className="font-semibold">{user.height || "Not set"}</p>
          </div>

          <div className="bg-white/5 p-4 rounded-xl">
            <span className="text-gray-400">Weight</span>
            <p className="font-semibold">{user.weight || "Not set"}</p>
          </div>

          <div className="bg-white/5 p-4 rounded-xl">
            <span className="text-gray-400">Gender</span>
            <p className="font-semibold">{user.gender || "Not set"}</p>
          </div>

          <div className="bg-white/5 p-4 rounded-xl">
            <span className="text-gray-400">User ID</span>
            <p className="font-semibold break-all">{user._id}</p>
          </div>



        </div>

        {/* 🔥 ACCOUNT SECTION */}
        <div className="mt-10 border-t border-white/10 pt-6 text-center">

          <h2 className="text-xl font-semibold mb-2 text-blue-400">
            Account Info
          </h2>

          <p className="text-gray-400">
            Member since{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>

          <p className="text-green-400 mt-1">Active</p>

        </div>

      </div>

      {/* 🔄 Uploading Overlay */}
      {uploading && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          Uploading...
        </div>
      )}

    </div>
  );
}