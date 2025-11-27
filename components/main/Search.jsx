import React, { useState, useRef, useEffect } from 'react';
import '../../styles/landingpage.css';
import { RiSearchLine as SearchIcon } from "react-icons/ri";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useProductStore from '../stores/useProductStore.jsx';
import debounce from 'lodash.debounce';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Search = () => {
  const navigate = useNavigate();
  const searchProducts = useProductStore((state) => state.searchProducts);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false); // 🔥 KEY FIX

  const rootRef = useRef(null);

  /* -------------------------------------------------------
      🔥 CLICK OUTSIDE CLOSES DROPDOWN
  ------------------------------------------------------- */
  useEffect(() => {
    const handleOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setIsOpen(false);      // 🔥 close
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  /* -------------------------------------------------------
      🔍 Debounced Search
  ------------------------------------------------------- */
  const handleSearch = debounce(async (text) => {
    if (!text.trim()) {
      setResults([]);
      setActiveIndex(-1);
      return;
    }

    const products = await searchProducts(text);
    setResults(products);
    setActiveIndex(-1);
  }, 250);

  const handleInputChange = (e) => {
    const text = e.target.value;
    setQuery(text);
    setIsOpen(true);        // 🔥 open on typing
    handleSearch(text);
  };

  /* -------------------------------------------------------
      ⌨️ Keyboard Navigation
  ------------------------------------------------------- */
  const handleKeyDown = (e) => {
    if (!isOpen || !results.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } 
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
    } 
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0) handleResultClick(results[activeIndex].id);
    } 
    else if (e.key === 'Escape') {
      setIsOpen(false);     // 🔥 close
      setActiveIndex(-1);
    }
  };

  /* -------------------------------------------------------
      🖱️ Selecting a Result
  ------------------------------------------------------- */
  const handleResultClick = (id) => {
    setIsOpen(false);        // 🔥 close
    setQuery('');            // reset input
    setResults([]);          // clear results
    navigate(`/product/${id}`);
  };

  return (
    <motion.div
      id="search-wrapper"
      ref={rootRef}
      variants={itemVariants}
      style={{ position: 'relative', width: '100%' }}
    >
      {/* ---------------------------------- */}
      {/* 🔍 Search Input */}
      {/* ---------------------------------- */}
      <div id="search-container">
        <input
          type="search"
          placeholder="Search for products..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}  // 🔥 open on focus
        />
        <SearchIcon />
      </div>

      {/* ---------------------------------- */}
      {/* 🔽 DROPDOWN */}
      {/* ---------------------------------- */}
      {isOpen && results.length > 0 && (      // 🔥 controlled visibility
        <div className="search-results">
          {results.map((product, index) => (
            <div
              key={product.id}
              className={`search-result-item ${activeIndex === index ? 'active' : ''}`}
              onClick={() => handleResultClick(product.id)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <img src={product.images[0]} className="search-result-img" />

              <div className="search-result-info">
                <span className="search-result-name">{product.name}</span>
                <span className="search-result-brand">{product.brand}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Search;
