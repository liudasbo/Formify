"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyTemplates from "@/components/dashboard/myTemplates/myTemplates";
import MyForms from "@/components/dashboard/myForms/myForms";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [userTemplates, setUserTemplates] = useState([]);
  const [userForms, setUserForms] = useState([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = session?.user?.id;

  const fetchTemplates = async () => {
    try {
      const res = await fetch(`/api/template/user/${userId}`);
      if (!res.ok) {
        throw new Error("Error fetching templates");
      }
      const data = await res.json();
      setUserTemplates(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error fetching templates");
    }
  };

  const fetchForms = async () => {
    try {
      const res = await fetch(`/api/form/user/${userId}`);
      if (!res.ok) {
        throw new Error("Error fetching forms");
      }
      const data = await res.json();
      setUserForms(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error fetching forms");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTemplates();
      fetchForms();
    }
  }, [userId]);

  useEffect(() => {
    async function fetchEmail() {
      try {
        const userRes = await fetch(`/api/user/${userId}`);
        if (!userRes.ok) {
          throw new Error("Error fetching user");
        }
        const userData = await userRes.json();
        setEmail(userData.email);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error fetching user");
        setEmail("Error");
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchEmail();
    }
  }, [userId]);

  if (status === "loading" || loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-4xl font-bold">My Dashboard</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="border rounded-lg p-6 flex m-auto h-28 gap-4 shadow">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>{session.user.name.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold">{session.user.name}</p>
            <p className="text-sm">{session.user.email}</p>
          </div>
        </div>

        <Separator orientation="vertical" />

        <div className="flex flex-col items-center text-center gap-2">
          <p className="text-sm">Templates created</p>
          <p className="font-bold">{userTemplates.length}</p>
        </div>

        <Separator orientation="vertical" />

        <div className="flex flex-col items-center text-center gap-2">
          <p className="text-sm">Forms filled</p>
          <p className="font-bold">{userForms.length}</p>
        </div>
      </div>

      <Tabs defaultValue="myTemplates" className="w-full">
        <TabsList className=" inline-flex h-9 items-center text-muted-foreground w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="myTemplates"
            className="inline-flex items-center justify-center whitespace-nowrap py-1 text-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            My templates
          </TabsTrigger>
          <TabsTrigger
            value="myForms"
            className="inline-flex items-center justify-center whitespace-nowrap py-1 text-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            My forms
          </TabsTrigger>
        </TabsList>
        <TabsContent value="myTemplates">
          <MyTemplates
            userTemplates={userTemplates}
            refreshData={fetchTemplates}
          />
        </TabsContent>
        <TabsContent value="myForms">
          <MyForms userForms={userForms} refreshData={fetchForms} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
