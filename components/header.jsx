import React from "react";
import { Input } from "@/components/ui/input";
import UserDropdownMenu from "./userDropdownMenu";
import { ModeToggle } from "./modeToggle";
import LanguageSwitcher from "./languageSwitcher";

export default function Header() {
  return (
    <header className="px-2 sm:px-4 py-2 flex items-center border-b justify-between">
      <a className="text-sm font-bold" href="/">
        Formify
      </a>
      <Input placeholder="Search" className="mx-4 sm:mx-8 text-sm max-w-3xl" />
      <div className="flex gap-2 sm:gap-4 items-center">
        <LanguageSwitcher />
        <ModeToggle />
        <UserDropdownMenu />
      </div>
    </header>
  );
}
