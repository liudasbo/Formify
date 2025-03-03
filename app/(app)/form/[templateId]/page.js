"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FormQuestionItem from "@/components/form/formQuestionItem";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Form() {
  const params = useParams();
  const templateId = parseInt(params.templateId, 10);
  const router = useRouter();

  const [template, setTemplate] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: session, status } = useSession();

  useEffect(() => {
    async function fetchTemplate() {
      try {
        const res = await fetch(`/api/template/${templateId}`);
        if (!res.ok) {
          throw new Error("Error fetching template");
        }

        const data = await res.json();
        setTemplate(data);

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

    async function fetchForm() {
      try {
        const res = await fetch(`/api/form/${templateId}`);
        if (!res.ok) {
          console.warn("No form answers found");
          return;
        }

        const data = await res.json();

        if (!Array.isArray(data.answers)) {
          console.warn("No answers found");
          return;
        }

        const initialAnswers = {};
        data.answers.forEach((answer) => {
          if (answer.optionId) {
            if (!initialAnswers[answer.questionId]) {
              initialAnswers[answer.questionId] = [];
            }
            initialAnswers[answer.questionId].push(answer.optionId);
          } else {
            initialAnswers[answer.questionId] =
              answer.textValue || answer.intValue || answer.optionId;
          }
        });
        setAnswers(initialAnswers);
      } catch (err) {
        console.error("Error", err.message);
      }
    }

    fetchTemplate();
    fetchForm();
  }, [templateId]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/form/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId: templateId,
          answers: Object.entries(answers).map(([questionId, answer]) => ({
            questionId: parseInt(questionId, 10),
            answer: Array.isArray(answer) ? answer : [answer],
          })),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error submitting form and answers");
      }

      setIsSubmitting(false);
      toast("Form submitted successfully!", { type: "success" });
    } catch (err) {
      console.error("Error", err.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {author.id === session?.user.id ? (
        <Button
          variant="secondary"
          className="mb-4"
          onClick={() => router.push(`/templates/edit/${templateId}`)}
        >
          Edit your template
        </Button>
      ) : null}
      <div className="border p-6 rounded-lg flex flex-col gap-5 shadow">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          {template.title}
        </h2>
        <p className="pt-2">{template.description}</p>
        <p>Topic: {template.topic}</p>
        <div className="flex gap-2">
          {template.tags.map((tag) => (
            <Badge key={tag.id}>{tag.label}</Badge>
          ))}
        </div>

        <p>Author: {author.email}</p>

        <div className="border-t pt-2">
          {template.questions.some((question) => question.required) ? (
            <p className="text-sm text-destructive">
              * Indicates required question
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-4 ">
        {template.questions.map((question) => (
          <FormQuestionItem
            question={question}
            key={question.id}
            answer={answers[question.id]}
            onAnswerChange={handleAnswerChange}
          />
        ))}
      </div>

      {session ? (
        <Button onClick={handleSubmit} className="mt-4">
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" />
              Loading...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      ) : null}
    </div>
  );
}
