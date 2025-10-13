import React, { useState, useEffect } from "react";
import { RiMoonLine as MoonIcon, RiSunLine as SunIcon } from "react-icons/ri";
import "../../styles/darkmode.css";

const DarkMode = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === "light" ? "dark" : "light"));

  return (
    <li className="darkmode-toggle" onClick={toggleTheme}>
      <div className={`toggle-switch ${theme}`}>
        <div className="toggle-ball">
          {theme === "light" ? <MoonIcon size={18} /> : <SunIcon size={18} />}
        </div>
      </div>
    </li>
  );
};

export default DarkMode;
