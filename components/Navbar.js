"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [jwtLoggedIn, setJwtLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // 🔥 Check login + fetch user
  const checkUser = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setJwtLoggedIn(true);
        setUser(data);
      } else {
        setJwtLoggedIn(false);
      }
    } catch {
      setJwtLoggedIn(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, [pathname]);

  const loggedIn = !!session || jwtLoggedIn;

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    await signOut({ redirect: false });
    router.push("/login");
  };

  // 🔥 Profile image logic
  const getProfileImage = () => {
    if (user?.profilePhoto) return user.profilePhoto;
    if (user?.gender === "male") return "/avatar-male.png";
    if (user?.gender === "female") return "/avatar-female.png";
    return "/default-profile.jpg";
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex justify-center">
      <div className="w-[95%] md:w-[80%] mt-4 px-6 py-3 rounded-full 
        bg-white/10 backdrop-blur-lg border border-white/20 
        flex justify-between items-center text-white">

        {/* LOGO */}
        <Link href="/" className="font-bold text-lg">
          Repzy
        </Link>

        {/* DESKTOP */}
        <div className="hidden md:flex gap-6 items-center">

          <Link href="/">Home</Link>
          <Link href="/feed">Feed</Link>
          <Link href="/progress">Progress</Link>
          <Link href="/nutrition">Nutrition</Link>
          <Link href="/exercises">Workout</Link>

          {!loggedIn ? (
            <>
              <Link href="/login">Login</Link>
              <Link
                href="/signup"
                className="bg-white text-black px-4 py-1 rounded-full"
              >
                Sign up
              </Link>
            </>
          ) : (
            <div className="relative">
              <img
                src={getProfileImage()}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-9 h-9 rounded-full cursor-pointer border"
              />

             <div
  className="relative"
  onMouseLeave={() => setDropdownOpen(false)}
>
  {dropdownOpen && (
    <div className="absolute right-0 mt-2 bg-black/90 backdrop-blur border border-white/10 rounded-lg p-2 w-40 shadow-xl z-50">

      <Link
        href="/profile"
        className="block px-3 py-2 hover:bg-white/10 rounded transition"
      >
        View Profile
      </Link>

      <Link
        href="/dashboard"
        className="block px-3 py-2 hover:bg-white/10 rounded transition"
      >
        Dashboard
      </Link>

      <button
        onClick={handleLogout}
        className="w-full text-left px-3 py-2 hover:bg-red-500/20 rounded transition"
      >
        Logout
      </button>

    </div>
  )}
</div>
            </div>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <div className="md:hidden">
          {menuOpen ? (
            <X onClick={() => setMenuOpen(false)} />
          ) : (
            <Menu onClick={() => setMenuOpen(true)} />
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="absolute top-20 w-[90%] bg-black rounded-xl p-6 flex flex-col gap-4 text-white md:hidden">

          <Link href="/">Home</Link>
          <Link href="/feed">Feed</Link>
          <Link href="/progress">Progress</Link>
          <Link href="/dashboard">Dashboard</Link>

          {!loggedIn ? (
            <>
              <Link href="/login">Login</Link>
              <Link href="/signup">Signup</Link>
            </>
          ) : (
            <>
              <Link href="/profile">Profile</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}