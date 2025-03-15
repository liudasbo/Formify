"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  BookText,
  Calendar,
  Search,
  User,
  Loader2,
  Star,
  ThumbsUp,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

export const TemplatesTable = ({
  title = "Templates",
  emptyMessage = "No templates found",
  emptySearchMessage = "No templates matching your search",
  enableSearch = false,
  enableResponsive = true,
  showAuthorEmail = false,
  showDescription = true,
  showCreatedAt = true,
  showLikes = false,
  sortBy = null, // 'latest', 'likes', etc.
  limitTo = 5,
  className = "",
}) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const isMobile = useIsMobile();

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const res = await fetch("/api/template");
        if (!res.ok) {
          throw new Error("Error fetching templates");
        }
        let data = await res.json();

        // Sort the templates based on the sortBy prop
        if (sortBy === "latest") {
          data = data.sort(
            (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
          );
        } else if (sortBy === "likes") {
          data = data.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
        }

        setTemplates(data);
      } catch (err) {
        console.error("Error fetching templates:", err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTemplates();
  }, [sortBy]);

  function handleRowClick(templateId) {
    router.push(`/form/${templateId}`);
  }

  const filteredTemplates = templates.filter((template) => {
    if (showLikes && (!template.likesCount || template.likesCount <= 0)) {
      return false;
    }

    return !enableSearch || !searchTerm
      ? true
      : template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (template.description &&
            template.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()));
  });

  // Render loading skeletons
  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center pb-4">
          <Skeleton className="h-8 w-[250px]" />
        </div>
        <div className="space-y-2">
          {[...Array(1)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render empty state
  if (templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border rounded-md bg-muted/10">
        <BookText className="h-10 w-10 text-muted mb-2" />
        <h3 className="text-lg font-medium">{emptyMessage}</h3>
        <p className="text-sm text-muted-foreground">
          Templates will appear here once created.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {enableSearch && (
        <div className="flex items-center mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      {filteredTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 border rounded-md bg-muted/10">
          <ThumbsUp className="h-10 w-10 text-muted mb-2" />
          <h3 className="text-lg font-medium">
            {showLikes ? "No liked templates found" : emptySearchMessage}
          </h3>
          <p className="text-sm text-muted-foreground">
            {showLikes
              ? "Templates with likes will appear here."
              : "Try adjusting your search term."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[25%] min-w-[150px]">Title</TableHead>
                {showLikes && (
                  <TableHead className="text-center w-[10%]">Likes</TableHead>
                )}
                {showDescription && enableResponsive && !isMobile && (
                  <TableHead className="w-[35%]">Description</TableHead>
                )}
                {showCreatedAt && enableResponsive && !isMobile && (
                  <TableHead className="w-[15%]">Created</TableHead>
                )}
                <TableHead className="w-[15%] min-w-[120px]">
                  {showAuthorEmail ? "Email" : "Author"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.slice(0, limitTo).map((template) => {
                // Extract first name for cleaner display
                const authorName =
                  template.user?.name || template.user?.email || "Unknown";
                const firstName = authorName.split(" ")[0];

                return (
                  <TableRow
                    key={template.id}
                    className="group hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleRowClick(template.id)}
                  >
                    <TableCell className="font-medium max-w-32">
                      <div className="flex items-center gap-2">
                        <BookText className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="truncate break-all">
                          {template.title}
                        </div>
                      </div>
                    </TableCell>

                    {showLikes && (
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span>{template.likesCount || 0}</span>
                          <Star fill="yellow" size={14} />
                        </div>
                      </TableCell>
                    )}

                    {showDescription && enableResponsive && !isMobile && (
                      <TableCell className="text-muted-foreground">
                        <div className="line-clamp-2 break-all">
                          {template.description}
                        </div>
                      </TableCell>
                    )}

                    {showCreatedAt && enableResponsive && !isMobile && (
                      <TableCell className="text-muted-foreground">
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          {template.createdAt
                            ? format(
                                new Date(template.createdAt),
                                "MMM d, yyyy"
                              )
                            : "Recently"}
                        </div>
                      </TableCell>
                    )}

                    <TableCell className="max-w-0 w-full">
                      <div className="flex items-center gap-1 overflow-hidden">
                        <User className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate">
                          {showAuthorEmail ? template.user?.email : firstName}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
