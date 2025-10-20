// src/pages/CategoryNavigation.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Search } from "lucide-react";
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";
import ProductGrid from "../components/main/ProductGrid.jsx";
import MobileCard from "../components/main/MobileCard.jsx";
import Pagination from "../components/main/Pagination.jsx";
import { Spin } from "antd";

import useCategoryStore from "../components/stores/useCategoryStore.jsx";
import { useCategoryQuery } from "../components/hooks/useCategoryQuery.jsx";
import "../styles/categorynavigation.css";

const CategoryNavigation = () => {
  const width = useWindowWidth();
  const isMobile = width < 650;
  const { categoryName, brandName } = useParams();

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

  // Update category & brand whenever the route changes
  useEffect(() => {
    setProductsParams({ page: 1, category: categoryName, brand: brandName, search: debouncedSearch });
    setOffersParams({ page: 1, category: categoryName, brand: brandName, search: debouncedSearch });
  }, [categoryName, brandName, debouncedSearch]);

  // Fetch products and offers using React Query
  const { data: productsData, isLoading: loadingProducts } = useCategoryQuery(productsParams);
  const { data: offersData, isLoading: loadingOffers } = useCategoryQuery({ ...offersParams, offers: true });

  // Filter products/offers by searchTerm for pagination
  const displayedProducts = (productsData?.products || []).filter(p =>
    !debouncedSearch || p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const displayedOffers = (offersData?.products || []).filter(p =>
    !debouncedSearch || p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div className="category-page">
      {/* Header */}
      <header className="cat-header">
        <h1>{brandName || categoryName || "Products"} Products</h1>
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

      {/* ---------- Desktop Layout ---------- */}
      {!isMobile && (
        <>
          {/* Products Section */}
          <main id="cat-container">
            <div className="products-grid-container cat-grid">
              {loadingProducts ? (
                <div className="loading-container">
                  <h2 style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    Loading <Spin />
                  </h2>
                </div>
              ) : displayedProducts.length > 0 ? (
                displayedProducts.map(p => <ProductGrid key={p._id} product={p} />)
              ) : (
                <div style={{ textAlign: "center" }}>No products found.</div>
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

          {/* Offers Section */}
          <main id="cat-container">
            <header>
              <h1>Offers for {brandName || categoryName || "Products"}</h1>
            </header>
            <div className="products-grid-container cat-grid">
              {loadingOffers ? (
                <div className="loading-container">
                  <h2 style={{ display: "flex", alignItems: "center", gap: "12px" }}>Loading <Spin /></h2>
                </div>
              ) : displayedOffers.length > 0 ? (
                displayedOffers.map(p => <ProductGrid key={p._id} product={p} />)
              ) : (
                <div style={{ textAlign: "center" }}>No offers found.</div>
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

      {/* ---------- Mobile Layout ---------- */}
      {isMobile && (
        <main className="mob-pr-container">
          <div className="mob-pr-cards">
            {displayedProducts.length > 0 ? (
              displayedProducts.map(p => <MobileCard key={p._id} product={p} />)
            ) : (
              <div className="mob-loading">No products found</div>
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
          <div className="mob-pr-cards">
            {displayedOffers.length > 0 ? (
              displayedOffers.map(p => <MobileCard key={p._id} product={p} />)
            ) : (
              <div className="mob-loading">No offers found</div>
            )}
          </div>
          <Pagination
            currentPage={offersData?.pagination.currentPage || 1}
            totalPages={offersData?.pagination.totalPages || 1}
            onPageChange={(page) => setOffersParams({ page })}
          />
        </main>
      )}
    </div>
  );
};

export default CategoryNavigation;
