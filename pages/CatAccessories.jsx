import React, { useMemo } from "react";
import "../styles/cataccessories.css";
import SearchDropdown from "../components/main/SearchDropdown.jsx";
import useAccessoriesStore from "../components/stores/useAccessoriesStore.jsx";
import { useAccessoriesQuery } from "../components/hooks/useAccessoriesQuery.jsx";
import { useDynamicFilters } from "../components/hooks/useDynamicFilters.jsx";
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";
import Pagination from "../components/main/Pagination.jsx";
import Loading from "../components/main/Loading.jsx";
import MobileCard from "../components/main/MobileCard.jsx";
import ProductGrid from "../components/main/ProductGrid.jsx";
import useTranslate from "../components/hooks/useTranslate.jsx";
import Filter from "../components/common/Filter.jsx";
import Sort from "../components/common/Sort.jsx";

/* =============================================================
   🎮 ACCESSORIES PAGE — Live Search + Grid Filters + Sort
============================================================= */
const CatAccessories = () => {
  const width = useWindowWidth();
  const t = useTranslate();

  /* =============================================================
     🧠 Zustand Store
  ============================================================= */
  const {
    // --- live search section
    searchParam,
    setSearchParam,
    searchFilters,
    setSearchFilters,
    resetSearchFilters,
    searchSort,
    setSearchSort,

    // --- main product grid section
    accessoriesPageParams,
    setAccessoriesPageParams,
    filters,
    setFilters,
    resetFilters,
    sort,
    setSort,
  } = useAccessoriesStore();

  /* =============================================================
     🔍 Queries
  ============================================================= */
  // 1️⃣ Main grid query (with sort + filters)
  const { data: accessories, isLoading, isError } = useAccessoriesQuery({
    ...accessoriesPageParams,
    ...filters,
    sort,
  });

  // 2️⃣ Dynamic filters query (shared)
  const { data: filtersData, isLoading: filtersLoading } = useDynamicFilters({
    category: ["Keyboards", "Mice", "Bags", "Headphones"],
  });

  // 3️⃣ Live search query (with search filters + sort)
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
  const { data: searchData } = useAccessoriesQuery(searchQueryParams);

  /* =============================================================
     🧩 Derived Data
  ============================================================= */
  const products = accessories?.products || [];
  const pagination = accessories?.pagination || { currentPage: 1, totalPages: 0 };
  const searchResults = searchData?.products || [];

  /* =============================================================
     ⚙️ Handlers
  ============================================================= */
  const handlePageChange = (page) => {
    if (page !== pagination.currentPage) setAccessoriesPageParams({ page });
  };

  const handleSelectSearch = (product) => {
    setAccessoriesPageParams({ search: product.name, page: 1 });
    setSearchParam("");
  };

  const handleSearchFilterChange = (updatedFilters) => {
    setSearchFilters(updatedFilters);
  };

  const handleGridFilterChange = (updatedFilters) => {
    setFilters(updatedFilters);
    setAccessoriesPageParams({ page: 1 });
  };

  /* =============================================================
     🧠 Dynamic Filters (shared)
  ============================================================= */
  const dynamicFilters = useMemo(() => {
    if (!filtersData) return [];

    const { brands = [], tags = [], priceRange = {} } = filtersData;
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
     🌀 Loading & Error States
  ============================================================= */
  if (isLoading)
    return <Loading message={t("Loading Accessories...", "جاري تحميل الإكسسوارات...")} />;
  if (isError)
    return (
      <p style={{ textAlign: "center" }}>
        {t("Failed to load accessories.", "فشل تحميل الإكسسوارات.")}
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
            {t("Elevate Your", "ارتقِ بـ")}{" "}
            <span>{t("Accessories", "إكسسواراتك")}</span>{" "}
            {t("Game", "إلى المستوى التالي")}
          </h1>

          <p className="hero-subtitle" style={{ marginTop: "2rem" }}>
            {t(
              "Discover precision-crafted designs made for performance, style, and innovation.",
              "اكتشف تصاميم دقيقة الصنع تجمع بين الأداء والأناقة والابتكار."
            )}
          </p>
        </div>

        {/* 🔍 Search Dropdown */}
        <div className="search-dropdown-wrapper">
          <SearchDropdown
            width={600}
            products={searchResults}
            value={searchParam}
            onChange={(e) => setSearchParam(e.target.value)}
            onSelect={handleSelectSearch}
          />
        </div>

        {/* ⚙️ Search Filter + Sort */}
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

      {/* === MAIN CONTENT === */}
      <main id="pc-pr-container">
        <header className="pr-header">
          <div className="header-left">
            <h1>{t("Accessories", "الإكسسوارات")}</h1>
          </div>

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
              {t("No accessories found.", "لم يتم العثور على إكسسوارات.")}
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

export default CatAccessories;
