"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import TemplateBuilder from "@/components/templateBuilder/template-builder";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { AnswersTable } from "@/components/templateAnswersTable/answersTable";

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
      router.push(`/form/${id}`);
    } else {
      const error = await response.json();
      console.error("Update error:", error.error);
    }
  };

  if (loading) return <p>Loading...</p>;
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="scroll-m-20 text-lg font-semibold tracking-tight first:mt-0">
          Edit your template
        </h3>
        <p className="text-sm text-muted-foreground">
          Make changes to your template to fit your needs.
        </p>
      </div>
      <Button type="button" onClick={handleUpdate}>
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
        <TabsList className="w-full flex p-4 mb-6">
          <TabsTrigger
            value="template"
            className="w-full data-[state=active]:font-bold"
          >
            Template
          </TabsTrigger>
          <TabsTrigger
            value="answers"
            className="w-full data-[state=active]:font-bold"
          >
            Answers
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="w-full data-[state=active]:font-bold"
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
        <TabsContent value="answers">
          <AnswersTable templateId={id} />
        </TabsContent>
        <TabsContent value="settings">Settings</TabsContent>
      </Tabs>
    </div>
  );
}
