import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { SignupForm } from "@/components/signup-form";
import Link from "next/link";
import LanguageSwitcher from "@/components/languageSwitcher";
import { ModeToggle } from "@/components/modeToggle";
import { BookText } from "lucide-react";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center justify-between">
          <ModeToggle />
          <Link href="/" className="flex gap-2 items-center">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <BookText className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold text-xl">Formify</span>
            </div>
          </Link>
          <LanguageSwitcher />
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
