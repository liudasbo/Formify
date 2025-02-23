import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { templateId } = params;
    const parsedTemplateId = parseInt(templateId, 10);
    if (isNaN(parsedTemplateId)) {
      return NextResponse.json(
        { error: "Invalid template ID" },
        { status: 400 }
      );
    }

    const data = await req.json();
    const { title, description, topic, tags, questions } = data;

    const existingTemplate = await db.template.findUnique({
      where: { id: parsedTemplateId },
      include: { tags: true, questions: { include: { options: true } } },
    });
    if (!existingTemplate) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    const tagOperations = await Promise.all(
      tags.map(async (tag) => {
        const existingTag = tag.id
          ? await db.tags.findUnique({ where: { id: tag.id } })
          : await db.tags.findFirst({ where: { label: tag.label } });
        if (!existingTag) {
          return db.tags.create({ data: { label: tag.label } });
        }
        return { id: existingTag.id };
      })
    );

    await db.template.update({
      where: { id: parsedTemplateId },
      data: {
        title,
        description,
        topic,
        tags: { set: tagOperations },
      },
    });

    const questionIdMap = {};
    for (const question of questions) {
      let questionRecord;

      if (
        question.id &&
        existingTemplate.questions.some((q) => q.id === question.id)
      ) {
        questionRecord = await db.question.update({
          where: { id: question.id },
          data: {
            title: question.title,
            required: question.required,
            type: question.type,
          },
        });

        questionIdMap[question.id] = questionRecord.id;
      } else {
        questionRecord = await db.question.create({
          data: {
            title: question.title,
            type: question.type,
            required: question.required,
            template: { connect: { id: parsedTemplateId } },
          },
        });

        questionIdMap[question.id || question.tempId || questionRecord.id] =
          questionRecord.id;
      }
    }

    for (const question of questions) {
      const realQuestionId =
        questionIdMap[question.id || question.tempId || question.id];
      if (!realQuestionId) continue;

      const existingQuestion = existingTemplate.questions.find(
        (q) => q.id === question.id
      );
      const existingOptionsIds = existingQuestion
        ? existingQuestion.options.map((opt) => opt.id)
        : [];

      const incomingOptionsIds = question.options
        .filter((opt) => opt.id)
        .map((opt) => opt.id);

      const optionsToDelete = existingOptionsIds.filter(
        (id) => !incomingOptionsIds.includes(id)
      );

      for (const option of question.options) {
        if (option.id && existingOptionsIds.includes(option.id)) {
          await db.options.update({
            where: { id: option.id },
            data: {
              value: option.value,
            },
          });
        } else {
          await db.options.create({
            data: {
              value: option.value,
              question: { connect: { id: realQuestionId } },
            },
          });
        }
      }

      if (optionsToDelete.length > 0) {
        await db.options.deleteMany({
          where: { id: { in: optionsToDelete } },
        });
      }
    }

    const existingQuestionIds = existingTemplate.questions.map((q) => q.id);
    const incomingQuestionIds = questions.filter((q) => q.id).map((q) => q.id);
    const questionsToDelete = existingQuestionIds.filter(
      (id) => !incomingQuestionIds.includes(id)
    );
    if (questionsToDelete.length > 0) {
      await db.question.deleteMany({
        where: { id: { in: questionsToDelete } },
      });
    }

    return NextResponse.json({
      message: "Template updated successfully!",
    });
  } catch (error) {
    console.error("Error updating template:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
