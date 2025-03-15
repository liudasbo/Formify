"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FormQuestionItem from "@/components/form/formQuestionItem";
import { toast } from "sonner";
import { Loader2, Star } from "lucide-react";
import { useSession } from "next-auth/react";
import TemplateInformationCard from "@/components/templateInformationCard";

export default function Form() {
  const params = useParams();
  const templateId = parseInt(params.templateId, 10);
  const router = useRouter();

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);

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
        setLikesCount(data.likesCount || 0);

        const userRes = await fetch(`/api/user/${data.userId}`);
        if (!userRes.ok) {
          throw new Error("Error fetching user");
        }
      } catch (err) {
        console.error("Error", err.message);
      } finally {
        setLoading(false);
      }
    }

    async function fetchForm() {
      // Only fetch previous answers if user is logged in
      if (!session) return;

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

    async function fetchLikeStatus() {
      if (!session) return;

      try {
        const res = await fetch(`/api/template/${templateId}/likes`);
        if (!res.ok) return;

        const data = await res.json();
        setLiked(data.userHasLiked);
        setLikesCount(data.likesCount);
      } catch (err) {
        console.error("Error fetching like status:", err);
      }
    }

    fetchTemplate();
    // Only fetch form answers if user is authenticated
    if (status === "authenticated") {
      fetchForm();
    }
    fetchLikeStatus();
  }, [templateId, session, status]);

  const handleToggleLike = async () => {
    if (!session) {
      toast("Please sign in to like templates", { type: "error" });
      return;
    }

    setLikeLoading(true);
    try {
      const method = liked ? "DELETE" : "POST";
      const res = await fetch(`/api/template/${templateId}/likes`, {
        method: method,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update like status");
      }

      const data = await res.json();
      setLiked(data.userHasLiked);
      setLikesCount(data.likesCount);

      toast(liked ? "Template unliked" : "Template liked", {
        type: "success",
      });
    } catch (err) {
      console.error("Error toggling like:", err);
      toast("Failed to update like status", { type: "error" });
    } finally {
      setLikeLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const validateAnswers = () => {
    const missingAnswers = template.questions.filter(
      (question) =>
        question.required &&
        (!answers[question.id] ||
          (Array.isArray(answers[question.id]) &&
            answers[question.id].length === 0))
    );

    if (missingAnswers.length > 0) {
      setValidationError("Please answer all required questions.");
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validateAnswers()) {
      return;
    }

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
      setIsSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="scroll-m-20 text-lg font-semibold tracking-tight first:mt-0">
          Fill Out the Form
        </h3>
        <p className="text-sm text-muted-foreground">
          Provide the required information and submit your response.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* ACTIONS */}
        <div className="flex items-center gap-2">
          {template.user.id === session?.user.id ? (
            <Button
              variant="outline"
              onClick={() => router.push(`/templates/edit/${templateId}`)}
            >
              Edit template
            </Button>
          ) : null}
          <Button
            variant="outline"
            onClick={handleToggleLike}
            disabled={likeLoading || !session}
            className="flex items-center gap-1"
          >
            {likeLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Star className={liked ? "fill-yellow-400" : ""} />
            )}
            <span className="ml-1">{likesCount}</span>
          </Button>
        </div>

        <TemplateInformationCard template={template} />

        <div className="flex flex-col gap-4">
          {template.questions.map((question) => (
            <FormQuestionItem
              question={question}
              key={question.id}
              answer={answers[question.id]}
              onAnswerChange={handleAnswerChange}
            />
          ))}
        </div>
        {validationError && (
          <p className="text-red-500 mt-4 text-sm">{validationError}</p>
        )}

        {session ? (
          <Button onClick={handleSubmit} className="sm:mx-auto">
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
    </div>
  );
}
