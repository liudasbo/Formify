"use client";

import * as React from "react";
import {
  LayoutDashboard,
  LifeBuoy,
  Send,
  Settings2,
  FileText,
  BookText,
  Home,
  Search,
  UserRoundCog,
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

  if (status === "loading") return null;

  console.log(session);

  const userMenuItems = [
    {
      title: "My dashboard",
      url: "/user/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Create new template",
      url: "/templates/new",
      icon: FileText,
    },
  ];

  if (session?.user?.isAdmin) {
    userMenuItems.push({
      title: "Admin dashboard",
      url: "/admin",
      icon: UserRoundCog,
    });
  }

  const sidebarData = {
    user: {
      name: session ? session.user.name : "",
      email: session ? session.user.email : "",
    },
    navMain: [
      {
        title: "Home",
        url: "/",
        icon: Home,
      },
      {
        title: "Browse forms",
        url: "/browse/forms",
        icon: Search,
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
    User: userMenuItems,
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
        {session ? <NavProjects projects={sidebarData.User} /> : null}
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
