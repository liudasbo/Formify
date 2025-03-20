"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function BlockedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Jei vartotojas nėra užblokuotas, nukreipiame į pagrindinį puslapį
  useEffect(() => {
    if (status === "authenticated" && !session.user.isBlocked) {
      router.push("/");
    }
  }, [session, status, router]);

  // Jei vartotojas neprisijungęs, nukreipiame į prisijungimo puslapį
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Account Blocked</h1>
          <p className="mt-4 text-gray-600">
            Your account has been blocked by an administrator. Please contact
            support for more information.
          </p>
        </div>

        <div className="pt-4">
          <Button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full"
            variant="destructive"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
