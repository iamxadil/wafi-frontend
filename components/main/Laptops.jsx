import React from "react";
import useWindowWidth from "../hooks/useWindowWidth.jsx";
import ProductCard from "./ProductCard.jsx";
import MobileCard from "./MobileCard.jsx";
import Pagination from "./Pagination.jsx";
import FilterDropdownContainer from "./FilterDropdownContainer.jsx"; // ✅ use the new reusable container
import useTranslate from '../hooks/useTranslate.jsx';
import { useLaptopsQuery } from "../hooks/useLaptopsQuery.jsx";
import useLaptopsStore from "../stores/useLaptopsStore.jsx";
import Loading from "../main/Loading.jsx";
import "../../styles/productscards.css";
import { Link } from "react-router-dom";
import { Laptop } from 'lucide-react';

const LaptopProducts = () => {

  //Width Setup
  const width = useWindowWidth();

  //Language Setup
  const t = useTranslate();

  // Zustand state
  const params = useLaptopsStore((state) => state.mainPageParams);
  const setParams = useLaptopsStore((state) => state.setMainPageParams);

  // Query
  const { data, isLoading, isError } = useLaptopsQuery(params);
  const products = data?.products || [];
  const pagination = data?.pagination || { currentPage: 1, totalPages: 0 };
  const maxPages = 2;
  const totalPages = Math.min(pagination.totalPages, maxPages);

  // Handlers
  const handleBrandChange = (brand) => {
    setParams({ brands: brand ? [brand] : [], page: 1 });
  };

  const handleSortChange = (sortValue) => {
    setParams({ sort: sortValue });
  };

  const handlePageChange = (page) => {
    if (page !== pagination.currentPage) setParams({ page });
  };

  // Loading / error
  if (isLoading) return <Loading message="Loading laptops..." />;
  if (isError) return <p style={{ textAlign: "center" }}>Failed to load laptops.</p>;


  // Render
  return (
    <main id="pc-pr-container">
      {/* Header */}
      <header className="pr-header">
        <Link to="/laptops" style={{flexDirection: t.rowReverse}}><h1>{t("Laptops", "اللابتوبات")}</h1> <Laptop /></Link>
      </header>

      {/* Products */}
      <div className={width > 650 ? "pc-pr-cards" : "mob-pr-cards"}>
        {products.length > 0 ? (
          products.map((product, i) =>
            width > 650 ? (
              <ProductCard key={product._id || product.id} product={product} />
            ) : (
              <MobileCard
                key={product._id || product.id}
                product={product}
                customDelay={i * 0.08}
              />
            )
          )
        ) : (
          <p style={{ textAlign: "center" }}>{t("No Laptops Found", "لا توجد لابتوبات")}</p>
        )}
      </div>

      {/* Pagination */}
      {products.length > 0 && totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </main>
  );
};

export default LaptopProducts;
