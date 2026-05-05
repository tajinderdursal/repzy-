import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import Like from "@/models/like";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import User from "@/models/signupdata";

export async function POST(req) {
  try {
    await connectDB();

    let userId = null;

    // 🔹 1) Try JWT
    const token = req.cookies.get("token")?.value;
    if (token) {
      try {
        const decoded = jwt.verify(token, "mysecretkey");
        userId = decoded.userId;
      } catch (e) {
        console.log("JWT invalid");
      }
    }

    // 🔹 2) Try Google (NextAuth)
    if (!userId) {
      const session = await getServerSession(authOptions);
      if (session?.user?.email) {
        const user = await User.findOne({ email: session.user.email });
        if (user) userId = user._id;
      }
    }

    // ❌ Not authenticated
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { photoId } = body;

    if (!photoId) {
      return NextResponse.json({ message: "photoId required" }, { status: 400 });
    }

    // 🔁 Toggle like
    const existingLike = await Like.findOne({ userId, photoId });

    let liked;
    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      liked = false;
    } else {
      await Like.create({ userId, photoId });
      liked = true;
    }

    // 🔢 Count after update
    const count = await Like.countDocuments({ photoId });

    return NextResponse.json({ liked, count });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}