import { connectDB } from "@/lib/mongodb";
import Workout from "@/models/workout";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
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

// ================= POST =================
export async function POST(req) {
  try {
    await connectDB();

    const userId = await getUserId(req);

    if (!userId) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();

    // 🔹 Validation
    if (!body.exercise || !body.sets || !body.reps || !body.weight) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const workout = await Workout.create({
      userId: userId,
      exercise: body.exercise,
      sets: body.sets,
      reps: body.reps,
      weight: body.weight,
    });

    return NextResponse.json(workout);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error saving workout" },
      { status: 500 }
    );
  }
}

// ================= GET =================
export async function GET(req) {
  try {
    await connectDB();

    const userId = await getUserId(req);

    if (!userId) {
      return NextResponse.json(
        { message: "Not logged in" },
        { status: 401 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const workouts = await Workout.find({
      userId: userId,
      date: { $gte: today },
    }).sort({ createdAt: -1 });

    return NextResponse.json(workouts);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching workouts" },
      { status: 500 }
    );
  }
}