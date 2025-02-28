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
        className="ml-auto"
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
        <TabsList className=" inline-flex h-9 items-center text-muted-foreground w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="template"
            className="inline-flex items-center justify-center whitespace-nowrap py-1 text-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Template
          </TabsTrigger>
          <TabsTrigger
            value="answers"
            className="inline-flex items-center justify-center whitespace-nowrap py-1 text-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Answers
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="inline-flex items-center justify-center whitespace-nowrap py-1 text-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
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
