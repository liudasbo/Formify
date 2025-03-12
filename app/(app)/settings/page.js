"use client";

import LanguageSwitcher from "@/components/languageSwitcher";
import { ModeToggle } from "@/components/modeToggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { useTranslation } from "react-i18next";
import { PaletteIcon, GlobeIcon, Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="scroll-m-20 text-lg font-semibold tracking-tight first:mt-0">
            {t("settings")}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            Manage your account and platform preferences.
          </p>
        </div>
      </div>

      <Separator className="mb-6" />

      <div className="space-y-6">
        <h3 className="scroll-m-20 text-lg font-semibold tracking-tight first:mt-0">
          Platform settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <PaletteIcon size={20} />
                <CardTitle>{t("theme")}</CardTitle>
              </div>
              <CardDescription>
                Choose your preferred appearance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ModeToggle />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <GlobeIcon size={20} />
                <CardTitle>{t("language")}</CardTitle>
              </div>
              <CardDescription>Select your preferred language</CardDescription>
            </CardHeader>
            <CardContent>
              <LanguageSwitcher />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t text-sm text-muted-foreground">
        <p>Formify &copy; 2025</p>
      </div>
    </div>
  );
}
