import React from "react";
import { motion } from "framer-motion";
import useWindowWidth from "../hooks/useWindowWidth.jsx";
import ProductGrid from "./ProductGrid.jsx";
import MobileCard from "./MobileCard.jsx";
import useTranslate from "../hooks/useTranslate.jsx";
import { useLaptopsQuery } from "../hooks/useLaptopsQuery.jsx";
import useLaptopsStore from "../stores/useLaptopsStore.jsx";
import Loading from "../main/Loading.jsx";
import "../../styles/productscards.css";
import { Link } from "react-router-dom";

const LaptopProducts = () => {
  const width = useWindowWidth();
  const t = useTranslate();

  const params = useLaptopsStore((state) => state.mainPageParams);
  const setParams = useLaptopsStore((state) => state.setMainPageParams);

  const { data, isLoading, isError } = useLaptopsQuery(params);
  const products = data?.products || [];
  const pagination = data?.pagination || { currentPage: 1, totalPages: 0 };
  const totalPages = Math.min(pagination.totalPages, 1);

  const handlePageChange = (page) => {
    if (page !== pagination.currentPage) setParams({ page });
  };

  if (isLoading) return <Loading message={t("Loading laptops...", "جاري تحميل اللابتوبات...")} />;
  if (isError)
    return <p style={{ textAlign: "center" }}>{t("Failed to load laptops.", "فشل تحميل اللابتوبات.")}</p>;

  return (
    <main id="pc-pr-container">
      {/* Header */}
      <header className={ width > 650 ? "main-header" : "pr-header"} style={{ justifyContent: t.flexAlign }}>
        <Link to="/laptops" className="viewmore-header" style={{ flexDirection: t.rowReverse }}>
          <h1>{t("Laptops", "اللابتوبات")}</h1>
        </Link>
      </header>

      {/* Products */}
      <div
        style={{ maxWidth: "100%" }}
        className={width > 650 ? "products-grid-container" : "mob-pr-cards"}
      >
        {products.length > 0 ? (
          products.map((product, i) =>
            width > 650 ? (
              <ProductGrid key={product._id || product.id} product={product} />
            ) : (
              <MobileCard
                key={product._id || product.id}
                product={product}
                customDelay={i * 0.08}
              />
            )
          )
        ) : (
          <p style={{ textAlign: "center" }}>
            {t("No Laptops Found", "لا توجد لابتوبات")}
          </p>
        )}
      </div>

      {/* 🌟 Animated View More Footer */}
      <motion.div
        className="viewmore-footer"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <Link to="/laptops" className="viewmore-button">
          {t("View All Laptops", "عرض كل اللابتوبات")}
        </Link>
      </motion.div>
    </main>
  );
};

export default LaptopProducts;
