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

function AuthorEmail({ userId }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEmail() {
      try {
        const userRes = await fetch(`/api/user/${userId}`);
        if (!userRes.ok) {
          throw new Error("Error fetching user");
        }
        const userData = await userRes.json();
        setEmail(userData.email);
      } catch (error) {
        console.error("Error fetching user:", error.message);
        setEmail("Error");
      } finally {
        setLoading(false);
      }
    }
    fetchEmail();
  }, [userId]);

  return <>{loading ? "Loading..." : email}</>;
}

export const LatestTemplatesTable = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const res = await fetch("/api/template/latest");
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
        <TableCaption>A list of latest templates.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
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
              <TableCell>
                <div className="flex aspect-square size-7 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <BookText className="size-4" />
                </div>
              </TableCell>
              <TableCell>{truncateText(template.title, 30)}</TableCell>
              <TableCell className="break-words">
                {truncateText(template.description, 40)}
              </TableCell>
              <TableCell className="text-right">
                <AuthorEmail userId={template.userId} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
