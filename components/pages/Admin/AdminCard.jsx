// src/components/AdminCard.jsx
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import "./styles/admincard.css";
import { ChevronDown } from "lucide-react";

const buildSparklinePath = (values = []) => {
  if (!values.length) return "";

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1; // avoid divide by 0

  return values
    .map((v, i) => {
      const x = (i / (values.length - 1 || 1)) * 100;
      // flip Y for SVG (0 at top)
      const y = 30 - ((v - min) / span) * 26 - 2;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
};

const AdminCard = ({
  title,
  subtitle = null, // small line under title
  value,
  valuePrefix = "", // e.g. "$"
  valueSuffix = "", // e.g. "%"

  icon,
  pill,
  accent = "default", // default | green | red | blue | purple | amber
  size = "md",        // sm | md | lg
  status = "default", // default | good | warning | critical
  layout = "vertical", // vertical | horizontal

  // trend / delta beside value
  delta = null,          // e.g. "+4.3%"
  deltaLabel = "",       // e.g. "vs last week"
  deltaTone = "neutral", // positive | negative | neutral

  expandable = false,
  defaultOpen = false,
  children, // extra details when expanded

  footer = null, // main footer content
  hint = null,   // tiny right-aligned hint in footer

  actions = [], // [{ label, icon, onClick }]

  // copy support
  enableCopy = false,
  copyText = null, // if null we auto-generate summary

  // optional sparkline mini chart
  sparkline = null,       // array of numbers
  sparklineLabel = "",    // tiny label under the chart

  rippleColor = "rgba(255,255,255,0.45)",
  motionPreset = "soft", // soft | bounce | none
  onClick = null,        // card-level click

  loading = false, // skeleton state
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const [pinned, setPinned] = useState(false);
  const [copied, setCopied] = useState(false);
  const rippleRef = useRef(null);

  const cardClass = [
    "admin-card",
    `accent-${accent}`,
    `size-${size}`,
    `layout-${layout}`,
    expandable ? "is-expandable" : "",
    open ? "is-open" : "",
    pinned ? "is-pinned" : "",
    status !== "default" ? `status-${status}` : "",
    `motion-${motionPreset}`,
  ]
    .filter(Boolean)
    .join(" ");

  const handleHeaderClick = (e) => {
    e.stopPropagation();
    triggerRipple(e);

    if (expandable) setOpen((prev) => !prev);
    if (onClick) onClick();
  };

  const handleActionClick = (e, actionOnClick) => {
    e.stopPropagation();
    if (actionOnClick) actionOnClick();
  };

  // ========= TAP RIPPLE EFFECT =========
  const triggerRipple = (e) => {
    const ripple = rippleRef.current;
    if (!ripple) return;

    const rect = ripple.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.setProperty("--ripple-size", `${size}px`);
    ripple.style.setProperty("--ripple-left", `${x}px`);
    ripple.style.setProperty("--ripple-top", `${y}px`);
    ripple.style.setProperty("--ripple-color", rippleColor);

    ripple.classList.remove("show");
    void ripple.offsetWidth; // force reflow
    ripple.classList.add("show");
  };

  // ========= COPY HANDLER =========
  const handleCopy = async (e) => {
    e.stopPropagation();

    const fallbackText =
      copyText ??
      `${title ?? ""}${value !== undefined ? ` — ${valuePrefix}${value}${valueSuffix}` : ""}${
        delta ? ` (${delta}${deltaLabel ? `, ${deltaLabel}` : ""})` : ""
      }`;

    try {
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fallbackText);
      } else {
        const ta = document.createElement("textarea");
        ta.value = fallbackText;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // Motion presets
  const hoverAnimation =
    motionPreset === "soft"
      ? { y: -2, boxShadow: "0 22px 60px rgba(15,23,42,0.32)" }
      : motionPreset === "bounce"
      ? { y: -3, scale: 1.01 }
      : {};

  const tapAnimation =
    motionPreset === "none"
      ? {}
      : {
          scale: 0.985,
        };

  const hasFooterContent = footer || hint;
  const hasSparkline = Array.isArray(sparkline) && sparkline.length >= 2;
  const sparkPath = hasSparkline ? buildSparklinePath(sparkline) : "";

  return (
    <motion.article
      className={cardClass}
      layout
      whileHover={hoverAnimation}
      whileTap={tapAnimation}
      transition={{ type: "spring", stiffness: 280, damping: 26, mass: 0.8 }}
      onDoubleClick={() => setPinned((prev) => !prev)}
    >
      {/* Ripple Layer */}
      <span className="card-ripple" ref={rippleRef} />

      {/* iOS-like Glass Layers */}
      <div className="card-noise" />
      <div className="card-glow ring-1" />
      <div className="card-glow ring-2" />
      <div className="card-shine" />

      {/* HEADER */}
      <header className="card-header" onClick={handleHeaderClick}>
        <div className="card-title-block">
          <div className="card-title">
            {icon && <span className="card-icon">{icon}</span>}
            <div className="card-title-text">
              <span className="card-label">{title}</span>
              {subtitle && <span className="card-subtitle">{subtitle}</span>}
            </div>
          </div>
        </div>

        <div className="card-right">
          {pill && <span className="card-pill">{pill}</span>}

          {enableCopy && (
            <button
              type="button"
              className="card-icon-button has-tooltip"
              onClick={handleCopy}
            >
              <span className="card-icon-button-symbol">⧉</span>
              <span className="card-tooltip">
                {copied ? "Copied!" : "Copy summary"}
              </span>
            </button>
          )}

          {actions?.length > 0 && (
            <div className="card-actions">
              {actions.map((action, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="card-action-btn has-tooltip"
                  onClick={(e) => handleActionClick(e, action.onClick)}
                >
                  {action.icon && (
                    <span className="action-icon">{action.icon}</span>
                  )}
                  {action.label && (
                    <span className="action-label">{action.label}</span>
                  )}
                  {action.tooltip && (
                    <span className="card-tooltip">{action.tooltip}</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {expandable && (
            <span className={`card-chevron ${open ? "rotated" : ""}`}><ChevronDown size={16}/></span>
          )}
        </div>
      </header>

      {/* LOADING SKELETON */}
      {loading && (
        <div className="card-skeleton">
          <div className="card-skeleton-bar big" />
          <div className="card-skeleton-bar" />
          <div className="card-skeleton-bar short" />
        </div>
      )}

      {/* MAIN VALUE + DELTA (when not loading) */}
      {!loading && value !== undefined && (
        <div className="card-value-row" onClick={handleHeaderClick}>
          <div className="card-value-group">
            {valuePrefix && (
              <span className="card-value-affix prefix">{valuePrefix}</span>
            )}
            <div className="card-value">{value}</div>
            {valueSuffix && (
              <span className="card-value-affix suffix">{valueSuffix}</span>
            )}
          </div>

          {delta !== null && (
            <div className={`card-delta delta-${deltaTone}`}>
              <span className="card-delta-value">{delta}</span>
              {deltaLabel && (
                <span className="card-delta-label">{deltaLabel}</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* SPARKLINE MINI-CHART (optional) */}
      {!loading && hasSparkline && (
        <div className="card-sparkline-block">
          <svg
            className="card-sparkline"
            viewBox="0 0 100 30"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="sparkline-stroke" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.35)" />
              </linearGradient>
              <linearGradient id="sparkline-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.38)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>

            {/* Fill under curve */}
            <path
              className="card-sparkline-fill"
              d={`${sparkPath} L 100 30 L 0 30 Z`}
            />

            {/* Line */}
            <path className="card-sparkline-line" d={sparkPath} />
          </svg>

          {sparklineLabel && (
            <div className="card-sparkline-label">{sparklineLabel}</div>
          )}
        </div>
      )}

      {/* FOOTER (compact info row) */}
      {hasFooterContent && (
        <footer className="card-footer">
          {footer && <div className="card-footer-main">{footer}</div>}
          {hint && <div className="card-hint">{hint}</div>}
        </footer>
      )}

      {/* EXPANDABLE INLINE DETAILS */}
      {expandable && !loading && (
        <motion.div
          className="card-details-wrapper"
          layout
          initial={false}
          animate={open ? "open" : "collapsed"}
          variants={{
            open: { opacity: 1, height: "auto", marginTop: "0.9rem" },
            collapsed: { opacity: 0, height: 0, marginTop: 0 },
          }}
          transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <div className="card-details">{children}</div>
        </motion.div>
      )}
    </motion.article>
  );
};

export default AdminCard;
