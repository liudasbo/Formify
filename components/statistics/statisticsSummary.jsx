import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, CheckCircle, ListChecks, Calendar } from "lucide-react";
import { format } from "date-fns";

export function StatisticsSummary({ form }) {
  // Calculate unique respondents using the totalForms property
  const uniqueRespondents = useMemo(() => {
    if (form?.totalForms !== undefined) {
      return form.totalForms;
    }

    if (!form?.answers || form.answers.length === 0) return 0;

    // Extract unique form IDs from answers
    const uniqueFormIds = new Set();
    form.answers.forEach((answer) => {
      if (answer.formId) {
        uniqueFormIds.add(answer.formId);
      }
    });

    return uniqueFormIds.size;
  }, [form?.answers, form?.totalForms]);

  // Calculate completion percentage
  const completionPercentage = useMemo(() => {
    if (!form?.template?.questions || !form?.answers || uniqueRespondents === 0)
      return 0;

    // Expected total answers if all questions were answered
    const expectedTotal = form.template.questions.length * uniqueRespondents;
    // Actual answers received
    const actualAnswers = form.answers.length;

    return Math.round((actualAnswers / expectedTotal) * 100);
  }, [form?.template?.questions, form?.answers, uniqueRespondents]);

  // Get the most recent response date
  const lastResponseDate = useMemo(() => {
    if (!form) return null;

    if (form.updatedAt) {
      return new Date(form.updatedAt);
    }

    if (!form?.answers || form.answers.length === 0) return null;

    const dates = form.answers.map((a) => new Date(a.createdAt || a.updatedAt));
    return new Date(Math.max(...dates));
  }, [form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Response Statistics</CardTitle>
        <CardDescription>
          Visual breakdown of responses for{" "}
          <span className="font-medium">{form.template?.title}</span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Respondents */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border/30 flex flex-col">
            <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
              <Users className="h-3.5 w-3.5" />
              <span>Total Respondents</span>
            </div>
            <div className="mt-1 text-2xl font-semibold">
              {uniqueRespondents}
            </div>
          </div>

          {/* Completion Rate */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border/30 flex flex-col">
            <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Completion Rate</span>
            </div>
            <div className="mt-1 text-2xl font-semibold">
              {completionPercentage}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {form.answers?.length || 0} answers received
            </div>
          </div>

          {/* Questions */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border/30 flex flex-col">
            <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
              <ListChecks className="h-3.5 w-3.5" />
              <span>Questions</span>
            </div>
            <div className="mt-1 text-2xl font-semibold">
              {form.template?.questions?.length || 0}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {form.template?.questions?.filter((q) => q.required)?.length || 0}{" "}
              required questions
            </div>
          </div>

          {/* Last Response */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border/30 flex flex-col">
            <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
              <Calendar className="h-3.5 w-3.5" />
              <span>Last Response</span>
            </div>
            <div className="mt-1 text-2xl font-semibold">
              {lastResponseDate
                ? format(lastResponseDate, "MMM d, yyyy")
                : "N/A"}
            </div>
            {lastResponseDate && (
              <div className="text-xs text-muted-foreground mt-1">
                {format(lastResponseDate, "h:mm a")}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
