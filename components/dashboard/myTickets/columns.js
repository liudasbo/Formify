"use client";

import { ExternalLink } from "lucide-react";
import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";

export const columns = () => [
  {
    accessorKey: "summary",
    header: "Title",
    cell: ({ row }) => {
      const summary = row.getValue("summary");
      return <div className="font-medium">{summary}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");

      let badgeStyle = "bg-gray-100";
      if (status?.toLowerCase().includes("open")) badgeStyle = "bg-blue-100";
      if (status?.toLowerCase().includes("progress"))
        badgeStyle = "bg-yellow-100";
      if (
        status?.toLowerCase().includes("done") ||
        status?.toLowerCase().includes("fixed")
      )
        badgeStyle = "bg-green-100";
      if (status?.toLowerCase().includes("reject")) badgeStyle = "bg-red-100";

      return (
        <Badge variant="outline" className={badgeStyle}>
          {status || "Open"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority");

      let variant = "default";
      if (priority === "Highest" || priority === "High")
        variant = "destructive";
      if (priority === "Low" || priority === "Lowest") variant = "outline";

      return <Badge variant={variant}>{priority}</Badge>;
    },
  },
  {
    accessorKey: "jiraKey",
    header: "Ticket ID",
    cell: ({ row }) => {
      return <div className="text-xs font-mono">{row.getValue("jiraKey")}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt");
      return createdAt ? dayjs(createdAt).format("YYYY-MM-DD") : "N/A";
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const link = row.original.link;

      return (
        <div className="flex gap-2">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-xs text-blue-600 hover:underline"
          >
            View in Jira
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </div>
      );
    },
  },
];
