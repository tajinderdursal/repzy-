import { connectDB } from "@/lib/mongodb";
import Workout from "@/models/workout";
import jwt from "jsonwebtoken";
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

// ================= DELETE =================
export async function DELETE(req, context) {
  try {
    await connectDB();

const { id } = await context.params;

    const userId = await getUserId(req);

    if (!userId) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // 🔒 Only delete user's own workout
    const deletedWorkout = await Workout.findOneAndDelete({
      _id: id,
      userId: userId,
    });

    if (!deletedWorkout) {
      return NextResponse.json(
        { message: "Not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(deletedWorkout);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error deleting workout" },
      { status: 500 }
    );
  }
}

// ================= PUT =================
export async function PUT(req, context) {
  try {
    await connectDB();

  const { id } = await context.params;
    const body = await req.json();

    const userId = await getUserId(req);

    if (!userId) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // 🔒 Only update user's own workout
    const updatedWorkout = await Workout.findOneAndUpdate(
      { _id: id, userId: userId },
      {
        exercise: body.exercise,
        sets: body.sets,
        reps: body.reps,
        weight: body.weight,
      },
      { new: true }
    );

    if (!updatedWorkout) {
      return NextResponse.json(
        { message: "Not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedWorkout);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error updating workout" },
      { status: 500 }
    );
  }
}