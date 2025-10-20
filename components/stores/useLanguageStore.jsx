import { create } from "zustand";

// Try to read saved language from localStorage, fallback to English
const savedLanguage = localStorage.getItem("appLanguage") || "en";

const useLanguageStore = create((set) => ({
  language: savedLanguage,

  setLanguage: (lang) => {
    if (["en", "ar"].includes(lang)) {
      localStorage.setItem("appLanguage", lang);
      set({ language: lang });
    }
  },

  toggleLanguage: () =>
    set((state) => {
      const newLang = state.language === "en" ? "ar" : "en";
      localStorage.setItem("appLanguage", newLang);
      return { language: newLang };
    }),
}));

export default useLanguageStore;
