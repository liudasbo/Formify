"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Shield, ShieldAlert, Lock, Unlock } from "lucide-react";
import { format } from "date-fns";

export const getColumns = (handleToggleAdmin, handleToggleBlock) => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
    cell: ({ row }) => {
      const email = row.getValue("email");
      return (
        <div className="truncate max-w-[80px] sm:max-w-[200px]">{email}</div>
      );
    },
  },
  {
    accessorKey: "isAdmin",
    header: "Role",
    cell: ({ row }) => {
      const user = row.original;
      const isAdmin = user.isAdmin;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={user.isBlocked}>
            <Button
              variant="outline"
              size="sm"
              className="h-8 flex items-center gap-1 font-normal"
            >
              {isAdmin ? "Admin" : "User"}

              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={() => handleToggleAdmin(user.id)}
              className="flex items-center gap-2"
              disabled={user.isBlocked}
            >
              {isAdmin ? (
                <>
                  <Shield className="h-4 w-4" />
                  <span>Change to User</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="h-4 w-4" />
                  <span>Make Admin</span>
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "isBlocked",
    header: "Status",
    cell: ({ row }) => {
      const user = row.original;
      const isBlocked = user.isBlocked;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 flex items-center gap-1 font-normal"
            >
              {isBlocked ? (
                <span className="text-destructive">Blocked</span>
              ) : (
                <span>Active</span>
              )}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={() => handleToggleBlock(user.id)}
              className="flex items-center gap-2"
            >
              {isBlocked ? (
                <>
                  <Unlock className="h-4 w-4" />
                  <span>Unblock User</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Block User</span>
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <span className="hidden lg:inline">Joined</span>,
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="hidden lg:block text-muted-foreground">
          {format(date, "MMM d, yyyy HH:mm")}
        </div>
      );
    },
  },
];
