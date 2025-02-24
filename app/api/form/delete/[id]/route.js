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
    const formId = url.pathname.split("/").pop();
    const parsedFormId = parseInt(formId, 10);

    if (isNaN(parsedFormId)) {
      return NextResponse.json({ error: "Invalid form ID" }, { status: 400 });
    }

    const existingForm = await db.form.findUnique({
      where: { id: parsedFormId },
      include: { answers: true },
    });

    if (!existingForm) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    await db.$transaction(async (tx) => {
      await tx.answer.deleteMany({
        where: { formId: parsedFormId },
      });
      await tx.form.delete({
        where: { id: parsedFormId },
      });
    });

    return NextResponse.json({ message: "Form deleted successfully!" });
  } catch (error) {
    console.error("Error deleting form:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
