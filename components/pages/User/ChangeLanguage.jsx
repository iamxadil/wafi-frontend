import React from "react";
import { Globe, Languages } from "lucide-react";
import useLanguageStore from "../../stores/useLanguageStore.jsx";
import "../../../styles/changelanguage.css";

const ChangeLanguage = () => {
  const { language, toggleLanguage } = useLanguageStore();
  const isEnglish = language === "en";

  return (
    <li className="language-toggle-btn" onClick={toggleLanguage}>
      <div className={`lang-switch ${isEnglish ? "english" : "arabic"}`}>
        <div className="lang-icon">
          {isEnglish ? <Globe size={16} /> : <Languages size={16} />}
        </div>
      </div>
    </li>
  );
};

export default ChangeLanguage;
