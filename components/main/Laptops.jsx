// src/components/LaptopProducts.jsx
import React from "react";
import { Link } from "react-router-dom";
import useWindowWidth from "../hooks/useWindowWidth.jsx";
import ProductCard from "./ProductCard.jsx";
import MobileCard from "./MobileCard.jsx";
import Pagination from "./Pagination.jsx";
import { useLaptopsQuery } from "../hooks/useLaptopsQuery.jsx";
import useLaptopsStore from "../stores/useLaptopsStore.jsx";
import Loading from "../main/Loading.jsx";
import "../../styles/productscards.css";

const LaptopProducts = () => {
  const width = useWindowWidth();

  // --------------------------
  // Zustand state for this page
  // --------------------------
  const params = useLaptopsStore((state) => state.mainPageParams);
  const setParams = useLaptopsStore((state) => state.setMainPageParams);

  // --------------------------
  // Fetch laptops
  // --------------------------
  const { data, isLoading, isError } = useLaptopsQuery(params);
  const products = data?.products || [];
  const pagination = data?.pagination || { currentPage: 1, totalPages: 0 };

  // --------------------------
  // Handlers
  // --------------------------
  const handleBrandChange = (brand) => {
    setParams({ brands: brand ? [brand] : [], page: 1 });
  };

  const handlePageChange = (page) => {
    if (page !== pagination.currentPage) setParams({ page });
  };

  // --------------------------
  // Loading / error states
  // --------------------------
  if (isLoading) return <Loading message="Loading laptops..." />;
  if (isError) return <p style={{ textAlign: "center" }}>Failed to load laptops.</p>;

  // --------------------------
  // Render
  // --------------------------
  return (
    <main id="pc-pr-container">
      {/* Header */}
      <header className={width > 650 ? "pc-pr-header" : "mob-pr-header"}>
        <h1>{width > 650 ? "Laptops" : <Link to="/laptops">Laptops</Link>}</h1>

        <div className={width > 650 ? "select-wrap" : "mob-select-wrap"}>
          <select
            className={width > 650 ? "custom" : "mob-custom"}
            value={params.brands[0] || ""}
            onChange={(e) => handleBrandChange(e.target.value)}
          >
            <option value="">All Brands</option>
            <option value="Acer">Acer</option>
            <option value="Asus">Asus</option>
            <option value="Apple">Apple</option>
            <option value="Lenovo">Lenovo</option>
            <option value="MSI">MSI</option>
            <option value="HP">HP</option>
          </select>
        </div>
      </header>

      {/* Products */}
      <div className={width > 650 ? "pc-pr-cards" : "mob-pr-cards"}>
        {products.length > 0 ? (
          products.map((product, i) =>
            width > 650 ? (
              <ProductCard key={product._id || product.id} product={product} />
            ) : (
              <MobileCard key={product._id || product.id} product={product} customDelay={i * 0.08} />
            )
          )
        ) : (
          <p style={{ textAlign: "center" }}>No laptops found.</p>
        )}
      </div>

      {/* Pagination */}
      {products.length > 0 && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </main>
  );
};

export default LaptopProducts;
