import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { userId } = params;

  try {
    const forms = await db.form.findMany({
      where: { userId: parseInt(userId, 10) },
      include: {
        template: true,
        answers: {
          include: {
            question: true,
            option: true,
          },
        },
      },
    });

    return NextResponse.json(forms);
  } catch (error) {
    console.error("Error fetching forms:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
