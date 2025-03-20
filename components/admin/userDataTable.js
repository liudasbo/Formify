"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getColumns } from "./columns";
import { DataTable } from "./data-table";
import Loading from "../Loading";

export function UserDataTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/users");

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error.message);
        toast.error("Error loading users", {
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleAdmin = async (userId) => {
    try {
      const response = await fetch(`/api/user/${userId}/role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update admin status");
      }

      const updatedUser = await response.json();

      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, isAdmin: updatedUser.isAdmin } : user
        )
      );

      toast.success("Success", {
        description: `User role changed to ${
          updatedUser.isAdmin ? "admin" : "user"
        }`,
      });
    } catch (error) {
      console.error("Error toggling admin status:", error);
      toast.error("Error updating user", {
        description: error.message,
      });
    }
  };

  const handleToggleBlock = async (userId) => {
    try {
      const response = await fetch(`/api/user/${userId}/block`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update block status");
      }

      const updatedUser = await response.json();

      setUsers(
        users.map((user) =>
          user.id === userId
            ? { ...user, isBlocked: updatedUser.isBlocked }
            : user
        )
      );

      toast.success("Success", {
        description: `User has been ${
          updatedUser.isBlocked ? "blocked" : "unblocked"
        }`,
      });
    } catch (error) {
      console.error("Error toggling block status:", error);
      toast.error("Error updating user", {
        description: error.message,
      });
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-destructive">
        <p>Error loading users: {error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  const columns = getColumns(handleToggleAdmin, handleToggleBlock);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Users ({users.length})</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <DataTable columns={columns} data={filteredUsers} />
    </div>
  );
}
