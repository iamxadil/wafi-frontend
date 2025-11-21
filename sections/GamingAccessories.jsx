import React from "react";

// Hooks
import { useAccessoriesQuery } from "../components/hooks/useAccessoriesQuery.jsx";
import useAccessoriesStore from "../components/stores/useAccessoriesStore.jsx";
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";
import useTranslate from "../components/hooks/useTranslate.jsx";

// Components
import MobileCard from "../components/main/MobileCard.jsx";
import ProductCard from "../components/main/ProductCard.jsx";
import ProductGrid from "../components/main/ProductGrid.jsx";
import Pagination from "../components/main/Pagination.jsx";
import Loading from "../components/main/Loading.jsx";
import ProductBlock from "../components/main/ProductBlock.jsx";

import { motion } from "framer-motion";

const GamingAccessories = () => {
  // Zustand
  const { gamingAccessories, setGamingAccessories } = useAccessoriesStore();

  // Query
  const { data: gaming, isLoading, isError } = useAccessoriesQuery({
    ...gamingAccessories,
    tags: ["Gaming"],
  });

  const products = gaming?.products ?? [];
  const pagination = gaming?.pagination ?? { currentPage: 1, totalPages: 1 };

  // Translate + Width
  const t = useTranslate();
  const width = useWindowWidth();
  const isMobile = width <= 650;

  // Handle Page Change
  const handlePageChange = (page) => {
    if (page !== pagination.currentPage) setGamingAccessories({ page });
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

  /* ============================================================
     ⏳ Loading / Error
  ============================================================ */
  if (isLoading) {
    return (
      <Loading
        message={t("Loading Accessories...", "جاري تحميل الإكسسوارات...")}
      />
    );
  }

  if (isError) {
    return (
      <p style={{ textAlign: "center" }}>
        {t("Failed to load accessories.", "فشل تحميل الإكسسوارات.")}
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
        <h1>{t("Gaming", "اكسسوارات الالعاب")}</h1>
      </header>

      {/* ========================== */}
      {/* 🖥 DESKTOP GRID            */}
      {/* ========================== */}
      {!isMobile && (
        <div className="pc-pr-cards">
          {products.length ? (
            products.map((product, i) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))
          ) : (
            <p style={{ textAlign: "center" }}>
              {t(
                "No gaming accessories found.",
                "لم يتم العثور على إكسسوارات ألعاب."
              )}
            </p>
          )}
        </div>
      )}

      {/* ========================== */}
      {/* 📱 MOBILE — SWIPE GRID     */}
      {/* ========================== */}
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
                    key={product._id || product.id}
                    product={product}
                    customDelay={i * 0.08}
                  />
                ))
              ) : (
                <p style={{ textAlign: "center" }}>
                  {t(
                    "No gaming accessories found.",
                    "لم يتم العثور على إكسسوارات ألعاب."
                  )}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* ========================== */}
      {/* 📌 PAGINATION FOOTER       */}
      {/* ========================== */}
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

export default GamingAccessories;
