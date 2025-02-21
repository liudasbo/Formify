import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const data = await req.json();

    const { title, description, topic, tags, questions } = data;

    const tagValues = tags.map((tag) => String(tag.value));

    const newTemplate = await db.template.create({
      data: {
        title,
        description,
        topic,
        tags: { set: tagValues },
        user: { connect: { id: userId } },
        questions: {
          create: questions.map((question) => ({
            title: question.title || "Untitled question",
            type: question.type,
            options: question.options.map((option) => option.value),
            required: question.required,
          })),
        },
      },
    });

    return NextResponse.json({
      template: newTemplate,
      message: "Template created successfully!",
    });
  } catch (error) {
    console.error("Error creating template:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
