"use client";

import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Loader2, PlusCircle, Clock, ThumbsUp } from "lucide-react";
import { FormsTable } from "@/components/formsTable";
import Loading from "@/components/Loading";

export default function Home() {
  const { data: session, status } = useSession();
  const { t } = useTranslation();

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-muted/60 to-muted/30 rounded-lg border p-6 md:p-8">
        <div className="max-w-3xl">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
            {session
              ? `Welcome back, ${session.user.name}`
              : "Create and share professional forms with Formify"}
          </h1>
          <p className="text-muted-foreground mb-6 max-w-2xl">
            Formify helps you create templates, collect responses, and analyze
            data efficiently. Get started now by creating a new template or
            using an existing one.
          </p>

          <div className="flex gap-2">
            {session ? (
              <Button asChild>
                <Link href="/templates/new">Create template</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/login">Log In</Link>
              </Button>
            )}

            <Button variant="outline" asChild>
              <Link href="/browse/forms">Browse all forms</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Latest forms */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Latest forms</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <FormsTable showAuthorEmail />
        </CardContent>
      </Card>

      {/* Most liked forms */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Most liked forms</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <FormsTable
            showLikes
            sortBy={"likes"}
            showAuthorEmail
            showDescription={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}
