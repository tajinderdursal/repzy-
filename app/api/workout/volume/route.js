import { connectDB } from "@/lib/mongodb";
import Workout from "@/models/workout";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import User from "@/models/signupdata";

// 🔹 Helper (JWT + Google)
async function getUserId(req) {
  let userId = null;

  // JWT
  const token = req.cookies.get("token")?.value;
  if (token) {
    try {
      const decoded = jwt.verify(token, "mysecretkey");
      userId = decoded.userId;
    } catch (err) {
      console.log("JWT invalid");
    }
  }

  // Google
  if (!userId) {
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      const user = await User.findOne({ email: session.user.email });
      if (user) userId = user._id;
    }
  }

  return userId;
}

// 🔹 Get week number (correct way)
function getWeekNumber(date) {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const pastDays = (date - firstDay) / 86400000;
  return Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
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

    const workouts = await Workout.find({
      userId: userId,
    });

    const weeklyVolume = {};

    workouts.forEach((w) => {
      const week = getWeekNumber(new Date(w.date));

      const volume = w.sets * w.reps * w.weight;

      if (!weeklyVolume[week]) {
        weeklyVolume[week] = 0;
      }

      weeklyVolume[week] += volume;
    });

    return NextResponse.json(weeklyVolume);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error calculating volume" },
      { status: 500 }
    );
  }
}