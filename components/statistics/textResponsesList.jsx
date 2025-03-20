import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TextResponsesList({ answers }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const validAnswers = useMemo(() => {
    return answers
      .filter((a) => a.textValue && a.textValue.trim() !== "")
      .sort((a, b) => {
        return (
          new Date(b.createdAt || b.updatedAt || 0) -
          new Date(a.createdAt || a.updatedAt || 0)
        );
      });
  }, [answers]);

  const paginatedAnswers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return validAnswers.slice(startIndex, startIndex + itemsPerPage);
  }, [validAnswers, currentPage]);

  const totalPages = Math.max(1, Math.ceil(validAnswers.length / itemsPerPage));

  if (validAnswers.length === 0) {
    return (
      <div className="text-muted-foreground text-sm italic text-center py-12 bg-muted/20 rounded-md">
        No text responses submitted
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-3">
        {paginatedAnswers.map((answer, index) => (
          <div
            key={index}
            className="bg-background border border-border/40 p-4 rounded-md text-sm"
          >
            {answer.textValue}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 text-sm text-muted-foreground">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, validAnswers.length)} of{" "}
            {validAnswers.length}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
