import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";
import useTranslate from "../components/hooks/useTranslate.jsx";
import ProductCard from "../components/main/ProductCard.jsx";
import ProductBlock from "../components/main/ProductBlock.jsx";
import Pagination from "../components/main/Pagination.jsx";
import { Spin } from "antd";
import { useCategoryQuery } from "../components/hooks/useCategoryQuery.jsx";
import "../styles/categorynavigation.css";

const SearchResults = () => {
  const width = useWindowWidth();
  const isMobile = width < 650;
  const t = useTranslate();
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("query") || "";
  const [searchTerm, setSearchTerm] = useState(query);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setSearchTerm(query);
    setPage(1);
  }, [query]);

  const { data: productsData, isLoading } = useCategoryQuery({
    search: query,
    page,
    limit: 12,
  });

  const products = productsData?.products || [];
  const pagination = productsData?.pagination || { currentPage: 1, totalPages: 1 };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchParams({ query: searchTerm });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isArabic = t("en", "ar") === "ar";

  return (
    <div className="category-page">
      <header className="cat-header">
        <h1 dir={isArabic ? "rtl" : "ltr"}>
          {t("Search Results for", "نتائج البحث عن")} "{query}"
          {!isLoading && productsData && (
            <span className="results-count">
              ({pagination.totalItems} {t("products", "منتج")})
            </span>
          )}
        </h1>

        <form className="search-cat" onSubmit={handleSearchSubmit}>
          <button type="submit" className="search-btn">
            <Search />
          </button>
          <input
            type="search"
            dir={isArabic ? "rtl" : "ltr"}
            placeholder={t("Search Products...", "بحث المنتجات...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </header>

      {isLoading ? (
        <div className="loading-container">
          <Spin />
          <span>{t("Loading...", "جاري التحميل...")}</span>
        </div>
      ) : products.length === 0 ? (
        <div className="coming-soon">
          <h1>{t("No products found", "لم يتم العثور على منتجات")}</h1>
          <p>{t("Try different keywords", "جرب كلمات مفتاحية مختلفة")}</p>
        </div>
      ) : (
        <>
          {isMobile ? (
            <main className="mob-pr-container">
              <div className="mobile-grid">
                {products.map((p) => (
                  <ProductBlock key={p._id} product={p} />
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </main>
          ) : (
            <main id="cat-container">
              <div className="pc-pr-cards">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
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
        </>
      )}
    </div>
  );
};

export default SearchResults;
