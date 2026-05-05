"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuth from "@/hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { User, Loading } = useAuth();
  const Router = useRouter();

  useEffect(() => {
    if (!Loading && !User) {
      Router.replace("/login?message=Please login first");
    }
  }, [User, Loading]);

  // 🔥 Loader (while checking auth)
  if (Loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  // 🔥 If not logged in → nothing (redirect happens)
  if (!User) return null;

  // ✅ If logged in → render page
  return children;
}