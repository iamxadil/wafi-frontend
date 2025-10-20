import React from "react";
import useWindowWidth from "../hooks/useWindowWidth.jsx";
import ProductCard from "./ProductCard.jsx";
import MobileCard from "./MobileCard.jsx";
import Pagination from "./Pagination.jsx";
import { useOffersQuery } from "../hooks/useOffersQuery.jsx"; // React Query hook
import useOffersStore from "../stores/useOffersStore.jsx";   // Zustand store

const Offers = () => {
  const width = useWindowWidth();

  // -------------------------------
  // UI/client state (Zustand)
  // -------------------------------
  const currentPage = useOffersStore((state) => state.currentPage);
  const setCurrentPage = useOffersStore((state) => state.setCurrentPage);
  const offersLimit = useOffersStore((state) => state.offersLimit);

  // -------------------------------
  // Server state (React Query)
  // -------------------------------
  const { data, isLoading, isError } = useOffersQuery({
    page: currentPage,
    limit: offersLimit,
  });

  if (isLoading) return <p>Loading offers...</p>;
  if (isError) return <p>Error loading offers</p>;

  const products = data?.products || [];
  const pagination = data?.pagination || { currentPage: 1, totalPages: 0 };

  // -------------------------------
  // Pagination handler
  // -------------------------------
  const handlePageChange = (page) => {
    setCurrentPage(page); // triggers React Query to fetch new page automatically
  };

  return (
    <main id="pc-pr-container">

      {/* Desktop */}
      {width > 650 && (
        <>
          <header id="pc-pr-header">
            <h1>Offers</h1>
          </header>
          <div id="pc-pr-cards-container">
            <div className="pc-pr-cards">
              {products.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Mobile */}
      {width <= 650 && (
        <>
          <header className="mob-pr-container">
            <h1>Offers</h1>
          </header>
          <div className="mob-pr-cards">
            {products.map((product, index) => (
              <MobileCard
                key={product._id || product.id}
                product={product}
                customDelay={index * 0.08}
              />
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {pagination.totalPages > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </main>
  );
};

export default Offers;
