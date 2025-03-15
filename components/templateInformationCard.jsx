import { Badge } from "@/components/ui/badge";
import { User, Calendar } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import dayjs from "dayjs";

const TemplateInformationCard = ({ template }) => {
  if (!template) return null;

  const requiredQuestionsCount = template.questions.filter(
    (question) => question.required
  ).length;

  return (
    <Card className="shadow-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl break-all">{template.title}</CardTitle>

        <CardDescription className="break-all">
          {template.description || "No description provided"}
        </CardDescription>
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

      <CardFooter className="border-t pt-4 pb-4 flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            <span>{template.user?.email || "Unknown"}</span>
          </div>

          {template.createdAt && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{dayjs(template.createdAt).format("MMM D, YYYY")}</span>
              </div>
            </>
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
