import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import jsforce from "jsforce";

const conn = new jsforce.Connection();

async function loginToSalesforce() {
  try {
    await conn.login(
      process.env.SALESFORCE_USERNAME,
      process.env.SALESFORCE_PASSWORD + process.env.SALESFORCE_SECURITY_TOKEN
    );
    console.log("Salesforce login successful");
  } catch (error) {
    console.error("Salesforce login error details:", error);
    throw new Error("Error logging into Salesforce");
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: parseInt(userId, 10) },
      select: {
        salesforceAccountId: true,
        salesforceContactId: true,
        isSyncedWithSalesforce: true,
      },
    });

    if (!user || !user.isSyncedWithSalesforce) {
      return NextResponse.json(
        { error: "User is not synced with Salesforce" },
        { status: 404 }
      );
    }

    await loginToSalesforce();

    try {
      if (user.salesforceContactId) {
        await conn.sobject("Contact").destroy(user.salesforceContactId);
        console.log(`Deleted Contact: ${user.salesforceContactId}`);
      }

      if (user.salesforceAccountId) {
        await conn.sobject("Account").destroy(user.salesforceAccountId);
        console.log(`Deleted Account: ${user.salesforceAccountId}`);
      }
    } catch (sfError) {
      console.error("Error deleting from Salesforce:", sfError);
    }

    await db.user.update({
      where: { id: parseInt(userId, 10) },
      data: {
        salesforceAccountId: null,
        salesforceContactId: null,
        isSyncedWithSalesforce: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Successfully unlinked from Salesforce",
    });
  } catch (error) {
    console.error("Error unlinking from Salesforce:", error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Server error. Please try again later.",
      },
      { status: 500 }
    );
  }
}
