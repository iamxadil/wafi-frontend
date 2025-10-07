import React, { useEffect, useState } from "react";
import "../../styles/productscards.css";
import useProductStore from "../stores/useProductStore.jsx";
import useCartStore from "../stores/useCartStore.jsx";
import useAuthStore from "../stores/useAuthStore.jsx";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import useWindowWidth from "../hooks/useWindowWidth.jsx";
import { useNavigate } from "react-router-dom";

const TrendingProducts = () => {
  const fetchTrendingProducts = useProductStore(
    (state) => state.fetchTrendingProducts
  );
  const trendingProducts = useProductStore((state) => state.trendingProducts);
  const trendingPagination = useProductStore(
    (state) => state.trendingPagination
  );
  const trendingLoading = useProductStore((state) => state.trendingLoading);
  const addToCart = useCartStore((state) => state.addToCart);

  const [direction, setDirection] = useState(0); // +1 next, -1 prev
  const width = useWindowWidth();
  const navigate = useNavigate();

  // Fetch trending products on mount
  useEffect(() => {
    fetchTrendingProducts(1, 8); // page 1, limit 8
  }, [fetchTrendingProducts]);

 const getFinalPrice = (product) => product.discountPrice > 0
    ? product.price - product.discountPrice
    : product.price;

  const handleAddToCart = async (product, quantity = 1) => {
  // Check stock
  if (product.countInStock <= 0) {
    toast.error("Sorry, this product is out of stock");
    return;
  }

  // Prepare product data with calculated finalPrice
  const productToAdd = {
    ...product,
    originalPrice: product.price,
    discountPrice: product.discountPrice,
    finalPrice: getFinalPrice(product),
  };

  const token = useAuthStore.getState().token;
  addToCart(productToAdd, quantity, token);
};

  const handlePageJump = (page) => {
    if (page !== trendingPagination.currentPage) {
      setDirection(page > trendingPagination.currentPage ? 1 : -1);
      fetchTrendingProducts(page, 8); // same limit
    }
  };

  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <>
      {width > 650 && (
        <main id="pc-pr-container">
          <header id="pc-pr-header">
            <h1>Trending Products</h1>
          </header>

          <section id="pc-pr-cards-container">
            <AnimatePresence custom={direction} mode="wait">
              {trendingLoading ? (
                <p style={{ padding: "2rem" }}>Loading trending products...</p>
              ) : trendingProducts.length === 0 ? (
                <p style={{ padding: "2rem" }}>No trending products available.</p>
              ) : (
                <motion.div
                  key={trendingPagination.currentPage}
                  className="pc-pr-cards"
                  custom={direction}
                  initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {trendingProducts.map((product) => (
                    <div
                      className="pc-pr-card"
                      key={product.id}
                      onClick={() => handleCardClick(product.id)}
                      style={{ cursor: "pointer" }}
                    >
                      {product.countInStock === 0 && (
                        <span className="badge out-of-stock">Out of Stock</span>
                      )}
                      {product.countInStock > 0 && (
                        <span className="badge in-stock">In Stock</span>
                      )}
                      {product.discountPrice > 0 && (
                        <span className="badge offer">
                          {Math.round(
                            (product.discountPrice / product.price) * 100
                          )}
                          % OFF
                        </span>
                      )}
                      <div className="pc-image-wrapper">
                        <div
                          className="pc-pr-image"
                          style={{ backgroundImage: `url(${product.images[0]})` }}
                        ></div>
                      </div>
                      <div className="pc-pr-details">
                        <p>{product.brand}</p>
                        <h2>{product.name}</h2>
                        <p>
                          {product.discountPrice > 0
                            ? `${(product.price - product.discountPrice).toLocaleString()} IQD`
                            : `${product.price.toLocaleString()} IQD`}
                        </p>
                      </div>
                      <div className="add-to-cart">
                        <button
                          className="atc-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Pagination */}
          {trendingPagination.totalPages > 1 && (
            <div className="pagination-controls">
              {Array.from(
                { length: trendingPagination.totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageJump(page)}
                  disabled={page === trendingPagination.currentPage}
                  className={
                    page === trendingPagination.currentPage ? "active" : ""
                  }
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </main>
      )}
    </>
  );
};

export default TrendingProducts;
