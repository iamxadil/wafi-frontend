import React, { useRef } from "react";
import { Globe, Languages } from "lucide-react";
import useLanguageStore from "../../stores/useLanguageStore.jsx";
import "../../../styles/changelanguage.css";

const ChangeLanguage = () => {
  const { language, toggleLanguage } = useLanguageStore();
  const isEnglish = language === "en";
  const toggleRef = useRef(null);

  const createTransitionOverlay = (currentLang, x, y) => {
    const overlay = document.createElement("div");
    overlay.className = `lang-transition-full transparent`;
    overlay.style.setProperty("--ripple-x", `${x}px`);
    overlay.style.setProperty("--ripple-y", `${y}px`);

    const content = document.createElement("div");
    content.className = "lang-transition-center";

    const iconMarkup = isEnglish
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="95" height="95" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="95" height="95" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M5 8l6 8"/><path d="M5 16l6-8 4 8 4-8"/><path d="M3 4h18"/></svg>`;

    const textMarkup = isEnglish ? "العربية" : "English";

    content.innerHTML = `
      <div class="lang-transition-icon">${iconMarkup}</div>
      <div class="lang-transition-text">${textMarkup}</div>
    `;

    overlay.appendChild(content);
    document.body.appendChild(overlay);

    // Switch language when expansion reaches full size
    setTimeout(() => toggleLanguage(), 400);

    // Fade away
    setTimeout(() => {
      overlay.classList.add("fade-out");
      setTimeout(() => overlay.remove(), 600);
    }, 1400);
  };

  const handleClick = () => {
    const rect = toggleRef.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    createTransitionOverlay(language, x, y);
  };

  return (
    <li className="language-toggle-btn" ref={toggleRef} onClick={handleClick}>
      <div className={`lang-switch ${isEnglish ? "english" : "arabic"}`}>
        <div className="lang-icon">
          {isEnglish ? <Globe size={16} /> : <Languages size={16} />}
        </div>
      </div>
    </li>
  );
};

export default ChangeLanguage;
