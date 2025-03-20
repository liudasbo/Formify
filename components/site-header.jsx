"use client";

import { SidebarIcon } from "lucide-react";

import { CommandDialog } from "@/components/command-dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { useSession } from "next-auth/react";
import { ModeToggle } from "./modeToggle";
import LanguageSwitcher from "./languageSwitcher";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();

  const { data: session, status } = useSession();

  if (status === "loading") return;

  return (
    <header className="fle sticky top-0 z-50 w-full items-center border-b bg-background">
      <div className="flex h-[--header-height] w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>

        <Separator orientation="vertical" className="mr-2 h-4" />

        <CommandDialog />

        <ModeToggle />

        <LanguageSwitcher />
      </div>
    </header>
  );
}
