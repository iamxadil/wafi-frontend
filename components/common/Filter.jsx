import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  SlidersHorizontal,
  Filter as FilterIcon,
  ChevronDown,
  X as XIcon,
  Trash2,
  Eraser,
  CheckCircle2,
} from "lucide-react";

import "../../styles/filter.css";
import useTranslate from "../hooks/useTranslate.jsx";

/* ============================================================
   FILTER COMPONENT — FINAL CLEANED VERSION
============================================================ */
const Filter = ({
  title = "Filters",
  icon = "SlidersHorizontal",
  filters = [],
  selected = {},
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

  /* ============================================================
     🔒 Close drawer when clicking outside + ESC
  ============================================================= */
  useEffect(() => {
    const onDown = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
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

  /* ============================================================
     🧮 Format range values
  ============================================================= */
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

  /* ============================================================
     ✔ Checkbox handler
  ============================================================= */
  const handleCheckboxChange = (filterId, option) => {
    const prev = selected[filterId] || [];

    const newValues = prev.includes(option)
      ? prev.filter((v) => v !== option)
      : [...prev, option];

    onChange({ ...selected, [filterId]: newValues });
  };

  /* ============================================================
     💰 Range handler
  ============================================================= */
  const handleRangeChange = (filterId, field, raw) => {
    const numeric = Number(String(raw).replace(/,/g, "")) || 0;

    const prev = selected[filterId] || {};
    const newValue = { ...prev, [field]: numeric };

    setFormattedValues((p) => ({
      ...p,
      [filterId]: {
        ...(p[filterId] || {}),
        [field]: numeric.toLocaleString(),
      },
    }));

    onChange({ ...selected, [filterId]: newValue });
  };

  /* ============================================================
     🧹 Clear all
  ============================================================= */
  const handleClearAll = () => {
    onClearAll ? onClearAll() : onChange({});
    setOpenSections({});
    setFormattedValues({});
  };

  /* ============================================================
     🎟 Chips for active filters
  ============================================================= */
  const chips = useMemo(() => {
    const out = [];

    for (const [key, val] of Object.entries(selected)) {
      if (Array.isArray(val)) {
        val.forEach((v) => out.push({ key, label: v, value: v }));
      } else if (val && typeof val === "object" && "min" in val && "max" in val) {
        out.push({ key, label: `${val.min} – ${val.max}`, value: "__range__" });
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

  /* ============================================================
     📦 Render options (flat + nested)
  ============================================================= */
  const renderOptions = (filter, options, level = 0) => {
    // Flat array
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

    // Grouped options
    if (typeof options === "object") {
      return Object.entries(options).map(([group, sub]) => {
        const key = `${filter.id}-${group}`;
        const isOpen = openSections[key];

        return (
          <div key={key} className={`f-subgroup level-${level}`}>
            <button className="f-subgroup-h" onClick={() => toggleSection(key)}>
              <span>{group}</span>
              <ChevronDown size={14} className={`chev ${isOpen ? "open" : ""}`} />
            </button>

            <div
              className="f-subgroup-c"
              style={{
                maxHeight: isOpen ? "500px" : 0,
                transition: "max-height 0.25s",
                overflow: "hidden",
              }}
            >
              {renderOptions(filter, sub, level + 1)}
            </div>
          </div>
        );
      });
    }

    return null;
  };

  /* ============================================================
     🖼 Main UI
  ============================================================= */
  return (
    <div className="f-wrap" data-dir={t?.rowReverse === "row-reverse" ? "rtl" : "ltr"}>
      
      {/* ================== Trigger ================== */}
      <button className="f-trigger" onClick={() => setIsOpen(true)} style={{ flexDirection: t.rowReverse }}>
        <IconComponent size={18} />
        <span>{title}</span>
        {selectedCount > 0 && <span className="f-badge">{selectedCount}</span>}
      </button>

      {/* Overlay */}
      <div className={`f-overlay ${isOpen ? "show" : ""}`} />

      {/* ================== Drawer ================== */}
      <aside
        ref={drawerRef}
        className={`f-drawer ${isOpen ? "open" : ""}`}
        style={{ width: drawerWidth }}
      >
        {/* Header */}
        <div className="f-head" style={{ flexDirection: t.rowReverse }}>
          <div className="f-head-title">
            <IconComponent size={18} />
            <span>{title}</span>
            {selectedCount > 0 && <span className="f-count">({selectedCount})</span>}
          </div>

          <button className="f-x" onClick={() => setIsOpen(false)}>
            <XIcon size={20} />
          </button>
        </div>

        {/* ================== Chips ================== */}
        {chips.length > 0 && (
          <div className="f-chips">
            {chips.map((c, i) => (
              <span key={i} className="f-chip">
                <span className="f-chip-t">{c.label}</span>
                <button className="f-chip-x" onClick={() => removeChip(c)}>
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

        {/* ================== Body ================== */}
        <div className="f-body">
          {filters.map((filter) => (
            <div key={filter.id} className="f-group">
              
              {/* Group Header */}
              <button
                className="f-group-h"
                onClick={() => toggleSection(filter.id)}
                style={{ flexDirection: t.rowReverse }}
              >
                <h4>{filter.label}</h4>
                <ChevronDown size={16} className={`chev ${openSections[filter.id] ? "open" : ""}`} />
              </button>

              {/* Group Body */}
              <div className="f-group-c" style={{ maxHeight: openSections[filter.id] ? "900px" : 0 }}>
                
                {/* Checkbox Filters */}
                {filter.type === "checkbox" && renderOptions(filter, filter.options)}

                {/* Range Filter */}
                {filter.type === "range" && (
                  <div className="f-range">
                    
                    {/* Inputs */}
                  <div className="f-range-inputs">
                    <div className="f-input-w">
                      <span className="f-innr-lbl">Min</span>
                      <input
                        inputMode="numeric"
                        value={
                          formattedValues[filter.id]?.min ??
                          selected[filter.id]?.min ??
                          filter.min
                        }
                        onChange={(e) => handleRangeChange(filter.id, "min", e.target.value)}
                      />
                    </div>

                    <span className="f-dash">–</span>

                    <div className="f-input-w">
                      <span className="f-innr-lbl">Max</span>
                      <input
                        inputMode="numeric"
                        value={
                          formattedValues[filter.id]?.max ??
                          selected[filter.id]?.max ??
                          filter.max
                        }
                        onChange={(e) => handleRangeChange(filter.id, "max", e.target.value)}
                      />
                    </div>
                  </div>
                    {/* Dual slider */}
                    <div className="f-range-sliders">
                      <input
                        type="range"
                        min={filter.min}
                        max={filter.max}
                        step={filter.step}
                        value={selected[filter.id]?.min ?? filter.min}
                        onChange={(e) => handleRangeChange(filter.id, "min", e.target.value)}
                        className="f-slider thumb-min"
                      />

                      <input
                        type="range"
                        min={filter.min}
                        max={filter.max}
                        step={filter.step}
                        value={selected[filter.id]?.max ?? filter.max}
                        onChange={(e) => handleRangeChange(filter.id, "max", e.target.value)}
                        className="f-slider thumb-max"
                      />
                    </div>

                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ================== Footer ================== */}
        <div className="f-foot">
          <button className="f-clear" onClick={handleClearAll}>
            <Eraser size={16} />
            <span>Clear</span>
          </button>

          <button className="f-apply" onClick={() => { setIsOpen(false); onApply?.(selected); }}>
            <CheckCircle2 size={18} />
            <span>Apply</span>
          </button>
        </div>

      </aside>
    </div>
  );
};

export default Filter;
