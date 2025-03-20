import { Loader2 } from "lucide-react";
import React from "react";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-64 gap-4">
      <Loader2 size={34} className="animate-spin text-primary" />
      <p>Please wait...</p>
    </div>
  );
}
