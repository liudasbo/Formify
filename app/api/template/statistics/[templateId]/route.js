import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const templateId = parseInt(params.templateId, 10);

    if (isNaN(templateId)) {
      return NextResponse.json(
        { error: "Invalid templateId parameter" },
        { status: 400 }
      );
    }

    const template = await db.template.findUnique({
      where: {
        id: templateId,
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
        tags: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    const forms = await db.form.findMany({
      where: {
        templateId: templateId,
      },
      include: {
        answers: {
          include: {
            question: true,
            option: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const allAnswers = forms.flatMap((form) => form.answers);

    const statistics = {
      template: template,
      answers: allAnswers,
      totalForms: forms.length,

      updatedAt: forms.length > 0 ? forms[0].updatedAt : template.updatedAt,

      createdAt:
        forms.length > 0
          ? forms[forms.length - 1].createdAt
          : template.createdAt,
    };

    return NextResponse.json(statistics);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
