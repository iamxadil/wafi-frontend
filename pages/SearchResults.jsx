import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";

import ProductCard from "../components/main/ProductCard.jsx";
import ProductBlock from "../components/main/ProductBlock.jsx";
import Pagination from "../components/main/Pagination.jsx";
import { Spin } from "antd";

import { useCategoryQuery } from "../components/hooks/useCategoryQuery.jsx";
import "../styles/categorynavigation.css";
import useTranslate from "../components/hooks/useTranslate.jsx";

const SearchResults = () => {
  const width = useWindowWidth();
  const isMobile = width < 650;
  const t = useTranslate();
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("query") || "";
  const page = Number(searchParams.get("page")) || 1;
  const isArabic = t("en", "ar") === "ar";

  const queryParams = useMemo(
    () => ({
      search: query,
      page,
      limit: 10,
      sort: "date-desc",
    }),
    [query, page]
  );

  const { data: productsData, isLoading: loadingProducts } = useCategoryQuery(queryParams);
  const products = productsData?.products || [];
  const pagination = productsData?.pagination || {};

  const handlePageChange = (newPage) => {
    setSearchParams({ query, page: newPage.toString() });
  };

  const handleSearchChange = (value) => {
    setSearchParams({ query: value, page: "1" });
  };

  if (!query) {
    return (
      <div className="category-page">
        <div className="coming-soon">
          <h1>{t("Please enter a search term", "الرجاء إدخال كلمة البحث")}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      <header
        className="cat-header"
        style={{ alignItems: isMobile && t.alignItems }}
      >
        <h1 style={{ textAlign: isArabic ? "right" : "left" }} dir={isArabic ? "rtl" : "ltr"}>
          {t("Search Results for", "نتائج البحث عن")}: "{query}"
        </h1>

        <div className="search-cat" style={{ flexDirection: isArabic ? "row-reverse" : "row" }}>
          <Search />
          <input
            type="search"
            dir={isArabic ? "rtl" : "ltr"}
            style={{ textAlign: isArabic ? "right" : "left" }}
            placeholder={t("Search Products...", "بحث المنتجات...")}
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      </header>

      {!isMobile && (
        <main id="cat-container">
          <div className="pc-pr-cards" style={{ justifyContent: "center", padding: 0 }}>
            {loadingProducts ? (
              <div className="loading-container">
                <h2>Loading <Spin /></h2>
              </div>
            ) : products.length ? (
              products.map((p) => <ProductCard key={p._id} product={p} />)
            ) : (
              <div>{t("No Products Found", "لا توجد منتجات")}</div>
            )}
          </div>

          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </main>
      )}

      {isMobile && (
        <main className="mob-pr-container">
          <motion.div
            className="swipe-mobile"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            dragMomentum={false}
            dragPropagation={false}
          >
            <div className="mobile-grid">
              {loadingProducts ? (
                <div style={{ padding: "2rem", textAlign: "center", width: "100%" }}>
                  <Spin />
                </div>
              ) : products.length ? (
                products.map((p) => <ProductBlock key={p._id} product={p} />)
              ) : (
                <div style={{ padding: "2rem", textAlign: "center", width: "100%" }}>
                  {t("No Products Found", "لا توجد منتجات")}
                </div>
              )}
            </div>
          </motion.div>

          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </main>
      )}
    </div>
  );
};

export default SearchResults;