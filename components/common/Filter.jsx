import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  SlidersHorizontal,
  Filter as FilterIcon,
  ChevronDown,
  X as XIcon, // ✅ renamed to avoid JSX tag conflict
  Trash2,
  Eraser,
  CheckCircle2,
} from "lucide-react";
import "../../styles/filter.css";
import useTranslate from "../hooks/useTranslate.jsx";

const Filter = ({
  title = "Filters",
  icon = "SlidersHorizontal",
  filters = [], // [{ id, label, type: 'checkbox'|'range', icon?: string, options?, min,max,step }]
  selected = {}, // { brand: ['Asus'], price: {min: 300, max: 1200}, ... }
  onChange,
  onClearAll,
  width,
  onApply,
}) => {
  const IconComponent = icon === "SlidersHorizontal" ? SlidersHorizontal : FilterIcon;
  const [isOpen, setIsOpen] = useState(false);
  const [openSections, setOpenSections] = useState({});
  const [formattedValues, setFormattedValues] = useState({});
  const drawerRef = useRef(null);
  const t = useTranslate();

  /* ===============================
     Close on outside click / ESC
  =============================== */
  useEffect(() => {
    const onDown = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) setIsOpen(false);
    };
    const onEsc = (e) => e.key === "Escape" && setIsOpen(false);
    if (isOpen) {
      document.addEventListener("mousedown", onDown);
      document.addEventListener("keydown", onEsc);
    }
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [isOpen]);

  /* ===============================
     Format numeric ranges
  =============================== */
  useEffect(() => {
    const formatted = {};
    for (const key in selected) {
      const entry = selected[key];
      if (entry && typeof entry === "object" && "min" in entry && "max" in entry) {
        formatted[key] = {
          min: entry.min?.toLocaleString() ?? "",
          max: entry.max?.toLocaleString() ?? "",
        };
      }
    }
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

  const handleRangeChange = (filterId, field, raw) => {
    const numeric = Number(String(raw).replace(/,/g, "")) || 0;
    const prev = selected[filterId] || {};
    const newValue = { ...prev, [field]: numeric };
    setFormattedValues((p) => ({
      ...p,
      [filterId]: { ...(p[filterId] || {}), [field]: numeric.toLocaleString() },
    }));
    onChange({ ...selected, [filterId]: newValue });
  };

  const handleClearAll = () => {
    onClearAll ? onClearAll() : onChange({});
    setOpenSections({});
    setFormattedValues({});
  };

  /* ===============================
     Chips (active selections)
  =============================== */
  const chips = useMemo(() => {
    const out = [];
    for (const [key, val] of Object.entries(selected)) {
      if (Array.isArray(val) && val.length) {
        val.forEach((v) => out.push({ key, label: v, value: v }));
      } else if (val && typeof val === "object" && "min" in val && "max" in val) {
        out.push({ key, label: `${val.min ?? ""} – ${val.max ?? ""}`, value: "__range__" });
      }
    }
    return out;
  }, [selected]);

  const removeChip = (chip) => {
    if (chip.value === "__range__") {
      const { [chip.key]: _, ...rest } = selected;
      onChange(rest);
    } else {
      const arr = selected[chip.key] || [];
      onChange({ ...selected, [chip.key]: arr.filter((v) => v !== chip.value) });
    }
  };

  const selectedCount = chips.length;
  const drawerWidth = width ? `${width}px` : "360px";

  /* ===============================
     Render Filter Options
  =============================== */
/* ===============================
   Render Filter Options (recursive)
=============================== */
const renderFilterOptions = (filter, level = 0) => {
  if (filter.type !== "checkbox") return null;

  const options = filter.options;
  if (!options) return null;

  // Case 1: flat array
  if (Array.isArray(options)) {
    return options.map((opt) => (
      <label key={opt} className={`f-option level-${level}`}>
        <input
          type="checkbox"
          checked={selected[filter.id]?.includes(opt) || false}
          onChange={() => handleCheckboxChange(filter.id, opt)}
        />
        <span>{opt}</span>
      </label>
    ));
  }

  // Case 2: grouped object
  if (typeof options === "object") {
    return Object.entries(options).map(([group, subOptions]) => {
      const groupKey = `${filter.id}-${group}`;
      const isOpen = openSections[groupKey];

      return (
        <div key={groupKey} className={`f-subgroup level-${level}`}>
          <button
            type="button"
            className="f-subgroup-h"
            onClick={() => toggleSection(groupKey)}
          >
            <span>{group}</span>
            <ChevronDown
              size={14}
              className={`chev ${isOpen ? "open" : ""}`}
            />
          </button>

          <div
            className="f-subgroup-c"
            style={{
              maxHeight: isOpen ? "500px" : 0,
              overflow: "hidden",
              transition: "max-height 0.25s ease",
            }}
          >
            {/* 🔁 Recursion here */}
            {renderFilterOptions(
              { ...filter, options: subOptions },
              level + 1
            )}
          </div>
        </div>
      );
    });
  }

  return null;
};


  /* ===============================
     Render
  =============================== */
  return (
    <div className="f-wrap" data-dir={t?.rowReverse === "row-reverse" ? "rtl" : "ltr"}>
      {/* Trigger */}
      <button
        className="f-trigger"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-controls="filters-drawer"
        style={{ flexDirection: t.rowReverse }}
      >
        <IconComponent size={18} />
        <span>{title}</span>
        {selectedCount > 0 && <span className="f-badge">{selectedCount}</span>}
      </button>

      {/* Overlay */}
      <div className={`f-overlay ${isOpen ? "show" : ""}`} aria-hidden={!isOpen} />

      {/* Drawer */}
      <aside
        id="filters-drawer"
        ref={drawerRef}
        className={`f-drawer ${isOpen ? "open" : ""}`}
        style={{ width: drawerWidth }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Header */}
        <div className="f-head" style={{ flexDirection: t.rowReverse }}>
          <div className="f-head-title">
            <IconComponent size={18} />
            <span>{title}</span>
            {selectedCount > 0 && <span className="f-count">({selectedCount})</span>}
          </div>
          <button className="f-x" onClick={() => setIsOpen(false)} aria-label="Close">
            <XIcon size={20} />
          </button>
        </div>

        {/* Chips */}
        {chips.length > 0 && (
          <div className="f-chips" role="list">
            {chips.map((c, idx) => (
              <span key={`${c.key}-${c.label}-${idx}`} className="f-chip" role="listitem">
                <span className="f-chip-t">{c.label}</span>
                <button className="f-chip-x" onClick={() => removeChip(c)} aria-label="Remove">
                  <XIcon size={14} />
                </button>
              </span>
            ))}
            <button className="f-chip-clear" onClick={handleClearAll}>
              <Trash2 size={14} />
              <span>Clear all</span>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="f-body">
          {filters.map((filter) => (
            <div key={filter.id} className="f-group">
              <button
                type="button"
                className="f-group-h"
                onClick={() => toggleSection(filter.id)}
                style={{ flexDirection: t.rowReverse }}
              >
                <h4>{filter.label}</h4>
                <ChevronDown
                  size={16}
                  className={`chev ${openSections[filter.id] ? "open" : ""}`}
                />
              </button>

              <div
                className="f-group-c"
                style={{ maxHeight: openSections[filter.id] ? "900px" : 0 }}
              >
                {filter.type === "checkbox" && renderFilterOptions(filter)}

                {filter.type === "range" && (
                  <div className="f-range">
                    <div className="f-range-inputs">
                      <div className="f-input-w">
                        <span className="f-innr-lbl">Min</span>
                        <input
                          inputMode="numeric"
                          value={
                            formattedValues[filter.id]?.min ??
                            filter.min?.toLocaleString?.() ??
                            ""
                          }
                          onChange={(e) =>
                            handleRangeChange(filter.id, "min", e.target.value)
                          }
                        />
                      </div>
                      <span className="f-dash">–</span>
                      <div className="f-input-w">
                        <span className="f-innr-lbl">Max</span>
                        <input
                          inputMode="numeric"
                          value={
                            formattedValues[filter.id]?.max ??
                            filter.max?.toLocaleString?.() ??
                            ""
                          }
                          onChange={(e) =>
                            handleRangeChange(filter.id, "max", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <input
                      type="range"
                      className="f-slider"
                      min={filter.min}
                      max={filter.max}
                      step={filter.step}
                      value={selected[filter.id]?.min ?? filter.min}
                      onChange={(e) =>
                        handleRangeChange(filter.id, "min", e.target.value)
                      }
                    />
                    <input
                      type="range"
                      className="f-slider"
                      min={filter.min}
                      max={filter.max}
                      step={filter.step}
                      value={selected[filter.id]?.max ?? filter.max}
                      onChange={(e) =>
                        handleRangeChange(filter.id, "max", e.target.value)
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="f-foot">
          <button className="f-clear" onClick={handleClearAll}>
            <Eraser size={16} />
            <span>Clear</span>
          </button>
          <button
            className="f-apply"
            onClick={() => {
              setIsOpen(false);
              onApply?.(selected);
            }}
          >
            <CheckCircle2 size={18} />
            <span>Apply</span>
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Filter;
