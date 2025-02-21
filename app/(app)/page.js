"use client";

import { LatestTemplatesTable } from "@/components/latestTemplatesTable/latestTemplatesTable";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { data: session, status } = useSession();
  const { t } = useTranslation();

  if (status === "loading") return;
  return (
    <div>
      <div>
        <h2 className="scroll-m-20 border-b pb-2 text-xl text-muted-foreground">
          Latest templates
        </h2>
        <LatestTemplatesTable />
      </div>

      <div className="mt-20">
        <h2 className="scroll-m-20 border-b pb-2 text-xl text-muted-foreground">
          Top 5 popular templates
        </h2>
      </div>
    </div>
  );
}
