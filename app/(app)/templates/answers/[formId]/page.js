"use client";

import React, { use, useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const getAnswersForQuestion = (questionId) => {
    return form.answers.filter((answer) => answer.questionId === questionId);
  };

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
      <div className="border p-6 rounded-lg flex flex-col gap-5 shadow mb-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          {form.template.title}
        </h2>
        <p className="pt-2">{form.template.description}</p>
        <p>Topic: {form.template.topic}</p>
        <div className="flex gap-2">
          {form.template.tags.map((tag) => (
            <Badge key={tag.id}>{tag.label}</Badge>
          ))}
        </div>
        <p>Author: {form.template.userId} id</p>
        {form.template.questions.some((question) => question.required) && (
          <div className="border-t pt-2">
            <p className="text-sm text-destructive">
              * Indicates required question
            </p>
          </div>
        )}
      </div>

      <div className="border rounded-lg p-4 mb-4 shadow">
        <p className="font-bold text-xl">Submitter info :</p>
        <p>
          <strong>Submitted by:</strong> {form.user.email}
        </p>
        <p>
          <strong>Submitted at:</strong>{" "}
          {new Date(form.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Answers</h2>
        <ul>
          {form.template.questions.map((question) => {
            const answers = getAnswersForQuestion(question.id);
            return (
              <li
                key={question.id}
                className="mb-2 border p-4 rounded-lg shadow"
              >
                <p className="font-bold mb-4 flex gap-1">
                  {question.title}
                  {question.required && (
                    <span className="text-destructive">*</span>
                  )}
                </p>
                {question.type !== "checkBoxes" &&
                  question.type !== "multipleChoice" && (
                    <p>
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
                        : "No answer"}
                    </p>
                  )}
                {(question.type === "checkBoxes" ||
                  question.type === "multipleChoice") && (
                  <ul>
                    {question.options.map((option) => (
                      <li key={option.id} className="flex items-center gap-2">
                        <Checkbox
                          checked={answers.some(
                            (answer) => answer.optionId === option.id
                          )}
                          disabled
                        />
                        {option.value}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
