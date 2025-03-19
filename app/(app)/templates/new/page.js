"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import TemplateBuilder from "@/components/templateBuilder/template-builder";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function NewTemplatePage() {
  const [templateData, setTemplateData] = useState({});
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleTemplateData = (data) => {
    setTemplateData(data);
  };

  const handlePublish = async () => {
    try {
      setIsLoading(true);
      const data = templateData;
      const response = await fetch("/api/template/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success("Template created successfully");
        router.push(`/form/${result.template.id}`);
      } else {
        console.error("Failed to create template");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error creating template:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="scroll-m-20 text-lg font-semibold tracking-tight first:mt-0">
            Create New Template
          </h3>
          <p className="text-sm text-muted-foreground">
            Design a custom template to fit your needs.
          </p>
        </div>
        <Button type="button" onClick={handlePublish} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" />
              Loading...
            </>
          ) : (
            "Publish"
          )}
        </Button>
      </div>

      <Tabs defaultValue="template" className="w-full">
        <TabsList className="w-full flex">
          <TabsTrigger
            value="template"
            className="w-full data-[state=active]:font-bold"
          >
            Template
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="w-full data-[state=active]:font-bold"
          >
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="template">
          <TemplateBuilder handleTemplateData={handleTemplateData} />
        </TabsContent>
        <TabsContent value="answers">Answers</TabsContent>
        <TabsContent value="settings">Settings</TabsContent>
      </Tabs>
    </div>
  );
}
