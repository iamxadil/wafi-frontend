import React, { useMemo, useState } from "react";

// Helpers
import buildFilters from "../components/utils/buildFilters.jsx";
import Filter from "../components/common/Filter.jsx";
import Sort from "../components/common/Sort.jsx";

// Reusables
import ProductGrid from "../components/main/ProductGrid.jsx";
import ProductBlock from "../components/main/ProductBlock.jsx";
import ProductCard from "../components/main/ProductCard.jsx";
import Pagination from "../components/main/Pagination.jsx";
import Loading from "../components/main/Loading.jsx";

// Hooks
import { useDynamicFilters } from "../components/hooks/useDynamicFilters.jsx";
import { useOthersQuery } from "../components/hooks/useOthersQuery.jsx";
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";
import useTranslate from "../components/hooks/useTranslate.jsx";

// Zustand
import useOthersStore from "../components/stores/useOthersStore.jsx";

const AllOthers = () => {
  const t = useTranslate();
  const width = useWindowWidth();

  const {
    othersPageParams,
    setOthersPageParams,
    filters,
    setFilters,
    sort,
    setSort,
    resetFilters,
  } = useOthersStore();

  /* ===========================================================
     🧠 Local “pending” filters (so user can pick before applying)
  =========================================================== */
  const [tempFilters, setTempFilters] = useState(filters);

  // 🧩 Fetch others data
  const { data: allOthers, isLoading } = useOthersQuery({
    ...othersPageParams,
    ...filters,
    sort,
  });

  const others = allOthers?.products || [];
  const pagination = allOthers?.pagination || { currentPage: 1, totalPages: 1 };

  // 🧩 Fetch dynamic filter metadata
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

  // 🧱 Build structured filters for Filter.jsx
  const dynamicFilters = useMemo(() => buildFilters(filtersData, t), [filtersData, t]);

  /* ===========================================================
     🧭 Handlers
  =========================================================== */
  const handlePageChange = (newPage) =>
    setOthersPageParams({ ...othersPageParams, page: newPage });

  const handleFilterChange = (updated) => setTempFilters(updated);

  const handleApplyFilters = (selected) => {
    setFilters(selected);
    setOthersPageParams({ page: 1 });
  };

  const handleClearAll = () => {
    resetFilters();
    setTempFilters({});
  };

  /* ===========================================================
     🌀 Loading State
  =========================================================== */
  if (isLoading || filtersLoading) {
    return <Loading message={t("Loading accessories...", "جاري تحميل الإكسسوارات...")} />;
  }

  /* ===========================================================
     🧩 Render
  =========================================================== */
  return (
    <div id="pc-pr-container">
      {/* === Header === */}
      <header className="pr-header" style={{ flexDirection: t.rowReverse }}>
        <h1>{t("Tech & Others", "معدات تقنية")}</h1>

        {/* === Filters & Sort === */}
        <div className="header-right">
          <Filter
            title={width > 650 && t("Filters", "الفلاتر")}
            filters={dynamicFilters}
            selected={tempFilters}
            onChange={handleFilterChange}
            onClearAll={handleClearAll}
            onApply={handleApplyFilters}
          />

          <Sort
            title={width > 650 && t("Sort", "الترتيب")}
            selected={sort}
            onChange={setSort}
          />
        </div>
      </header>

      {/* === Products Grid === */}
      <div className={width > 650 ? "pc-pr-cards" : "mobile-grid"}>
        {others.length > 0 ? (
          others.map((product, i) =>
            width > 650 ? (
              <ProductCard key={product._id || i} product={product} />
            ) : (
              <ProductBlock key={product._id || i} product={product} customDelay={i * 0.08} />
            )
          )
        ) : (
          <p style={{ textAlign: "center" }}>
            {t("No products found.", "لم يتم العثور على منتجات.")}
          </p>
        )}
      </div>

      {/* === Pagination === */}
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default AllOthers;
