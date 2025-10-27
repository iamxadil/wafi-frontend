// src/components/SearchDropdown.jsx
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useTranslate from "../hooks/useTranslate.jsx";

const SearchDropdown = ({ products = [], width = 600, value, onChange }) => {

  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const t = useTranslate();

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty("--x", `${x}%`);
    e.currentTarget.style.setProperty("--y", `${y}%`);
  };

  return (
    <motion.div
      id="search-container"
      style={{ maxWidth: `${width}px`, minWidth: "175px" }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Input wrapper */}
      <div className="search-input-wrapper" >
        <SearchIcon className="search-icon" />
       <input
          type="search"
          dir={t.language === "ar" ? "rtl" : "ltr"}        
          style={{ textAlign: t.textAlign }}            
          placeholder={t("Search for products...", "ابحث عن المنتجات")}
          ref={inputRef}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 120)}
        />

      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isFocused && value && (
          <motion.div
            className="search-results"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {products.length > 0 ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
                  },
                }}
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product._id || product.id}
                    variants={{
                      hidden: { opacity: 0, y: 8 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={`search-result-item ${
                      activeIndex === index ? "active" : ""
                    }`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseMove={handleMouseMove}
                    onMouseDown={() => navigate(`/product/${product._id}`)}
                  >
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="search-result-img"
                    />
                    <div className="search-result-info">
                      <span className="search-result-name">{product.name}</span>
                      <span className="search-result-brand">{product.brand}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="search-no-results">
                No results found for "{value}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchDropdown;
