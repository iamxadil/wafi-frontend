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

  /* ------------------------------------------------------------
     SORT OPTIONS (Cleaned, Correct Values Only)
  ------------------------------------------------------------ */
  const sortOptions = [
    { value: "alpha-asc", label: t("Alphabetically (A → Z)", "أبجديًا (A → Z)") },
    { value: "alpha-desc", label: t("Alphabetically (Z → A)", "أبجديًا (Z → A)") },
    { value: "price-asc", label: t("Price (Low → High)", "السعر (الأقل → الأعلى)") },
    { value: "price-desc", label: t("Price (High → Low)", "السعر (الأعلى → الأقل)") },
    { value: "date-desc", label: t("Newest First", "الأحدث أولًا") },
    { value: "date-asc", label: t("Oldest First", "الأقدم أولًا") },
  ];

  /* ------------------------------------------------------------
     CLOSE ON OUTSIDE CLICK
  ------------------------------------------------------------ */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ------------------------------------------------------------
     CLOSE ON WINDOW RESIZE
  ------------------------------------------------------------ */
  useEffect(() => {
    setIsOpen(false);
  }, [width]);

  /* ------------------------------------------------------------
     SELECT HANDLER
  ------------------------------------------------------------ */
  const handleSelect = (value) => {
    onChange?.(value);
    setIsOpen(false);
  };

  const currentOption =
    sortOptions.find((opt) => opt.value === selected)?.label ||
    t("Default", "الافتراضي");

  /* ------------------------------------------------------------
     RENDER
  ------------------------------------------------------------ */
  return (
    <div
      ref={sortRef}
      className={`sort-container ${isOpen ? "open" : ""} ${
        overlayMode ? "overlay-mode" : ""
      }`}
    >
      {/* TOGGLE BUTTON */}
      <button
        className="sort-toggle"
        onClick={() => setIsOpen((p) => !p)}
        title={currentOption}
        style={{ flexDirection: t.rowReverse }}
      >
        <IconComponent size={18} />

        <span className="sort-title">
          {t(title, "ترتيب حسب")}
        </span>

        <Icons.ChevronDown
          size={16}
          className={`chevron ${isOpen ? "open" : ""}`}
          style={{
            transform: isOpen
              ? "rotate(180deg)"
              : t.isRTL
              ? "rotate(90deg)"
              : "rotate(0deg)",
          }}
        />
      </button>

      {/* DROPDOWN */}
      <div
        className="sort-dropdown"
        style={{
          [t.positionAlign]: "0",
          transform: isOpen ? "scale(1)" : "scale(0.95)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        {sortOptions.map((opt) => (
          <button
            key={opt.value}
            className={`sort-option ${selected === opt.value ? "active" : ""}`}
            onClick={() => handleSelect(opt.value)}
            title={opt.label}
          >
            <span className="sort-option-text">{opt.label}</span>

            {selected === opt.value && (
              <Icons.Check size={16} className="check-icon" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sort;
