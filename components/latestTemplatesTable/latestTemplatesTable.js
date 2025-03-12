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
import { BookText } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export const LatestTemplatesTable = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const isMobile = useIsMobile();

  console.log(isMobile);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const res = await fetch("/api/template");
        if (!res.ok) {
          throw new Error("Error fetching templates");
        }
        const data = await res.json();
        setTemplates(data);
      } catch (err) {
        console.error("Error fetching templates:", err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTemplates();
  }, []);

  function handleRowClick(templateId) {
    router.push(`/form/${templateId}`);
  }

  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            {isMobile ? null : <TableHead>Description</TableHead>}
            <TableHead className="text-right">Author</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.slice(0, 5).map((template) => (
            <TableRow
              onClick={() => handleRowClick(template.id)}
              key={template.id}
              className="cursor-pointer"
            >
              <TableCell>{truncateText(template.title, 30)}</TableCell>
              {isMobile ? null : (
                <TableCell className="break-words">
                  {truncateText(template.description, 40)}
                </TableCell>
              )}
              <TableCell className="text-right">
                {template.user.email}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
