"use client";

import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18";

export default function I18nProvider({ children }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark that we're now on the client
    setIsClient(true);

    // Then load language preference
    const savedLang = localStorage.getItem("language") || "en";
    if (savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, []);

  // On first server render, make sure we use a consistent language (English)
  // This prevents hydration mismatch by making server and initial client render match
  if (!isClient) {
    i18n.changeLanguage("en");
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
