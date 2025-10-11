// src/components/TrendingProducts.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useProductStore from "../stores/useProductStore.jsx";
import ProductCard from "./ProductCard.jsx";
import Pagination from "./Pagination.jsx";
import useWindowWidth from '../hooks/useWindowWidth.jsx';

const TrendingProducts = () => {
  const fetchTrendingProducts = useProductStore(state => state.fetchTrendingProducts);
  const trendingProducts = useProductStore(state => state.trendingProducts);
  const trendingLoading = useProductStore(state => state.trendingLoading);
  const width = useWindowWidth();


  // Fetch trending products on mount or width change (desktop only)
  useEffect(() => {
    if (width > 650) {
      fetchTrendingProducts({ page: 1, limit: 4 });
    }
  }, [fetchTrendingProducts, width]);

  // Do not render on mobile
  if (width <= 650) return null;

  return (
    <main id="pc-pr-container">
      <header>
        <h1>Trending Products</h1>
      </header>

      <section id="pc-pr-cards-container">
        {trendingLoading ? (
          <p style={{ padding: "2rem" }}>Loading trending products...</p>
        ) : trendingProducts.length === 0 ? (
          <p style={{ padding: "2rem" }}>No trending products available.</p>
        ) : (
          <div className="pc-pr-cards">
            {trendingProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default TrendingProducts;
