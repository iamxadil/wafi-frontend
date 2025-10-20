import React from "react";
import useLanguageStore from "../../stores/useLanguageStore.jsx";
import "../../../styles/profilepage.css";

const ChangeLanguage = () => {
  const { language, toggleLanguage } = useLanguageStore();
  const isEnglish = language === "en";

  const handleToggle = () => {
    toggleLanguage();
  };

  return (
    <div className="change-language">
      <h1 style={{ fontWeight: 600 }}>Language</h1>
      <div className="language-toggle-group">
        <span className={`language-label ${isEnglish ? "active" : ""}`}>English</span>
        <div
          className={`language-switch ${isEnglish ? "english" : "arabic"}`}
          onClick={handleToggle}
        >
          <div className="language-thumb" />
        </div>
        <span className={`language-label ${!isEnglish ? "active" : ""}`}>Arabic</span>
      </div>
    </div>
  );
};

export default ChangeLanguage;
