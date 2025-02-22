import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { userId } = await params;

  if (!userId) {
    return NextResponse.json({ error: "User id is required" }, { status: 400 });
  }

  try {
    const templates = await db.template.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to get templates" },
      { status: 500 }
    );
  }
}
