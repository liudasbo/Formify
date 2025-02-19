"use client";

import { useSortable } from "@dnd-kit/sortable";
import React, { useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { Input } from "../ui/input";
import { GripHorizontal, Trash2, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import OptionList from "./optionList";

const QuestionItem = ({ question, onDelete, handleUpdate, setQuestions }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [selectedType, setSelectedType] = useState(question.type);

  return (
    <div ref={setNodeRef} style={style} className="bg-background">
      <div className="px-6 pb-6 border rounded-lg ">
        <div
          {...attributes}
          {...listeners}
          className="cursor-move w-full flex justify-center py-1"
        >
          <GripHorizontal />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <div className="w-full flex flex-col gap-2">
              <p className="text-sm">Question title</p>
              <Input
                defaultValue={question.title}
                onChange={(e) => handleUpdate(question.id, e.target.value)}
              />
            </div>

            <Select
              defaultValue={selectedType}
              onValueChange={(value) => {
                setSelectedType(value);
                handleUpdate(
                  question.id,
                  question.title,
                  question.required,
                  value
                );
              }}
            >
              <SelectTrigger className="w-[180px] mt-auto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="checkBoxes" className="cursor-pointer">
                    Checkboxes
                  </SelectItem>
                  <SelectItem value="shortAnswer" className="cursor-pointer">
                    Short answer
                  </SelectItem>
                  <SelectItem value="paragraph" className="cursor-pointer">
                    Paragraph
                  </SelectItem>
                  <SelectItem value="multipleChoice" className="cursor-pointer">
                    Multiple choice
                  </SelectItem>
                  <SelectItem
                    value="positiveInteger"
                    className="cursor-pointer"
                  >
                    Positive integer
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {selectedType === "checkBoxes" ? (
            <OptionList
              options={question.options}
              question={question}
              setQuestions={setQuestions}
            />
          ) : null}
          {selectedType === "shortAnswer" ? (
            <Input
              disabled
              defaultValue="Short-answer text"
              className="border-0 shadow-none border-b rounded-none"
            />
          ) : null}
          {selectedType === "paragraph" ? (
            <Input
              disabled
              defaultValue="Long-answer text"
              className="border-0 shadow-none border-b rounded-none"
            />
          ) : null}

          {selectedType === "multipleChoice" ? (
            <OptionList
              options={question.options}
              question={question}
              setQuestions={setQuestions}
            />
          ) : null}

          {selectedType === "positiveInteger" ? (
            <Input
              defaultValue="0"
              disabled
              type="number"
              className="border-0 shadow-none border-b rounded-none"
            />
          ) : null}

          <div className="border-t pt-4 flex justify-end">
            <div className="border-r pr-4">
              <Button
                variant="destructive"
                type="button"
                onClick={() => onDelete(question.id)}
              >
                <Trash2 />
              </Button>
            </div>
            <div className="flex items-center pl-5 gap-2">
              <p className="text-sm">Required</p>
              <Switch
                checked={question.required}
                onCheckedChange={(value) =>
                  handleUpdate(question.id, question.title, value)
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionItem;
