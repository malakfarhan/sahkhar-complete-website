// src/i18n/LanguageContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Language = "ar" | "en";

type LanguageContextValue = { 
  language: Language; 
  isEnglish: boolean; 
  setLanguage: (language: Language) => void; 
  toggleLanguage: () => void;
  refreshKey: number; // 🔑 ADD THIS
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => 
    (localStorage.getItem("site_language") === "en" ? "en" : "ar")
  );
  
  // 🔑 ADD refreshKey
  const [refreshKey, setRefreshKey] = useState(0);

  const setLanguage = (next: Language) => {
    localStorage.setItem("site_language", next);
    setLanguageState(next);
    setRefreshKey(prev => prev + 1); // 🔑 Force re-render
  };

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.body.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        isEnglish: language === "en", 
        setLanguage, 
        toggleLanguage,
        refreshKey, // 🔑 EXPORT THIS
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}

export function localized<T extends Record<string, unknown>>(item: T, key: string, language: Language): string {
  const english = item[`${key}En`];
  const arabic = item[key];
  return String(language === "en" && english ? english : arabic ?? "");
}