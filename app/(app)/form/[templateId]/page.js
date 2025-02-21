"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FormQuestionItem from "@/components/form/formQuestionItem";

export default function Form() {
  const params = useParams();
  const id = params.templateId;

  const [form, setForm] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchForm() {
      try {
        setLoading(true);
        const res = await fetch(`/api/form/${id}`);
        if (!res.ok) {
          throw new Error("Error fetching form");
        }
        const data = await res.json();
        setForm(data);

        const userRes = await fetch(`/api/user/${data.userId}`);
        if (!userRes.ok) {
          throw new Error("Error fetching user");
        }
        const userData = await userRes.json();
        setAuthor(userData);
      } catch (err) {
        console.error("Error", err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchForm();
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!form) return <p>Not found</p>;

  return (
    <div>
      <div className="border p-6 rounded-lg flex flex-col gap-5">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          {form.title}
        </h2>
        <p className="pt-2">{form.description}</p>
        <p>Topic: {form.topic}</p>
        <div className="flex gap-2">
          {form.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>

        <p>Author: {author.email}</p>

        <div className="border-t pt-2">
          {form.questions.some((question) => question.required) ? (
            <p className="text-sm text-destructive">
              * Indicates required question
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {form.questions.map((question) => (
          <FormQuestionItem question={question} key={question.id} />
        ))}
      </div>

      <Button className="mt-4">Submit</Button>
    </div>
  );
}
