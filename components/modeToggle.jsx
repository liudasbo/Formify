"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon, Monitor, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Helper function to determine which text and icon to display
  const getThemeInfo = () => {
    switch (theme) {
      case "light":
        return { icon: <Sun className="h-4 w-4" />, text: t("light") };
      case "dark":
        return { icon: <Moon className="h-4 w-4" />, text: t("dark") };
      case "system":
      default:
        return { icon: <Monitor className="h-4 w-4" />, text: t("system") };
    }
  };

  const { icon, text } = getThemeInfo();

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-[110px] justify-between h-9 px-3 py-2"
        >
          <div className="flex items-center gap-2">
            {icon}
            <span>{text}</span>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen ? "rotate-180" : "rotate-0"
            )}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={cn(
            "flex items-center gap-2 cursor-pointer",
            theme === "light" ? "bg-accent" : ""
          )}
        >
          <Sun className="h-4 w-4" />
          <span>{t("light")}</span>
          {theme === "light" && <Check className="h-4 w-4 ml-auto" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={cn(
            "flex items-center gap-2 cursor-pointer",
            theme === "dark" ? "bg-accent" : ""
          )}
        >
          <Moon className="h-4 w-4" />
          <span>{t("dark")}</span>
          {theme === "dark" && <Check className="h-4 w-4 ml-auto" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={cn(
            "flex items-center gap-2 cursor-pointer",
            theme === "system" ? "bg-accent" : ""
          )}
        >
          <Monitor className="h-4 w-4" />
          <span>{t("system")}</span>
          {theme === "system" && <Check className="h-4 w-4 ml-auto" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
