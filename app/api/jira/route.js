import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const JIRA_DOMAIN = process.env.JIRA_DOMAIN;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY;

async function getIssueTypes() {
  try {
    const response = await fetch(
      `https://${JIRA_DOMAIN}.atlassian.net/rest/api/3/issue/createmeta?projectKeys=${JIRA_PROJECT_KEY}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${JIRA_EMAIL}:${JIRA_API_TOKEN}`
          ).toString("base64")}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    return data.projects[0]?.issuetypes;
  } catch (error) {
    return null;
  }
}

async function findJiraUser(email) {
  try {
    const response = await fetch(
      `https://${JIRA_DOMAIN}.atlassian.net/rest/api/3/user/search?query=${encodeURIComponent(
        email
      )}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${JIRA_EMAIL}:${JIRA_API_TOKEN}`
          ).toString("base64")}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) return null;

    const users = await response.json();
    const exactMatch = users.find(
      (user) => user.emailAddress?.toLowerCase() === email.toLowerCase()
    );

    return exactMatch
      ? {
          accountId: exactMatch.accountId,
          displayName: exactMatch.displayName,
        }
      : null;
  } catch (error) {
    return null;
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { summary, description, priority, pageUrl, templateName } =
      await req.json();
    if (!summary) {
      return NextResponse.json(
        { error: "Summary is required" },
        { status: 400 }
      );
    }

    if (!JIRA_API_TOKEN || !JIRA_EMAIL || !JIRA_DOMAIN || !JIRA_PROJECT_KEY) {
      return NextResponse.json(
        { error: "Jira API configuration is incomplete" },
        { status: 500 }
      );
    }

    const issueTypes = await getIssueTypes();
    let issueTypeName = "Task";

    if (issueTypes?.length > 0) {
      const preferredTypes = ["Service Request", "Incident", "Task", "Problem"];

      const foundType = preferredTypes.find((type) =>
        issueTypes.some((t) => t.name === type)
      );

      issueTypeName = foundType || issueTypes[0].name;
    }

    const jiraUser = await findJiraUser(session.user.email);
    const reporterFound = !!jiraUser;

    const fullDescription = {
      version: 1,
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: description ? [{ type: "text", text: description }] : [],
        },
        { type: "rule" },
        {
          type: "heading",
          attrs: { level: 3 },
          content: [{ type: "text", text: "Reporter information" }],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Reporter Status: ",
                      marks: [{ type: "strong" }],
                    },
                    {
                      type: "text",
                      text: reporterFound
                        ? `Jira user found (${jiraUser.displayName})`
                        : "Jira user not found",
                    },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Name: ",
                      marks: [{ type: "strong" }],
                    },
                    { type: "text", text: session.user.name || "N/A" },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Email: ",
                      marks: [{ type: "strong" }],
                    },
                    { type: "text", text: session.user.email },
                  ],
                },
              ],
            },
            ...(templateName
              ? [
                  {
                    type: "listItem",
                    content: [
                      {
                        type: "paragraph",
                        content: [
                          {
                            type: "text",
                            text: "Template: ",
                            marks: [{ type: "strong" }],
                          },
                          { type: "text", text: templateName },
                        ],
                      },
                    ],
                  },
                ]
              : []),
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Page URL: ",
                      marks: [{ type: "strong" }],
                    },
                    { type: "text", text: pageUrl || "N/A" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const priorityMap = {
      High: "Highest",
      Medium: "Medium",
      Average: "Medium",
      Low: "Low",
    };

    const ticketData = {
      fields: {
        project: { key: JIRA_PROJECT_KEY },
        summary,
        description: fullDescription,
        issuetype: { name: issueTypeName },
        priority: {
          name: priorityMap[priority] || "Medium",
        },
        ...(jiraUser ? { reporter: { id: jiraUser.accountId } } : {}),
        labels: [
          `user-${session.user.email.replace("@", "-at-")}`,
          templateName
            ? `template-${templateName.replace(/\s+/g, "-").toLowerCase()}`
            : null,
          reporterFound ? "reporter-found" : "reporter-not-found",
        ].filter(Boolean),
      },
    };

    const jiraResponse = await fetch(
      `https://${JIRA_DOMAIN}.atlassian.net/rest/api/3/issue`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${JIRA_EMAIL}:${JIRA_API_TOKEN}`
          ).toString("base64")}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticketData),
      }
    );

    const responseText = await jiraResponse.text();

    let jiraData;
    try {
      jiraData = JSON.parse(responseText);
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid response from Jira" },
        { status: 500 }
      );
    }

    if (!jiraResponse.ok) {
      return NextResponse.json(
        {
          error:
            jiraData.errorMessages?.join(", ") ||
            Object.values(jiraData.errors || {}).join(", ") ||
            "Failed to create Jira ticket",
        },
        { status: jiraResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      ticket: {
        jiraKey: jiraData.key,
        summary,
        status: "Open",
        priority,
        template: templateName,
        link: `https://${JIRA_DOMAIN}.atlassian.net/browse/${jiraData.key}`,
        reporterSet: reporterFound,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to create ticket" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    if (!JIRA_API_TOKEN || !JIRA_EMAIL || !JIRA_DOMAIN || !JIRA_PROJECT_KEY) {
      return NextResponse.json(
        { error: "Jira API configuration is incomplete" },
        { status: 500 }
      );
    }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const startAt = (page - 1) * limit;

    const emailLabel = `user-${session.user.email.replace("@", "-at-")}`;
    const jql = `project = ${JIRA_PROJECT_KEY} AND (labels = "${emailLabel}" OR text ~ "${session.user.email}")`;

    const searchUrl = `https://${JIRA_DOMAIN}.atlassian.net/rest/api/3/search?jql=${encodeURIComponent(
      jql
    )}&startAt=${startAt}&maxResults=${limit}`;

    const jiraResponse = await fetch(searchUrl, {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${JIRA_EMAIL}:${JIRA_API_TOKEN}`
        ).toString("base64")}`,
        Accept: "application/json",
      },
    });

    if (!jiraResponse.ok) {
      const errorText = await jiraResponse.text();

      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        return NextResponse.json(
          {
            error: `Invalid response from Jira: ${errorText.substring(0, 100)}`,
          },
          { status: jiraResponse.status }
        );
      }

      return NextResponse.json(
        {
          error:
            errorData.errorMessages?.join(", ") || "Failed to fetch tickets",
        },
        { status: jiraResponse.status }
      );
    }

    const data = await jiraResponse.json();

    const tickets = data.issues.map((issue) => ({
      id: issue.id,
      jiraKey: issue.key,
      summary: issue.fields.summary,
      status: issue.fields.status?.name || "Open",
      priority: issue.fields.priority?.name || "Medium",
      createdAt: issue.fields.created,
      updatedAt: issue.fields.updated,
      link: `https://${JIRA_DOMAIN}.atlassian.net/browse/${issue.key}`,
      reporter: issue.fields.reporter
        ? {
            name: issue.fields.reporter.displayName,
            email: issue.fields.reporter.emailAddress,
            accountId: issue.fields.reporter.accountId,
          }
        : null,
    }));

    return NextResponse.json({
      tickets,
      pagination: {
        total: data.total,
        page,
        limit,
        pages: Math.ceil(data.total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}
