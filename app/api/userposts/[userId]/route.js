import { connectDB } from "@/lib/mongodb";
import Post from "@/models/progressphoto";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    await connectDB();


    const { userId } = await params;

    const posts = await Post.find({ userId, isPublic: true })
        .sort({ createdAt: -1 });

    return NextResponse.json(posts);
}