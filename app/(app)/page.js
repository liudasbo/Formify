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
      <div className="flex flex-col gap-4">
        <h3 className="scroll-m-20 text-lg font-semibold tracking-tight first:mt-0">
          Latest templates
        </h3>
        <LatestTemplatesTable />
      </div>
    </div>
  );
}
