// src/pages/CatLaptops.jsx
import React, { useMemo } from "react";
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";
import ProductGrid from "../components/main/ProductGrid.jsx";
import MobileCard from "../components/main/MobileCard.jsx";
import Pagination from "../components/main/Pagination.jsx";
import useLaptopsStore from "../components/stores/useLaptopsStore.jsx";
import { useLaptopsQuery } from "../components/hooks/useLaptopsQuery.jsx";
import { useDynamicFilters } from "../components/hooks/useDynamicFilters.jsx";
import Loading from "../components/main/Loading.jsx";
import SearchDropdown from "../components/main/SearchDropdown.jsx";
import Filter from "../components/common/Filter.jsx";
import Sort from "../components/common/Sort.jsx";
import useTranslate from "../components/hooks/useTranslate.jsx";
import "../styles/catlaptops.css";

const CatLaptops = () => {
  const width = useWindowWidth();
  const t = useTranslate();

  /* =============================================================
     🧠 Zustand Store
  ============================================================= */
  const {
    // --- Live Search (hero)
    searchParam,
    setSearchParam,
    searchFilters,
    setSearchFilters,
    resetSearchFilters,
    searchSort,
    setSearchSort,

    // --- Main Grid
    laptopPageParams,
    setLaptopPageParams,
    filters,
    setFilters,
    resetFilters,
    sort,
    setSort,

    // --- Top Laptops
    topPageParams,
    setTopPageParams,
  } = useLaptopsStore();

  /* =============================================================
     🔍 Queries
  ============================================================= */
  // 1️⃣ Main grid (filters + sort)
  const { data: laptops, isLoading, isError } = useLaptopsQuery({
    ...laptopPageParams,
    ...filters,
    sort,
  });

  // 2️⃣ Dynamic filters (based on category)
  const { data: filtersData, isLoading: filtersLoading } = useDynamicFilters({
    category: ["Laptops"],
  });

  
  // 3️⃣ Live search query (top search)
  const searchQueryParams = useMemo(
    () => ({
      search: searchParam,
      page: 1,
      limit: 5,
      sort: searchSort,
      ...searchFilters,
    }),
    [searchParam, searchFilters, searchSort]
  );
  const { data: searchData } = useLaptopsQuery(searchQueryParams);

  // 4️⃣ Top laptops query
  const { data: topData, isLoading: topLoading } = useLaptopsQuery({
    ...topPageParams,
    isTopProduct: true,
  });

  /* =============================================================
     🧩 Derived Data
  ============================================================= */
  const products = laptops?.products || [];
  const pagination = laptops?.pagination || { currentPage: 1, totalPages: 0 };
  const searchResults = searchData?.products || [];
  const topProducts = topData?.products || [];
  const topPagination = topData?.pagination || {
    currentPage: topPageParams.page,
    totalPages: 0,
  };

  /* =============================================================
     ⚙️ Handlers
  ============================================================= */
  const handlePageChange = (page) => {
    if (page !== pagination.currentPage) setLaptopPageParams({ page });
  };

  const handleSelectSearch = (product) => {
    setLaptopPageParams({ search: product.name, page: 1 });
    setSearchParam("");
  };

  const handleSearchFilterChange = (updatedFilters) => {
    setSearchFilters(updatedFilters);
  };

  const handleGridFilterChange = (updatedFilters) => {
    setFilters(updatedFilters);
    setLaptopPageParams({ page: 1 });
  };

  const handleTopPageChange = (page) => {
    if (page !== topPagination.currentPage) setTopPageParams({ page });
  };

  /* =============================================================
     ⚙️ Dynamic Filter Sections
  ============================================================= */
  const dynamicFilters = useMemo(() => {
    if (!filtersData) return [];

    const { brands = [], tags = [], specs = {}, priceRange = {} } = filtersData;
    const sections = [];

    if (brands.length > 0) {
      sections.push({
        id: "brand",
        label: t("Brands", "العلامة التجارية"),
        type: "checkbox",
        options: brands.sort(),
      });
    }

    if (tags.length > 0) {
      sections.push({
        id: "tags",
        label: t("Tags", "الوسوم"),
        type: "checkbox",
        options: tags.sort(),
      });
    }

    // ✅ Only show laptop-related specs dynamically
    Object.entries(specs).forEach(([key, values]) => {
      if (values.length > 0) {
        sections.push({
          id: key,
          label: key.toUpperCase(),
          type: "checkbox",
          options: values.sort(),
        });
      }
    });

    if (priceRange.min !== undefined && priceRange.max !== undefined) {
      sections.push({
        id: "price",
        label: t("Price Range", "نطاق السعر"),
        type: "range",
        min: priceRange.min,
        max: priceRange.max,
        step: 10,
      });
    }

    return sections;
  }, [filtersData, t]);

  /* =============================================================
     🌀 Loading & Error
  ============================================================= */
  if (isLoading || topLoading)
    return (
      <Loading
        message={t("Loading laptops...", "جاري تحميل اللابتوبات...")}
      />
    );
  if (isError)
    return (
      <p style={{ textAlign: "center" }}>
        {t("Failed to load laptops.", "فشل تحميل اللابتوبات.")}
      </p>
    );

  /* =============================================================
     🧩 Render
  ============================================================= */
  return (
    <>
      {/* === HERO SECTION === */}
      <section className="laptops-hero">
        <div className="hero-content">
          <div className="blur-shape blur-1"></div>
          <div className="blur-shape blur-2"></div>

          <h1 className="hero-title">
            {t("Explore the", "استكشف")}{" "}
            <span>{t("Laptop Universe", "عالم اللابتوبات")}</span>
          </h1>
          <p className="hero-subtitle">
            {t(
              "Power, design, and performance — where innovation meets experience.",
              "القوة، التصميم، والأداء — حيث تلتقي الابتكارات مع التجربة."
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
          <h1>{t("Laptops", "اللابتوبات")}</h1>

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
            width > 650 ? "products-grid-container cat-grid" : "mob-pr-cards"
          }
        >
          {products.length > 0 ? (
            products.map((product, i) =>
              width > 650 ? (
                <ProductGrid key={product._id || product.id} product={product} />
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
              {t("No laptops found.", "لم يتم العثور على لابتوبات.")}
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

        {/* === TOP LAPTOPS SECTION === */}
        <header className="pr-header" style={{ flexDirection: t.rowReverse }}>
          <h1>{t("Top Laptops", "لابتوبات مميزة")}</h1>
        </header>

        <div
          className={
            width > 650 ? "products-grid-container cat-grid" : "mob-pr-cards"
          }
        >
          {topProducts.length > 0 ? (
            topProducts.map((product, i) =>
              width > 650 ? (
                <ProductGrid key={product._id || product.id} product={product} />
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
              {t("No top laptops found.", "لم يتم العثور على لابتوبات مميزة.")}
            </p>
          )}
        </div>

        {/* 📄 Top Laptops Pagination */}
        {topProducts.length > 0 && topPagination.totalPages > 1 && (
          <Pagination
            currentPage={topPagination.currentPage}
            totalPages={topPagination.totalPages}
            onPageChange={handleTopPageChange}
          />
        )}
      </main>
    </>
  );
};

export default CatLaptops;
