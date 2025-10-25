import React from "react";
import { Link } from "react-router-dom";
import useWindowWidth from "../hooks/useWindowWidth.jsx";
import ProductCard from "./ProductCard.jsx";
import MobileCard from "./MobileCard.jsx";
import Pagination from "./Pagination.jsx";
import FilterDropdownContainer from "./FilterDropdownContainer.jsx"; // ✅ use the new reusable container
import { useLaptopsQuery } from "../hooks/useLaptopsQuery.jsx";
import useLaptopsStore from "../stores/useLaptopsStore.jsx";
import Loading from "../main/Loading.jsx";
import "../../styles/productscards.css";

const LaptopProducts = () => {
  const width = useWindowWidth();

  // Zustand state
  const params = useLaptopsStore((state) => state.mainPageParams);
  const setParams = useLaptopsStore((state) => state.setMainPageParams);

  // Query
  const { data, isLoading, isError } = useLaptopsQuery(params);
  const products = data?.products || [];
  const pagination = data?.pagination || { currentPage: 1, totalPages: 0 };

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
        <h1>Laptops</h1>

        {/* ✅ Filter & Sort dropdown container */}
        <FilterDropdownContainer
          title="Filter & Sort"
          brandProps={{
            value: params.brands[0] || "",
            placeholder: "All Brands",
            options: [
              { value: "", label: "All Brands" },
              { value: "Acer", label: "Acer" },
              { value: "Asus", label: "Asus" },
              { value: "Apple", label: "Apple" },
              { value: "Lenovo", label: "Lenovo" },
              { value: "MSI", label: "MSI" },
              { value: "HP", label: "HP" },
            ],
            onChange: handleBrandChange,
          }}
          sortProps={{
            value: params.sort || "",
            placeholder: "Sort by",
            options: [
              { value: "newest", label: "Newest Arrivals" },
              { value: "oldest", label: "Oldest First" },
              { value: "price-asc", label: "Price: Low to High" },
              { value: "price-desc", label: "Price: High to Low" },
              { value: "discount-asc", label: "Discount: Low to High" },
              { value: "discount-desc", label: "Discount: High to Low" },
              { value: "name-asc", label: "Name: A → Z" },
              { value: "name-desc", label: "Name: Z → A" },
            ],
            onChange: handleSortChange,
          }}

          priceProps={{
    minPrice: params.minPrice ?? 0,
    maxPrice: params.maxPrice ?? 5000,
    onChange: ({ minPrice, maxPrice }) =>
      setParams({ minPrice, maxPrice }),
  }}
          />
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
