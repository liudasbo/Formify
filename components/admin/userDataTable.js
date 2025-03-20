"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getColumns } from "./columns";
import { DataTable } from "./data-table";
import Loading from "../Loading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function UserDataTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

  const handleDelete = async () => {
    // Check if any users are selected
    if (Object.keys(rowSelection).length === 0) {
      toast.error("No users selected");
      return;
    }

    try {
      setIsDeleting(true);
      // Get the IDs of selected users
      const selectedUserIds = Object.keys(rowSelection).map(
        (index) => filteredUsers[parseInt(index)].id
      );

      // Call the API to delete the selected users
      const response = await fetch("/api/users/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userIds: selectedUserIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete users");
      }

      // Remove the deleted users from the state
      const updatedUsers = users.filter(
        (user) => !selectedUserIds.includes(user.id)
      );
      setUsers(updatedUsers);
      setRowSelection({}); // Clear selection

      toast.success("Success", {
        description: `${selectedUserIds.length} user(s) deleted successfully`,
      });
    } catch (error) {
      console.error("Error deleting users:", error);
      toast.error("Error deleting users", {
        description: error.message,
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCount = Object.keys(rowSelection).length;

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
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <Input
          className="w-auto text-sm"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div>
          <Button
            variant="outline"
            onClick={() => setShowDeleteDialog(true)}
            disabled={selectedCount === 0}
          >
            <Trash2 />
            Delete {selectedCount > 0 ? `(${selectedCount})` : ""}
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={filteredUsers}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action will permanently delete {selectedCount} user(s) and
              cannot be undone. All associated data will also be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
