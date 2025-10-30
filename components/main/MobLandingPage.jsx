import React, { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/moblandingpage.css";
import { SquaresSubtract } from "lucide-react";
import useProductStore from "../stores/useProductStore";
import useTranslate from "../hooks/useTranslate";

// Lazy-load icons to reduce bundle size
const SearchIcon = React.lazy(() =>
  import("react-icons/bi").then((m) => ({ default: m.BiSearchAlt }))
);
const FilterIcon = React.lazy(() =>
  import("react-icons/bi").then((m) => ({ default: m.BiFilterAlt }))
);

// Lazy import images (handled by Vite)
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
  const t = useTranslate();
  const abortRef = useRef(null);

  // Memoized image list to avoid re-renders
  const images = useMemo(
    () => [
      { src: LaptopImg, category: "Laptops" },
      { src: HeadphoneImg, category: "Headphones" },
      { src: MouseImg, category: "Mice" },
      { src: JoystickImg, category: "Joysticks" },
      { src: KeyboardImg, category: "Keyboards" },
    ],
    []
  );

  const navCat = (category) => {
    if (!category) return;
    const path =
      category.toLowerCase() === "laptops"
        ? "/Laptops"
        : `/category/${category}`;
    navigate(path);
  };

  // --- 🔎 Optimized Live Search ---
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    // Cancel previous request if still pending
    if (abortRef.current) {
      abortRef.current.abort();
    }

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
    }, 350); // debounce 350ms

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query, selectedBrands, searchProducts]);

  // --- Filter logic ---
  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  const clearFilters = () => setSelectedBrands([]);

  return (
    <main id="mob-landing-page">
      {/* ======= Title ======= */}
      <div
        className="mob-title"
        style={{ textAlign: t.textAlign }}
      >
        <h2>{t("Start your journey here", "ابدأ رحلتك الآن")}</h2>
        <h4>{t("Make your first order", "قم بطلبك الأول")}</h4>
      </div>

      {/* ======= Search + Filter ======= */}
      <div className="mob-search-container">
        <div className="mob-search-row">
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
                    <button
                      className="clear-filters"
                      onClick={clearFilters}
                    >
                      {t("Clear Filters", "مسح الفلاتر")}
                    </button>
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

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
                results.map((item) => (
                  <div
                    key={item._id}
                    className="mob-search-result-item"
                    onClick={() => navigate(`/product/${item._id}`)}
                  >
                    <img
                      src={item.images?.[0] || "/placeholder.png"}
                      alt={item.name}
                      loading="lazy"
                    />
                    <div className="mob-result-info">
                      <span>{item.name}</span>
                      <span>
                        {item.price?.toLocaleString()} IQD
                      </span>
                    </div>
                  </div>
                ))
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
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default MobLandingPage;
