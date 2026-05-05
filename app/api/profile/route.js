


import { connectDB } from "@/lib/mongodb";
import User from "@/models/signupdata";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
export async function GET(req) {
  try {
    await connectDB();

    // 🔹 1. Try JWT (your old system)
    const token = req.cookies.get("token")?.value;

    if (token) {
      const decoded = jwt.verify(token, "mysecretkey");
      const user = await User.findById(decoded.userId).select("-password");
      return NextResponse.json(user);
    }

    // 🔹 2. Try Google session (NextAuth)
   const session = await getServerSession(authOptions);

    if (session?.user?.email) {
      const user = await User.findOne({ email: session.user.email }).select("-password");
      return NextResponse.json(user);
    }

    return NextResponse.json({ message: "Not logged in" }, { status: 401 });

  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}



// UPDATE PROFILE
export async function PUT(req) {
  try {
    await connectDB();

    let userId = null;

    // 🔹 1. Try JWT
    const token = req.cookies.get("token")?.value;

    if (token) {
      const decoded = jwt.verify(token, "mysecretkey");
      userId = decoded.userId;
    }

    // 🔹 2. Try Google session
    if (!userId) {
      const session = await getServerSession(authOptions);

      if (session?.user?.email) {
        const user = await User.findOne({ email: session.user.email });
        userId = user?._id;
      }
    }

    // 🔥 If still not found
    if (!userId) {
      return NextResponse.json(
        { message: "Not logged in" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      body,
      { new: true }
    );

    return NextResponse.json(updatedUser);

  } catch (error) {
    return NextResponse.json(
      { message: "Update failed" },
      { status: 500 }
    );
  }
}