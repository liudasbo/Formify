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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import TagInput from "./tag-input";
import QuestionList from "./questionList";
import {
  BookText,
  MessageSquare,
  GraduationCap,
  ScrollText,
  BarChart3,
  FileSpreadsheet,
  Eye,
  Edit2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";

export default function TemplateBuilder({ handleTemplateData, initialData }) {
  const [title, setTitle] = useState(initialData?.title || "Unnamed");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [descriptionView, setDescriptionView] = useState("edit");
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
    <div className="flex flex-col gap-4">
      {/* Template Details Card */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted pb-4">
          <CardTitle className="text-xl">Template Details</CardTitle>
          <CardDescription>
            Define the basic information about your template
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            {/* Title Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm flex items-center gap-1.5">
                  <BookText className="h-4 w-4" />
                  Title
                </p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-md transition-colors ${
                    title.length > 80
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {title.length}/100
                </span>
              </div>
              <Input
                id="title"
                value={title}
                maxLength={100}
                placeholder="Enter template title..."
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description Field with Markdown */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4" />
                  Description
                  <a
                    href="https://commonmark.org/help/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground font-normal text-xs ml-1 bg-muted px-1.5 py-0.5 rounded hover:bg-muted/80 hover:underline cursor-pointer transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    supports markdown
                  </a>
                </p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-md transition-colors ${
                    description.length > 400
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {description.length}/500
                </span>
              </div>

              <Tabs
                value={descriptionView}
                onValueChange={setDescriptionView}
                className="w-full"
              >
                <TabsList className="mb-2">
                  <TabsTrigger
                    value="edit"
                    className="flex items-center gap-2 text-xs"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Edit
                  </TabsTrigger>
                  <TabsTrigger
                    value="preview"
                    className="flex items-center gap-2 text-xs"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Preview
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="edit" className="mt-0">
                  <Textarea
                    id="description"
                    placeholder="Describe your template..."
                    className="h-36 text-sm"
                    maxLength={500}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <div className="text-xs text-muted-foreground mt-1.5">
                    <span>Use markdown: </span>
                    <code className="px-1 py-0.5 bg-muted rounded">
                      **bold**
                    </code>
                    <span>, </span>
                    <code className="px-1 py-0.5 bg-muted rounded">
                      *italic*
                    </code>
                    <span>, </span>
                    <code className="px-1 py-0.5 bg-muted rounded">
                      ## Heading
                    </code>
                    <span>, </span>
                    <code className="px-1 py-0.5 bg-muted rounded">
                      [link](url)
                    </code>
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="mt-0">
                  <div className="border rounded-md p-3 bg-muted prose dark:prose-invert w-full max-w-none">
                    {description ? (
                      <ReactMarkdown>{description}</ReactMarkdown>
                    ) : (
                      <p className="text-muted-foreground italic text-sm">
                        Preview will appear here...
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <Separator className="my-4" />

            {/* Topic Selection */}
            <div className="flex flex-col gap-2">
              <p className="text-sm">Topic</p>
              <Select value={topic} onValueChange={setTopic}>
                <SelectTrigger id="topic">
                  <span className="flex items-center">
                    <SelectValue />
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="other"
                    className="cursor-pointer flex items-center"
                  >
                    <span>Other</span>
                  </SelectItem>
                  <SelectItem
                    value="education"
                    className="cursor-pointer flex items-center"
                  >
                    <span>Education</span>
                  </SelectItem>
                  <SelectItem
                    value="quiz"
                    className="cursor-pointer flex items-center"
                  >
                    <span>Quiz</span>
                  </SelectItem>
                  <SelectItem
                    value="feedback"
                    className="cursor-pointer flex items-center"
                  >
                    <span>Feedback</span>
                  </SelectItem>
                  <SelectItem
                    value="survey"
                    className="cursor-pointer flex items-center"
                  >
                    <span>Survey</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tags Input */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm">Template Tags</Label>
              <TagInput
                id="tags"
                onTagsChange={setTags}
                selectedTags={tags}
                maxTags={5}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <QuestionList questions={questions} setQuestions={setQuestions} />
    </div>
  );
}
