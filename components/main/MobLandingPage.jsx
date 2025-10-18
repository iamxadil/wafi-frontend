import React, { useState, useEffect } from "react";
import TypingText from "../effects/TypingText";
import { useNavigate } from "react-router-dom"; 
import "../../styles/moblandingpage.css";
import {
  BiSearchAlt as Search,
  BiFilterAlt as Filter,
  BiRightArrowAlt as ArrowRight,
} from "react-icons/bi";
import useProductStore from "../stores/useProductStore"; 

// Import images so Netlify/Vite can bundle them
import LaptopImg from "../../assets/img/laptop.png";
import HeadphoneImg from "../../assets/img/headphone.png";
import MouseImg from "../../assets/img/mouse.png";
import JoystickImg from "../../assets/img/joystick.png";
import KeyboardImg from "../../assets/img/keyboard.png";

const MobLandingPage = () => {
  const navigate = useNavigate();
  const searchProducts = useProductStore((state) => state.searchProducts);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);

  // Images for slider with categories
  const images = [
    { src: LaptopImg, category: "Laptops" },
    { src: HeadphoneImg, category: "Headphones" },
    { src: MouseImg, category: "Mice" },
    { src: JoystickImg, category: "Joysticks" },
    { src: KeyboardImg, category: "Keyboards" },
  ];

  const navCat = (category) => {

    if (!category) return; 
    const path = category.toLowerCase() === "laptops" ? "/Laptops" : `/category/${category}`;
    navigate(path);
  }

  // Search effect: only trigger if query has text
  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim().length > 0) {
        const filters = selectedBrands.length
          ? { brand: selectedBrands.join(",") }
          : {};
        const data = await searchProducts(query, filters);
        setResults(data || []);
      } else {
        setResults([]);
      }
    };

    const timer = setTimeout(fetchResults, 300); // debounce
    return () => clearTimeout(timer);
  }, [query, selectedBrands, searchProducts]);

  const toggleBrand = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const clearFilters = () => setSelectedBrands([]);

  return (
    <main id="mob-landing-page">
      {/* Title */}
      <div className="mob-title">
        <TypingText texts={["Start Your Journey Here", "The best of the best"]} />
        <h3>Make your first order.</h3>
      </div>

      {/* Search + Filter */}
      <div className="mob-search-container">
        <div className="mob-search-row">
          <div className="mob-search">
            <Search size={25} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
            />
          </div>

          <div className="mob-filter">
            <button onClick={() => setDropdownOpen(!dropdownOpen)}>
              <Filter />
            </button>

            {dropdownOpen && (
              <ul className="filter-dropdown">
                {["Acer", "Asus", "Apple", "Lenovo", "HP"].map((brand) => (
                  <li key={brand}>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                      />
                      {brand}
                    </label>
                  </li>
                ))}
                {selectedBrands.length > 0 && (
                  <li>
                    <button className="clear-filters" onClick={clearFilters}>
                      Clear Filters
                    </button>
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* Active filter chips */}
        {selectedBrands.length > 0 && (
          <div className="mob-active-filters">
            {selectedBrands.map((brand) => (
              <span className="filter-chip" key={brand}>
                {brand} 
                <button onClick={() => toggleBrand(brand)}>×</button>
              </span>
            ))}
          </div>
        )}

        {/* Dropdown search results */}
        {query.trim().length > 0 && (
          <div className="mob-search-results">
            <div className="mob-search-results-inner">
              {results.length > 0 ? (
                results.map((item, index) => (
                  <div
                    className="mob-search-result-item" key={index} onClick={() => navigate(`/product/${item._id}`)} >
                     <img
                          src={item.images[0] || "/placeholder.png"}
                          alt={item.name}
                        />
                    <div className="mob-result-info">
                      <span>{item.name}</span>
                      <span>{item.price.toLocaleString()} IQD</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">No results found</div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Slider Section */}
      <section className="slider-container">
        <h1>Discover <ArrowRight /></h1>
        <div className="slider">
          {images.map((item, index) => (
            <div
              className="slider-card"
              key={index}
              onClick={() => navCat(item.category)}
              style={{ cursor: "pointer" }}
            >
              <img src={item.src} alt={`Product ${index + 1}`} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default MobLandingPage;
