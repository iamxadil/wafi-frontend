import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/pagination.css";
import { ArrowRight, ArrowLeft } from "lucide-react";

const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  const containerRef = useRef(null);
  const touchStartX = useRef(null);
  const [activePos, setActivePos] = useState({ left: 0, width: 0 });

  /* ==========================
     Visible Pages (Desktop)
  ========================== */
  const getVisiblePages = (currentPage, totalPages) => {
    if (totalPages <= 1) return [];
    const delta = 2;
    const range = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) range.unshift("…");
    if (currentPage + delta < totalPages - 1) range.push("…");

    range.unshift(1);
    range.push(totalPages);

    return range;
  };

  const pages = getVisiblePages(currentPage, totalPages);

  /* ==========================
     Active Slider Highlight
  ========================== */
  useEffect(() => {
    if (!containerRef.current) return;
    const active = containerRef.current.querySelector(".page-btn.active");
    if (active) {
      const rect = active.getBoundingClientRect();
      const parentRect = containerRef.current.getBoundingClientRect();
      setActivePos({
        left: rect.left - parentRect.left,
        width: rect.width,
      });
    }
  }, [currentPage, totalPages, pages.length]);

  /* ==========================
       Ripple Effect
  ========================== */
  const createRipple = (event) => {
    const button = event.currentTarget;
    const circle = document.createElement("span");

    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - (button.offsetLeft + radius)}px`;
    circle.style.top = `${event.clientY - (button.offsetTop + radius)}px`;
    circle.classList.add("ripple");

    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) ripple.remove();

    button.appendChild(circle);
  };

  /* ==========================
      Mobile Swipe Gestures
  ========================== */
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;

    const diff = e.changedTouches[0].clientX - touchStartX.current;

    if (Math.abs(diff) > 60) {
      // vibrate (soft haptic)
      if (navigator.vibrate) navigator.vibrate(10);

      if (diff < 0 && currentPage < totalPages) {
        onPageChange(currentPage + 1);
      }
      if (diff > 0 && currentPage > 1) {
        onPageChange(currentPage - 1);
      }
    }

    touchStartX.current = null;
  };

  /* ==========================
       MAIN RENDER
  ========================== */
  return (
    <nav
      className="pagination"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Prev Button */}
      <motion.button
        className="page-nav"
        disabled={currentPage === 1}
        onClick={(e) => {
          createRipple(e);
          if (navigator.vibrate) navigator.vibrate(15);
          onPageChange(Math.max(currentPage - 1, 1));
        }}
        whileTap={{ scale: 0.88 }}
      >
        <ArrowLeft size={18} />
      </motion.button>

      {/* Desktop Pages */}
      <div className="pagination-pages" ref={containerRef}>
        <AnimatePresence initial={false}>
          {activePos.width > 0 && (
            <motion.div
              key={`highlight-${currentPage}`}
              className="page-highlight"
              initial={false}
              animate={{ left: activePos.left, width: activePos.width }}
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          )}
        </AnimatePresence>

        {pages.map((page, i) =>
          page === "…" ? (
            <span key={i} className="page-ellipsis">…</span>
          ) : (
            <motion.button
              key={page}
              className={`page-btn ${page === currentPage ? "active" : ""}`}
              onClick={(e) => {
                createRipple(e);
                if (navigator.vibrate) navigator.vibrate(15);
                onPageChange(page);
              }}
              whileTap={{ scale: 0.9 }}
              whileHover={{ y: -2 }}
            >
              {page}
            </motion.button>
          )
        )}
      </div>

      {/* Mobile Compact Display */}
      <motion.div
        className="pagination-compact"
        key={`compact-${currentPage}`}
        initial={{ opacity: 0, y: 7 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -7 }}
        transition={{ duration: 0.2 }}
      >
        {currentPage}/{totalPages}
      </motion.div>

      {/* Next Button */}
      <motion.button
        className="page-nav"
        disabled={currentPage === totalPages}
        onClick={(e) => {
          createRipple(e);
          if (navigator.vibrate) navigator.vibrate(15);
          onPageChange(Math.min(currentPage + 1, totalPages));
        }}
        whileTap={{ scale: 0.88 }}
      >
        <ArrowRight size={18} />
      </motion.button>
    </nav>
  );
};

export default Pagination;
