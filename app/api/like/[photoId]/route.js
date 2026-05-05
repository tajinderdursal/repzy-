import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import Like from "@/models/like";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import User from "@/models/signupdata";

export async function GET(req, context) {
  try {
    await connectDB();

const { photoId } = await context.params;

    let userId = null;

    // 🔹 1. Try JWT
    const token = req.cookies.get("token")?.value;

    if (token) {
      try {
        const decoded = jwt.verify(token, "mysecretkey");
        userId = decoded.userId;
      } catch (err) {
        console.log("JWT invalid");
      }
    }

    // 🔹 2. Try Google session
    if (!userId) {
      const session = await getServerSession(authOptions);

      if (session?.user?.email) {
        const user = await User.findOne({ email: session.user.email });
        if (user) {
          userId = user._id;
        }
      }
    }

    // ❌ Not logged in → still return count (optional design)
    // You can allow public viewing
    const totalLikes = await Like.countDocuments({ photoId });

    let isLiked = false;

    if (userId) {
      const liked = await Like.findOne({ userId, photoId });
      isLiked = !!liked;
    }

    return NextResponse.json({
      totalLikes,
      isLiked,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}