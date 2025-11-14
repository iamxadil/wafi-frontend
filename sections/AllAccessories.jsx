import React, { useMemo, useState } from "react";

// Helpers
import buildFilters from "../components/utils/buildFilters.jsx";
import Filter from "../components/common/Filter.jsx";
import Sort from "../components/common/Sort.jsx";

// Reusables
import ProductGrid from "../components/main/ProductGrid.jsx";
import ProductBlock from '../components/main/ProductBlock.jsx';
import MobileCard from "../components/main/MobileCard.jsx";
import ProductCard from '../components/main/ProductCard.jsx';
import Pagination from "../components/main/Pagination.jsx";
import Loading from "../components/main/Loading.jsx";

// Hooks
import { useDynamicFilters } from "../components/hooks/useDynamicFilters.jsx";
import { useAccessoriesQuery } from "../components/hooks/useAccessoriesQuery.jsx";
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";
import useTranslate from "../components/hooks/useTranslate.jsx";

// Zustand
import useAccessoriesStore from "../components/stores/useAccessoriesStore.jsx";

const AllAccessories = () => {
  const t = useTranslate();
  const width = useWindowWidth();

  /* ============================================================
     🧠 Zustand Store
  ============================================================ */
  const {
    accessoriesPageParams,
    setAccessoriesPageParams,
    filters,
    setFilters,
    resetFilters,
    sort, // kept for consistency even if not yet used
    setSort,
  } = useAccessoriesStore();

  /* ============================================================
     🧠 Local “pending” filters (so user can adjust before Apply)
  ============================================================ */
  const [tempFilters, setTempFilters] = useState(filters);

  /* ============================================================
     🔍 Main Query
  ============================================================ */
  const { data: allAccessories, isLoading } = useAccessoriesQuery({
    ...accessoriesPageParams,
    ...filters, // ✅ only applied filters trigger query
    sort,
  });

  const products = allAccessories?.products || [];
  const pagination = allAccessories?.pagination || {
    currentPage: 1,
    totalPages: 1,
  };

  /* ============================================================
     🧩 Dynamic Filter Metadata
  ============================================================ */
  const { data: filtersData, isLoading: filtersLoading } = useDynamicFilters({
    category: ["Keyboards", "Mice", "Bags", "Headphones"],
  });

  // 🧱 Build structured filters for Filter.jsx
  const dynamicFilters = useMemo(() => buildFilters(filtersData, t), [filtersData, t]);

  /* ============================================================
     ⚙️ Handlers
  ============================================================ */
  const handlePageChange = (newPage) =>
    setAccessoriesPageParams({ ...accessoriesPageParams, page: newPage });

  const handleFilterChange = (updated) => {
    // Temporary (not applied yet)
    setTempFilters(updated);
  };

  const handleApplyFilters = (selected) => {
    // ✅ Commit filters and reset page
    setFilters(selected);
    setAccessoriesPageParams({ page: 1 });
  };

  const handleClearAll = () => {
    resetFilters();
    setTempFilters({});
  };

  /* ============================================================
     🌀 Loading State
  ============================================================ */
  if (isLoading || filtersLoading) {
    return (
      <Loading
        message={t("Loading accessories...", "جاري تحميل الإكسسوارات...")}
      />
    );
  }

  /* ============================================================
     🧩 Render
  ============================================================ */
  return (
    <div id="pc-pr-container">
      {/* === Header === */}
      <header className="pr-header" style={{ flexDirection: t.rowReverse}}>
       <h1>{t("Accessories", "الإكسسوارات")}</h1>

        <div className="header-right">
            <Filter
          title={width > 650 && t("Filters", "الفلاتر")}
          filters={dynamicFilters}
          selected={tempFilters}
          onChange={handleFilterChange}
          onClearAll={handleClearAll}
          onApply={handleApplyFilters} // ✅ Apply button works the same
        />

           <Sort
            title={ width > 650 && t("Sort", "الترتيب")}
            selected={sort}
            onChange={setSort}
          />
        </div>
      
      </header>

      {/* === Products Grid === */}
      <div
        className={width > 650 ? "pc-pr-cards" : "mobile-grid"}
      >
        {products.length > 0 ? (
          products.map((product, i) =>
            width > 650 ? (
              <ProductCard key={product._id || i} product={product} />
            ) : (
              <ProductBlock key={product._id || i} product={product} customDelay={i * 0.08} />
            )
          )
        ) : (
          <p style={{ textAlign: "center" }}>
            {t("No accessories found.", "لم يتم العثور على إكسسوارات.")}
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

export default AllAccessories;
