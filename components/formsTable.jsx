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
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { BookText, Calendar, Search, User, Star, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const FormsTable = ({
  emptyMessage = "No forms found",
  emptySearchMessage = "No forms matching your search",
  enableSearch = false,
  enableResponsive = true,
  showAuthorEmail = false,
  showDescription = true,
  showCreatedAt = true,
  showLikes = false,
  showTopic = false,
  sortBy = null, // 'latest', 'likes', etc.
  limitTo = 5,
  className = "",
}) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [topicFilter, setTopicFilter] = useState("all"); // Filter by topic
  const router = useRouter();
  const isMobile = useIsMobile();

  // Get readable topic name
  const getTopicName = (topicValue) => {
    switch (topicValue) {
      case "education":
        return "Education";
      case "quiz":
        return "Quiz";
      case "feedback":
        return "Feedback";
      case "survey":
        return "Survey";
      case "application":
        return "Application";
      default:
        return "Other";
    }
  };

  // Get all available topics for filter
  const getAvailableTopics = () => {
    const topicSet = new Set(
      templates.map((template) => template.topic || "other")
    );
    return Array.from(topicSet);
  };

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
    // Filter by likes
    if (showLikes && (!template.likesCount || template.likesCount <= 0)) {
      return false;
    }

    // Filter by topic if topic filter is active
    if (topicFilter !== "all" && template.topic !== topicFilter) {
      return false;
    }

    // Filter by search term
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
      <div className="flex flex-col items-center justify-center p-12 border rounded-md bg-muted/10">
        <h3 className="text-lg font-bold">{emptyMessage}</h3>
        <p className="text-sm text-muted-foreground">
          Templates will appear here once created.
        </p>
      </div>
    );
  }

  // Get unique topics from templates
  const availableTopics = getAvailableTopics();

  return (
    <div className={className}>
      {enableSearch && (
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center mb-4">
          {/* Search field */}
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search forms..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Topic filter */}
          {showTopic && (
            <div className="flex items-center gap-2">
              <Select value={topicFilter} onValueChange={setTopicFilter}>
                <SelectTrigger className="w-[140px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-3.5 w-3.5" />
                    <SelectValue placeholder="Filter by topic" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All topics</SelectItem>
                  {availableTopics.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {getTopicName(topic)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}

      {filteredTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 border rounded-md bg-muted/10">
          <h3 className="text-lg font-medium">
            {showLikes
              ? "No liked templates found"
              : topicFilter !== "all"
              ? `No ${getTopicName(topicFilter).toLowerCase()} forms found`
              : emptySearchMessage}
          </h3>
          <p className="text-sm text-muted-foreground">
            {showLikes
              ? "Templates with likes will appear here."
              : topicFilter !== "all"
              ? "Try changing your filter or search term."
              : "Try adjusting your search term."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-full max-w-[30%]">Title</TableHead>
                {showLikes && (
                  <TableHead className="text-center w-[10%]">Likes</TableHead>
                )}
                {showTopic && <TableHead className="w-[12%]">Topic</TableHead>}
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
              {filteredTemplates
                .slice(0, limitTo < 0 ? undefined : limitTo)
                .map((template) => {
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

                      {showTopic && (
                        <TableCell>
                          {template.topic ? (
                            <Badge variant="secondary" className="font-normal">
                              {getTopicName(template.topic)}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">Other</span>
                          )}
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
