import React, { useState,  useRef } from 'react';
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
  const [activeIndex, setActiveIndex] = useState(-1); // for keyboard navigation
  const inputRef = useRef(null);

  // Debounced search function
  const handleSearch = debounce(async (text) => {
    if (!text.trim()) {
      setResults([]);
      setActiveIndex(-1);
      return;
    }
    const products = await searchProducts(text);
    setResults(products);
    setActiveIndex(-1);
  }, 300);

  const handleInputChange = (e) => {
    const text = e.target.value;
    setQuery(text);
    handleSearch(text);
  };

  const handleResultClick = (id) => {
    setQuery('');
    setResults([]);
    navigate(`/product/${id}`);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!results.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0) {
        handleResultClick(results[activeIndex].id);
      }
    } else if (e.key === 'Escape') {
      setResults([]);
      setActiveIndex(-1);
    }
  };

  return (
    <>

        <motion.div
          id="search-container"
          variants={itemVariants}
          style={{ position: 'relative' }}
        >
          <input
            type="search"
            placeholder='Search for products...'
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            ref={inputRef}
          />
          <SearchIcon />

          {results.length > 0 && (
            <div className="search-results">
              {results.map((product, index) => (
                <div
                  key={product.id}
                  className={`search-result-item ${activeIndex === index ? 'active' : ''}`}
                  onClick={() => handleResultClick(product.id)}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <img src={product.images[0]} alt={product.name} className="search-result-img" />
                  <div className="search-result-info">
                    <span className="search-result-name">{product.name}</span>
                    <span className="search-result-brand">{product.brand}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

 
    </>
  );
};

export default Search;
