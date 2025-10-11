// src/pages/CatLaptops.jsx
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { BiSearchAlt as Search, BiHeart as Heart } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import useProductStore from "../components/stores/useProductStore.jsx";
import useWindowWidth from "../components/hooks/useWindowWidth";
import ProductGrid from "../components/main/ProductGrid.jsx";
import ProductCard from '../components/main/ProductCard.jsx';
import MobileCard from "../components/main/MobileCard.jsx";
import Pagination from '../components/main/Pagination.jsx';
import "../styles/catlaptops.css";





const CatLaptops = () => {

  const navigate = useNavigate();
  const width = useWindowWidth();
  const { fetchLaptops, laptopProducts, laptopPagination, topLaptopProducts, fetchTopLaptops, laptopLimit } = useProductStore();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchRef = useRef(null);
  const topPicksRef = useRef(null);


useEffect(() => {
  fetchTopLaptops(4);
  if (width > 650) {
    fetchLaptops({ limit: 6 });
  } else {
    fetchLaptops({ limit: 5 });
  }
}, [width]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) return setResults([]), setActiveIndex(-1);
    const id = setTimeout(() => {
      const filtered = laptopProducts.filter((p) => p.approved).filter((p) =>
        p.name.toLowerCase().includes(trimmed.toLowerCase()) ||
        p.brand.toLowerCase().includes(trimmed.toLowerCase())
      ).sort((a, b) => (b.rating || 0) - (a.rating || 0));
      setResults(filtered); setActiveIndex(-1);
    }, 250);
    return () => clearTimeout(id);
  }, [query, laptopProducts]);

  const handleKeyDown = (e) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") setActiveIndex((p) => (p + 1) % results.length);
    else if (e.key === "ArrowUp") setActiveIndex((p) => (p - 1 + results.length) % results.length);
    else if (e.key === "Enter" && activeIndex >= 0) handleResultClick(results[activeIndex]._id || results[activeIndex].id);
    else if (e.key === "Escape") setResults([]), setActiveIndex(-1);
  };

  const handleResultClick = (id) => { if (!id) return; navigate(`/product/${id}`); setQuery(""); setResults([]); };
  const handlePageChange = (page) => fetchLaptops({ page, limit: laptopLimit });
  const handleExploreClick = () => topPicksRef.current?.scrollIntoView({ behavior: "smooth" });

  const topLaptops = useMemo(() => (topLaptopProducts || []).filter((p) => p.approved).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4), [topLaptopProducts]);

  const filters = [
    { key: "brand", title: "Brand", options: ["Apple", "Acer", "Asus", "HP", "Lenovo"], multiple: true },
    { key: "ram", title: "RAM", options: ["8GB", "16GB", "32GB"], multiple: true },
    { key: "cpu", title: "CPU", options: ["i5", "i7", "i9"], multiple: true },
    { key: "screen", title: "Screen Size", options: ['13"', '14"', '15"', '16"'], multiple: true },
    { key: "price", title: "Price Range", options: ["<500", "500-1000", "1000-1500", ">1500"], multiple: false },
  ];

    const handleFiltersChange = (selected) => {
    console.log("Selected filters:", selected);
    // Filter products logic
  };

  return (
    <main id="cat-laptops-page">
      {/* Header + Search */}
      <header id="cat-laptops-header" ref={searchRef}>
        <div className="lines"><h1 className="main-line">Universe of Laptops</h1><p className="subline">Innovation in every pixel.</p></div>
        <div className="cat-search-container">
          <div className="cat-search"><Search size={20} /><h3>Where Dreams Come True.</h3>
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown} placeholder="Search by name or brand..." />
            {results.length > 0 && (
              <div className="mob-search-results">
                <div className="mob-search-results-inner">
                  {results.map((item, index) => (
                    <div key={item._id || item.id || index} className={`mob-search-result-item ${activeIndex === index ? "active" : ""}`}
                      onClick={() => handleResultClick(item._id || item.id)} onMouseEnter={() => setActiveIndex(index)}>
                      <img src={item.images?.[0] || "/placeholder.png"} alt={item.name} />
                      <div className="mob-result-info"><span>{item.name}</span><span>{((item.price || 0) - (item.discountPrice || 0)).toLocaleString()} IQD</span></div>
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

      {/* Desktop Top Cards */}
      {width > 650 && (
        <section id="pc-pr-cards-container">
        <div className="pc-pr-cards">
         {topLaptops.map((product) => <ProductCard key={product.id || product._id} product={product}/>)}
        </div>
        </section>
      )}

      {width > 650 && <header className="cat-tops-container">
        <h1>Laptops</h1>
        </header>}

      {/* Desktop Grid */}
      {width > 650 && (
        <main className="products-grid-container">
          {laptopProducts.map((laptop) => (
           <ProductGrid
                key={laptop._id || laptop.id}
                product={laptop}
              />

          ))}
        </main>
      )}


      {/* Mobile Cards */}
      {width <= 650 && (
        <div id="mob-pr-container">
          <div className="mob-pr-cards">
          {topLaptops.map((laptop) => (
            <MobileCard
              key={laptop.id || laptop._id}
              product={laptop}
            />
          ))}
          </div>
        </div>
      )}


      {/* Mobile Cards */}
      {width <= 650 && (
        <>
        <div id="mob-pr-container">
          <header className="cat-tops-container"><h1>Laptops</h1></header>
          <div className="mob-pr-cards">
          {laptopProducts.map((laptop) => (
            <MobileCard
              key={laptop.id || laptop._id}
              product={laptop}
            />
          ))}
          </div>
        </div>
        </>
      )}


      {/* Pagination */}
        {laptopPagination.totalPages > 1 && (
          <Pagination
            currentPage={laptopPagination.currentPage}
            totalPages={laptopPagination.totalPages}
            onPageChange={handlePageChange}
            mobile
          />
        )}
    </main>
  );
};

export default CatLaptops;
