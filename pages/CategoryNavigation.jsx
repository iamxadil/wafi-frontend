import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/categorynavigation.css";
import { IoAdd as Add } from "react-icons/io5";
import { BiHeart as Heart, BiLeftArrow as ArrowLeft, BiRightArrow as ArrowRight } from "react-icons/bi";
import useProductStore from "../components/stores/useProductStore.jsx";
import useCartStore from "../components/stores/useCartStore.jsx";
import useAuthStore from "../components/stores/useAuthStore.jsx";
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";

const CategoryNavigation = () => {
  const { categoryName, brandName } = useParams();
  const navigate = useNavigate();

  const fetchCategoryProducts = useProductStore((state) => state.fetchCategoryProducts);
  const categoryProducts = useProductStore((state) => state.categoryProducts);
  const categoryPagination = useProductStore((state) => state.categoryPagination);
  const setCategoryCurrentPage = useProductStore((state) => state.setCategoryCurrentPage);

  const fetchCategoryOffers = useProductStore((state) => state.fetchCategoryOffers);
  const categoryOffers = useProductStore((state) => state.categoryOffers);
  const categoryOfferPagination = useProductStore((state) => state.categoryOfferPagination);
  const setCategoryOfferCurrentPage = useProductStore((state) => state.setCategoryOfferCurrentPage);

  const addToCart = useCartStore((state) => state.addToCart);
  const token = useAuthStore.getState().token;

  const width = useWindowWidth();
  const isMobile = width < 650;

  const productsPerPage =  5;
  const offersPerPage = 5;

  const [searchTerm, setSearchTerm] = useState("");

  // Fetch products when category/brand/page changes
  useEffect(() => {
    setCategoryCurrentPage(1);
    setCategoryOfferCurrentPage(1);
    fetchCategoryProducts({
      category: categoryName,
      brand: brandName,
      page: 1,
      limit: productsPerPage
    });
    fetchCategoryOffers({
      category: categoryName,
      brand: brandName,
      page: 1,
      limit: offersPerPage
    });
  }, [categoryName, brandName, fetchCategoryProducts, fetchCategoryOffers, productsPerPage, offersPerPage]);

  // Fetch products when page changes
  useEffect(() => {
    fetchCategoryProducts({
      category: categoryName,
      brand: brandName,
      page: categoryPagination.currentPage,
      limit: productsPerPage
    });
  }, [categoryName, brandName, categoryPagination.currentPage, fetchCategoryProducts, productsPerPage]);

  // Fetch offers when offer page changes
  useEffect(() => {
    fetchCategoryOffers({
      category: categoryName,
      brand: brandName,
      page: categoryOfferPagination.currentPage,
      limit: offersPerPage
    });
  }, [categoryName, brandName, categoryOfferPagination.currentPage, fetchCategoryOffers, offersPerPage]);


  
  // Filter by search term
  const displayedProducts = (categoryProducts || []).filter(p =>
    !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const displayedOffers = (categoryOffers || []).filter(p =>
    !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (product) => {
    if (product.countInStock <= 0) {
      alert("Sorry, this product is out of stock");
      return;
    }
    addToCart(product, 1, token);
    alert(`${product.name} added to cart!`);
  };

  const handleProductPageJump = (newPage) => {
    setCategoryCurrentPage(newPage);
  };

  const handleOfferPageJump = (newPage) => {
    setCategoryOfferCurrentPage(newPage);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="category-page">
      {/* Header */}
      <header className="cat-header">
        <h1>{brandName || categoryName || "Products"} Products</h1>
        <div className="search-cat">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* Desktop Grid */}
      {!isMobile && (
        <>
          <div className="pc-cat-grid">
            {displayedProducts.length > 0 ? (
              displayedProducts.map((p) => (
                <div key={p.id} className="pc-cat-card" onClick={() => handleProductClick(p.id)}>
                  {p.countInStock === 0 && <span className="mob-badge out-of-stock">Out of Stock</span>}
                  <div className="pc-cat-image">
                    <img src={p.images[0]} alt={p.name} />
                  </div>
                  <div className="pc-cat-details">
                    <h3>{p.name}</h3>
                    <p>{p.brand}</p>
                    <p>{p.price.toLocaleString()} IQD</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No products found.</p>
            )}
          </div>

          {/* Product Pagination */}
          {categoryPagination.totalPages > 1 && (
            <div className="pagination-controls">
              {Array.from({ length: categoryPagination.totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => handleProductPageJump(p)}
                  disabled={p === categoryPagination.currentPage}
                  className={p === categoryPagination.currentPage ? "active" : ""}
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Offers Grid */}
          <div id="pc-cat-grid-offers">
            <header><h1>Offers for {brandName || categoryName || "Products"} Products</h1></header>
            <div className="pc-cat-grid">
              {displayedOffers.length > 0 ? (
                displayedOffers.map((p) => (
                  <div key={p.id} className="pc-cat-card" onClick={() => handleProductClick(p.id)}>
                    {p.countInStock === 0 && <span className="badge out-of-stock">Out of Stock</span>}
                    {p.countInStock > 0 && <span className="badge in-stock">In Stock</span>}
                    {p.discountPrice > 0 && <span className="badge offer">{Math.round((p.discountPrice / p.price) * 100)}% OFF</span>}
                    <div className="pc-cat-image">
                      <img src={p.images[0]} alt={p.name} />
                    </div>
                    <div className="pc-cat-details">
                      <h3>{p.name}</h3>
                      <p>{p.brand}</p>
                      <p>{p.price.toLocaleString()} IQD</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No offers found.</p>
              )}
            </div>

            {/* Offers Pagination */}
            {categoryOfferPagination.totalPages > 1 && (
              <div className="pagination-controls">
                {Array.from({ length: categoryOfferPagination.totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => handleOfferPageJump(p)}
                    disabled={p === categoryOfferPagination.currentPage}
                    className={p === categoryOfferPagination.currentPage ? "active" : ""}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Mobile Grid */}
      {isMobile && (
        <main id="mob-pr-container">
          {/* Mobile Products */}
          <div className="mob-pr-cards">
            {displayedProducts.length > 0 ? displayedProducts.map(p => (
              <div key={p.id} className="mob-pr-card" onClick={() => handleProductClick(p.id)}>
                <div className="mob-pr-badges">
                  {p.countInStock === 0 && <span className="mob-badge out-of-stock">Out of Stock</span>}
                  {p.countInStock > 0 && <span className="mob-badge in-stock">In Stock</span>}
                  {p.discountPrice > 0 && <span className="mob-badge offer">{Math.round((p.discountPrice / p.price) * 100)}%</span>}
                </div>
                <div className="mob-pr-image"><img src={p.images[0]} alt={p.name} /></div>
                <div className="mob-pr-details">
                  <h3>{p.brand}</h3>
                  <h3>{p.name}</h3>
                  <h3>{p.price.toLocaleString()} IQD</h3>
                </div>
                <div className="mob-pr-buttons">
                  <button onClick={() => handleAddToCart(p)}><Add /></button>
                  <button><Heart /></button>
                </div>
              </div>
            )) : <div className="mob-loading">No products found.</div>}
          </div>

          {/* Mobile Product Pagination */}
          {categoryPagination.totalPages > 1 && (
            <div className="mob-pagination-controls">
              <button onClick={() => handleProductPageJump(Math.max(categoryPagination.currentPage - 1, 1))} disabled={categoryPagination.currentPage === 1}><ArrowLeft /></button>
              <span className="mob-page-indicator">{categoryPagination.currentPage} of {categoryPagination.totalPages}</span>
              <button onClick={() => handleProductPageJump(Math.min(categoryPagination.currentPage + 1, categoryPagination.totalPages))} disabled={categoryPagination.currentPage === categoryPagination.totalPages}><ArrowRight /></button>
            </div>
          )}

          {/* Mobile Offers */}
          <header><h1>Offers for {brandName || categoryName || "Products"}</h1></header>
          <div className="mob-pr-cards">
            {displayedOffers.length > 0 ? displayedOffers.map(p => (
              <div key={p.id} className="mob-pr-card" onClick={() => handleProductClick(p.id)}>
                <div className="mob-pr-badges">
                  {p.countInStock === 0 && <span className="mob-badge out-of-stock">Out of Stock</span>}
                  {p.countInStock > 0 && <span className="mob-badge in-stock">In Stock</span>}
                  {p.discountPrice > 0 && <span className="mob-badge offer">{Math.round((p.discountPrice / p.price) * 100)}%</span>}
                </div>
                <div className="mob-pr-image"><img src={p.images[0]} alt={p.name} /></div>
                <div className="mob-pr-details">
                  <h3>{p.brand}</h3>
                  <h3>{p.name}</h3>
                  <h3>{p.price.toLocaleString()} IQD</h3>
                </div>
                <div className="mob-pr-buttons">
                  <button onClick={() => handleAddToCart(p)}><Add /></button>
                  <button><Heart /></button>
                </div>
              </div>
            )) : <div className="mob-loading">No offers found.</div>}
          </div>

          {/* Mobile Offers Pagination */}
          {categoryOfferPagination.totalPages > 1 && (
            <div className="mob-pagination-controls">
              <button onClick={() => handleOfferPageJump(Math.max(categoryOfferPagination.currentPage - 1, 1))} disabled={categoryOfferPagination.currentPage === 1}><ArrowLeft /></button>
              <span className="mob-page-indicator">{categoryOfferPagination.currentPage} of {categoryOfferPagination.totalPages}</span>
              <button onClick={() => handleOfferPageJump(Math.min(categoryOfferPagination.currentPage + 1, categoryOfferPagination.totalPages))} disabled={categoryOfferPagination.currentPage === categoryOfferPagination.totalPages}><ArrowRight /></button>
            </div>
          )}
        </main>
      )}
    </div>
  );
};

export default CategoryNavigation;
