import { createContext, useEffect, useState } from "react";
import { getTranslations } from "@/assets/languages/i18n.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const LanguageContext = createContext();

export default function LanguageProvider({ children }) {
  const [lang, setLang] = useState("En");
  const [t, setT] = useState(getTranslations("En"));

  // Load saved language on mount
  useEffect(() => {
    const loadLang = async () => {
      const savedLang = await AsyncStorage.getItem("LANGUAGE");
      if (savedLang) {
        setLang(savedLang);
        setT(getTranslations(savedLang));
      }
    };
    loadLang();
  }, []);

  // Change language
  const changeLanguage = async (newLang) => {
    setLang(newLang);
    setT(getTranslations(newLang));
    await AsyncStorage.setItem("LANGUAGE", newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
