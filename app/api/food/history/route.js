import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Food from "@/models/food";

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const foods = await Food.find({ userId });

  return NextResponse.json({ foods });
}