import React from "react";
import useWindowWidth from "../hooks/useWindowWidth.jsx";
import "../../styles/filterselect.css";

/**
 * Clean, glassy, left-aligned filter/sort select
 * Uses CSS variables and pure styling.
 */
const FilterSelect = ({ value, options, onChange, placeholder = "Select" }) => {
  const width = useWindowWidth();
  const isMobile = width <= 650;
  const isPlaceholder = value === "";

  return (
    <div className={`filter-select-wrapper ${isMobile ? "mobile" : "desktop"}`}>
      <select
        className={`filter-select ${isPlaceholder ? "placeholder" : ""}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterSelect;
