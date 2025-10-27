import useLanguageStore from "../stores/useLanguageStore.jsx";

/**
 * useTranslate hook
 * Simple bilingual switcher with text, flex, and absolute positioning alignment.
 */
export default function useTranslate() {
  const { language } = useLanguageStore();

  // Translation helper
  const t = (en, ar) => (language === "en" ? en : ar);

  // Alignment helpers
  const textAlign = language === "ar" ? "right" : "left";
  const flexAlign = language === "ar" ? "flex-end" : "flex-start";
  const positionAlign = language === "ar" ? "right" : "left";
  const rowReverse = language === "ar" ? "row-reverse" : "row"

  // All helpers + language state
  return Object.assign(t, {
    language,
    textAlign,
    flexAlign,
    rowReverse,
    positionAlign,
  });
}
