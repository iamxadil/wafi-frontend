import React, { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/moblandingpage.css";
import { SquaresSubtract } from "lucide-react";
import useProductStore from "../stores/useProductStore";
import useTranslate from "../hooks/useTranslate";

// === Lazy-load icons to reduce JS bundle ===
const SearchIcon = React.lazy(() =>
  import("react-icons/bi").then((m) => ({ default: m.BiSearchAlt }))
);
const FilterIcon = React.lazy(() =>
  import("react-icons/bi").then((m) => ({ default: m.BiFilterAlt }))
);

// === Static images (preprocessed by Vite) ===
import LaptopImg from "../../assets/img/strix.webp";
import HeadphoneImg from "../../assets/img/sony.avif";
import MouseImg from "../../assets/img/logitech.webp";
import BagImg from "../../assets/img/bag.webp";
import KeyboardImg from "../../assets/img/keyboard.avif";
import SSDImg from "../../assets/img/ssd.webp";

const MobLandingPage = () => {
  const navigate = useNavigate();
  const searchProducts = useProductStore((state) => state.searchProducts);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const t = useTranslate();
  const abortRef = useRef(null);

  // === Memoized images (prevent re-renders) ===
  const images = 
     [
      { src: LaptopImg, category: "Laptops", title: t("Laptops", "اللابتوبات") },
      { src: SSDImg, category: "Hard Disks & SSDs", title: t("Storage", "التخزين") },
      { src: HeadphoneImg, category: "Headphones", title: t("Headphones", "السماعات") }, // main LCP image
      { src: MouseImg, category: "Mice", title: t("Mice", "الماوسات") },
      { src: BagImg, category: "Bags", title: t("Bags", "الحقائب") },
      { src: KeyboardImg, category: "Keyboards", title: t("Keyboards", "الكيبوردات") },
    ]
  


  const navCat = (category) => {
    if (!category) return;
    const path =
      category.toLowerCase() === "laptops"
        ? "/Laptops"
        : `/category/${category}`;
    navigate(path);
  };

  // === Optimized live search with debounce + cancellation ===
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const timeout = setTimeout(async () => {
      try {
        const filters =
          selectedBrands.length > 0
            ? { brand: selectedBrands.join(",") }
            : {};
        const data = await searchProducts(query, filters, {
          signal: controller.signal,
        });
        setResults(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name !== "AbortError") console.error("Search failed:", err);
      }
    }, 350);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query, selectedBrands, searchProducts]);

  // === Filter logic ===
  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  const clearFilters = () => setSelectedBrands([]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  const handleViewAll = () => {
    if (!query.trim()) return;
    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  return (
    <main id="mob-landing-page">
      {/* ======= Title ======= */}
      <div className="mob-title" style={{ textAlign: t.textAlign }}>
        <h2>{t("Al-Wafi for Computers", "الوافي للحاسبات")}</h2>
        <h4>{t("Expertise that guides you to the ultimate choice", "خبرة تقودك إلى الاختيار الافضل")}</h4>
      </div>

      {/* ======= Search + Filter ======= */}
      <div className="mob-search-container">
        <form className="mob-search-row" onSubmit={handleSearchSubmit}>
          <div className="mob-search">
            <Suspense fallback={<span>🔍</span>}>
              <SearchIcon size={22} />
            </Suspense>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("Search products...", "ابحث عن المنتجات...")}
              dir={t.language === "ar" ? "rtl" : "ltr"}
              style={{ textAlign: t.textAlign }}
            />
          </div>

          <div className="mob-filter">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              aria-label="Filter"
            >
              <Suspense fallback={<span>⚙️</span>}>
                <FilterIcon size={22} />
              </Suspense>
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
                      {t("Clear Filters", "مسح الفلاتر")}
                    </button>
                  </li>
                )}
              </ul>
            )}
          </div>
        </form>

        {/* Active filters */}
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

        {/* Search results */}
        {query.trim().length > 0 && (
          <div className="mob-search-results">
            <div className="mob-search-results-inner">
              {results.length > 0 ? (
                <>
                  {results.map((item) => (
                    <div
                      key={item._id}
                      className="mob-search-result-item"
                      onClick={() => navigate(`/product/${item._id}`)}
                    >
                      <img
                        src={item.images?.[0] || "/placeholder.png"}
                        alt={item.name}
                        decoding="async"
                        width="80"
                        height="80"
                      />
                      <div className="mob-result-info">
                        <span>{item.name}</span>
                        <span style={{color: "var(--accent)", fontWeight: "bold"}}>{item.finalPrice?.toLocaleString()} IQD</span>
                      </div>
                    </div>
                  ))}
                  <div className="mob-search-view-all" onClick={handleViewAll}>
                    {t("View All Results", "عرض جميع النتائج")} ({results.length}+)
                  </div>
                </>
              ) : (
                <div className="no-results">
                  {t("No results found", "لا توجد نتائج")}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      

      {/* ======= Slider Section ======= */}
      <section className="slider-container">
        <h1 style={{ flexDirection: t.rowReverse }}>
          {t("Discover", "اكتشف")} <SquaresSubtract />
        </h1>

        <div className="slider">
          {images.map((item, index) => (
            <div
              className="slider-card"
              key={index}
              onClick={() => navCat(item.category)}
            >
              <img
                src={item.src}
                alt={item.category}
                decoding="async"
                width="400"
                height="400"
                loading={index === 1 ? "eager" : "lazy"} // ✅ Eager load the hero (Headphones)
              />

              <p>{item.title}</p>
             
            </div>
          ))}
        </div>
      </section>

    </main>
  );
};

export default MobLandingPage;
