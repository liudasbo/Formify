import React from "react";
import { Input } from "../ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "../ui/checkbox";

export default function FormQuestionItem({ question, answer, onAnswerChange }) {
  const handleChange = (value) => {
    onAnswerChange(question.id, value);
  };

  return (
    <div className="flex flex-col gap-5 p-6 border rounded-lg shadow">
      <div className=" flex gap-1">
        <p className="font-bold">{question.title}</p>
        {question.required ? <p className="text-destructive">*</p> : null}
      </div>

      {question.type === "checkBoxes" && (
        <div className="flex flex-col gap-4">
          {question.options.map((option) => (
            <div key={option.id} className="flex gap-2 items-center">
              <Checkbox
                checked={Array.isArray(answer) && answer.includes(option.id)}
                onCheckedChange={(checked) => {
                  const newValue = checked
                    ? [...(Array.isArray(answer) ? answer : []), option.id]
                    : (Array.isArray(answer) ? answer : []).filter(
                        (id) => id !== option.id
                      );
                  handleChange(newValue);
                }}
              />
              <p>{option.value}</p>
            </div>
          ))}
        </div>
      )}

      {question.type === "shortAnswer" && (
        <Input
          placeholder="Your answer"
          className="w-[50%] border-0 shadow-none rounded-none focus-visible:ring-0 focus:border-b focus:border-foreground hover:border-b border-b"
          value={answer || ""}
          onChange={(e) => handleChange(e.target.value)}
        />
      )}

      {question.type === "paragraph" && (
        <Textarea
          placeholder="Your answer"
          className="min-h-0 h-9 py-1 border-0 shadow-none rounded-none focus-visible:ring-0 focus:border-b focus:border-foreground hover:border-b border-b"
          value={answer || ""}
          onChange={(e) => handleChange(e.target.value)}
        />
      )}

      {question.type === "multipleChoice" && (
        <div className="flex flex-col gap-4">
          {question.options.map((option) => (
            <div key={option.id} className="flex gap-2 items-center">
              <Checkbox
                checked={Array.isArray(answer) && answer.includes(option.id)}
                onCheckedChange={(checked) => {
                  const newValue = checked ? [option.id] : [];
                  handleChange(newValue);
                }}
              />
              <p>{option.value}</p>
            </div>
          ))}
        </div>
      )}

      {question.type === "positiveInteger" && (
        <Input
          min="0"
          type="number"
          value={answer || ""}
          className="w-[20%] border-0 shadow-none rounded-none focus-visible:ring-0 focus:border-b focus:border-foreground hover:border-b border-b"
          onChange={(e) => handleChange(parseInt(e.target.value, 10) || 0)}
        />
      )}
    </div>
  );
}
