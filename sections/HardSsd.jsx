// src/sections/HardSsd.jsx
import React from "react";

// Hooks
import { useComponentsQuery } from "../components/hooks/useComponentsQuery.jsx";
import useComponentsStore from "../components/stores/useComponentsStore.jsx";
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";
import useTranslate from "../components/hooks/useTranslate.jsx";

// Components
import ProductCard from "../components/main/ProductCard.jsx";
import ProductBlock from "../components/main/ProductBlock.jsx";
import Pagination from "../components/main/Pagination.jsx";
import Loading from "../components/main/Loading.jsx";

import { motion } from "framer-motion";

const HardSsd = () => {
  const t = useTranslate();
  const width = useWindowWidth();
  const isMobile = width <= 650;

  /* ============================================================
     🧠 Zustand Store Slice
  ============================================================ */
  const { hardSsdParams, setHardSsdParams } = useComponentsStore();

  /* ============================================================
     📡 Query — FILTER BY CATEGORY
  ============================================================ */
  const { data, isLoading, isError } = useComponentsQuery({
    ...hardSsdParams,
    category: "Hard Disks & SSDs",
  });

  const products = data?.products ?? [];
  const pagination = data?.pagination ?? { currentPage: 1, totalPages: 1 };

  /* ============================================================
     🔧 Handlers
  ============================================================ */
  const handlePageChange = (page) => {
    if (page !== pagination.currentPage) {
      setHardSsdParams({ page });
    }
  };

  /* ============================================================
     📱 MOBILE — Swipe Pagination
  ============================================================ */
  const handleSwipeEnd = (e, info) => {
    const current = pagination.currentPage;
    const total = pagination.totalPages;

    if (info.offset.x < -120 && current < total) handlePageChange(current + 1);
    if (info.offset.x > 120 && current > 1) handlePageChange(current - 1);
  };

  /* ============================================================
     ⏳ Loading + Error
  ============================================================ */
  if (isLoading) {
    return (
      <Loading
        message={t("Loading storage components...", "جاري تحميل وحدات التخزين...")}
      />
    );
  }

  if (isError) {
    return (
      <p style={{ textAlign: "center" }}>
        {t("Failed to load storage components.", "فشل تحميل وحدات التخزين.")}
      </p>
    );
  }

  /* ============================================================
     🎨 Render
  ============================================================ */
  return (
    <section id="pc-pr-container">
      {/* Header */}
      <header className="pr-header" style={{ flexDirection: t.rowReverse }}>
        <h1>{t("Storage", "التخزين")}</h1>
      </header>

      {/* ==================== */}
      {/* 🖥 DESKTOP GRID      */}
      {/* ==================== */}
      {!isMobile && (
        <div className="pc-pr-cards">
          {products.length ? (
            products.map((product, i) => (
              <ProductCard key={product._id || i} product={product} />
            ))
          ) : (
            <p style={{ textAlign: "center" }}>
              {t("No products found.", "لا توجد منتجات.")}
            </p>
          )}
        </div>
      )}

      {/* ==================== */}
      {/* 📱 MOBILE GRID       */}
      {/* ==================== */}
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
                  <ProductBlock key={product._id || i} product={product} />
                ))
              ) : (
                <p style={{ textAlign: "center" }}>
                  {t("No products found.", "لا توجد منتجات.")}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* ==================== */}
      {/* 📌 PAGINATION FOOTER */}
      {/* ==================== */}
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </section>
  );
};

export default HardSsd;
