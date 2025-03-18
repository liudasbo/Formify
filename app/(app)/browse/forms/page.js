import { FormsTable } from "@/components/formsTable";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BrowseFormsPage() {
  return (
    <div>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Browse forms;;</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <FormsTable
            enableSearch
            limitTo={-1}
            showTopic
            showDescription={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}
