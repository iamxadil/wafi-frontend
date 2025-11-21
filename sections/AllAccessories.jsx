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
import { useAccessoriesQuery } from "../components/hooks/useAccessoriesQuery.jsx";
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";
import useTranslate from "../components/hooks/useTranslate.jsx";

// Zustand
import useAccessoriesStore from "../components/stores/useAccessoriesStore.jsx";

/* ============================================================
   MAIN PAGE — ACCESSORIES
============================================================ */
const AllAccessories = () => {
  const t = useTranslate();
  const width = useWindowWidth();
  const isMobile = width <= 650;

  /* ============================================================
     🧠 Zustand Store
  ============================================================= */
  const {
    accessoriesPageParams,
    setAccessoriesPageParams,
    filters,
    setFilters,
    resetFilters,
    sort,
    setSort,
  } = useAccessoriesStore();

  const [tempFilters, setTempFilters] = useState(filters);

  /* ============================================================
     🔍 Query Products
  ============================================================= */
  const { data: allAccessories, isLoading } = useAccessoriesQuery({
    ...accessoriesPageParams,
    ...filters,
    sort,
  });

  const products = allAccessories?.products || [];
  const pagination = allAccessories?.pagination || {
    currentPage: 1,
    totalPages: 1,
  };

  /* ============================================================
     🔍 Dynamic Filters
  ============================================================= */
  const { data: filtersData, isLoading: filtersLoading } = useDynamicFilters({
    category: ["Keyboards", "Mice", "Bags", "Headphones"],
  });

  const dynamicFilters = useMemo(
    () => buildFilters(filtersData, t),
    [filtersData, t]
  );

  /* ============================================================
     🔧 Handlers
  ============================================================= */
  const handlePageChange = (page) =>
    setAccessoriesPageParams({ ...accessoriesPageParams, page });

  const handleApplyFilters = (selected) => {
    setFilters(selected);
    setAccessoriesPageParams({ page: 1 });
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
      <Loading message={t("Loading accessories...", "جاري تحميل الإكسسوارات...")} />
    );
  }

  /* ============================================================
     🎨 Render
  ============================================================= */
  return (
    <div id="pc-pr-container">
      {/* HEADER */}
      <header className="pr-header" style={{ flexDirection: t.rowReverse }}>
        <h1>{t("Accessories", "الإكسسوارات")}</h1>

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

      {/* ============================================================
         🖥 DESKTOP GRID
      ============================================================ */}
      {!isMobile && (
        <div className="pc-pr-cards">
          {products.length ? (
            products.map((product, i) => (
              <ProductCard key={product._id || i} product={product} />
            ))
          ) : (
            <p style={{ textAlign: "center" }}>
              {t("No accessories found.", "لم يتم العثور على إكسسوارات.")}
            </p>
          )}
        </div>
      )}

      {/* ============================================================
         📱 MOBILE — SWIPE PAGINATION (fixed)
      ============================================================ */}
      {isMobile && (
        <div className="swipe-lock">
          <motion.div
            className="swipe-mobile"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            dragMomentum={false}
            dragPropagation={false}
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
                  {t("No accessories found.", "لم يتم العثور على إكسسوارات.")}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* PAGINATION FOOTER */}
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
