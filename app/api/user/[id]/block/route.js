import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!session.user.isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    if (userId === parseInt(session.user.id)) {
      return NextResponse.json(
        { error: "You cannot block yourself" },
        { status: 400 }
      );
    }

    const existingUser = await db.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Toggle block status
    const newBlockStatus = !existingUser.isBlocked;

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { isBlocked: newBlockStatus },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        isBlocked: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error toggling block status:", error);
    return NextResponse.json(
      { error: "Failed to update block status" },
      { status: 500 }
    );
  }
}
