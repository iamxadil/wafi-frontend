// src/pages/CatLaptops.jsx
import React from "react";
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";
import ProductGrid from "../components/main/ProductGrid.jsx";
import MobileCard from "../components/main/MobileCard.jsx";
import Pagination from "../components/main/Pagination.jsx";
import useLaptopsStore from "../components/stores/useLaptopsStore.jsx";
import { useLaptopsQuery } from "../components/hooks/useLaptopsQuery.jsx";
import Loading from "../components/main/Loading.jsx";
import SearchDropdown from "../components/main/SearchDropdown.jsx";
import useTranslate from "../components/hooks/useTranslate.jsx";
import "../styles/catlaptops.css";

const CatLaptops = () => {
  const width = useWindowWidth();
  const t = useTranslate();

  // Zustand states
  const params = useLaptopsStore((s) => s.laptopPageParams);
  const setParams = useLaptopsStore((s) => s.setLaptopPageParams);
  const topParams = useLaptopsStore((s) => s.topPageParams);
  const setTopParams = useLaptopsStore((s) => s.setTopPageParams);
  const searchParam = useLaptopsStore((s) => s.searchParam);
  const setSearchParam = useLaptopsStore((s) => s.setSearchParam);

  // Queries
  const { data, isLoading, isError } = useLaptopsQuery(params);
  const products = data?.products || [];
  const pagination = data?.pagination || { currentPage: 1, totalPages: 0 };

  const { data: topData, isTopLoading } = useLaptopsQuery({
    ...topParams,
    isTopProduct: true,
  });
  const topProducts = topData?.products || [];
  const topPagination = topData?.pagination || {
    currentPage: topParams.page,
    totalPages: 0,
  };

  // Search dropdown
  const { data: searchData } = useLaptopsQuery({
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
  const handleTopPageChange = (page) => {
    if (page !== topPagination.currentPage) setTopParams({ page });
  };
  const handleSelectSearch = (product) => {
    setParams({ search: product.name, page: 1 });
    setSearchParam("");
  };

  // Loading / Error
  if (isLoading || isTopLoading) {
    return (
      <main
        id="cat-laptops-page"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "1200px",
        }}
      >
        <Loading message={t("Loading laptops...", "جاري تحميل اللابتوبات...")} />
      </main>
    );
  }

  if (isError)
    return <p style={{ textAlign: "center" }}>{t("Failed to load laptops.", "فشل تحميل اللابتوبات.")}</p>;

  return (
    <>
      {/* === HERO SECTION === */}
      <section className="laptops-hero">
        <div className="hero-content">
          {/* Glows behind text */}
          <div className="blur-shape blur-1"></div>
          <div className="blur-shape blur-2"></div>

          <h1 className="hero-title">
            {t("Explore the", "استكشف")} <span>{t("Laptop Universe", "عالم اللابتوبات")}</span>
          </h1>
          <p className="hero-subtitle">
            {t(
              "Power, design, and performance — where innovation meets experience.",
              "القوة، التصميم، والأداء — حيث تلتقي الابتكارات مع التجربة."
            )}
          </p>
        </div>

        {/* Search Bar */}
        <div className="search-dropdown-wrapper">
          <SearchDropdown
            width={550}
            products={searchResults}
            value={searchParam}
            onChange={(e) => setSearchParam(e.target.value)}
            onSelect={handleSelectSearch}
          />
        </div>
      </section>

      {/* === MAIN CONTENT === */}
      <main id="pc-pr-container">
        {/* All Laptops */}
        <header className="pr-header" style={{flexDirection: t.rowReverse}}>
          <h1>{t("Laptops", "اللابتوبات")}</h1>
        </header>

        <div className={width > 650 ? "products-grid-container cat-grid" : "mob-pr-cards"}>
          {products.length > 0 ? (
            products.map((product, index) =>
              width > 650 ? (
                <ProductGrid key={product._id || product.id} product={product} />
              ) : (
                <MobileCard
                  key={product._id || product.id}
                  product={product}
                  customDelay={index * 0.08}
                />
              )
            )
          ) : (
            <p style={{ textAlign: "center" }}>{t("No laptops found.", "لم يتم العثور على لابتوبات.")}</p>
          )}
        </div>

        {products.length > 0 && pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {/* Top Laptops */}
        <header className="pr-header" style={{flexDirection: t.rowReverse}}>
          <h1>{t("Top Laptops", "لابتوبات مُميزة")}</h1>
        </header>

        <div className={width > 650 ? "products-grid-container cat-grid" : "mob-pr-cards"}>
          {topProducts.length > 0 ? (
            topProducts.map((product, index) =>
              width > 650 ? (
                <ProductGrid key={product._id || product.id} product={product} />
              ) : (
                <MobileCard
                  key={product._id || product.id}
                  product={product}
                  customDelay={index * 0.08}
                />
              )
            )
          ) : (
            <p style={{ textAlign: "center" }}>
              {t("No top laptops found.", "لم يتم العثور على لابتوبات مميزة.")}
            </p>
          )}
        </div>

        {topProducts.length > 0 && topPagination.totalPages > 1 && (
          <Pagination
            currentPage={topPagination.currentPage}
            totalPages={topPagination.totalPages}
            onPageChange={handleTopPageChange}
          />
        )}
      </main>
    </>
  );
};

export default CatLaptops;
