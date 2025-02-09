"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { t } = useTranslation();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Kad išvengtume nekorektiško rodymo

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => setTheme("light")}
        variant={theme === "light" ? "secondary" : "outline"}
        className="border cursor-pointer"
      >
        {t("light")}
      </Button>
      <Button
        onClick={() => setTheme("dark")}
        variant={theme === "dark" ? "secondary" : "outline"}
        className="border cursor-pointer"
      >
        {t("dark")}
      </Button>
      <Button
        onClick={() => setTheme("system")}
        variant={theme === "system" ? "secondary" : "outline"}
        className="border cursor-pointer"
      >
        {t("system")}
      </Button>
    </div>
  );
}
