// Filter.jsx
import React, { useState, useEffect, useRef } from "react";
import * as Icons from "lucide-react";
import "../../styles/filter.css";
import useTranslate from "../hooks/useTranslate";

const Filter = ({
  title = "Filters",
  icon = "SlidersHorizontal",
  filters = [],
  selected = {},
  onChange,
  onClearAll,              // ✅ new (optional)
  overlayMode = true,
  width
}) => {
  const IconComponent = Icons[icon] || Icons.Filter;
  const [isOpen, setIsOpen] = useState(false);
  const [openSections, setOpenSections] = useState({});
  const [formattedValues, setFormattedValues] = useState({});
  const filterRef = useRef(null);
  const t = useTranslate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const formatted = {};
    Object.keys(selected).forEach((key) => {
      const entry = selected[key];
      if (entry && typeof entry === "object") {
        const minVal =
          typeof entry.min === "number" && !isNaN(entry.min) ? entry.min : 0;
        const maxVal =
          typeof entry.max === "number" && !isNaN(entry.max) ? entry.max : 0;

        formatted[key] = {
          min: minVal.toLocaleString(),
          max: maxVal.toLocaleString(),
        };
      }
    });
    setFormattedValues(formatted);
  }, [selected]);


  const toggleSection = (id) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleCheckboxChange = (filterId, option) => {
    const prev = selected[filterId] || [];
    const newValues = prev.includes(option)
      ? prev.filter((v) => v !== option)
      : [...prev, option];
    onChange({ ...selected, [filterId]: newValues });
  };

  const handleRangeChange = (filterId, field, value) => {
    const numeric = Number(String(value).replace(/,/g, ""));
    const prev = selected[filterId] || {};
    const newValue = { ...prev, [field]: numeric };

    setFormattedValues((prevFmt) => ({
      ...prevFmt,
      [filterId]: {
        ...prevFmt[filterId],
        [field]: numeric.toLocaleString(),
      },
    }));

    onChange({
      ...selected,
      [filterId]: newValue,
    });
  };

  const handleClearAll = () => {
    if (onClearAll) onClearAll();     // ✅ call store reset when provided
    else onChange({});                // fallback (works if parent replaces)
    setOpenSections({});
    setFormattedValues({});
  };

  const renderSelectedChips = () => {
    const grouped = [];

    Object.entries(selected).forEach(([key, value]) => {
      const def = filters.find((f) => f.id === key);
      if (!def || def.type !== "checkbox") return;
      if (Array.isArray(value) && value.length) {
        grouped.push({ id: key, label: def.label, values: value });
      }
    });

    if (!grouped.length) return null;

    return (
      <div className="filter-chips-floating">
        {grouped.map((g) => (
          <div key={g.id} className="filter-chip-group">
            <span className="group-label">{g.label}:</span>
            <span className="group-values">{g.values.join(", ")}</span>
            <Icons.X
              size={13}
              className="remove-group"
              onClick={() => {
                const next = { ...selected };
                delete next[g.id];
                onChange(next);
              }}
            />
          </div>
        ))}
        <button className="clear-all-mini" onClick={handleClearAll}>
          <Icons.XCircle size={13} />
          Clear All
        </button>
      </div>
    );
  };

  return (
    <div
      ref={filterRef}
      className={`filter-container ${isOpen ? "open" : ""} ${overlayMode ? "overlay-mode" : ""}`}
    >
      <button className="filter-toggle" style={{flexDirection: t.rowReverse}} onClick={() => setIsOpen((p) => !p)}>
        <IconComponent size={18} />
        <span>{title}</span>
        <Icons.ChevronDown size={16} className={`chevron ${isOpen ? "open" : ""}`} />
      </button>

      {renderSelectedChips()}

      <div className="filter-body" style={{width: `${width}%`}}>
        {filters.map((filter) => (
          <div key={filter.id} className={`filter-group ${openSections[filter.id] ? "open" : ""}`}>
            <div className="filter-group-header" style={{flexDirection: t.rowReverse}} onClick={() => toggleSection(filter.id)}>
              <h4>{filter.label}</h4>
              <Icons.ChevronDown size={14} className={`chevron ${openSections[filter.id] ? "open" : ""}`} />
            </div>

            <div className="filter-group-content">
              {filter.type === "checkbox" &&
                filter.options.map((opt) => (
                  <label key={opt} className="filter-option">
                    <input
                      type="checkbox"
                      checked={selected[filter.id]?.includes(opt) || false}
                      onChange={() => handleCheckboxChange(filter.id, opt)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}

              {filter.type === "range" && (
                <div className="filter-range">
                  <div className="range-inputs">
                    <input
                      type="text"
                      value={formattedValues[filter.id]?.min ?? filter.min.toLocaleString()}
                      onChange={(e) => handleRangeChange(filter.id, "min", e.target.value)}
                    />
                    <span className="dash">–</span>
                    <input
                      type="text"
                      value={formattedValues[filter.id]?.max ?? filter.max.toLocaleString()}
                      onChange={(e) => handleRangeChange(filter.id, "max", e.target.value)}
                    />
                  </div>

                  <input
                    type="range"
                    className="range-slider"
                    min={filter.min}
                    max={filter.max}
                    step={filter.step}
                    value={selected[filter.id]?.min ?? filter.min}
                    onChange={(e) => handleRangeChange(filter.id, "min", e.target.value)}
                  />
                  <input
                    type="range"
                    className="range-slider"
                    min={filter.min}
                    max={filter.max}
                    step={filter.step}
                    value={selected[filter.id]?.max ?? filter.max}
                    onChange={(e) => handleRangeChange(filter.id, "max", e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        ))}

        {Object.keys(selected).length > 0 && (
          <div className="filter-clear">
            <button onClick={handleClearAll}>
              <Icons.X size={14} />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Filter;
