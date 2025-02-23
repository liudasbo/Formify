import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { templateId } = await params;
    const parsedTemplateId = parseInt(templateId, 10);

    if (isNaN(parsedTemplateId)) {
      return NextResponse.json(
        { error: "Invalid template ID" },
        { status: 400 }
      );
    }

    // Patikriname, ar šablonas egzistuoja
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

    // Surenkame visus klausimų ID
    const questionIds = existingTemplate.questions.map((q) => q.id);

    // Pradėsime transakciją, kad užtikrintume vientisumą
    await db.$transaction([
      // 1. Ištriname variantus (options)
      db.options.deleteMany({
        where: { questionId: { in: questionIds } },
      }),
      // 2. Ištriname klausimus (questions)
      db.question.deleteMany({
        where: { id: { in: questionIds } },
      }),
      // 3. Ištriname patį šabloną (template)
      db.template.delete({
        where: { id: parsedTemplateId },
      }),
    ]);

    return NextResponse.json({ message: "Template deleted successfully!" });
  } catch (error) {
    console.error("Error deleting template:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
