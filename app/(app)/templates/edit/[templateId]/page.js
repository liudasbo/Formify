"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import TemplateBuilder from "@/components/templateBuilder/template-builder";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Trash2, BarChart4, Save } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { AnswersTable } from "@/components/templateAnswersTable/answersTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FormStatistics from "@/components/formStatistics";

export default function EditTemplate() {
  const [templateData, setTemplateData] = useState({});
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdateBtnLoading, setIsUpdateBtnLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleTemplateData = (data) => {
    setTemplateData(data);
  };

  const params = useParams();
  const id = params.templateId;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/template/statistics/${id}`);
        if (!res.ok) {
          throw new Error("Error fetching data");
        }
        const data = await res.json();

        setFormData(data);
        setTemplateData(data.template);
      } catch (err) {
        console.error("Error fetching data:", err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    if (
      status === "authenticated" &&
      templateData.userId &&
      templateData.userId !== session.user.id
    ) {
      toast.error("You do not have permission to edit this template.");
      router.push("/");
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
      setIsUpdateBtnLoading(false);
      toast("Template updated successfully!", { type: "success" });
      router.push(`/form/${id}`);
    } else {
      const error = await response.json();
      console.error("Update error:", error.error);
      setIsUpdateBtnLoading(false);
      toast.error("Failed to update template");
    }
  };

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/template/delete/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Template deleted successfully");
        router.push("/user/dashboard");
      } else {
        console.error("Failed to delete template");
        toast.error("Failed to delete template");
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error("An error occurred while deleting the template");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleUpdate}
          className="w-full sm:w-auto"
        >
          {isUpdateBtnLoading ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              Loading...
            </>
          ) : (
            <>
              <Save />
              Update Template
            </>
          )}
        </Button>

        <Button
          onClick={openDeleteDialog}
          variant="outline"
          type="button"
          className="w-full sm:w-auto"
        >
          <Trash2 />
          Delete
        </Button>
      </div>

      <Tabs defaultValue="template" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger
            value="template"
            className="w-full data-[state=active]:font-bold"
          >
            Template
          </TabsTrigger>
          <TabsTrigger
            value="results"
            className="w-full data-[state=active]:font-bold"
          >
            Results
          </TabsTrigger>
          <TabsTrigger
            value="statistics"
            className="w-full data-[state=active]:font-bold"
          >
            Statistics
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
        <TabsContent value="results">
          <AnswersTable templateId={id} />
        </TabsContent>
        <TabsContent value="statistics">
          <FormStatistics form={formData} />
        </TabsContent>
        <TabsContent value="settings">Settings</TabsContent>
      </Tabs>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Delete Template?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this template? This action cannot
              be undone and all associated form submissions will be permanently
              removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Template"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
