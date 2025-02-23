"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TagInput from "./tag-input";
import QuestionList from "./questionList";

export default function TemplateBuilder({ handleTemplateData, initialData }) {
  const [title, setTitle] = useState(initialData?.title || "Unnamed");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [topic, setTopic] = useState(initialData?.topic || "other");
  const [tags, setTags] = useState(initialData?.tags || []);
  const [questions, setQuestions] = useState(initialData?.questions || []);

  useEffect(() => {
    if (initialData) {
      setTitle((prev) =>
        prev !== initialData.title ? initialData.title || "Unnamed" : prev
      );
      setDescription((prev) =>
        prev !== initialData.description ? initialData.description || "" : prev
      );
      setTopic((prev) =>
        prev !== initialData.topic ? initialData.topic || "other" : prev
      );
      setTags((prev) =>
        JSON.stringify(prev) !== JSON.stringify(initialData.tags)
          ? initialData.tags || []
          : prev
      );
      setQuestions((prev) =>
        JSON.stringify(prev) !== JSON.stringify(initialData.questions)
          ? initialData.questions || []
          : prev
      );
    }
  }, [initialData]);

  useEffect(() => {
    handleTemplateData({ title, description, topic, tags, questions });
  }, [title, description, topic, tags, questions]);

  return (
    <form className="flex flex-col gap-4 mt-4">
      <div className="border p-6 rounded-lg shadow">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <p className="text-sm">Title</p>
            <Input
              value={title}
              className="text-3xl md:text-3xl lg:text-3xl py-6"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-sm">Description (support markdown)</p>
            <Textarea
              placeholder="Description..."
              className="h-24"
              defaultValue={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-sm">Topic</p>
            <Select value={topic} onValueChange={setTopic}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="other" className="cursor-pointer">
                  Other
                </SelectItem>
                <SelectItem value="education" className="cursor-pointer">
                  Education
                </SelectItem>
                <SelectItem value="quiz" className="cursor-pointer">
                  Quiz
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-sm">Tags</p>
            <TagInput
              onTagsChange={setTags}
              selectedTags={initialData?.tags || []}
            />
          </div>
        </div>
      </div>

      <QuestionList questions={questions} setQuestions={setQuestions} />
    </form>
  );
}
