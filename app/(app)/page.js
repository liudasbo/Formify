"use client";

import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { data: session, status } = useSession();
  const { t } = useTranslation();

  if (status === "loading") return;
  return (
    <div>
      <p>{session ? `Signed in as ${session.user.email}` : "Not signed in"}</p>
    </div>
  );
}
