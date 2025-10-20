// src/components/SearchDropdown.jsx
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { SearchIcon } from "lucide-react"; 
import { useNavigate } from "react-router-dom";

const SearchDropdown = ({ products = [], width, value, onChange }) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      id="search-container"
      style={{ position: "relative", maxWidth: `${width}px`, minWidth: "175px", zIndex: 500 }}
    >
      <input
        type="search"
        placeholder="Search for products..."
        ref={inputRef}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <SearchIcon />

      {/* Dropdown only visible when focused and input has value */}
      {isFocused && value && (
        <div className="search-results">
          {products.length > 0 ? (
            products.map((product, index) => (
              <div
                key={product.id || product._id}
                className={`search-result-item ${activeIndex === index ? "active" : ""}`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={() => navigate(`/product/${product._id}`)} // onMouseDown prevents blur issue
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="search-result-img"
                />
                <div className="search-result-info">
                  <span className="search-result-name">{product.name}</span>
                  <span className="search-result-brand">{product.brand}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="search-no-results">
              No results found for "{value}"
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default SearchDropdown;
