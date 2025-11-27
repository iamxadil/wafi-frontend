// src/components/SearchDropdown.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useTranslate from "../hooks/useTranslate.jsx";

const SearchDropdown = ({ products = [], width = 600, value, onChange }) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const navigate = useNavigate();
  const t = useTranslate();

  /* -------------------------------------------------------
      🔥 KEYBOARD NAVIGATION
  ------------------------------------------------------- */
  const handleKeyDown = (e) => {
    if (!isOpen) return;

    const count = products.length;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (count > 0) setActiveIndex((prev) => (prev + 1) % count);
        break;

      case "ArrowUp":
        e.preventDefault();
        if (count > 0)
          setActiveIndex((prev) => (prev - 1 + count) % count);
        break;

      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && products[activeIndex]) {
          navigate(`/product/${products[activeIndex]._id}`);
        } else {
          navigate(`/search?query=${value}`);
        }
        setIsOpen(false);
        break;

      case "Escape":
        inputRef.current.blur();
        break;
    }
  };

  /* -------------------------------------------------------
      🔥 AUTO SCROLL ACTIVE
  ------------------------------------------------------- */
  useEffect(() => {
    const container = resultsRef.current;
    const item = container?.querySelector(`[data-index="${activeIndex}"]`);

    if (item) {
      setTimeout(() => {
        item.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }, 50);
    }
  }, [activeIndex]);

  return (
    <motion.div
      id="search-container"
      style={{ maxWidth: `${width}px`, minWidth: "175px" }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* ---------------------------------- */}
      {/* 🔍 INPUT */}
      {/* ---------------------------------- */}
      <div className="search-input-wrapper">
        <SearchIcon className="search-icon" />

        <input
          type="search"
          ref={inputRef}
          value={value}
          onChange={(e) => {
            onChange(e);
            setIsOpen(e.target.value.length > 0);   // ONLY OPEN WHEN NOT EMPTY
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (value.length > 0) setIsOpen(true);
            setActiveIndex(-1);
          }}
          placeholder={t("Search for products...", "ابحث عن المنتجات")}
          dir={t.language === "ar" ? "rtl" : "ltr"}
          style={{ textAlign: t.textAlign }}
        />
      </div>

      {/* ---------------------------------- */}
      {/* 🔽 DROPDOWN */}
      {/* ---------------------------------- */}
      <AnimatePresence>
        {isOpen && value && (
          <motion.div
            className="search-results"
            ref={resultsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {products.length ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
                  },
                }}
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    data-index={index}
                    variants={{
                      hidden: { opacity: 0, y: 8 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.2 }}
                    className={`search-result-item ${
                      activeIndex === index ? "active" : ""
                    }`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseDown={() => {
                      navigate(`/product/${product._id}`);
                      setIsOpen(false); // ONLY CLOSE ON SELECT
                    }}
                  >
                    <img
                      src={product.images?.[0]}
                      className="search-result-img"
                    />

                    <div className="search-result-info">
                      <span className="search-result-name">
                        {product.name}
                      </span>
                      <span className="search-result-price">
                        {product.finalPrice.toLocaleString()} IQD
                      </span>
                      <span className="search-result-brand">
                        {product.brand}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="search-no-results">
                {t("No results found for", "لا توجد نتائج لـ")} "{value}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchDropdown;
