import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/pagination.css";
import { ArrowRight, ArrowLeft } from 'lucide-react';

const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  const [activePos, setActivePos] = useState({ left: 0, width: 0 });
  const containerRef = useRef(null);

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
    if (currentPage - delta > 2) range.unshift("...");
    if (currentPage + delta < totalPages - 1) range.push("...");
    range.unshift(1);
    if (totalPages > 1) range.push(totalPages);
    return range;
  };

  const pages = getVisiblePages(currentPage, totalPages);

  // Measure active button position for sliding highlight
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

  return (
    <nav className="pagination">
      {/* Prev */}
      <motion.button
        className="page-nav"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        whileTap={{ scale: 0.9 }}
      >
         <ArrowLeft />
      </motion.button>

      {/* Pages */}
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
          page === "..." ? (
            <span key={`ellipsis-${i}`} className="page-ellipsis">
              ...
            </span>
          ) : (
            <motion.button
              key={`page-${page}`}
              className={`page-btn ${page === currentPage ? "active" : ""}`}
              onClick={() => onPageChange(page)}
              whileTap={{ scale: 0.9 }}
              whileHover={{ y: -2 }}
            >
              {page}
            </motion.button>
          )
        )}
      </div>

      {/* Mobile Compact */}
      <AnimatePresence mode="wait">
        {totalPages > 1 && (
          <motion.div
            key={`compact-${currentPage}`}
            className="pagination-compact"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <span>
              {currentPage} / {totalPages}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next */}
      <motion.button
        className="page-nav"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowRight />
      </motion.button>
    </nav>
  );
};

export default Pagination;
