import { useState, useMemo } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Info,
  ClipboardList,
  MessageSquare,
  ListChecks,
  Hash,
  AlignLeft,
  HelpCircle,
} from "lucide-react";
import { ChartDisplay } from "./chartDisplay";
import { TextResponsesList } from "./textResponsesList";

export function QuestionResponseCard({ form, questionId }) {
  const question = useMemo(() => {
    return form.template?.questions?.find((q) => q.id === questionId) || {};
  }, [form.template?.questions, questionId]);

  const answers = useMemo(() => {
    return (
      form.answers?.filter((answer) => answer.questionId === questionId) || []
    );
  }, [form.answers, questionId]);

  const uniqueRespondents = useMemo(() => {
    if (form?.totalForms !== undefined) {
      return form.totalForms;
    }

    if (!form?.answers || form.answers.length === 0) return 0;

    const uniqueFormIds = new Set();
    form.answers.forEach((answer) => {
      if (answer.formId) {
        uniqueFormIds.add(answer.formId);
      }
    });

    return uniqueFormIds.size;
  }, [form?.answers, form?.totalForms]);

  const responseCount = answers.length;

  const completionRate = useMemo(() => {
    if (uniqueRespondents === 0) return 0;
    return (responseCount / uniqueRespondents) * 100;
  }, [responseCount, uniqueRespondents]);

  const isTextQuestion =
    question.type === "shortAnswer" || question.type === "paragraph";

  const [chartType, setChartType] = useState(
    question.type === "positiveInteger" ? "bar" : "pie"
  );

  const canToggleChartType = () => {
    return question.type === "multipleChoice" || question.type === "checkBoxes";
  };

  const getQuestionTypeIcon = () => {
    switch (question.type) {
      case "checkBoxes":
        return <ClipboardList className="h-4 w-4 text-muted-foreground" />;
      case "shortAnswer":
        return <MessageSquare className="h-4 w-4 text-muted-foreground" />;
      case "paragraph":
        return <AlignLeft className="h-4 w-4 text-muted-foreground" />;
      case "multipleChoice":
        return <ListChecks className="h-4 w-4 text-muted-foreground" />;
      case "positiveInteger":
        return <Hash className="h-4 w-4 text-muted-foreground" />;
      default:
        return <HelpCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/30">
        <div className="flex items-start gap-2">
          <span className="mt-1">{getQuestionTypeIcon()}</span>
          <div className="flex-1">
            <CardTitle className="text-base flex items-start justify-between">
              <span>
                {question.title}
                {question.required && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </span>
              <Badge className="ml-2" variant="outline">
                {question.type === "checkBoxes" && "Checkboxes"}
                {question.type === "shortAnswer" && "Short Answer"}
                {question.type === "paragraph" && "Paragraph"}
                {question.type === "multipleChoice" && "Multiple Choice"}
                {question.type === "positiveInteger" && "Number"}
              </Badge>
            </CardTitle>
            <div className="mt-2 text-xs text-muted-foreground">
              <span className="font-medium">{responseCount}</span>{" "}
              {responseCount === 1 ? "response" : "responses"}
              {uniqueRespondents > 0 && (
                <>
                  <span className="mx-1">•</span>
                  <span className="font-medium">
                    {Math.round(completionRate)}%
                  </span>{" "}
                  completion rate
                </>
              )}
            </div>
          </div>
        </div>

        {!isTextQuestion && canToggleChartType() && answers.length > 0 && (
          <div className="mt-2">
            <Tabs
              value={chartType}
              onValueChange={setChartType}
              className="w-[200px]"
            >
              <TabsList>
                <TabsTrigger value="pie" className="flex items-center gap-1.5">
                  <PieChartIcon className="h-3.5 w-3.5" />
                  <span>Pie</span>
                </TabsTrigger>
                <TabsTrigger value="bar" className="flex items-center gap-1.5">
                  <BarChartIcon className="h-3.5 w-3.5" />
                  <span>Bar</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-6">
        {!isTextQuestion ? (
          answers.length > 0 ? (
            <div className="h-[350px]">
              <ChartDisplay
                question={question}
                answers={answers}
                chartType={chartType}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground bg-muted/20 rounded-lg">
              <Info className="h-6 w-6 mb-2 opacity-50" />
              <p className="text-sm">No responses to this question yet</p>
            </div>
          )
        ) : answers.length > 0 ? (
          <TextResponsesList answers={answers} />
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground bg-muted/20 rounded-lg">
            <Info className="h-6 w-6 mb-2 opacity-50" />
            <p className="text-sm">No text responses submitted</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
