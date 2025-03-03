import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const formId = parseInt(params.formId, 10);

    if (isNaN(formId)) {
      return NextResponse.json(
        { error: "Invalid formId parameter" },
        { status: 400 }
      );
    }

    const form = await db.form.findUnique({
      where: {
        id: formId,
      },
      include: {
        answers: {
          include: {
            question: {
              include: {
                options: true, // Include related options
              },
            },
          },
        },
        template: {
          include: {
            questions: {
              include: {
                options: true, // Include related options
              },
            },
            tags: true, // Include related tags
          },
        },
        user: true, // Include user who submitted the form
      },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error("Error fetching form:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
