// src/pages/CatAccessories.jsx
import React, { useMemo } from "react";
import "../styles/cataccessories.css";

// Components
import SearchDropdown from "../components/main/SearchDropdown.jsx";
import AllAccessories from "../sections/AllAccessories.jsx";
import GamingAccessories from "../sections/GamingAccessories.jsx";

// Hooks
import { useAccessoriesQuery } from "../components/hooks/useAccessoriesQuery.jsx";
import { useDynamicFilters } from "../components/hooks/useDynamicFilters.jsx";
import useAccessoriesStore from "../components/stores/useAccessoriesStore.jsx";
import useTranslate from "../components/hooks/useTranslate.jsx";
import Loading from "../components/main/Loading.jsx";

const CatAccessories = () => {
  const t = useTranslate();

  /* =============================================================
     🧠 Zustand Store
  ============================================================= */
  const {
    // 🔍 Live Search
    searchParam,
    setSearchParam,
    searchFilters,
    searchSort,
    setAccessoriesPageParams,
  } = useAccessoriesStore();

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

  const { data: searchData, isLoading, isError } = useAccessoriesQuery(searchQueryParams);
  const searchResults = searchData?.products || [];

  /* =============================================================
     🧩 Dynamic Filters
  ============================================================= */
  const { isLoading: filtersLoading } = useDynamicFilters({
    category: ["Keyboards", "Mice", "Bags", "Headphones"],
  });

  /* =============================================================
     ⚙️ Handlers
  ============================================================= */
  const handleSelectSearch = (product) => {
    setAccessoriesPageParams({ search: product.name, page: 1 });
    setSearchParam("");
  };

  /* =============================================================
     🌀 Loading & Error States
  ============================================================= */
  if (isLoading || filtersLoading)
    return (
      <Loading
        message={t("Loading accessories...", "جاري تحميل الإكسسوارات...")}
      />
    );

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

      {/* === MAIN ACCESSORY SECTIONS === */}
      <AllAccessories />
      <GamingAccessories />
    </>
  );
};

export default CatAccessories;
