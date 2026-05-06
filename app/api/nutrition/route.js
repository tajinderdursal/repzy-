import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ error: "No query" }, { status: 400 });
    }

    const res = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&api_key=${process.env.USDA_API_KEY}`
    );

    if (!res.ok) {
      return NextResponse.json({ error: "API failed" }, { status: 500 });
    }

    const data = await res.json();

   

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch food data" },
      { status: 500 }
    );
  }
}