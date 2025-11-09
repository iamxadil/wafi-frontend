import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProductGrid from "./ProductGrid.jsx";
import MobileCard from "./MobileCard.jsx";
import useWindowWidth from "../hooks/useWindowWidth.jsx";
import useAccessoriesStore from "../stores/useAccessoriesStore.jsx";
import { useAccessoriesQuery } from "../hooks/useAccessoriesQuery.jsx";
import Loading from "./Loading.jsx";
import useTranslate from "../hooks/useTranslate.jsx";
import "../../styles/productscards.css";

const AccessoriesProducts = () => {
  const width = useWindowWidth();
  const t = useTranslate();

  // Zustand state
  const params = useAccessoriesStore((state) => state.accessoriesParams);
  const setParams = useAccessoriesStore((state) => state.setAccessoriesParams);

  // Query
  const { data, isLoading, isError } = useAccessoriesQuery(params);
  const products = data?.products || [];
  const pagination = data?.pagination || { currentPage: 1, totalPages: 0 };
  const totalPages = Math.min(pagination.totalPages, 1);

  // Pagination handler
  const handlePageChange = (page) => {
    if (page !== pagination.currentPage) setParams({ page });
  };

  // States
  if (isLoading)
    return <Loading message={t("Loading accessories...", "جاري تحميل الإكسسوارات...")} />;
  if (isError)
    return <p style={{ textAlign: "center" }}>{t("Failed to load accessories.", "فشل تحميل الإكسسوارات.")}</p>;

  return (
    <main id="pc-pr-container">
      {/* === Header === */}
      <header className={ width > 650 ? "main-header" : "pr-header"} style={{ justifyContent: t.flexAlign }}>
        <Link to="/accessories" className="viewmore-header" style={{ flexDirection: t.rowReverse }}>
          <h1>{t("Accessories", "الإكسسوارات")}</h1>
        </Link>
      </header>

      {/* === Products Grid === */}
      <div
        style={{ maxWidth: "100%" }}
        className={width > 650 ? "products-grid-container" : "mob-pr-cards"}
      >
        {products.length > 0 ? (
          products.map((product, i) =>
            width > 650 ? (
              <ProductGrid key={product._id || i} product={product} />
            ) : (
              <MobileCard key={product._id || i} product={product} customDelay={i * 0.08} />
            )
          )
        ) : (
          <p style={{ textAlign: "center" }}>
            {t("No Accessories Found", "لا توجد إكسسوارات")}
          </p>
        )}
      </div>

      {/* === Animated View More Footer === */}
      <motion.div
        className="viewmore-footer"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <Link to="/accessories" className="viewmore-button">
          {t("View All Accessories", "عرض كل الإكسسوارات")}
        </Link>
      </motion.div>
    </main>
  );
};

export default AccessoriesProducts;
