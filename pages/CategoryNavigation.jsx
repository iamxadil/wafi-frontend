// src/pages/CategoryNavigation.jsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";

import ProductCard from '../components/main/ProductCard.jsx';
import ProductBlock from "../components/main/ProductBlock.jsx";
import Pagination from "../components/main/Pagination.jsx";
import { Spin } from "antd";

import useCategoryStore from "../components/stores/useCategoryStore.jsx";
import { useCategoryQuery } from "../components/hooks/useCategoryQuery.jsx";
import "../styles/categorynavigation.css";
import useTranslate from "../components/hooks/useTranslate.jsx";

const CategoryNavigation = () => {
  const width = useWindowWidth();
  const isMobile = width < 650;
  const t = useTranslate();
  const { categoryName, brandName } = useParams();
  const category = categoryName?.trim();
  const brand = brandName?.trim();

  const {
    productsParams,
    setProductsParams,
    offersParams,
    setOffersParams,
    searchTerm,
    setSearchTerm,
  } = useCategoryStore();

  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

const location = useLocation();

useEffect(() => {


  // Clear local + store search
  setSearchTerm("");
  setDebouncedSearch("");

  // Reset params but preserve other fields in the store
  setProductsParams(prev => ({
    ...prev,
    page: 1,
    category,
    ...(brand ? { brand } : {}),
    search: "",
  }));

  setOffersParams(prev => ({
    ...prev,
    page: 1,
    category,
    ...(brand ? { brand } : {}),
    search: "",
  }));
}, [location.pathname, location.key]); // run on any navigation

  // Fetch products & offers
  const { data: productsData, isLoading: loadingProducts } = useCategoryQuery({
    ...productsParams,
    category,
    ...(brand && { brand } ),
  });

  const { data: offersData, isLoading: loadingOffers } = useCategoryQuery({
    ...offersParams,
    category,
    ...(brand && { brand }),
   
  });


  // Filter products/offers for pagination
  const displayedProducts = (productsData?.products || []).filter(
    p => !debouncedSearch || p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const displayedOffers = (offersData?.products || []).filter(
    p => !debouncedSearch || p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

const nothingAtAll =
  !loadingProducts &&
  !loadingOffers &&
  !searchTerm &&
  (productsData?.products?.length === 0) &&
  (offersData?.products?.length === 0);



      
  return (
  <div className="category-page">

    {/* 🌟 If nothing at all → show only Coming Soon */}
    {nothingAtAll ? (
      <div className="coming-soon">
        <h1>{t("Coming Soon...", "..يتوفر قريباً")}</h1>
      </div>
    ) : (
      <>
        {/* ===== YOUR FULL ORIGINAL UI GOES HERE ===== */}
        {/* Header */}
        <header className="cat-header">
          <h1>{brandName || categoryName || "Products"} {t("Products", "منتجات")}</h1>
          <div className="search-cat">
            <Search />
            <input
              type="search"
              placeholder="Search Products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Desktop + Mobile layouts exactly as you had them */}
        {/* -------------------------------------------------- */}
        {!isMobile && (
          <>
            {/* DESKTOP PRODUCTS */}
            <main id="cat-container">
              <div className="pc-pr-cards" style={{ justifyContent: "center", padding: "0" }}>
                {loadingProducts ? (
                  <div className="loading-container">
                    <h2 style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      Loading <Spin />
                    </h2>
                  </div>
                ) : displayedProducts.length > 0 ? (
                  displayedProducts.map(p => <ProductCard key={p._id} product={p} />)
                ) : (
                  <div style={{ textAlign: "center" }}>{t("No Products Found", "لا توجد منتجات")}</div>
                )}
              </div>

              {productsData?.pagination.totalPages > 1 && (
                <Pagination
                  currentPage={productsData.pagination.currentPage}
                  totalPages={productsData.pagination.totalPages}
                  onPageChange={(page) => setProductsParams({ page })}
                />
              )}
            </main>

            {/* DESKTOP OFFERS */}
            <main id="cat-container">
              <header>
                <h1>{brandName || categoryName} {t("Offers", "عروض")}</h1>
              </header>
              <div className="pc-pr-cards" style={{ justifyContent: "center", marginTop: "4rem", padding: "0" }}>
                {loadingOffers ? (
                  <div className="loading-container">
                    <h2 style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      Loading <Spin />
                    </h2>
                  </div>
                ) : displayedOffers.length > 0 ? (
                  displayedOffers.map(p => <ProductCard key={p._id} product={p} />)
                ) : (
                  <div style={{ textAlign: "center" }}>{t("No Offers Found", "لا توجد عروض")}</div>
                )}
              </div>

              {offersData?.pagination.totalPages > 1 && (
                <Pagination
                  currentPage={offersData.pagination.currentPage}
                  totalPages={offersData.pagination.totalPages}
                  onPageChange={(page) => setOffersParams({ page })}
                />
              )}
            </main>
          </>
        )}

        {/* MOBILE */}
        {isMobile && (
          <main className="mob-pr-container">
            <div className="mobile-grid">
              {displayedProducts.length > 0 ? (
                displayedProducts.map(p => <ProductBlock key={p._id} product={p} />)
              ) : (
                <div className="mob-loading">{t("No Products Found", "لا توجد منتجات")}</div>
              )}
            </div>

            <Pagination
              currentPage={productsData?.pagination.currentPage || 1}
              totalPages={productsData?.pagination.totalPages || 1}
              onPageChange={(page) => setProductsParams({ page })}
            />

            <header id="offers-header">
              <h1>Offers for {brandName || categoryName || "Products"}</h1>
            </header>

            <div className="mobile-grid">
              {displayedOffers.length > 0 ? (
                displayedOffers.map(p => <ProductBlock key={p._id} product={p} />)
              ) : (
                <div className="mob-loading">{t("No Offers Found", "لا توجد عروض")}</div>
              )}
            </div>

            <Pagination
              currentPage={offersData?.pagination.currentPage || 1}
              totalPages={offersData?.pagination.totalPages || 1}
              onPageChange={(page) => setOffersParams({ page })}
            />
          </main>
        )}
      </>
    )}
  </div>
);
};

export default CategoryNavigation;
