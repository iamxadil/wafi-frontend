import React, { useMemo, useState } from "react";

// Components
import Filter from "../components/common/Filter.jsx";
import Sort from "../components/common/Sort.jsx";
import ProductGrid from "../components/main/ProductGrid.jsx";
import ProductBlock from "../components/main/ProductBlock.jsx";
import ProductCard from "../components/main/ProductCard.jsx";
import Pagination from "../components/main/Pagination.jsx";
import Loading from "../components/main/Loading.jsx";

// Hooks
import { motion } from "framer-motion";
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
  const isMobile = width <= 650;

  const {
    laptopPageParams,
    setLaptopPageParams,
    filters,
    setFilters,
    sort,
    setSort,
    resetFilters,
  } = useLaptopsStore();

  const [tempFilters, setTempFilters] = useState(filters);

  /* ===============================
     📡 Fetch laptops
  =============================== */
  const { data: allLaptops, isLoading: laptopsLoading } = useLaptopsQuery({
    ...laptopPageParams,
    ...filters,
    sort,
    category: "Laptops",
  });

  const laptops = allLaptops?.products || [];
  const pagination = allLaptops?.pagination || { currentPage: 1, totalPages: 1 };

  /* ===============================
     📡 Fetch dynamic filter data
  =============================== */
  const { data: dynamicData, isLoading: filtersLoading } =
    useLaptopsDynamicFilters();

  const dynamicFilters = dynamicData?.filters || [];

  /* ===============================
     📌 Handlers
  =============================== */
  const handlePageChange = (page) =>
    setLaptopPageParams({ ...laptopPageParams, page });

  const handleApplyFilters = (selected) => {
    setFilters(selected);
    setLaptopPageParams({ page: 1 });
  };

  const handleClearAll = () => {
    resetFilters();
    setTempFilters({});
  };

  /* ===============================
     🔥 MOBILE SWIPE PAGINATION
  =============================== */
  const handleSwipeEnd = (e, info) => {
    const current = pagination.currentPage;
    const total = pagination.totalPages;

    if (info.offset.x < -120 && current < total) handlePageChange(current + 1);
    if (info.offset.x > 120 && current > 1) handlePageChange(current - 1);
  };

  /* ===============================
     ⌛ Loading
  =============================== */
  if (laptopsLoading || filtersLoading) {
    return (
      <Loading
        message={t("Loading laptops...", "جاري تحميل اللابتوبات...")}
      />
    );
  }

  /* ===============================
     🎨 Render
  =============================== */
  return (
    <div id="pc-pr-container">
      {/* Header */}
      <header className="pr-header" style={{ flexDirection: t.rowReverse }}>
        <h1>{t("Laptops", "اللابتوبات")}</h1>

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

      {/* ============================ */}
      {/* 🖥 DESKTOP GRID */}
      {/* ============================ */}
      {!isMobile && (
        <div className="pc-pr-cards">
          {laptops.length ? (
            laptops.map((product, i) => (
              <ProductCard key={product._id || i} product={product} />
            ))
          ) : (
            <p style={{ textAlign: "center" }}>
              {t("No laptops found.", "لم يتم العثور على لابتوبات.")}
            </p>
          )}
        </div>
      )}

      {/* ============================ */}
      {/* 📱 MOBILE — SWIPE */}
      {/* ============================ */}
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
              {laptops.length ? (
                laptops.map((product, i) => (
                  <ProductBlock
                    key={product._id || i}
                    product={product}
                    customDelay={i * 0.08}
                  />
                ))
              ) : (
                <p style={{ textAlign: "center" }}>
                  {t("No laptops found.", "لم يتم العثور على لابتوبات.")}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* ============================ */}
      {/* 📌 PAGINATION FOOTER */}
      {/* ============================ */}
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
