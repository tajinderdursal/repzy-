import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Comment from "@/models/comment";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import User from "@/models/signupdata";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { photoId, text } = body;

    let userId = null;

    // 🔹 1. Try JWT (your existing system)
    const token = req.cookies.get("token")?.value;

    if (token) {
      try {
        const decoded = jwt.verify(token, "mysecretkey");
        userId = decoded.userId;
      } catch (err) {
        console.log("JWT invalid");
      }
    }

    // 🔹 2. Try Google (NextAuth)
    if (!userId) {
      const session = await getServerSession(authOptions);

      if (session?.user?.email) {
        const user = await User.findOne({ email: session.user.email });
        if (user) {
          userId = user._id;
        }
      }
    }

    // ❌ Not authenticated
    if (!userId) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // ❌ Validate input
    if (!photoId || !text) {
      return NextResponse.json(
        { message: "Missing fields" },
        { status: 400 }
      );
    }

    // ✅ Create comment
    const newComment = await Comment.create({
      userId,
      photoId,
      text,
    });

    return NextResponse.json({
      message: "Comment added",
      comment: newComment,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}