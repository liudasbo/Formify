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

    const tagValues = await Promise.all(
      tags.map(async (tag) => {
        let existingTag = await db.tags.findFirst({
          where: { label: tag.label },
        });

        if (!existingTag) {
          existingTag = await db.tags.create({
            data: {
              label: tag.label,
            },
          });
        }

        return existingTag;
      })
    );

    const newTemplate = await db.template.create({
      data: {
        title,
        description,
        topic,
        user: { connect: { id: userId } },
        tags: {
          connect: tagValues.map((tag) => ({ id: tag.id })),
        },
        questions: {
          create: questions.map((question) => ({
            title: question.title || "Untitled question",
            type: question.type,
            required: question.required,
            options: {
              create: question.options.map((option) => ({
                value: option.value,
              })),
            },
          })),
        },
      },
      include: {
        questions: {
          include: {
            options: true,
          },
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
