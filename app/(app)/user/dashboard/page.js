"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyTemplates from "@/components/dashboard/myTemplates/myTemplates";
import MyForms from "@/components/dashboard/myForms/myForms";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userTemplates, setUserTemplates] = useState([]);
  const [userForms, setUserForms] = useState([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
      setEmail(userData.email);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error fetching data");
      setEmail("Error");
    } finally {
      setLoading(false);
    }
  }, [userId]);

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
      <h3 className="scroll-m-20 text-lg font-semibold tracking-tight first:mt-0">
        My Dashboard
      </h3>

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex">
        <div className="flex border rounded-lg shadow p-6 gap-6 justify-around">
          {/* USER INFO */}
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback>{session.user.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-bold">{session.user.name}</p>
              <p className="text-sm">{session.user.email}</p>
            </div>
          </div>

          <Separator orientation="vertical" />

          {/* Templates */}
          <div className="text-center">
            <p className="text-sm">Templates created</p>
            <p className="text-sm font-bold">{userTemplates.length}</p>
          </div>

          <Separator orientation="vertical" />

          {/* Forms */}
          <div className="text-center">
            <p className="text-sm">Forms filled</p>
            <p className="text-sm font-bold">{userForms.length}</p>
          </div>
        </div>
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
        </TabsList>
        <TabsContent value="myTemplates">
          <MyTemplates userTemplates={userTemplates} refreshData={fetchData} />
        </TabsContent>
        <TabsContent value="myForms">
          <MyForms userForms={userForms} refreshData={fetchData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
