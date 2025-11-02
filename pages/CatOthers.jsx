import React from "react";
import "../styles/cataccessories.css"; // reuse same style file
import SearchDropdown from "../components/main/SearchDropdown.jsx";
import useOthersStore from "../components/stores/useOthersStore.jsx";
import { useOthersQuery } from "../components/hooks/useOthersQuery.jsx";
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";
import Pagination from "../components/main/Pagination.jsx";
import Loading from "../components/main/Loading.jsx";
import MobileCard from "../components/main/MobileCard.jsx";
import ProductGrid from "../components/main/ProductGrid.jsx";
import useTranslate from "../components/hooks/useTranslate.jsx";

const CatOthers = () => {
  const width = useWindowWidth();
  const t = useTranslate();

  // Zustand state
  const params = useOthersStore((state) => state.othersPageParams);
  const setParams = useOthersStore((state) => state.setOthersPageParams);
  const searchParam = useOthersStore((state) => state.searchParam);
  const setSearchParam = useOthersStore((state) => state.setSearchParam);

  // Query for others (main data)
  const { data: others, isLoading, isError } = useOthersQuery(params);
  const products = others?.products || [];
  const pagination = others?.pagination || { currentPage: 1, totalPages: 0 };

  // Query for search results
  const { data: searchData } = useOthersQuery({
    ...params,
    search: searchParam,
    page: 1,
    limit: 5,
  });
  const searchResults = searchData?.products || [];

  // Handlers
  const handlePageChange = (page) => {
    if (page !== pagination.currentPage) setParams({ page });
  };

  const handleSelectSearch = (product) => {
    setParams({ search: product.name, page: 1 });
    setSearchParam("");
  };

  // Handle loading and error states
  if (isLoading)
    return (
      <Loading
        message={t("Loading products...", "جاري تحميل المنتجات...")}
      />
    );

  if (isError)
    return (
      <p style={{ textAlign: "center" }}>
        {t("Failed to load products.", "فشل تحميل المنتجات.")}
      </p>
    );

  return (
    <>
      {/* === HERO SECTION === */}
      <section className="accessories-hero">
        <div className="hero-content">
          {/* Gradient glows behind text */}
          <div className="blur-shape blur-1"></div>
          <div className="blur-shape blur-2"></div>

          <h1 className="hero-title">
            {t("Essential", "منتجات")}{" "}
            <span>{t("Tech Gear", "تكنولوجية أساسية")}</span>{" "}
            {t("for Every Setup", "لكل إعداد")}
          </h1>
          <p className="hero-subtitle" style={{ marginTop: "2rem" }}>
            {t(
              "Find routers, drives, adapters, and cables that keep your tech world connected.",
              "اكتشف أجهزة التوجيه التي تبقي عالمك التقني متصلاً."
            )}
          </p>
        </div>

        {/* Search Dropdown */}
        <div className="search-dropdown-wrapper">
          <SearchDropdown
            width={600}
            products={searchResults}
            value={searchParam}
            onChange={(e) => setSearchParam(e.target.value)}
            onSelect={handleSelectSearch}
          />
        </div>
      </section>

      {/* === MAIN CONTENT === */}
      <main id="pc-pr-container">
        <header className="pr-header" style={{ flexDirection: t.rowReverse }}>
          <h1>{t("Other Tech Products", "منتجات تقنية أخرى")}</h1>
        </header>

        <div
          className={
            width > 650
              ? "products-grid-container cat-grid"
              : "mob-pr-cards"
          }
        >
          {products.length > 0 ? (
            products.map((product, i) =>
              width > 650 ? (
                <ProductGrid
                  key={product._id || product.id}
                  product={product}
                />
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
              {t("No products found.", "لم يتم العثور على منتجات.")}
            </p>
          )}
        </div>

        {products.length > 0 && pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </main>
    </>
  );
};

export default CatOthers;
