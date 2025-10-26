import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import useWindowWidth from "../hooks/useWindowWidth.jsx";
import ProductCard from "./ProductCard.jsx";
import MobileCard from "./MobileCard.jsx";
import Pagination from "./Pagination.jsx";
import { useOffersQuery } from "../hooks/useOffersQuery.jsx";
import useOffersStore from "../stores/useOffersStore.jsx";

const Offers = () => {
  const width = useWindowWidth();
  const currentPage = useOffersStore((s) => s.currentPage);
  const setCurrentPage = useOffersStore((s) => s.setCurrentPage);
  const offersLimit = useOffersStore((s) => s.offersLimit);

  // fetch data
  const { data, isLoading, isError } = useOffersQuery({
    page: currentPage,
    limit: offersLimit,
  });

  if (isLoading) return <p>Loading offers...</p>;
  if (isError) return <p>Error loading offers.</p>;

  const products = data?.products || [];
  const pagination = data?.pagination || { currentPage: 1, totalPages: 0 };

  // ✅ cap pagination to 2 pages only for this component
  const totalPages = Math.min(pagination.totalPages, 2);

  return (
    <main id="pc-pr-container">
      <header className="pr-header">
        <Link to="/offers">
          <h1>Offers</h1>
          <ArrowRight size={24} />
        </Link>
      </header>

      {/* Cards */}
      <div className={width > 650 ? "pc-pr-cards" : "mob-pr-cards"}>
        {products.length ? (
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
          <p style={{ textAlign: "center" }}>No offers found.</p>
        )}
      </div>

      {/* Pagination */}
      {products.length > 0 && totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={totalPages} // 👈 limited to 2
          onPageChange={(p) => setCurrentPage(p)}
        />
      )}
    </main>
  );
};

export default Offers;
