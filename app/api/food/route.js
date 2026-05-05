import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Food from "@/models/food";
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      userId,
      name,
      calories,
      protein,
      carbs,
      fat,
      quantity,
      date,
      meal,
    } = body;

    if (!userId || !name || !calories || !quantity || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newFood = await Food.create({
      userId,
      name,
      calories,
      protein,
      carbs,
      fat,
      quantity,
      date,
      meal,
    });

    return NextResponse.json(
      { success: true, data: newFood },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to save food" },
      { status: 500 }
    );
  }
}
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const date = searchParams.get("date");

    const foods = await Food.find({ userId, date });

    return NextResponse.json({ foods });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
export async function DELETE(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await Food.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete" },
      { status: 500 }
    );
  }
}