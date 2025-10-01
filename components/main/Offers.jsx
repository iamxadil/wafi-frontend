import React, { useEffect, useState } from "react";
import "../../styles/productscards.css";
import useProductStore from "../stores/useProductStore.jsx";
import useCartStore from "../stores/useCartStore.jsx";
import useAuthStore from "../stores/useAuthStore.jsx";
import { toast } from "react-toastify";
import useWindowWidth from "../hooks/useWindowWidth.jsx";
import { useNavigate } from "react-router-dom";
import { BiRightArrowAlt as ArrowRight, BiHeart as Heart, BiLeftArrowAlt as ArrowLeft } from "react-icons/bi";
import { IoAdd as Add } from "react-icons/io5";

const Offers = () => {
  const fetchOffers = useProductStore((state) => state.fetchOffers);
  const offerProducts = useProductStore((state) => state.offerProducts);
  const offerPagination = useProductStore((state) => state.offerPagination);
  const offersLoading = useProductStore((state) => state.offersLoading);
  const addToCart = useCartStore((state) => state.addToCart);

  const [direction, setDirection] = useState(0);
  const width = useWindowWidth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOffers(1);
  }, [fetchOffers]);

  const handleAddToCart = (product) => {
    if (product.countInStock <= 0) {
      toast.error("Sorry, this product is out of stock");
      return;
    }
    const token = useAuthStore.getState().token;
    addToCart(product, 1, token);
  };

  const handlePageJump = (page) => {
    if (page !== offerPagination.currentPage) {
      setDirection(page > offerPagination.currentPage ? 1 : -1);
      fetchOffers(page);
    }
  };

  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <>
      {/* PC Container */}
      {width > 650 && (
        <main id="pc-pr-container">
          <header id="pc-pr-header">
            <h1>Offers</h1>
          </header>

          <section id="pc-pr-cards-container">
            {offersLoading ? (
              <p style={{ padding: "2rem" }}>Loading offers...</p>
            ) : offerProducts.length === 0 ? (
              <p style={{ padding: "2rem" }}>No offers available.</p>
            ) : (
              <div className="pc-pr-cards">
                {offerProducts.map((product) => (
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
                        {Math.round((product.discountPrice / product.price) * 100)}% OFF
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
              </div>
            )}
          </section>

          {/* PC Pagination */}
          {offerPagination.totalPages > 1 && (
            <div className="pagination-controls">
              {Array.from({ length: offerPagination.totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageJump(page)}
                  disabled={page === offerPagination.currentPage}
                  className={page === offerPagination.currentPage ? "active" : ""}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </main>
      )}

      {/* Mobile Container */}
      {width <= 650 && (
        <main id="mob-pr-container">
          <h1>Offers <ArrowRight /></h1>

          <div
            className="mob-pr-cards"
            style={{ display: "flex", gap: "1rem", overflowX: "auto", scrollSnapType: "x mandatory", paddingBottom: "1rem" }}
          >
            {offerProducts.length > 0 ? (
              offerProducts.map((product) => (
                <div
                  className="mob-pr-card"
                  key={product.id}
                  onClick={() => handleCardClick(product.id)}
                  style={{ cursor: "pointer", scrollSnapAlign: "start", flex: "0 0 auto" }}
                >
                  {/* Badges */}
                  <div className="mob-pr-badges">
                    {product.countInStock === 0 && <span className="mob-badge out-of-stock">Out of Stock</span>}
                    {product.countInStock > 0 && <span className="mob-badge in-stock">In Stock</span>}
                    {product.discountPrice > 0 && <span className="mob-badge offer">{Math.round((product.discountPrice / product.price) * 100)}%</span>}
                  </div>

                  {/* Image */}
                  <div className="mob-pr-image">
                    <img src={product.images[0]} alt={product.name} />
                  </div>

                  {/* Details */}
                  <div className="mob-pr-details">
                    <h3>{product.brand}</h3>
                    <h3>{product.name}</h3>
                    <h3>{product.discountPrice > 0 ? (product.price - product.discountPrice).toLocaleString() + " IQD" : product.price.toLocaleString() + " IQD"}</h3>
                  </div>

                  {/* Buttons */}
                  <div className="mob-pr-buttons">
                    <button onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}>
                      <Add />
                    </button>
                    <button onClick={(e) => e.stopPropagation()}>
                      <Heart />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: "1rem", color: "#888", minWidth: "100%", textAlign: "center" }}>
                {offersLoading ? "Loading offers..." : "No offers available."}
              </div>
            )}
          </div>

          {/* Mobile Pagination */}
          <div className="mob-pagination-controls">
            <button
              onClick={() => handlePageJump(offerPagination.currentPage - 1)}
              disabled={offerPagination.currentPage === 1}
            >
              <ArrowLeft />
            </button>

            <span className="mob-page-indicator">
              {offerPagination.currentPage} of {offerPagination.totalPages}
            </span>

            <button
              onClick={() => handlePageJump(offerPagination.currentPage + 1)}
              disabled={offerPagination.currentPage === offerPagination.totalPages}
            >
              <ArrowRight />
            </button>
          </div>
        </main>
      )}
    </>
  );
};

export default Offers;
