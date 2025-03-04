"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import TemplateBuilder from "@/components/templateBuilder/template-builder";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function NewTemplatePage() {
  const [templateData, setTemplateData] = useState({});
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleTemplateData = (data) => {
    setTemplateData(data);
  };

  const handlePublish = async () => {
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
      router.push("/user/dashboard");
    }
  };

  return (
    <div className="flex flex-col">
      <Button
        type="button"
        onClick={handlePublish}
        className="ml-auto mb-6"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" />
            Loading...
          </>
        ) : (
          "Publish"
        )}
      </Button>
      <Tabs defaultValue="template" className="w-full">
        <TabsList className="w-full flex p-4 mb-6">
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
