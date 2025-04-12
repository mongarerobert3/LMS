import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = 'en' | 'sw';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Translation dictionary
  const translations = {
    en: {
      login: "Login",
      dashboard: "Dashboard",
      courses: "Courses",
      progress: "Progress",
      resources: "Resources",
      assignments: "Assignments",
      quizzes: "Quizzes",
      modules: "Modules",
      students: "Students",
      instructors: "Instructors",
      admin: "Admin",
      search: "Search...",
      notifications: "Notifications",
    },
    sw: {
      login: "Ingia",
      dashboard: "Dashibodi",
      courses: "Kozi",
      progress: "Maendeleo",
      resources: "Rasilimali",
      assignments: "Kazi",
      quizzes: "Maswali",
      modules: "Moduli",
      students: "Wanafunzi",
      instructors: "Walimu",
      admin: "Msimamizi",
      search: "Tafuta...",
      notifications: "Arifa",
    },
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
