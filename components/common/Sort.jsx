import React, { useState, useEffect, useRef } from "react";
import * as Icons from "lucide-react";
import "../../styles/sort.css";
import useWindowWidth from "../hooks/useWindowWidth";
import useTranslate from "../hooks/useTranslate.jsx";

const Sort = ({
  title = "Sort by",
  icon = "ArrowUpDown",
  selected,
  onChange,
  overlayMode = true,
}) => {
  const IconComponent = Icons[icon] || Icons.ArrowUpDown;
  const [isOpen, setIsOpen] = useState(false);
  const sortRef = useRef(null);
  const width = useWindowWidth();
  const t = useTranslate();

  // 🧩 Internal sort options
  const sortOptions = [
    { value: "alpha-asc", label: "Alphabetically (A → Z)" },
    { value: "alpha-desc", label: "Alphabetically (Z → A)" },
    { value: "price-desc", label: "Price (High → Low)" },
    { value: "price-asc", label: "Price (Low → High)" },
    { value: "date-desc", label: "Date (Newest → Oldest)" },
    { value: "date-asc", label: "Date (Oldest → Newest)" },
    { value: "offers", label: "Offers / Discounts" },
  ];

  // 🧠 Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value) => {
    onChange?.(value);
    setIsOpen(false);
  };

  const currentOption =
    sortOptions.find((opt) => opt.value === selected)?.label || "Default";

  return (
    <div
      ref={sortRef}
      className={`sort-container ${isOpen ? "open" : ""} ${
        overlayMode ? "overlay-mode" : ""
      }`}
    >
      {/* === TOGGLE BUTTON === */}
      <button
        className="sort-toggle"
        onClick={() => setIsOpen((p) => !p)}
        title={currentOption} // Tooltip for truncated text
        style={{flexDirection: t.rowReverse}}
      >
        <IconComponent size={18} />
        <span className="sort-title">{title} </span>
      
        <Icons.ChevronDown
          size={16}
          className={`chevron ${isOpen ? "open" : ""}`}
        />
      </button>

      {/* === DROPDOWN === */}
      <div className="sort-dropdown">
        {sortOptions.map((opt) => (
          <button
            key={opt.value}
            className={`sort-option ${
              selected === opt.value ? "active" : ""
            }`}
            onClick={() => handleSelect(opt.value)}
            title={opt.label} // Tooltip on each item
          >
            <span className="sort-option-text">{opt.label}</span>
            {selected === opt.value && (
              <Icons.Check size={14} className="check-icon" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sort;
