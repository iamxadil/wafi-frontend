import React, { useMemo, useState } from "react";

// Helpers
import buildFilters from "../components/utils/buildFilters.jsx";
import Filter from "../components/common/Filter.jsx";
import Sort from "../components/common/Sort.jsx";

// Reusables
import ProductGrid from "../components/main/ProductGrid.jsx";
import ProductBlock from "../components/main/ProductBlock.jsx";
import Pagination from "../components/main/Pagination.jsx";
import Loading from "../components/main/Loading.jsx";

// Hooks
import { useDynamicFilters } from "../components/hooks/useDynamicFilters.jsx";
import { useLaptopsQuery } from "../components/hooks/useLaptopsQuery.jsx";
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";
import useTranslate from "../components/hooks/useTranslate.jsx";

// Zustand
import useLaptopsStore from "../components/stores/useLaptopsStore.jsx";

const AllLaptops = () => {
  const t = useTranslate();
  const width = useWindowWidth();

  const {
    laptopPageParams,
    setLaptopPageParams,
    filters,
    setFilters,
    sort,
    setSort,
    resetFilters,
  } = useLaptopsStore();

  /* ===========================================================
     🧠 Local “pending” filters (so user can pick before applying)
  =========================================================== */
  const [tempFilters, setTempFilters] = useState(filters);

  // 🧩 Fetch laptop data
  const { data: allLaptops, isLoading } = useLaptopsQuery({
    ...laptopPageParams,
    ...filters, // Only applied filters trigger query
    sort,
  });

  const laptops = allLaptops?.products || [];
  const pagination = allLaptops?.pagination || { currentPage: 1, totalPages: 1 };

  // 🧩 Fetch dynamic filter metadata
  const { data: filtersData, isLoading: filtersLoading } = useDynamicFilters({
    category: ["Laptops"],
  });

  // 🧱 Build structured filters for Filter.jsx
  const dynamicFilters = useMemo(() => buildFilters(filtersData, t), [filtersData, t]);

  /* ===========================================================
     🧭 Handlers
  =========================================================== */
  const handlePageChange = (newPage) =>
    setLaptopPageParams({ ...laptopPageParams, page: newPage });

  const handleFilterChange = (updated) => {
    // This updates the temporary filter UI state
    setTempFilters(updated);
  };

  const handleApplyFilters = (selected) => {
    // When Apply clicked, commit to global store and reset page
    setFilters(selected);
    setLaptopPageParams({ page: 1 });
  };

  const handleClearAll = () => {
    resetFilters();
    setTempFilters({});
  };

  /* ===========================================================
     🌀 Loading State
  =========================================================== */
  if (isLoading || filtersLoading) {
    return <Loading message={t("Loading laptops...", "جاري تحميل اللابتوبات...")} />;
  }

  /* ===========================================================
     🧩 Render
  =========================================================== */
  return (
    <div id="pc-pr-container">
      {/* === Header === */}
      <header className="pr-header" style={{ flexDirection: t.rowReverse}}>
      <h1>{t("Laptops", "اللابتوبات")}</h1>
     
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
      <div
        className={width > 650 ? "products-grid-container" : "mobile-grid"}
      >
        {laptops.length > 0 ? (
          laptops.map((product, i) =>
            width > 650 ? (
              <ProductGrid key={product._id || i} product={product} />
            ) : (
              <ProductBlock key={product._id || i} product={product} customDelay={i * 0.08} />
            )
          )
        ) : (
          <p style={{ textAlign: "center" }}>
            {t("No laptops found.", "لم يتم العثور على لابتوبات.")}
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

export default AllLaptops;
