import { Badge } from "@/components/ui/badge";
import { User, Calendar, Mail } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import dayjs from "dayjs";
import ReactMarkdown from "react-markdown";

const TemplateInformationCard = ({ template }) => {
  if (!template) return null;

  const requiredQuestionsCount = template.questions.filter(
    (question) => question.required
  ).length;

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle className="text-3xl break-all">{template.title}</CardTitle>

        {template.description ? (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{template.description}</ReactMarkdown>
          </div>
        ) : (
          <CardDescription className="break-all">
            No description provided
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Topic */}
        <div>
          <p className="text-sm mb-2 text-muted-foreground">Topic</p>
          <div className="inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-sm font-medium">
            {template.topic}
          </div>
        </div>

        {/* Tags */}
        {template.tags && template.tags.length > 0 && (
          <div>
            <p className="text-sm mb-2 text-muted-foreground">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {template.tags.map((tag) => (
                <Badge key={tag.id} variant="outline" className="font-normal">
                  {tag.label}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t pt-4 pb-4 flex justify-between items-center text-xs text-muted-foreground flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            <span>{template.user?.name}</span>
          </div>

          <div className="flex items-center gap-1">
            <Mail className="h-3.5 w-3.5" />
            <span>{template.user?.email}</span>
          </div>

          {template.createdAt && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{dayjs(template.createdAt).format("MMM D, YYYY")}</span>
            </div>
          )}
        </div>

        <div>
          {requiredQuestionsCount > 0 && (
            <span className="text-destructive font-medium mr-1">
              * Indicates required question
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TemplateInformationCard;
