"use client";

import { LatestTemplatesTable } from "@/components/latestTemplatesTable/latestTemplatesTable";
import MostLikedTemplatesTable from "@/components/mostLikedTemplatesTable";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { data: session, status } = useSession();
  const { t } = useTranslation();

  if (status === "loading") return;
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="scroll-m-20 text-lg font-semibold tracking-tight first:mt-0">
          Latest templates
        </h3>
        <p className="text-sm text-muted-foreground mb-2">
          Select a template to start filling out the form.
        </p>
        <LatestTemplatesTable />
      </div>

      <div>
        <h3 className="scroll-m-20 text-lg font-semibold tracking-tight first:mt-0">
          Most liked templates
        </h3>
        <p className="text-sm text-muted-foreground mb-2">
          Browse the templates with the highest user ratings.
        </p>
        <MostLikedTemplatesTable />
      </div>
    </div>
  );
}
