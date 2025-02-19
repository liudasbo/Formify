"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  FileText,
  BookText,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import Link from "next/link";

export function AppSidebar({ ...props }) {
  const { data: session, status } = useSession();
  const { t } = useTranslation();
  if (status === "loading") return;

  const sidebarData = {
    user: {
      name: session ? session.user.name : "",
      email: session ? session.user.email : "",
    },
    navMain: [
      {
        title: "Create new template",
        url: "/templates/new",
        icon: FileText,
      },
      {
        title: t("settings"),
        url: "/settings",
        icon: Settings2,
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "#",
        icon: Send,
      },
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  };

  return (
    <Sidebar
      className="top-[--header-height] !h-[calc(100svh-var(--header-height))]"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <BookText className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-xl">
                    Formify
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
        {/* <NavProjects projects={sidebarData.projects} /> */}
        {/* <NavSecondary items={sidebarData.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        {session ? (
          <NavUser user={sidebarData.user} />
        ) : (
          <Link href="/login">
            <Button className="w-full">{t("logIn")}</Button>
          </Link>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
