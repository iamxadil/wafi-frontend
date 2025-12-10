// src/pages/CatComponents.jsx
import React, { useMemo } from "react";
import "../styles/cataccessories.css"; // ✅ same stylesheet, reuse styling

// Components
import SearchDropdown from "../components/main/SearchDropdown.jsx";
import AllComponents from "../sections/AllComponents.jsx";

// Hooks
import { useComponentsQuery } from "../components/hooks/useComponentsQuery.jsx";
import { useDynamicFilters } from "../components/hooks/useDynamicFilters.jsx";
import useComponentsStore from "../components/stores/useComponentsStore.jsx";
import useTranslate from "../components/hooks/useTranslate.jsx";
import Loading from "../components/main/Loading.jsx";
import HardSsd from "../sections/HardSsd.jsx";

const CatComponents = () => {
  const t = useTranslate();

  /* =============================================================
     🧠 Zustand Store (Live Search)
  ============================================================= */
  const {
    searchParam,
    setSearchParam,
    searchFilters,
    searchSort,
    setComponentsPageParams,
  } = useComponentsStore();

  /* =============================================================
     🔍 Live Search Query
  ============================================================= */
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

  const { data: searchData, isLoading, isError } =
    useComponentsQuery(searchQueryParams);

  const searchResults = searchData?.products || [];

  /* =============================================================
     🧩 Dynamic Filters (preload for smoother UX)
  ============================================================= */
  const { isLoading: filtersLoading } = useDynamicFilters({
    category: ["Hard Disks & SSDs", "Hard Disks", "SSD", "RAM"],
  });

  /* =============================================================
     ⚙️ Handlers
  ============================================================= */
  const handleSelectSearch = (product) => {
    setComponentsPageParams({ search: product.name, page: 1 });
    setSearchParam("");
  };

  /* =============================================================
     🌀 Loading & Error States
  ============================================================= */
  if (isLoading || filtersLoading)
    return (
      <Loading
        message={t("Loading components...", "جاري تحميل المكوّنات...")}
      />
    );

  if (isError)
    return (
      <p style={{ textAlign: "center" }}>
        {t("Failed to load components.", "فشل تحميل المكوّنات.")}
      </p>
    );

  /* =============================================================
     🎨 Render
  ============================================================= */
  return (
    <>
      {/* === HERO SECTION === */}
      <section className="accessories-hero components-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            {t("Power Up Your", "عزّز قوة")}{" "}
            <span>{t("Components", "المكوّنات")}</span>{" "}
            {t("Build", "لبناء جهازك")}.
          </h1>

      <p className="hero-subtitle" style={{ marginTop: "2rem" }}>
        {t(
          "Build smarter with components crafted for efficiency and top-tier performance.",
          "ارتقِ بجهازك بمكوّنات مصممة للكفاءة والأداء المتميز."
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

      {/* === MAIN COMPONENT SECTIONS === */}
      <AllComponents />
      <HardSsd />

    </>
  );
};

export default CatComponents;
