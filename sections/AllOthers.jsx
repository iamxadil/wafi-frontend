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

// Hooks
import { motion } from "framer-motion";
import { useDynamicFilters } from "../components/hooks/useDynamicFilters.jsx";
import { useOthersQuery } from "../components/hooks/useOthersQuery.jsx";
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";
import useTranslate from "../components/hooks/useTranslate.jsx";

// Zustand
import useOthersStore from "../components/stores/useOthersStore.jsx";

const AllOthers = () => {
  const t = useTranslate();
  const width = useWindowWidth();
  const isMobile = width <= 650;

  const {
    othersPageParams,
    setOthersPageParams,
    filters,
    setFilters,
    sort,
    setSort,
    resetFilters,
  } = useOthersStore();

  const [tempFilters, setTempFilters] = useState(filters);

  // Fetch Data
  const { data: allOthers, isLoading } = useOthersQuery({
    ...othersPageParams,
    ...filters,
    sort,
  });

  const others = allOthers?.products || [];
  const pagination = allOthers?.pagination || {
    currentPage: 1,
    totalPages: 1,
  };

  // Dynamic Filters
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

  const dynamicFilters = useMemo(
    () => buildFilters(filtersData, t),
    [filtersData, t]
  );

  // Handlers
  const handlePageChange = (newPage) =>
    setOthersPageParams({ ...othersPageParams, page: newPage });

  const handleApplyFilters = (selected) => {
    setFilters(selected);
    setOthersPageParams({ page: 1 });
  };

  const handleClearAll = () => {
    resetFilters();
    setTempFilters({});
  };

  /* ============================================================
     📱 MOBILE — SWIPE PAGINATION
  ============================================================ */
  const handleSwipeEnd = (e, info) => {
    const x = info.offset.x;
    const current = pagination.currentPage;
    const total = pagination.totalPages;

    if (x < -120 && current < total) handlePageChange(current + 1);
    if (x > 120 && current > 1) handlePageChange(current - 1);
  };

  if (isLoading || filtersLoading) {
    return (
      <Loading
        message={t("Loading accessories...", "جاري تحميل الإكسسوارات...")}
      />
    );
  }

  return (
    <div id="pc-pr-container">
      {/* Header */}
      <header className="pr-header" style={{ flexDirection: t.rowReverse }}>
        <h1>{t("Tech & Others", "معدات تقنية")}</h1>

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
          {others.length ? (
            others.map((product, i) => (
              <ProductCard key={product._id || i} product={product} />
            ))
          ) : (
            <p style={{ textAlign: "center" }}>
              {t("No products found.", "لم يتم العثور على منتجات.")}
            </p>
          )}
        </div>
      )}

      {/* ============================================================
          📱 MOBILE — SWIPE GRID
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
              {others.length ? (
                others.map((product, i) => (
                  <ProductBlock
                    key={product._id || i}
                    product={product}
                    customDelay={i * 0.08}
                  />
                ))
              ) : (
                <p style={{ textAlign: "center" }}>
                  {t("No products found.", "لم يتم العثور على منتجات.")}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      )}

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

export default AllOthers;
