"use client";

import { Trash2 } from "lucide-react";
import dayjs from "dayjs";
import { SquarePen } from "lucide-react";

export const columns = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt");
      return dayjs(createdAt).format("YYYY-MM-DD HH:mm");
    },
  },
  {
    accessorKey: "topic",
    header: "Topic",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <div className="hover:bg-muted p-2 rounded-lg">
            <Trash2 size={16} />
          </div>
          <div className="hover:bg-muted p-2 rounded-lg">
            <SquarePen size={16} />
          </div>
        </div>
      );
    },
  },
];
