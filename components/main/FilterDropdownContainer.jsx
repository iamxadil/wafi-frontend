import React, { useState } from "react";
import FilterSelect from "./FilterSelect.jsx";
import "../../styles/filterdropdown.css";

/**
 * Elegant dropdown for Brand, Sort & Price Range (IQD)
 * with locale formatting and smart input handling.
 */
const FilterDropdownContainer = ({
  title = "Filters",
  brandProps,
  sortProps,
  priceProps,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localMin, setLocalMin] = useState(priceProps?.minPrice || 0);
  const [localMax, setLocalMax] = useState(priceProps?.maxPrice || 10_000_000);

  // Format number with commas (no currency symbol inside)
  const formatPrice = (price) => price.toLocaleString();
  
  const parseNumber = (val) => Number(val.replace(/[^\d]/g, "")) || 0;

  const handleMinChange = (val) => {
    const num = parseNumber(val);
    if (num <= localMax) {
      setLocalMin(num);
      priceProps?.onChange({ minPrice: num, maxPrice: localMax });
    }
  };

  const handleMaxChange = (val) => {
    const num = parseNumber(val);
    if (num >= localMin) {
      setLocalMax(num);
      priceProps?.onChange({ minPrice: localMin, maxPrice: num });
    }
  };

  return (
    <div className="filter-dropdown-wrapper">
      <button
        className="filter-dropdown-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {title}
        <span className={`arrow ${isOpen ? "up" : ""}`}></span>
      </button>

      {isOpen && (
        <div className="filter-dropdown-content">
          {brandProps && <FilterSelect {...brandProps} />}
          {sortProps && <FilterSelect {...sortProps} />}

          {priceProps && (
            <div className="price-range-container">
              <label className="price-label">Price Range</label>

              <div className="price-values">
                <span>{formatPrice(localMin)} IQD</span>
                <span>—</span>
                <span>{formatPrice(localMax)} IQD</span>
              </div>

              <div className="range-slider-container">
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  step="100000"
                  value={localMin}
                  onChange={(e) => handleMinChange(e.target.value)}
                  className="price-slider"
                />
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  step="100000"
                  value={localMax}
                  onChange={(e) => handleMaxChange(e.target.value)}
                  className="price-slider"
                />
              </div>

              <div className="price-inputs">
                <div className="input-wrapper">
                  <input
                    type="text"
                    value={formatPrice(localMin)}
                    onChange={(e) => handleMinChange(e.target.value)}
                    placeholder="Min"
                  />
                  <span className="iqd-suffix">IQD</span>
                </div>

                <span className="price-separator">—</span>

                <div className="input-wrapper">
                  <input
                    type="text"
                    value={localMax.toLocaleString()}
                    onChange={(e) => handleMaxChange(e.target.value)}
                    placeholder="Max"
                  />
                  <span className="iqd-suffix">IQD</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterDropdownContainer;
