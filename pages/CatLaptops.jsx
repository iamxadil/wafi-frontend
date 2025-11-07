// src/pages/CatLaptops.jsx
import React, { useMemo } from "react";
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";
import useLaptopsStore from "../components/stores/useLaptopsStore.jsx";
import { useLaptopsQuery } from "../components/hooks/useLaptopsQuery.jsx";
import { useDynamicFilters } from "../components/hooks/useDynamicFilters.jsx";
import Loading from "../components/main/Loading.jsx";
import SearchDropdown from "../components/main/SearchDropdown.jsx";
import useTranslate from "../components/hooks/useTranslate.jsx";
import "../styles/catlaptops.css";
import AllLaptops from "../sections/AllLaptops.jsx";

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
    searchSort,

    // --- Main Grid
    laptopPageParams,
    filters,
    sort,
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

  // 2️⃣ Dynamic filters (category: Laptops)
  const { data: filtersData, isLoading: filtersLoading } = useDynamicFilters({
    category: ["Laptops"],
  });

  // 3️⃣ Live search query (for the top search dropdown)
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
  const searchResults = searchData?.products || [];

  /* =============================================================
     ⚙️ Handlers
  ============================================================= */
  const handleSelectSearch = (product) => {
    // Clicking a search result sets that product name as the search query
    // and resets pagination
    setSearchParam(product.name);
  };

  /* =============================================================
     🌀 Loading & Error States
  ============================================================= */
  if (isLoading || filtersLoading)
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

        {/* 🔍 Live Search */}
        <div className="search-dropdown-wrapper">
          <SearchDropdown
            width={600}
            products={searchResults}
            value={searchParam}
            onChange={(e) => setSearchParam(e.target.value)}
            onSelect={handleSelectSearch}
          />
        </div>
      </section>

      {/* === MAIN LAPTOP GRID === */}
      <AllLaptops />
    </>
  );
};

export default CatLaptops;
