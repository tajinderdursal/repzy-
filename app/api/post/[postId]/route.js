import { connectDB } from "@/lib/mongodb";
import ProgressPhoto from "@/models/progressphoto";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    await connectDB();

    // ✅ IMPORTANT (Next.js params fix)
    const { postId } = await params;

    // ✅ validate ID
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json(
        { error: "Invalid post ID" },
        { status: 400 }
      );
    }

    // ✅ fetch post
    const post = await ProgressPhoto.findById(postId)
      .populate("userId", "name profilePhoto")
      .lean();

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);

  } catch (error) {
    console.error("Error fetching post:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}