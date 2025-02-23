"use client";

import { Trash2 } from "lucide-react";
import dayjs from "dayjs";
import { SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";

export const columns = (refreshData) => [
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
      const router = useRouter();

      const handleDelete = async () => {
        const id = row.original.id;
        await fetch(`/api/templates/delete/${id}`, {
          method: "DELETE",
        });
        refreshData();
      };

      return (
        <div className="flex gap-2">
          <div
            onClick={handleDelete}
            className="hover:bg-muted p-2 rounded-lg cursor-pointer"
          >
            <Trash2 size={16} />
          </div>

          <div
            onClick={() => router.push(`/templates/edit/${row.original.id}`)}
            className="hover:bg-muted p-2 rounded-lg cursor-pointer  "
          >
            <SquarePen size={16} />
          </div>
        </div>
      );
    },
  },
];
