import React, { useMemo, useState } from "react";

// Components
import Filter from "../components/common/Filter.jsx";
import Sort from "../components/common/Sort.jsx";
import ProductGrid from "../components/main/ProductGrid.jsx";
import ProductBlock from "../components/main/ProductBlock.jsx";
import Pagination from "../components/main/Pagination.jsx";
import Loading from "../components/main/Loading.jsx";

// Hooks
import { useLaptopsDynamicFilters } from "../components/query/useLaptopsDynamicFilters.jsx";
import { useLaptopsQuery } from "../components/hooks/useLaptopsQuery.jsx";
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";
import useTranslate from "../components/hooks/useTranslate.jsx";

// Zustand
import useLaptopsStore from "../components/stores/useLaptopsStore.jsx";

/* ============================================================
   MAIN PAGE
============================================================ */
const AllLaptops = () => {
  const t = useTranslate();
  const width = useWindowWidth();

  const {
    laptopPageParams,
    setLaptopPageParams,
    filters,        // committed filters (applied)
    setFilters,     
    sort,
    setSort,
    resetFilters
  } = useLaptopsStore();

  /* ============================================================
     🧠 Local temp filters (before Apply)
  ============================================================= */
  const [tempFilters, setTempFilters] = useState(filters);

  /* ============================================================
     🧮 Fetch laptops with committed filters
  ============================================================= */
  const { data: allLaptops, isLoading: laptopsLoading } = useLaptopsQuery({
    ...laptopPageParams,
    ...filters,
    sort,
    category: "Laptops"
  });

  const laptops = allLaptops?.products || [];
  const pagination = allLaptops?.pagination || {
    currentPage: 1,
    totalPages: 1,
  };

  /* ============================================================
     🏗  Fetch dynamic filter metadata (CPU/GPU/RAM/etc)
  ============================================================= */
  const {
    data: dynamicData,
    isLoading: filtersLoading
  } = useLaptopsDynamicFilters(); // NEW ONE

  // Filter definitions ready for Filter.jsx
  const dynamicFilters = dynamicData?.filters || [];

  /* ============================================================
     📌 Handlers
  ============================================================= */
  const handlePageChange = (page) =>
    setLaptopPageParams({ ...laptopPageParams, page });

  const handleFilterChange = (updated) => setTempFilters(updated);

  const handleApplyFilters = (selected) => {
    setFilters(selected);               // commit them
    setLaptopPageParams({ page: 1 });   // reset page to 1
  };

  const handleClearAll = () => {
    resetFilters();
    setTempFilters({});
  };

  /* ============================================================
     ⏳ Loading
  ============================================================= */
  if (laptopsLoading || filtersLoading) {
    return (
      <Loading
        message={t("Loading laptops...", "جاري تحميل اللابتوبات...")}
      />
    );
  }

  /* ============================================================
     🎨 Render
  ============================================================= */
  return (
    <div id="pc-pr-container">
      {/* Header */}
      <header className="pr-header" style={{ flexDirection: t.rowReverse }}>
        <h1>{t("Laptops", "اللابتوبات")}</h1>

        <div className="header-right">
          {/* Filter Component */}
          <Filter
            title={width > 650 && t("Filters", "الفلاتر")}
            filters={dynamicFilters}
            selected={tempFilters}
            onChange={handleFilterChange}
            onClearAll={handleClearAll}
            onApply={handleApplyFilters}
          />

          {/* Sort Component */}
          <Sort
            title={width > 650 && t("Sort", "الترتيب")}
            selected={sort}
            onChange={setSort}
          />
        </div>
      </header>

      {/* Products Grid */}
      <div className={width > 650 ? "products-grid-container" : "mobile-grid"}>
        {laptops.length ? (
          laptops.map((product, i) =>
            width > 650 ? (
              <ProductGrid key={product._id || i} product={product} />
            ) : (
              <ProductBlock
                key={product._id || i}
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

      {/* Pagination */}
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
