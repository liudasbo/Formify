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
import { useRouter } from "next/navigation";

export function AnswersTable({ templateId }) {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmails, setUserEmails] = useState({});
  const router = useRouter();

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/template/${templateId}/forms`);
      if (!res.ok) {
        throw new Error("Error fetching forms");
      }
      const data = await res.json();
      setForms(data);

      // Fetch user emails
      const userIds = [...new Set(data.map((form) => form.userId))];
      const userEmails = await Promise.all(
        userIds.map(async (userId) => {
          const userRes = await fetch(`/api/user/${userId}`);
          if (!userRes.ok) {
            throw new Error(`Error fetching user with ID ${userId}`);
          }
          const userData = await userRes.json();
          return { userId, email: userData.email };
        })
      );

      const userEmailsMap = userEmails.reduce((acc, { userId, email }) => {
        acc[userId] = email;
        return acc;
      }, {});

      setUserEmails(userEmailsMap);
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <Table>
      <TableCaption>A list of forms for the selected template.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Submitter</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="w-[100px]">Form ID</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {forms.map((form) => (
          <TableRow
            key={form.id}
            onClick={() => router.push(`/templates/answers/${form.id}`)}
            className="cursor-pointer"
          >
            <TableCell>{userEmails[form.userId] || "Loading..."}</TableCell>
            <TableCell>{new Date(form.createdAt).toLocaleString()}</TableCell>
            <TableCell className="font-medium">{form.id}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total Forms</TableCell>
          <TableCell className="text-right">{forms.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
