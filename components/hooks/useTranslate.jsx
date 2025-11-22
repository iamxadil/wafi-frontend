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

  // Direction helpers
  const inlineDirection = language === "ar" ? "rtl" : "ltr";
  const bidiMode = "plaintext";

  /* ================================================== */
  /* ⭐ NEW — Arabic Font Helpers                       */
  /* ================================================== */

  // Your preferred Arabic font (editable)
  const arFont = `"Aref Ruqaa", serif`;

  // Auto-applied only when language === "ar"
  const arStyle = language === "ar"
    ? { fontFamily: arFont }
    : {};

  return Object.assign(t, {
    language,
    textAlign,
    flexAlign,
    rowReverse,
    positionAlign,

    inlineDirection,
    bidiMode,

    // ⭐ New exports
    arFont,
    arStyle,
  });
}
