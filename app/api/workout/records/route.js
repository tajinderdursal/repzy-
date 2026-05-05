import { connectDB } from "@/lib/mongodb";
import Workout from "@/models/workout";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import User from "@/models/signupdata";

// 🔹 Helper: get userId (JWT + Google)
async function getUserId(req) {
  let userId = null;

  // 1. JWT
  const token = req.cookies.get("token")?.value;
  if (token) {
    try {
      const decoded = jwt.verify(token, "mysecretkey");
      userId = decoded.userId;
    } catch (err) {
      console.log("JWT invalid");
    }
  }

  // 2. Google session
  if (!userId) {
    const session = await getServerSession(authOptions);

    if (session?.user?.email) {
      const user = await User.findOne({ email: session.user.email });
      if (user) userId = user._id;
    }
  }

  return userId;
}

export async function GET(req) {
  try {
    await connectDB();

    const userId = await getUserId(req);

    if (!userId) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const records = await Workout.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: "$exercise",
          maxWeight: { $max: "$weight" },
        },
      },
    ]);

    return NextResponse.json(records);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching records" },
      { status: 500 }
    );
  }
}