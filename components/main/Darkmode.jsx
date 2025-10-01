import React, { useState, useEffect } from 'react';
import { RiMoonLine as MoonIcon } from "react-icons/ri";
import { RiSunLine as SunIcon } from "react-icons/ri";

const DarkMode = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <li onClick={toggleTheme} style={{ cursor: "pointer" }}  className="icon">
      <span style={{ display: "inline-flex", alignItems: "center"}}>
        {theme === "light" ? <MoonIcon /> : <SunIcon />}
      </span>
      {theme === "light" ? <span className='text'>Dark Mode</span> : <span className='text'>Light Mode</span>}
    </li>
  );
};

export default DarkMode;
