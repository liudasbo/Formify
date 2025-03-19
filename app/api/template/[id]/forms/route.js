import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const templateId = parseInt(params.id, 10);

    if (isNaN(templateId)) {
      return NextResponse.json(
        { error: "Invalid templateId parameter" },
        { status: 400 }
      );
    }

    const forms = await db.form.findMany({
      where: {
        templateId: templateId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Newest first
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
