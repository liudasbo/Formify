"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import TemplateBuilder from "@/components/templateBuilder/template-builder";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export default function EditTemplate() {
  const [templateData, setTemplateData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isUpdateBtnLoading, setIsUpdateBtnLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleTemplateData = (data) => {
    setTemplateData(data);
  };

  const params = useParams();
  const id = params.templateId;

  useEffect(() => {
    async function fetchTemplateData() {
      try {
        const res = await fetch(`/api/template/${id}`);
        if (!res.ok) {
          throw new Error("Error fetching form");
        }
        const data = await res.json();
        setTemplateData(data);
      } catch (err) {
        console.error("Error", err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchTemplateData();
    }
  }, [id]);

  useEffect(() => {
    if (
      status === "authenticated" &&
      templateData.userId &&
      templateData.userId !== session.user.id
    ) {
      toast.error("You do not have permission to edit this template.");
      router.push("/"); // Redirect to home or another appropriate page
    }
  }, [status, templateData, session, router]);

  const handleUpdate = async () => {
    setIsUpdateBtnLoading(true);
    if (!id) {
      console.error("Template ID is missing!");
      return;
    }

    const response = await fetch(`/api/template/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(templateData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result.message);
      setIsUpdateBtnLoading(false);
      toast("Template updated successfully!", { type: "success" });
    } else {
      const error = await response.json();
      console.error("Update error:", error.error);
    }
  };

  if (loading) return <p>Loading...</p>;
  return (
    <div className="flex flex-col">
      <h1 className="text-4xl font-bold">Customize your template</h1>
      <Button className="ml-auto" type="button" onClick={handleUpdate}>
        {isUpdateBtnLoading ? (
          <>
            <Loader2 className="animate-spin" />
            Loading...
          </>
        ) : (
          "Update"
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
          <TemplateBuilder
            handleTemplateData={handleTemplateData}
            initialData={templateData}
          />
        </TabsContent>
        <TabsContent value="answers">Answers</TabsContent>
        <TabsContent value="settings">Settings</TabsContent>
      </Tabs>
    </div>
  );
}
