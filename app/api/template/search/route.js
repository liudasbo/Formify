import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    const templates = await db.template.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
