"use client";

import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function MyTickets() {
  const { data: session, status } = useSession();
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  const fetchTickets = async (page = 1) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("Fetching tickets, page:", page);

      if (status !== "authenticated") {
        throw new Error("You must be logged in to view tickets");
      }

      const res = await fetch(
        `/api/jira?page=${page}&limit=${pagination.limit}`
      );

      const responseText = await res.text();

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Invalid JSON response:", responseText);
        throw new Error("Server returned invalid response format");
      }

      if (!res.ok) {
        console.error("API Error:", data);
        throw new Error(data.error || "Failed to fetch tickets");
      }

      if (!Array.isArray(data.tickets)) {
        console.error("Unexpected response format:", data);
        throw new Error("Invalid ticket data received from server");
      }

      console.log(`Received ${data.tickets.length} tickets`);
      setTickets(data.tickets);
      setPagination(data.pagination || pagination);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError(err.message);
      toast.error(`Failed to fetch tickets: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchTickets();
    } else if (status === "unauthenticated") {
      setError("You must be logged in to view tickets");
      setIsLoading(false);
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Checking authentication...</span>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
        You must be logged in to view your tickets.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin" size={16} />
        <p className="ml-2 text-sm">Loading tickets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error loading tickets:</p>
          <p>{error}</p>
        </div>
        <Button
          onClick={() => fetchTickets(pagination.page)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" /> Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm font-bold">My Support Tickets</p>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => fetchTickets(pagination.page)}
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {tickets.length > 0 ? (
        <>
          <DataTable columns={columns()} data={tickets} />

          {pagination.pages > 1 && (
            <div className="flex justify-center mt-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchTickets(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>

                <span className="text-sm">
                  Page {pagination.page} of {pagination.pages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchTickets(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 border rounded-lg bg-gray-50">
          <p className="text-muted-foreground">
            You haven created any support tickets yet.
          </p>
        </div>
      )}
    </div>
  );
}
