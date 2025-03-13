"use client";

import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
}

export const columns = (refreshData) => [
  {
    accessorKey: "template.title",
    header: "Title",
    cell: ({ row }) => {
      const title = row.original.template.title;
      return <span title={title}>{truncateText(title, 20)}</span>;
    },
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
    accessorKey: "template.userId",
    header: "Author",
    cell: ({ row }) => {
      const [author, setAuthor] = useState(null);
      const userId = row.original.template.userId;

      useEffect(() => {
        const fetchAuthor = async () => {
          try {
            const res = await fetch(`/api/user/${userId}`);
            if (!res.ok) {
              throw new Error("Error fetching author");
            }
            const data = await res.json();
            setAuthor(data.name);
          } catch (err) {
            console.error("Error fetching author:", err.message);
          }
        };

        fetchAuthor();
      }, [userId]);

      return author || "Loading...";
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const router = useRouter();

      const handleDelete = async () => {
        const id = row.original.id;

        try {
          const res = await fetch(`/api/form/delete/${id}`, {
            method: "DELETE",
          });
          if (res.ok) {
            refreshData();
            toast.success("Form deleted successfully");
          } else {
            console.error("Failed to delete form");
            toast.error("Failed to delete form");
          }
        } catch (error) {
          console.error("Error deleting form:", error);
          toast.error("Error deleting form");
        }
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
            onClick={() => router.push(`/form/${row.original.template.id}`)}
            className="hover:bg-muted p-2 rounded-lg cursor-pointer"
          >
            <SquarePen size={16} />
          </div>
        </div>
      );
    },
  },
];
