import { NextResponse } from "next/server";
import jsforce from "jsforce";
import { db } from "@/lib/db";

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

export async function POST(req) {
  try {
    const {
      accountName,
      contactFirstName,
      contactLastName,
      contactEmail,
      contactPhone,
      contactTitle,
      userId,
    } = await req.json();

    if (
      !accountName ||
      !contactFirstName ||
      !contactLastName ||
      !contactEmail
    ) {
      return NextResponse.json(
        { error: "Some required fields are missing" },
        { status: 400 }
      );
    }

    await loginToSalesforce();

    const account = await conn.sobject("Account").create({
      Name: accountName,
    });

    const contact = await conn.sobject("Contact").create({
      FirstName: contactFirstName,
      LastName: contactLastName,
      Email: contactEmail,
      Phone: contactPhone,
      Title: contactTitle,
      AccountId: account.id,
    });

    if (userId) {
      try {
        await db.user.update({
          where: { id: parseInt(userId, 10) },
          data: {
            salesforceAccountId: account.id,
            salesforceContactId: contact.id,
            isSyncedWithSalesforce: true,
          },
        });
        console.log(`User ${userId} synced with Salesforce`);
      } catch (prismaError) {
        console.error("Error updating user record:", prismaError.message);
      }
    }

    return NextResponse.json({ account, contact });
  } catch (error) {
    console.error("Error creating account and contact:", error.message);
    return NextResponse.json(
      { error: error.message || "Server error. Please try again later." },
      { status: 500 }
    );
  }
}

export async function GET(req) {
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
      return NextResponse.json({
        isSynced: false,
        message: "User is not synced with Salesforce",
      });
    }

    await loginToSalesforce();

    const [account, contact] = await Promise.all([
      conn.sobject("Account").retrieve(user.salesforceAccountId),
      conn.sobject("Contact").retrieve(user.salesforceContactId),
    ]);

    return NextResponse.json({ isSynced: true, account, contact });
  } catch (error) {
    console.error("Error fetching Salesforce data:", error.message);
    return NextResponse.json(
      { error: error.message || "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
