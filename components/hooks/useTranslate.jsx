import useLanguageStore from "../stores/useLanguageStore.jsx";

export default function useTranslate() {
  const { language } = useLanguageStore();

  // Translation helper
  const t = (en, ar) => (language === "en" ? en : ar);

  // Alignment helpers
  const textAlign = language === "ar" ? "right" : "left";
  const flexAlign = language === "ar" ? "flex-end" : "flex-start";
  const positionAlign = language === "ar" ? "right" : "left";
  const rowReverse = language === "ar" ? "row-reverse" : "row";

  // ⭐ NEW — inline text direction for mixed Arabic/English
  const inlineDirection = language === "ar" ? "rtl" : "ltr";

  // ⭐ NEW — prevents wrapping problems with mixed direction text
  const bidiMode = "plaintext"; // always needed for Arabic/English mixes

  return Object.assign(t, {
    language,
    textAlign,
    flexAlign,
    rowReverse,
    positionAlign,

    // NEW
    inlineDirection,
    bidiMode,
  });
}
