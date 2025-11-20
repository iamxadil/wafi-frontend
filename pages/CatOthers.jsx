import React, { useMemo } from "react";
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";
import useOthersStore from "../components/stores/useOthersStore.jsx";
import { useOthersQuery } from "../components/hooks/useOthersQuery.jsx";
import { useDynamicFilters } from "../components/hooks/useDynamicFilters.jsx";
import Loading from "../components/main/Loading.jsx";
import SearchDropdown from "../components/main/SearchDropdown.jsx";
import useTranslate from "../components/hooks/useTranslate.jsx";
import "../styles/cataccessories.css";
import AllOthers from "../sections/AllOthers.jsx";

const CatOthers = () => {
  const width = useWindowWidth();
  const t = useTranslate();

  /* =============================================================
     🧠 Zustand Store
  ============================================================= */
  const {
    searchParam,
    setSearchParam,
    searchFilters,
    searchSort,
    othersPageParams,
    filters,
    sort,
  } = useOthersStore();

  /* =============================================================
     🔍 Queries
  ============================================================= */
  const { data: others, isLoading, isError } = useOthersQuery({
    ...othersPageParams,
    ...filters,
    sort,
  });

  const { data: filtersData, isLoading: filtersLoading } = useDynamicFilters({
    category: [
      "Routers",
      "Adapters",
      "Flash Drives",
      "Hard Disks & SSDs",
      "Cables",
      "Power Banks",
      "USB Hubs",
      "Others"
    ],
  });

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

  const { data: searchData } = useOthersQuery(searchQueryParams);
  const searchResults = searchData?.products || [];

  const handleSelectSearch = (product) => setSearchParam(product.name);

  /* =============================================================
     🌀 Loading & Error States
  ============================================================= */
  if (isLoading || filtersLoading)
    return (
      <Loading
        message={t("Loading accessories...", "جاري تحميل الإكسسوارات.")}
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
          {t("Empower Your", "عزّز")}{" "}
          <span>{t("Setup", "تجهيزاتك")}</span>{" "}
          {t("with Smart Tech", "بتقنيات ذكية")}
        </h1>

        <p className="hero-subtitle" style={{ marginTop: "2rem" }}>
          {t(
            "Explore routers, drives, and essential tools that keep your world connected and efficient.",
            "استكشف أجهزة الراوتر، والأقراص، والأدوات الأساسية التي تُبقي عالمك متصلاً وفعّالاً."
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

      {/* === MAIN ACCESSORIES GRID === */}
      <AllOthers />
    </>
  );
};

export default CatOthers;
