"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyTemplates from "@/components/dashboard/myTemplates/myTemplates";
import MyForms from "@/components/dashboard/myForms/myForms";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FilePlus } from "lucide-react";
import { Files } from "lucide-react";

import SalesForceDialog from "@/components/dashboard/salesForceDialog/salesForceDialog";
import MyTickets from "@/components/dashboard/myTickets/myTickets";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userTemplates, setUserTemplates] = useState([]);
  const [userForms, setUserForms] = useState([]);
  const [userData, setUserData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUnlinking, setIsUnlinking] = useState(false);
  const userId = session?.user?.id;

  const fetchData = useCallback(async () => {
    if (!userId) return;

    try {
      const [templatesRes, formsRes, userRes] = await Promise.all([
        fetch(`/api/template/user/${userId}`),
        fetch(`/api/form/user/${userId}`),
        fetch(`/api/user/${userId}`),
      ]);

      if (!templatesRes.ok) throw new Error("Error fetching templates");
      if (!formsRes.ok) throw new Error("Error fetching forms");
      if (!userRes.ok) throw new Error("Error fetching user");

      const [templatesData, formsData, userData] = await Promise.all([
        templatesRes.json(),
        formsRes.json(),
        userRes.json(),
      ]);

      setUserTemplates(templatesData);
      setUserForms(formsData);
      setUserData(userData);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error fetching data");
      setUserData({ user: "Error" });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const handleUnlink = async () => {
    setIsUnlinking(true);

    try {
      const response = await fetch(`/api/salesforce/unlink?userId=${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to unlink Salesforce account"
        );
      }

      toast.success("Successfully unlinked from Salesforce");
      fetchData();
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsUnlinking(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }

    if (status === "authenticated") {
      fetchData();
    }
  }, [status, userId, router, fetchData]);

  if (status === "loading" || loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="scroll-m-20 text-lg font-semibold tracking-tight first:mt-0">
          My Dashboard
        </h3>
        <p className="text-sm text-muted-foreground">
          View your templates, submitted forms, and take action.
        </p>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex ">
        {/* USER INFO */}
        <div className="flex border rounded-lg shadow p-6 gap-4 justify-around w-full">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback>{session.user.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-bold">{session.user.name}</p>
              <p className="text-sm">{userData.email}</p>
            </div>
          </div>

          <Separator orientation="vertical" />

          {/* Templates */}
          <div className="text-center flex flex-col gap-1">
            <p className="text-sm">Templates created</p>
            <p className="text-sm font-bold flex items-center justify-center gap-2">
              <FilePlus size={16} />
              {userTemplates.length}
            </p>
          </div>

          <Separator orientation="vertical" />

          {/* Forms */}
          <div className="text-center flex flex-col gap-1">
            <p className="text-sm">Forms filled</p>
            <p className="text-sm font-bold flex items-center justify-center gap-2">
              <Files size={16} /> {userForms.length}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold">Actions</p>
        {userData.isSyncedWithSalesforce ? (
          <div>
            <Button
              variant="destructive"
              onClick={handleUnlink}
              disabled={isUnlinking}
            >
              {isUnlinking ? "Unlinking..." : "Unlink from Salesforce"}
            </Button>
          </div>
        ) : (
          <SalesForceDialog user={session.user} fetchData={fetchData} />
        )}
      </div>

      <Tabs defaultValue="myTemplates" className="w-full">
        <TabsList className="w-full flex p-4 mb-6">
          <TabsTrigger
            value="myTemplates"
            className="w-full data-[state=active]:font-bold"
          >
            My templates
          </TabsTrigger>
          <TabsTrigger
            value="myForms"
            className="w-full data-[state=active]:font-bold"
          >
            My forms
          </TabsTrigger>
          <TabsTrigger
            value="myTickets"
            className="w-full data-[state=active]:font-bold"
          >
            My tickets
          </TabsTrigger>
        </TabsList>
        <TabsContent value="myTemplates">
          <MyTemplates userTemplates={userTemplates} refreshData={fetchData} />
        </TabsContent>
        <TabsContent value="myForms">
          <MyForms userForms={userForms} refreshData={fetchData} />
        </TabsContent>
        <TabsContent value="myTickets">
          <MyTickets />
        </TabsContent>
      </Tabs>
    </div>
  );
}
