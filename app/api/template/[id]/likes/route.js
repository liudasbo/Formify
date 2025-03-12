import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// GET endpoint returns like status and count
export async function GET(req, { params }) {
  try {
    const { id } = params;
    const templateId = parseInt(id);

    if (isNaN(templateId)) {
      return NextResponse.json(
        { error: "Invalid template ID" },
        { status: 400 }
      );
    }

    // Get template and likes count
    const template = await db.template.findUnique({
      where: { id: templateId },
      select: {
        id: true,
        likesCount: true,
      },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Check if current user has liked the template
    const session = await getServerSession(authOptions);
    let userHasLiked = false;

    if (session?.user) {
      const userId = parseInt(session.user.id);

      const like = await db.templateLike.findUnique({
        where: {
          userId_templateId: {
            userId: userId,
            templateId: templateId,
          },
        },
      });

      userHasLiked = !!like;
    }

    return NextResponse.json({
      likesCount: template.likesCount,
      userHasLiked,
    });
  } catch (error) {
    console.error("Error getting template likes:", error);
    return NextResponse.json(
      { error: "Failed to get likes information" },
      { status: 500 }
    );
  }
}

// POST endpoint to like a template
export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to like templates" },
        { status: 401 }
      );
    }

    const { id } = params;
    const templateId = parseInt(id);
    const userId = parseInt(session.user.id);

    if (isNaN(templateId)) {
      return NextResponse.json(
        { error: "Invalid template ID" },
        { status: 400 }
      );
    }

    // Check if template exists
    const template = await db.template.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Check if user has already liked this template
    const existingLike = await db.templateLike.findUnique({
      where: {
        userId_templateId: {
          userId: userId,
          templateId: templateId,
        },
      },
    });

    if (existingLike) {
      return NextResponse.json(
        { error: "You've already liked this template" },
        { status: 400 }
      );
    }

    // Create the like and update likes count in a transaction
    const [like, _] = await db.$transaction([
      db.templateLike.create({
        data: {
          userId: userId,
          templateId: templateId,
        },
      }),
      db.template.update({
        where: { id: templateId },
        data: { likesCount: { increment: 1 } },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Template liked successfully",
      likesCount: template.likesCount + 1,
      userHasLiked: true,
    });
  } catch (error) {
    console.error("Error liking template:", error);
    return NextResponse.json(
      { error: "Failed to like template" },
      { status: 500 }
    );
  }
}

// DELETE endpoint to unlike a template
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to unlike templates" },
        { status: 401 }
      );
    }

    const { id } = params;
    const templateId = parseInt(id);
    const userId = parseInt(session.user.id);

    if (isNaN(templateId)) {
      return NextResponse.json(
        { error: "Invalid template ID" },
        { status: 400 }
      );
    }

    // Check if template exists
    const template = await db.template.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Check if like exists
    const existingLike = await db.templateLike.findUnique({
      where: {
        userId_templateId: {
          userId: userId,
          templateId: templateId,
        },
      },
    });

    if (!existingLike) {
      return NextResponse.json(
        { error: "You haven't liked this template" },
        { status: 400 }
      );
    }

    // Remove the like and decrement likes count in a transaction
    await db.$transaction([
      db.templateLike.delete({
        where: {
          userId_templateId: {
            userId: userId,
            templateId: templateId,
          },
        },
      }),
      db.template.update({
        where: { id: templateId },
        data: {
          likesCount: {
            decrement: 1,
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Template unliked successfully",
      likesCount: Math.max(0, template.likesCount - 1),
      userHasLiked: false,
    });
  } catch (error) {
    console.error("Error unliking template:", error);
    return NextResponse.json(
      { error: "Failed to unlike template" },
      { status: 500 }
    );
  }
}
