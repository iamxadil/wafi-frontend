import React, { useEffect, useState } from "react";
import "../styles/categorynavigation.css";
import { useParams } from "react-router-dom";
import { IoAdd as Add } from "react-icons/io5";
import { BiHeart as Heart, BiLeftArrow as ArrowLeft, BiRightArrow as ArrowRight } from "react-icons/bi";
import useProductStore from "../components/stores/useProductStore.jsx";
import useCartStore from "../components/stores/useCartStore.jsx";
import useAuthStore from "../components/stores/useAuthStore.jsx";
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";

const CategoryNavigation = () => {
  const { categoryName, brandName } = useParams();

  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const products = useProductStore((state) => state.products);
  const laptopPagination = useProductStore((state) => state.laptopPagination);
  const fetchOffers = useProductStore((state) => state.fetchOffers);
  const offerPagination = useProductStore((state) => state.offerPagination);
  const offerProductsStore = useProductStore((state) => state.offerProducts);

  const addToCart = useCartStore((state) => state.addToCart);
  const token = useAuthStore.getState().token;

  const width = useWindowWidth();
  const isMobile = width < 650;

  const [searchTerm, setSearchTerm] = useState("");
  const [productPage, setProductPage] = useState(1);
  const [offerPage, setOfferPage] = useState(1);

  // Fetch products
  useEffect(() => {
    fetchProducts({ category: categoryName, brand: brandName, page: productPage });
  }, [categoryName, brandName, productPage, fetchProducts]);

  // Fetch offers
  useEffect(() => {
    fetchOffers(offerPage);
  }, [offerPage, fetchOffers]);

  // Filter products locally by search term
  const displayedProducts = products.filter((p) => {
    let matches = true;
    if (categoryName) matches = matches && p.category.toLowerCase() === categoryName.toLowerCase();
    if (brandName) matches = matches && p.brand.toLowerCase().trim() === brandName.toLowerCase().trim();
    if (searchTerm) matches = matches && p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matches;
  });

  const offerProducts = offerProductsStore.filter((p) =>
    (!categoryName || p.category.toLowerCase() === categoryName.toLowerCase()) &&
    (!brandName || p.brand.toLowerCase() === brandName.toLowerCase()) &&
    (!searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddToCart = (product) => {
    if (product.countInStock <= 0) {
      alert("Sorry, this product is out of stock");
      return;
    }
    addToCart(product, 1, token);
    alert(`${product.name} added to cart!`);
  };

  const handleProductPageJump = (newPage) => setProductPage(newPage);
  const handleOfferPageJump = (newPage) => setOfferPage(newPage);

  return (
    <div className="category-page">
      {/* Header */}
      <header className="cat-header">
        <h1>{brandName || categoryName || "Products"}</h1>
        <div className="search-cat">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={() => { setProductPage(1); setOfferPage(1); }}>Search</button>
        </div>
      </header>

      {/* PC GRID */}
      {!isMobile && (
        <>
          <div className="pc-cat-grid">
            {displayedProducts.length > 0 ? (
              displayedProducts.map((p) => (
                <div key={p._id} className="pc-cat-card">
                  {p.countInStock === 0 && <span className="mob-badge out-of-stock">Out of Stock</span>}
                  <div className="pc-cat-image">
                    <img src={p.images[0]} />
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

          {/* Desktop Pagination */}
          {laptopPagination.totalPages > 1 && (
            <div className="pagination-controls">
              {Array.from({ length: laptopPagination.totalPages }, (_, index) => index + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handleProductPageJump(p)}
                  disabled={p === laptopPagination.currentPage}
                  className={p === laptopPagination.currentPage ? "active" : ""}
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Offers Section */}
          <div id="pc-cat-grid-offers">
            <header>
              <h1>Offers for {brandName || categoryName || "Products"}</h1>
            </header>

            <div className="pc-cat-grid">
              {offerProducts.length > 0 ? (
                offerProducts.map((p) => (
                  <div key={p._id} className="pc-cat-card">
                    {p.countInStock === 0 && <span className="badge out-of-stock">Out of Stock</span>}
                    {p.countInStock > 0 && <span className="badge in-stock">In Stock</span>}
                    {p.discountPrice > 0 && <span className="badge offer">{Math.round((p.discountPrice / p.price) * 100)}% OFF</span>}
                    <div className="pc-cat-image">
                      <img src={p.images[0]} />
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
            {offerPagination.totalPages > 1 && (
              <div className="pagination-controls">
                {Array.from({ length: offerPagination.totalPages }, (_, index) => index + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => handleOfferPageJump(p)}
                    disabled={p === offerPagination.currentPage}
                    className={p === offerPagination.currentPage ? "active" : ""}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* MOBILE CARDS */}
      {isMobile && (
        <main id="mob-pr-container">
          {/* Products */}
          <div className="mob-pr-cards">
            {displayedProducts.length > 0 ? (
              displayedProducts.map((p) => (
                <div key={p._id} className="mob-pr-card">
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
              ))
            ) : (<div className="mob-loading">No products found.</div>)}
          </div>

          {/* Mobile Product Pagination */}
          {laptopPagination.totalPages > 1 && (
            <div className="mob-pagination-controls">
              <button onClick={() => handleProductPageJump(Math.max(productPage - 1, 1))} disabled={productPage === 1}><ArrowLeft /></button>
              <span className="mob-page-indicator">{productPage} of {laptopPagination.totalPages}</span>
              <button onClick={() => handleProductPageJump(Math.min(productPage + 1, laptopPagination.totalPages))} disabled={productPage === laptopPagination.totalPages}><ArrowRight /></button>
            </div>
          )}

          {/* Mobile Offers Section */}
          <header><h1>Offers for {brandName || categoryName || "Products"}</h1></header>
          <div className="mob-pr-cards">
            {offerProducts.length > 0 ? (
              offerProducts.map((p) => (
                <div key={p._id} className="mob-pr-card">
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
              ))
            ) : (<div className="mob-loading">No offers found.</div>)}
          </div>

          {/* Mobile Offers Pagination */}
          {offerPagination.totalPages > 1 && (
            <div className="mob-pagination-controls">
              <button onClick={() => handleOfferPageJump(Math.max(offerPage - 1, 1))} disabled={offerPage === 1}><ArrowLeft /></button>
              <span className="mob-page-indicator">{offerPage} of {offerPagination.totalPages}</span>
              <button onClick={() => handleOfferPageJump(Math.min(offerPage + 1, offerPagination.totalPages))} disabled={offerPage === offerPagination.totalPages}><ArrowRight /></button>
            </div>
          )}
        </main>
      )}
    </div>
  );
};

export default CategoryNavigation;
