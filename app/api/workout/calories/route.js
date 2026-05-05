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

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period");

    let startDate = new Date();

    if (period === "today") {
      startDate.setHours(0, 0, 0, 0);
    }

    if (period === "week") {
      startDate.setDate(startDate.getDate() - 7);
    }

    if (period === "month") {
      startDate.setDate(startDate.getDate() - 30);
    }

    const result = await Workout.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          calories: {
            $sum: {
              $multiply: ["$weight", "$reps", "$sets", 0.1],
            },
          },
        },
      },
    ]);

    return NextResponse.json({
      calories: result[0]?.calories || 0,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching calories" },
      { status: 500 }
    );
  }
}