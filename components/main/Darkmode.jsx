import React, { useState, useEffect, useRef } from "react";
import { Sun, Moon } from "lucide-react";
import "../../styles/darkmode.css";

const DarkMode = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const toggleRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const createTransitionOverlay = (currentTheme, x, y) => {
    const overlay = document.createElement("div");
    overlay.className = `theme-transition-full ${currentTheme}`;
    overlay.style.setProperty("--ripple-x", `${x}px`);
    overlay.style.setProperty("--ripple-y", `${y}px`);

    const content = document.createElement("div");
    content.className = "transition-center";

    const iconMarkup =
      currentTheme === "light"
        ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="110" height="110" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.64 13.65A9 9 0 1 1 10.35 2.36a7 7 0 1 0 11.29 11.29z"/></svg>` // Moon
        : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="110" height="110" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`; // Sun

    content.innerHTML = `
      <div class="transition-icon-full">${iconMarkup}</div>
      <div class="transition-text">${currentTheme === "light" ? "Dark Mode" : "Light Mode"}</div>
    `;

    overlay.appendChild(content);
    document.body.appendChild(overlay);

    // 🔥 Switch theme at the *end* of the expansion (≈ ripple fully grown)
    setTimeout(() => {
      setTheme((prev) => (prev === "light" ? "dark" : "light"));
    }, 500); // slightly later than before

    // Clean up overlay
    setTimeout(() => {
      overlay.classList.add("fade-out");
      setTimeout(() => overlay.remove(), 600);
    }, 1400);
  };

  const toggleTheme = () => {
    const rect = toggleRef.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    createTransitionOverlay(theme, x, y);
  };

  return (
    <li className="darkmode-toggle" ref={toggleRef} onClick={toggleTheme}>
      <div className={`toggle-switch ${theme}`}>
        <div className="toggle-ball">
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </div>
      </div>
    </li>
  );
};

export default DarkMode;
