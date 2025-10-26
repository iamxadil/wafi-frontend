// src/pages/CatLaptops.jsx
import React, { useEffect } from "react";
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";
import ProductGrid from "../components/main/ProductGrid.jsx";
import MobileCard from "../components/main/MobileCard.jsx";
import Pagination from "../components/main/Pagination.jsx";
import useLaptopsStore from "../components/stores/useLaptopsStore.jsx";
import { useLaptopsQuery } from "../components/hooks/useLaptopsQuery.jsx";
import Loading from "../components/main/Loading.jsx";
import SearchDropdown from "../components/main/SearchDropdown.jsx";
import "../styles/catlaptops.css";

const CatLaptops = () => {
  const width = useWindowWidth();

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

  // Search results for dropdown
  const { data: searchData } = useLaptopsQuery({
    ...params,
    search: searchParam,
    page: 1,
    limit: 5,
  });
  const searchResults = searchData?.products || [];

  // Parallax + top/bottom fade (match CatAccessories)
  useEffect(() => {
    const handleScroll = () => {
      const hero = document.querySelector(".laptops-hero");
      const blur1 = document.querySelector(".laptops-hero .blur-1");
      const blur2 = document.querySelector(".laptops-hero .blur-2");
      if (!hero || !blur1 || !blur2) return;

      const scrollY = window.scrollY;
      const fadeHeight = 600;
      const fadeValue = Math.max(0, 1 - scrollY / fadeHeight);
      hero.style.setProperty("--fade-opacity", fadeValue.toFixed(2));

      // Parallax offsets
      const offset1 = scrollY * 0.15;
      const offset2 = scrollY * 0.25;
      blur1.style.transform = `translateY(${offset1}px)`;
      blur2.style.transform = `translateY(${offset2}px)`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        <Loading message="Loading laptops..." />
      </main>
    );
  }
  if (isError) return <p style={{ textAlign: "center" }}>Failed to load laptops.</p>;

  // Render
  return (
    <>
      {/* HERO (mirrors accessories) */}
      <section className="laptops-hero">
        <div className="hero-content">
          {/* Glows ONLY behind text */}
          <div className="blur-shape blur-1"></div>
          <div className="blur-shape blur-2"></div>

          <h1 className="hero-title">
            Explore the <span>Laptop Universe</span>
          </h1>
          <p className="hero-subtitle">
            Power, design, and performance — where innovation meets experience.
          </p>
        </div>

        {/* Search */}
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

      {/* MAIN CONTENT */}
      <main id="pc-pr-container">
        {/* All Laptops */}
        <header className="pr-header">
          <h1>Laptops</h1>
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
            <p style={{ textAlign: "center" }}>No laptops found.</p>
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
        <header className="pr-header">
          <h1>Top Laptops</h1>
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
            <p style={{ textAlign: "center" }}>No top laptops found.</p>
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
