"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLang = localStorage.getItem("language") || "en";
      i18n.changeLanguage(storedLang);
      setCurrentLang(storedLang);
    }
  }, [i18n]);

  const changeLanguage = async (lang) => {
    await i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    setCurrentLang(lang);
  };

  if (!currentLang) return null;

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => changeLanguage("en")}
        variant={currentLang === "en" ? "secondary" : "outline"}
        className="border"
      >
        English
      </Button>
      <Button
        onClick={() => changeLanguage("lt")}
        variant={currentLang === "lt" ? "secondary" : "outline"}
        className="border"
      >
        Lietuvių
      </Button>
    </div>
  );
};

export default LanguageSwitcher;
