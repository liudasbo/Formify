import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(req) {
  try {
    // Check authentication and admin rights
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    if (!session.user.isAdmin) {
      return NextResponse.json(
        { error: "Admin privileges required" },
        { status: 403 }
      );
    }

    // Get user IDs from request body
    const { userIds } = await req.json();

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "No valid user IDs provided" },
        { status: 400 }
      );
    }

    // Prevent admins from deleting themselves
    if (userIds.includes(session.user.id)) {
      return NextResponse.json(
        { error: "You cannot delete your own account" },
        { status: 400 }
      );
    }

    // Delete in transaction to maintain data integrity
    const deletedCount = await db.$transaction(async (tx) => {
      // First get all templates created by these users
      const userTemplates = await tx.template.findMany({
        where: {
          userId: { in: userIds },
        },
        select: { id: true },
      });

      const templateIds = userTemplates.map((t) => t.id);

      // Get all forms related to these users or their templates
      const userForms = await tx.form.findMany({
        where: {
          OR: [
            { userId: { in: userIds } },
            { templateId: { in: templateIds } },
          ],
        },
        select: { id: true },
      });

      const formIds = userForms.map((f) => f.id);

      // 1. Delete answers from all forms
      await tx.answer.deleteMany({
        where: {
          formId: { in: formIds },
        },
      });

      // 2. Delete all template likes
      await tx.templateLike.deleteMany({
        where: {
          OR: [
            { userId: { in: userIds } },
            { templateId: { in: templateIds } },
          ],
        },
      });

      // 3. Delete all forms
      await tx.form.deleteMany({
        where: {
          OR: [
            { userId: { in: userIds } },
            { templateId: { in: templateIds } },
          ],
        },
      });

      // 4. Delete all options from questions in templates
      const questions = await tx.question.findMany({
        where: {
          templateId: { in: templateIds },
        },
        select: { id: true },
      });

      const questionIds = questions.map((q) => q.id);

      await tx.options.deleteMany({
        where: {
          questionId: { in: questionIds },
        },
      });

      // 5. Delete all questions from templates
      await tx.question.deleteMany({
        where: {
          templateId: { in: templateIds },
        },
      });

      // 6. Delete all templates
      await tx.template.deleteMany({
        where: {
          userId: { in: userIds },
        },
      });

      // 7. Finally delete the users
      const result = await tx.user.deleteMany({
        where: {
          id: { in: userIds },
        },
      });

      return result.count;
    });

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${deletedCount} users`,
    });
  } catch (error) {
    console.error("Error deleting users:", error);

    return NextResponse.json(
      {
        error: "Failed to delete users",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
