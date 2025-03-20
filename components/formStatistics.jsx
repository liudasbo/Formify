import React from "react";
import { StatisticsSummary } from "./statistics/statisticsSummary";
import { QuestionResponseCard } from "./statistics/questionResponseCard";

export default function FormStatistics({ form }) {
  if (!form || !form.template || !form.template.questions) {
    return <div>No form data available</div>;
  }

  return (
    <div className="space-y-6">
      <StatisticsSummary form={form} />

      <div className="space-y-6">
        {form.template.questions.map((question) => (
          <QuestionResponseCard
            key={question.id}
            form={form}
            questionId={question.id}
          />
        ))}
      </div>
    </div>
  );
}
