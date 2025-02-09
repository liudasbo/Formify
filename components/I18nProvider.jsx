"use client";

import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18";

export default function I18nProvider({ children }) {
  useEffect(() => {
    const savedLang = localStorage.getItem("language") || "en";
    if (savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
