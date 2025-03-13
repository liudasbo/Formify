"use client";

import React, { use, useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import TemplateInformationCard from "@/components/templateInformationCard";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Calendar,
  Loader2,
  AlignLeft,
  ListChecks,
  MessageSquare,
  Check,
  ClipboardList,
  Hash,
} from "lucide-react";

export default function FormAnswersPage({ params }) {
  const { formId } = use(params);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await fetch(`/api/form/answers/${formId}`);
        if (!res.ok) {
          throw new Error("Error fetching form");
        }
        const data = await res.json();
        setForm(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  const getQuestionTypeIcon = (type) => {
    switch (type) {
      case "checkBoxes":
        return <ClipboardList className="h-4 w-4 text-muted-foreground" />;
      case "shortAnswer":
        return <MessageSquare className="h-4 w-4 text-muted-foreground" />;
      case "paragraph":
        return <AlignLeft className="h-4 w-4 text-muted-foreground" />;
      case "multipleChoice":
        return <Check className="h-4 w-4 text-muted-foreground" />;
      case "positiveInteger":
        return <Hash className="h-4 w-4 text-muted-foreground" />;
      default:
        return <ListChecks className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getAnswersForQuestion = (questionId) => {
    return form.answers.filter((answer) => answer.questionId === questionId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );

  if (error)
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded-md">
        <p>{error}</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="scroll-m-20 text-lg font-semibold tracking-tight first:mt-0">
          Template Answers
        </h3>
        <p className="text-sm text-muted-foreground">
          View the responses submitted by users for your template.
        </p>
      </div>

      <TemplateInformationCard template={form.template} />

      <Card className="shadow-sm">
        <CardHeader className="pb-3 pt-4">
          <h2 className="text-base font-medium">Submission Information</h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Submitted by:</span>
              <span>{form.user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Submitted at:</span>
              <span>{formatDate(form.createdAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="space-y-1.5">
        <div className="flex flex-col gap-4">
          {form.template.questions.map((question) => {
            const answers = getAnswersForQuestion(question.id);
            return (
              <div
                key={question.id}
                className="bg-card border rounded-lg overflow-hidden"
              >
                {/* Question header */}
                <div className="p-4 md:p-5 border-b bg-muted/30">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getQuestionTypeIcon(question.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start gap-2">
                        <h3 className="font-medium">{question.title}</h3>
                        {question.required && (
                          <span className="text-destructive font-medium">
                            *
                          </span>
                        )}
                      </div>
                      {question.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {question.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Answer section */}
                <div className="p-4 md:p-5">
                  {question.type !== "checkBoxes" &&
                    question.type !== "multipleChoice" && (
                      <div className="text-sm">
                        <p className="text-muted-foreground mb-1">Response:</p>
                        <div className="bg-muted/40 p-3 rounded-md">
                          {answers.length > 0
                            ? answers
                                .map((answer) => {
                                  if (answer.textValue) return answer.textValue;
                                  if (answer.intValue) return answer.intValue;
                                  if (answer.optionId) {
                                    const option = question.options.find(
                                      (opt) => opt.id === answer.optionId
                                    );
                                    return option ? option.value : "No answer";
                                  }
                                  return null;
                                })
                                .filter(Boolean)
                                .join(", ")
                            : "No answer provided"}
                        </div>
                      </div>
                    )}

                  {(question.type === "checkBoxes" ||
                    question.type === "multipleChoice") && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Response:
                      </p>
                      <div className="space-y-2">
                        {question.options.map((option) => (
                          <div
                            key={option.id}
                            className="flex items-center gap-2"
                          >
                            <Checkbox
                              checked={answers.some(
                                (answer) => answer.optionId === option.id
                              )}
                              disabled
                            />
                            <span
                              className={
                                answers.some(
                                  (answer) => answer.optionId === option.id
                                )
                                  ? "font-medium"
                                  : "text-muted-foreground"
                              }
                            >
                              {option.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
