"use client";

import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "lt", name: "Lietuvių", flag: "🇱🇹" },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState("en"); // Default to 'en' to match server
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark that we're now on the client
    setIsClient(true);

    // Then load the actual language preference
    const browserLang = navigator.language.split("-")[0];
    const storedLang = localStorage.getItem("language");
    const initialLang =
      storedLang ||
      (languages.some((lang) => lang.code === browserLang)
        ? browserLang
        : "en");

    i18n.changeLanguage(initialLang).catch(() => i18n.changeLanguage("en"));
    setCurrentLang(initialLang);
  }, [i18n]);

  const changeLanguage = async (langCode) => {
    try {
      await i18n.changeLanguage(langCode);
      localStorage.setItem("language", langCode);
      setCurrentLang(langCode);
    } catch (error) {
      console.error("Failed to change language:", error);
    }
  };

  // Show default English UI on server and first render
  if (!isClient) return null;

  const currentLanguage = languages.find((lang) => lang.code === currentLang);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="px-3">
          <Globe />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="mr-1">{language.flag}</span>
            {language.name}
            {currentLang === language.code && (
              <Check className="h-4 w-4 ml-auto" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
