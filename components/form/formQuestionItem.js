import React from "react";
import { Input } from "../ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "../ui/checkbox";

export default function FormQuestionItem({ question }) {
  return (
    <div className="flex flex-col gap-5 p-6 border rounded-lg shadow">
      <div className=" flex gap-1">
        <p className="font-bold">{question.title}</p>
        {question.required ? <p className="text-destructive">*</p> : null}
      </div>

      {question.type === "checkBoxes" ? (
        <div className="flex flex-col gap-4">
          {question.options.map((option, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Checkbox />
              <p>{option}</p>
            </div>
          ))}
        </div>
      ) : null}

      {question.type === "shortAnswer" ? (
        <Input
          placeholder="Your answer"
          className="w-[50%] border-0 shadow-none rounded-none focus-visible:ring-0 focus:border-b focus:border-foreground hover:border-b border-b"
        />
      ) : null}

      {question.type === "paragraph" ? (
        <Textarea
          placeholder="Your answer"
          className="min-h-0 h-9 py-1 border-0 shadow-none rounded-none focus-visible:ring-0 focus:border-b focus:border-foreground hover:border-b border-b"
        />
      ) : null}

      {question.type === "multipleChoice" ? (
        <div className="flex flex-col gap-4">
          {question.options.map((option, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Checkbox />
              <p>{option}</p>
            </div>
          ))}
        </div>
      ) : null}

      {question.type === "positiveInteger" ? (
        <Input
          min="0"
          type="number"
          defaultValue="0"
          className="w-[20%] border-0 shadow-none rounded-none focus-visible:ring-0 focus:border-b focus:border-foreground hover:border-b border-b"
        />
      ) : null}
    </div>
  );
}
