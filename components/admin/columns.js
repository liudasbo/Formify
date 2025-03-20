"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const getColumns = (handleToggleAdmin, handleToggleBlock) => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "isAdmin",
    header: "Role",
    cell: ({ row }) => {
      const isAdmin = row.getValue("isAdmin");
      return (
        <Badge variant={isAdmin ? "default" : "secondary"}>
          {isAdmin ? "Admin" : "User"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isBlocked",
    header: "Status",
    cell: ({ row }) => {
      const isBlocked = row.getValue("isBlocked");

      return (
        <Badge variant={isBlocked ? "destructive" : "outline"}>
          {isBlocked ? "Blocked" : "Active"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleToggleAdmin(user.id)}
            disabled={user.isBlocked}
          >
            {user.isAdmin ? "Remove Admin" : "Make Admin"}
          </Button>

          <Button
            variant={user.isBlocked ? "outline" : "destructive"}
            size="sm"
            onClick={() => handleToggleBlock(user.id)}
          >
            {user.isBlocked ? "Unblock" : "Block"}
          </Button>
        </div>
      );
    },
  },
];
