import React from "react";
import { Input } from "../ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  AlignLeft,
  ListChecks,
  MessageSquare,
  Check,
  ClipboardList,
  Hash,
} from "lucide-react";

export default function FormQuestionItem({ question, answer, onAnswerChange }) {
  const handleChange = (value) => {
    onAnswerChange(question.id, value);
  };

  // Get the appropriate icon for question type
  const getQuestionTypeIcon = () => {
    switch (question.type) {
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

  return (
    <div className="bg-card border rounded-lg overflow-hidden transition-all hover:shadow-sm">
      {/* Question header */}
      <div className="p-4 md:p-5 border-b bg-muted/30">
        <div className="flex items-start gap-3">
          <div className="mt-1">{getQuestionTypeIcon()}</div>
          <div className="flex-1">
            <div className="flex items-start gap-2">
              <h3 className="font-medium">{question.title}</h3>
              {question.required && (
                <span className="text-destructive font-medium">*</span>
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
        {question.type === "checkBoxes" && (
          <div className="grid gap-3">
            {question.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`checkbox-${option.id}`}
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
                <Label
                  htmlFor={`checkbox-${option.id}`}
                  className="cursor-pointer"
                >
                  {option.value}
                </Label>
              </div>
            ))}
          </div>
        )}

        {question.type === "shortAnswer" && (
          <div>
            <Input
              placeholder="Your answer"
              className="max-w-md focus-visible:ring-1"
              value={answer || ""}
              onChange={(e) => handleChange(e.target.value)}
            />
          </div>
        )}

        {question.type === "paragraph" && (
          <div>
            <Textarea
              placeholder="Your answer"
              className="min-h-[100px] max-w-md focus-visible:ring-1"
              value={answer || ""}
              onChange={(e) => handleChange(e.target.value)}
            />
          </div>
        )}

        {question.type === "multipleChoice" && (
          <RadioGroup
            value={
              Array.isArray(answer) && answer.length > 0 ? answer[0] : undefined
            }
            onValueChange={(value) => handleChange([value])}
            className="grid gap-3"
          >
            {question.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={`radio-${option.id}`} />
                <Label
                  htmlFor={`radio-${option.id}`}
                  className="cursor-pointer"
                >
                  {option.value}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {question.type === "positiveInteger" && (
          <div>
            <Input
              type="number"
              min="0"
              placeholder="0"
              className="max-w-[120px] focus-visible:ring-1"
              value={answer || ""}
              onChange={(e) => handleChange(parseInt(e.target.value, 10) || 0)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
