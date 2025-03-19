"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format, formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { User, Calendar, Clock, Inbox, Mail, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AnswersTable({ templateId }) {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/template/${templateId}/forms`);
      if (!res.ok) {
        throw new Error("Error fetching forms");
      }
      const data = await res.json();
      setForms(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [templateId]);

  // Loading state with skeletons
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Form Submissions</CardTitle>
          <CardDescription>Loading submission data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-500">
            Error Loading Submissions
          </CardTitle>
          <CardDescription>
            There was a problem retrieving the form submissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (forms.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Form Submissions</CardTitle>
          <CardDescription>No submissions yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-40 border rounded-md bg-muted/30">
            <Inbox className="h-10 w-10 text-muted mb-2" />
            <p className="text-muted-foreground">
              No form submissions available yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Submissions will appear here once users complete your form
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Submissions</CardTitle>
        <CardDescription>View all responses for your template</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60%]">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Submitter
                </div>
              </TableHead>
              <TableHead className="w-[40%]">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Last Edited
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forms.map((form) => {
              // Get initials for avatar fallback
              const name = form.user?.name || "";
              const initials = name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

              // Use updatedAt if available, otherwise fallback to createdAt
              const lastEditedDate = form.updatedAt || form.createdAt;

              return (
                <TableRow
                  key={form.id}
                  onClick={() => router.push(`/templates/answers/${form.id}`)}
                  className="cursor-pointer hover:bg-muted/50 group"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={form.user?.image}
                          alt={form.user?.name || "User"}
                        />
                        <AvatarFallback>
                          {initials || <User size={14} />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {form.user?.name || "Anonymous User"}
                        </span>
                        {form.user?.email && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {form.user.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {format(new Date(lastEditedDate), "MMM d, yyyy")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(lastEditedDate), "HH:mm")} ·{" "}
                          {formatDistanceToNow(new Date(lastEditedDate), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Total Submissions</TableCell>
              <TableCell className="text-right">{forms.length}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}
