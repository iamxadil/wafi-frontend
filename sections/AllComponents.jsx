import React, { useMemo, useState } from "react";

// Helpers
import buildFilters from "../components/utils/buildFilters.jsx";
import Filter from "../components/common/Filter.jsx";
import Sort from "../components/common/Sort.jsx";

// Reusables
import ProductBlock from "../components/main/ProductBlock.jsx";
import ProductCard from "../components/main/ProductCard.jsx";
import Pagination from "../components/main/Pagination.jsx";
import Loading from "../components/main/Loading.jsx";

// Swipe
import { motion } from "framer-motion";

// Hooks
import { useDynamicFilters } from "../components/hooks/useDynamicFilters.jsx";
import { useComponentsQuery } from "../components/hooks/useComponentsQuery.jsx";
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";
import useTranslate from "../components/hooks/useTranslate.jsx";

// Zustand
import useComponentsStore from "../components/stores/useComponentsStore.jsx";

/* ============================================================
   MAIN PAGE — COMPONENTS
============================================================ */
const AllComponents = () => {
  const t = useTranslate();
  const width = useWindowWidth();
  const isMobile = width <= 650;

  /* ============================================================
     🧠 Zustand Store
  ============================================================= */
  const {
    componentsPageParams,
    setComponentsPageParams,
    filters,
    setFilters,
    resetFilters,
    sort,
    setSort,
  } = useComponentsStore();

  const [tempFilters, setTempFilters] = useState(filters);

  /* ============================================================
     🔍 Query Components
  ============================================================= */
  const { data: allComponents, isLoading } = useComponentsQuery({
    ...componentsPageParams,
    ...filters,
    sort,
  });

  const products = allComponents?.products || [];
  const pagination = allComponents?.pagination || {
    currentPage: 1,
    totalPages: 1,
  };

  /* ============================================================
     🔍 Dynamic Filters (use same hook!)
  ============================================================= */
  const { data: filtersData, isLoading: filtersLoading } = useDynamicFilters({
    category: ["Hard Disks & SSDs", "Hard Disks", "SSD", "RAM"],
  });

  const dynamicFilters = useMemo(
    () => buildFilters(filtersData, t),
    [filtersData, t]
  );

  /* ============================================================
     🔧 Handlers
  ============================================================= */
  const handlePageChange = (page) =>
    setComponentsPageParams({ ...componentsPageParams, page });

  const handleApplyFilters = (selected) => {
    setFilters(selected);
    setComponentsPageParams({ page: 1 });
  };

  const handleClearAll = () => {
    resetFilters();
    setTempFilters({});
  };

  /* ============================================================
     📱 MOBILE SWIPE PAGINATION
  ============================================================= */
  const handleSwipeEnd = (e, info) => {
    const threshold = 120;

    const current = pagination.currentPage;
    const total = pagination.totalPages;

    if (info.offset.x < -threshold && current < total) {
      handlePageChange(current + 1);
    }
    if (info.offset.x > threshold && current > 1) {
      handlePageChange(current - 1);
    }
  };

  /* ============================================================
     ⌛ Loading
  ============================================================= */
  if (isLoading || filtersLoading) {
    return (
      <Loading
        message={t("Loading components...", "جاري تحميل المكوّنات...")}
      />
    );
  }

  /* ============================================================
     🎨 Render
  ============================================================= */
  return (
    <div id="pc-pr-container">
      {/* HEADER */}
      <header className="pr-header" style={{ flexDirection: t.rowReverse }}>
        <h1>{t("Components", "المكوّنات")}</h1>

        <div className="header-right">
          <Filter
            title={width > 650 && t("Filters", "الفلاتر")}
            filters={dynamicFilters}
            selected={tempFilters}
            onChange={setTempFilters}
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

      {/* DESKTOP GRID */}
      {!isMobile && (
        <div className="pc-pr-cards">
          {products.length ? (
            products.map((product, i) => (
              <ProductCard key={product._id || i} product={product} />
            ))
          ) : (
            <p style={{ textAlign: "center" }}>
              {t("No components found.", "لا توجد مكوّنات.")}
            </p>
          )}
        </div>
      )}

      {/* MOBILE GRID */}
      {isMobile && (
        <div className="swipe-lock">
          <motion.div
            className="swipe-mobile"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            dragMomentum={false}
            onDragEnd={handleSwipeEnd}
          >
            <div className="mobile-grid">
              {products.length ? (
                products.map((product, i) => (
                  <ProductBlock
                    key={product._id || i}
                    product={product}
                    customDelay={i * 0.08}
                  />
                ))
              ) : (
                <p style={{ textAlign: "center" }}>
                  {t("No components found.", "لا توجد مكوّنات.")}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* PAGINATION */}
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

export default AllComponents;
