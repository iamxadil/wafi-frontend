import React, { useState, useEffect, useRef } from "react";
import { BiSearchAlt as Search, BiHeart as Heart } from "react-icons/bi";
import { FiCpu as CPU } from "react-icons/fi";
import { CgSmartphoneRam as RAM } from "react-icons/cg";
import { AiOutlineFullscreen as Screen } from "react-icons/ai";
import { IoAdd as Add } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import useProductStore from "../components/stores/useProductStore.jsx";
import useCartStore from "../components/stores/useCartStore.jsx";
import useAuthStore from "../components/stores/useAuthStore.jsx";
import useWindowWidth from "../components/hooks/useWindowWidth";
import WhyOurLaptops from "../components/main/WhyOurLaptops.jsx";
import "../styles/catlaptops.css";

const CatLaptops = () => {
  const navigate = useNavigate();
  const width = useWindowWidth();
  const { fetchLaptops, laptopProducts } = useProductStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const token = useAuthStore.getState().token;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchRef = useRef(null);
  const topPicksRef = useRef(null);

  useEffect(() => {
    fetchLaptops();
  }, [fetchLaptops]);

  // Filter laptops based on query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setActiveIndex(-1);
      return;
    }

    const filtered = laptopProducts
      .filter((p) => p.approved)
      .filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => b.rating - a.rating);

    setResults(filtered);
    setActiveIndex(-1);
  }, [query, laptopProducts]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setResults([]);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) handleResultClick(results[activeIndex]._id);
    } else if (e.key === "Escape") {
      setResults([]);
      setActiveIndex(-1);
    }
  };

  const handleResultClick = (id) => {
    navigate(`/product/${id}`);
    setQuery("");
    setResults([]);
  };

  const handleAddToCart = (product) => {
    if (product.countInStock <= 0) {
      alert("Sorry, this product is out of stock");
      return;
    }
    addToCart(product, 1, token);
  };

  const handleExploreClick = () => {
    if (topPicksRef.current) {
      topPicksRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const topLaptops = laptopProducts
    .filter((p) => p.isTopProduct && p.approved)
    .sort((a, b) => b.rating - a.rating);

  return (
    <>
      <main id="cat-laptops-page">
        {/* Header */}
        <header id="cat-laptops-header" ref={searchRef}>
          <div className="lines">
            <h1 className="main-line">Universe of Laptops</h1>
            <p className="subline">Innovation in every pixel.</p>
          </div>

          {/* Search Dropdown */}
          <div className="cat-search-container">
            <div className="cat-search" style={{ position: "relative" }}>
              <Search size={20} /> <h3>Where Dreams Come True.</h3>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {results.length > 0 && (
                <div className="mob-search-results">
                  <div className="mob-search-results-inner">
                    {results.map((item, index) => (
                      <div
                        key={index}
                        className={`mob-search-result-item ${
                          activeIndex === index ? "active" : ""
                        }`}
                        onClick={() => handleResultClick(item._id)}
                        onMouseEnter={() => setActiveIndex(index)}
                      >
                        <img
                          src={item.images[0] || "/placeholder.png"}
                          alt={item.name}
                        />
                        <div className="mob-result-info">
                          <span>{item.name}</span>
                          <span>
                            {((item.price || 0) - (item.discountPrice || 0)).toLocaleString()} IQD
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button onClick={handleExploreClick}>Explore</button>
          </div>
        </header>

        {/* Top Picks */}
        <header className="cat-tops-container" ref={topPicksRef}>
          <h1>Our Top Picks</h1>
        </header>

        {/* Desktop Cards */}
        {width > 650 && (
          <section id="pc-pr-cards-container">
            <div className="pc-pr-cards">
              {topLaptops.length > 0
                ? topLaptops.map((product) => (
                    <div
                      className="pc-pr-card"
                      key={product.id}
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <div className="pc-image-wrapper">
                        <div
                          className="pc-pr-image"
                          style={{ backgroundImage: `url(${product.images[0]})` }}
                        />
                      </div>
                      <div className="pc-pr-details">
                        <p>{product.brand}</p>
                        <h2 className="pr-name">{product.name}</h2>
                        <div className="specs">
                          <p>
                            <RAM /> {product.specs.ram}
                          </p>
                          <p>
                            <CPU />
                            {product.specs.cpu}
                          </p>
                          <p>
                            <Screen />
                            {product.specs.screenSize} "
                          </p>
                        </div>
                        <p>
                          {(product.price - (product.discountPrice || 0)).toLocaleString()} IQD
                        </p>
                      </div>
                      <div className="add-to-cart">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))
                : "Loading laptops..."}
            </div>
          </section>
        )}

        {/* Mobile Cards */}
        {width <= 650 && (
          <section id="mob-pr-container">
            <div className="mob-pr-cards">
              {topLaptops.length > 0
                ? topLaptops.map((product) => (
                    <div
                      className="mob-pr-card"
                      key={product.id}
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <div className="mob-pr-image">
                        <img src={product.images[0]} alt={product.name} />
                      </div>
                      <div className="mob-pr-details">
                        <h3>{product.brand}</h3>
                        <h3>{product.name}</h3>
                        <h3>
                          {(product.price - (product.discountPrice || 0)).toLocaleString()} IQD
                        </h3>
                      </div>
                      <div className="mob-pr-buttons">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                        >
                          <Add />
                        </button>
                        <button onClick={(e) => e.stopPropagation()}>
                          <Heart />
                        </button>
                      </div>
                    </div>
                  ))
                : "Loading laptops..."}
            </div>
          </section>
        )}

        <WhyOurLaptops />
      </main>
    </>
  );
};

export default CatLaptops;
