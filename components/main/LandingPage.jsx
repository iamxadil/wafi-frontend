import React, { useState, useEffect, useRef } from 'react';
import '../../styles/landingpage.css';
import { RiSearchLine as SearchIcon } from "react-icons/ri";
import { motion } from 'framer-motion';
import TypingText from '../effects/TypingText';
import useWindowWidth from '../hooks/useWindowWidth';
import { useNavigate } from 'react-router-dom';
import useProductStore from '../stores/useProductStore.jsx';
import debounce from 'lodash.debounce';
import laptopImg from '../../assets/img/laptop.png';
import backgroundImg from '../../assets/img/background.png';




const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.3 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const LandingPage = () => {
  const width = useWindowWidth();
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

    <div id='landing-page'>
      <motion.div
        className="left-hero"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={itemVariants}>
          ALWAFI FOR YOUR UNLIMITED ENTERTAINMENT
        </motion.h1>

        <motion.p variants={itemVariants}>
          Make Your Journey With Our Most Fresh Products Inspired & Crafted From The Most Unique Brands. 
        </motion.p>

        <motion.div
          id="search-container"
          variants={itemVariants}
          style={{ position: 'relative' }}
        >
          <input
            type="text"
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
      </motion.div>

      <div className='right-hero'>
        { width > 720 && (
          <div id="laptop-container">
            { width > 1350 && <img src={laptopImg} alt="Laptop" id='laptop'/> }
            <img src={backgroundImg} id='background' alt="Background"/> 
            { width > 1350 && (
              <div id="layer">
                <TypingText texts={["Look upon the sky", "The best of the best"]} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>

 
    </>
  );
};

export default LandingPage;
