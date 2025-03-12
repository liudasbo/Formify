"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

export const MostLikedTemplatesTable = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const isMobile = useIsMobile();

  useEffect(() => {
    async function fetchMostLikedTemplates() {
      try {
        const res = await fetch("/api/template");
        if (!res.ok) {
          throw new Error("Error fetching templates");
        }
        const data = await res.json();

        // Sort templates by likesCount (descending)
        const sortedTemplates = data
          .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
          .slice(0, 5); // Get top 5

        setTemplates(sortedTemplates);
      } catch (err) {
        console.error("Error fetching templates:", err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMostLikedTemplates();
  }, []);

  function handleRowClick(templateId) {
    router.push(`/form/${templateId}`);
  }

  function truncateText(text, maxLength) {
    if (!text) return "";
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No liked templates found yet.
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead className="text-center">Likes</TableHead>
            <TableHead className="text-right">Author</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => (
            <TableRow
              onClick={() => handleRowClick(template.id)}
              key={template.id}
              className="cursor-pointer"
            >
              <TableCell>{truncateText(template.title, 30)}</TableCell>
              <TableCell className="items-center justify-center text-center flex gap-1">
                {template.likesCount || 0}
                <Star fill="yellow" size={16} />
              </TableCell>
              <TableCell className="text-right">
                {template.user?.email || "Unknown"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MostLikedTemplatesTable;
