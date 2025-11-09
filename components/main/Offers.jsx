import React from "react";
import { Link } from "react-router-dom";
import { Percent } from 'lucide-react';
import useWindowWidth from "../hooks/useWindowWidth.jsx";
import ProductCard from "./ProductCard.jsx";
import ProductGrid from "./ProductGrid.jsx";
import MobileCard from "./MobileCard.jsx";
import Pagination from "./Pagination.jsx";
import { useOffersQuery } from "../hooks/useOffersQuery.jsx";
import useOffersStore from "../stores/useOffersStore.jsx";
import useTranslate from "../hooks/useTranslate.jsx";

const Offers = () => {

  const width = useWindowWidth();
  const currentPage = useOffersStore((s) => s.currentPage);
  const setCurrentPage = useOffersStore((s) => s.setCurrentPage);
  const offersLimit = useOffersStore((s) => s.offersLimit);
  const t = useTranslate();

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
      <header className={ width > 650 ? "main-header" : "pr-header"} style={{justifyContent: t.flexAlign}}>
        <Link style={{flexDirection: t.rowReverse}}>
          <h1>{t("Offers", "التخفيضات")}</h1>
          <Percent size={24} />
        </Link>
      </header>

      {/* Cards */}
      <div style={{maxWidth: "100%"}} className={width > 650 ? "products-grid-container" : "mob-pr-cards"}>
        {products.length ? (
          products.map((product, i) =>
            width > 650 ? (
              <ProductGrid key={product._id || product.id} product={product} />
            ) : (
              <MobileCard
                key={product._id || product.id}
                product={product}
                customDelay={i * 0.08}
              />
            )
          )
        ) : (
          <p style={{ textAlign: "center" }}>{t("No Offers Found", "لا توجد تخفيضات")}</p>
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
