import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const templateId = url.pathname.split("/").pop();
    const parsedTemplateId = parseInt(templateId, 10);

    if (isNaN(parsedTemplateId)) {
      return NextResponse.json(
        { error: "Invalid template ID" },
        { status: 400 }
      );
    }

    const existingTemplate = await db.template.findUnique({
      where: { id: parsedTemplateId },
      include: { questions: { include: { options: true } } },
    });

    if (!existingTemplate) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    const questionIds = existingTemplate.questions.map((q) => q.id);

    const forms = await db.form.findMany({
      where: { templateId: parsedTemplateId },
    });
    const formIds = forms.map((form) => form.id);

    await db.$transaction(async (tx) => {
      await tx.answer.deleteMany({
        where: { formId: { in: formIds } },
      });
      await tx.form.deleteMany({
        where: { id: { in: formIds } },
      });
      await tx.options.deleteMany({
        where: { questionId: { in: questionIds } },
      });
      await tx.question.deleteMany({
        where: { id: { in: questionIds } },
      });
      await tx.template.delete({
        where: { id: parsedTemplateId },
      });
    });

    return NextResponse.json({ message: "Template deleted successfully!" });
  } catch (error) {
    console.error("Error deleting template:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
