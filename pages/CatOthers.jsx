// src/pages/CatOthers.jsx
import React, { useMemo } from "react";
import "../styles/cataccessories.css"; // reuse same style
import SearchDropdown from "../components/main/SearchDropdown.jsx";
import useOthersStore from "../components/stores/useOthersStore.jsx";
import { useOthersQuery } from "../components/hooks/useOthersQuery.jsx";
import { useDynamicFilters } from "../components/hooks/useDynamicFilters.jsx";
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";
import Pagination from "../components/main/Pagination.jsx";
import Loading from "../components/main/Loading.jsx";
import MobileCard from "../components/main/MobileCard.jsx";
import ProductGrid from "../components/main/ProductGrid.jsx";
import Filter from "../components/common/Filter.jsx";
import Sort from "../components/common/Sort.jsx";
import useTranslate from "../components/hooks/useTranslate.jsx";

const CatOthers = () => {
  const width = useWindowWidth();
  const t = useTranslate();

  /* =============================================================
     🧠 Zustand Store
  ============================================================= */
  const {
    othersPageParams,
    setOthersPageParams,
    searchParam,
    setSearchParam,
    filters,
    setFilters,
    resetFilters,
    sort,
    setSort,
    searchFilters,
    setSearchFilters,
    resetSearchFilters,
    searchSort,
    setSearchSort,
  } = useOthersStore();

  /* =============================================================
     🔍 Queries
  ============================================================= */
  // 1️⃣ Main grid
  const { data: others, isLoading, isError } = useOthersQuery({
    ...othersPageParams,
    ...filters,
    sort,
  });

  // 2️⃣ Dynamic filter sections
  const { data: filtersData, isLoading: filtersLoading } = useDynamicFilters({
    category: [
      "Routers",
      "Adapters",
      "Flash Drives",
      "Hard Disks & SSDs",
      "Cables",
      "Power Banks",
      "USB Hubs",
    ],
  });

  // 3️⃣ Live search
  const { data: searchData } = useOthersQuery({
    page: 1,
    limit: 5,
    search: searchParam,
    sort: searchSort,
    ...searchFilters,
  });

  /* =============================================================
     🧩 Derived Data
  ============================================================= */
  const products = others?.products || [];
  const pagination = others?.pagination || { currentPage: 1, totalPages: 0 };
  const searchResults = searchData?.products || [];

  /* =============================================================
     ⚙️ Handlers
  ============================================================= */
  const handlePageChange = (page) => {
    if (page !== pagination.currentPage) setOthersPageParams({ page });
  };

  const handleSelectSearch = (product) => {
    setOthersPageParams({ search: product.name, page: 1 });
    setSearchParam("");
  };

  const handleGridFilterChange = (updated) => {
    setFilters(updated);
    setOthersPageParams({ page: 1 });
  };

  const handleSearchFilterChange = (updated) => {
    setSearchFilters(updated);
  };

  /* =============================================================
     🧩 Dynamic Filter Sections
  ============================================================= */
  const dynamicFilters = useMemo(() => {
    if (!filtersData) return [];
    const { brands = [], tags = [], priceRange = {} } = filtersData;
    const sections = [];

    if (brands.length > 0)
      sections.push({
        id: "brand",
        label: t("Brands", "العلامة التجارية"),
        type: "checkbox",
        options: brands.sort(),
      });

    if (tags.length > 0)
      sections.push({
        id: "tags",
        label: t("Tags", "الوسوم"),
        type: "checkbox",
        options: tags.sort(),
      });

    if (priceRange.min !== undefined && priceRange.max !== undefined)
      sections.push({
        id: "price",
        label: t("Price Range", "نطاق السعر"),
        type: "range",
        min: priceRange.min,
        max: priceRange.max,
        step: 5,
      });

    return sections;
  }, [filtersData, t]);

  /* =============================================================
     🌀 Loading / Error
  ============================================================= */
  if (isLoading)
    return <Loading message={t("Loading products...", "جاري تحميل المنتجات...")} />;
  if (isError)
    return (
      <p style={{ textAlign: "center" }}>
        {t("Failed to load products.", "فشل تحميل المنتجات.")}
      </p>
    );

  /* =============================================================
     🧩 Render
  ============================================================= */
  return (
    <>
      {/* === HERO SECTION === */}
      <section className="accessories-hero">
        <div className="hero-content">
          <div className="blur-shape blur-1"></div>
          <div className="blur-shape blur-2"></div>

          <h1 className="hero-title">
            {t("Essential", "منتجات")}{" "}
            <span>{t("Tech Gear", "تكنولوجية أساسية")}</span>{" "}
            {t("for Every Setup", "لكل إعداد")}
          </h1>
          <p className="hero-subtitle" style={{ marginTop: "2rem" }}>
            {t(
              "Find routers, drives, adapters, and cables that keep your tech world connected.",
              "اكتشف أجهزة التوجيه والأقراص ومحولات الطاقة التي تبقي عالمك التقني متصلاً."
            )}
          </p>
        </div>

        {/* 🔍 Search Bar */}
        <div className="search-dropdown-wrapper">
          <SearchDropdown
            width={600}
            products={searchResults}
            value={searchParam}
            onChange={(e) => setSearchParam(e.target.value)}
            onSelect={handleSelectSearch}
          />
        </div>

        {/* 🧩 Search Filters + Sort */}
        <div className="filter-sorts">
          {filtersLoading ? (
            <p style={{ textAlign: "center", fontSize: "0.9rem" }}>
              {t("Loading filters...", "جاري تحميل الفلاتر...")}
            </p>
          ) : (
            <>
              <Sort
                title={t("Sort", "الترتيب")}
                selected={searchSort}
                onChange={setSearchSort}
              />
              <Filter
                title={t("Search Filters", "فلاتر البحث")}
                icon="SlidersHorizontal"
                filters={dynamicFilters}
                selected={searchFilters}
                onChange={handleSearchFilterChange}
                onClearAll={resetSearchFilters}
              />
            </>
          )}
        </div>
      </section>

      {/* === MAIN GRID === */}
      <main id="pc-pr-container">
        <header className="pr-header">
          <h1>{t("Other Products", "منتجات أخرى")}</h1>

          <div className="header-right">
            {filtersLoading ? (
              <p className="loading-filters-text">
                {t("Loading filters...", "جاري تحميل الفلاتر...")}
              </p>
            ) : (
              <>
                <Filter
                  title={width > 600 ? t("Filters", "الفلاتر") : ""}
                  filters={dynamicFilters}
                  selected={filters}
                  onChange={handleGridFilterChange}
                  onClearAll={resetFilters}
                  width={350}
                />
                <Sort
                  title={width > 600 ? t("Sort", "الترتيب") : ""}
                  selected={sort}
                  onChange={setSort}
                />
              </>
            )}
          </div>
        </header>

        {/* 🧱 Products Grid */}
        <div
          className={
            width > 650
              ? "products-grid-container cat-grid"
              : "mob-pr-cards"
          }
        >
          {products.length > 0 ? (
            products.map((product, i) =>
              width > 650 ? (
                <ProductGrid
                  key={product._id || product.id}
                  product={product}
                />
              ) : (
                <MobileCard
                  key={product._id || product.id}
                  product={product}
                  customDelay={i * 0.08}
                />
              )
            )
          ) : (
            <p style={{ textAlign: "center" }}>
              {t("No products found.", "لم يتم العثور على منتجات.")}
            </p>
          )}
        </div>

        {/* 📄 Pagination */}
        {products.length > 0 && pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </main>
    </>
  );
};

export default CatOthers;
