import React, { useState } from "react";

// Components
import ProductBlock from "../components/main/ProductBlock.jsx";
import ProductCard from "../components/main/ProductCard.jsx";
import Pagination from "../components/main/Pagination.jsx";
import Loading from "../components/main/Loading.jsx";

// Hooks
import { motion } from "framer-motion";
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";
import useTranslate from "../components/hooks/useTranslate.jsx";
import { useMonitorsQuery } from "../components/hooks/useMonitorsQuery.jsx";

const AllMonitors = () => {
  const t = useTranslate();
  const width = useWindowWidth();
  const isMobile = width <= 650;

  // Local pagination state
  const [page, setPage] = useState(1);

  /* ===============================
     📡 Fetch monitors
  =============================== */
  const { data, isLoading, isError } = useMonitorsQuery({
    limit: 20,
    page,
  });

  const monitors = data?.products || [];
  const pagination = data?.pagination || { currentPage: 1, totalPages: 1 };

  /* ===============================
     🔥 MOBILE SWIPE PAGINATION
  =============================== */
  const handleSwipeEnd = (e, info) => {
    const current = pagination.currentPage;
    const total = pagination.totalPages;

    if (info.offset.x < -120 && current < total) {
      setPage(current + 1);
    }
    if (info.offset.x > 120 && current > 1) {
      setPage(current - 1);
    }
  };

  /* ===============================
     ⌛ Loading
  =============================== */
  if (isLoading) {
    return (
      <Loading
        message={t("Loading monitors...", "جاري تحميل الشاشات...")}
      />
    );
  }

  if (isError) {
    return (
      <p style={{ textAlign: "center" }}>
        {t("Failed to load monitors.", "فشل تحميل الشاشات.")}
      </p>
    );
  }

  /* ===============================
     🎨 Render
  =============================== */
  return (
    <div id="pc-pr-container">
      {/* Header */}
      <header className="pr-header" style={{ flexDirection: t.rowReverse }}>
        <h1>{t("Monitors", "الشاشات")}</h1>
        <div className="header-right"></div>
      </header>

      {/* ============================ */}
      {/* 🖥 DESKTOP GRID */}
      {/* ============================ */}
      {!isMobile && (
        <div className="pc-pr-cards">
          {monitors.length ? (
            monitors.map((product, i) => (
              <ProductCard
                key={product._id || i}
                product={product}
              />
            ))
          ) : (
            <p style={{ textAlign: "center" }}>
              {t("No monitors found.", "لم يتم العثور على شاشات.")}
            </p>
          )}
        </div>
      )}

      {/* ============================ */}
      {/* 📱 MOBILE — SWIPE PAGINATION */}
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
              {monitors.length ? (
                monitors.map((product, i) => (
                  <ProductBlock
                    key={product._id || i}
                    product={product}
                    customDelay={i * 0.08}
                  />
                ))
              ) : (
                <p style={{ textAlign: "center" }}>
                  {t("No monitors found.", "لم يتم العثور على شاشات.")}
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
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}
    </div>
  );
};

export default AllMonitors;
