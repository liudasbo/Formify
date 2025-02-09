"use client";

import LanguageSwitcher from "@/components/languageSwitcher";
import { ModeToggle } from "@/components/modeToggle";
import React from "react";
import { useTranslation } from "react-i18next";

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="p-6 sm:p-20">
      <h1 className="text-4xl font-bold mb-8">{t("settings")}</h1>

      <div>
        <h2 className="scroll-m-20 border-b pb-2 text-xl text-muted-foreground">
          {t("preferences")}
        </h2>

        <div className="mt-4 flex flex-col gap-2">
          <p className="text-[14px]">{t("theme")}</p>
          <ModeToggle />
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <p className="text-[14px]">{t("language")}</p>
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}
