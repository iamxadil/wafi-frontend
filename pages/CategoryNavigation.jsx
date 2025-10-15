import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/categorynavigation.css";
import { Search } from "lucide-react";

import useProductStore from "../components/stores/useProductStore.jsx";
import useCartStore from "../components/stores/useCartStore.jsx";
import useAuthStore from "../components/stores/useAuthStore.jsx";
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";
import OptimizeImage from "../components/hooks/OptimizeImage.jsx";
import ProductGrid from "../components/main/ProductGrid.jsx"
import MobileCard from "../components/main/MobileCard.jsx";
import Pagination from "../components/main/Pagination.jsx";

const CategoryNavigation = () => {
  const { categoryName, brandName } = useParams();
  const navigate = useNavigate();

  const {
    fetchCategoryProducts,
    categoryProducts,
    categoryPagination,
    setCategoryCurrentPage,
    fetchCategoryOffers,
    categoryOffers,
    categoryOfferPagination,
    setCategoryOfferCurrentPage,
  } = useProductStore();


  const width = useWindowWidth();
  const isMobile = width < 650;

  const [searchTerm, setSearchTerm] = useState("");
  const [productsPerPage, setProductsPerPage] = useState(8);
  const [offersPerPage, setOffersPerPage] = useState(8);

  useEffect(() => {
    if (width > 650) {
      setProductsPerPage(8);
      setOffersPerPage(8);
    } else {
      setProductsPerPage(5);
      setOffersPerPage(5);
    }
  }, [width]);

  useEffect(() => {
    setCategoryCurrentPage(1);
    setCategoryOfferCurrentPage(1);
    fetchCategoryProducts({ category: categoryName, brand: brandName, page: 1, limit: productsPerPage });
    fetchCategoryOffers({ category: categoryName, brand: brandName, page: 1, limit: offersPerPage });
  }, [categoryName, brandName, productsPerPage, offersPerPage]);

  useEffect(() => {
    fetchCategoryProducts({
      category: categoryName,
      brand: brandName,
      page: categoryPagination.currentPage,
      limit: productsPerPage,
    });
  }, [categoryPagination.currentPage, categoryName, brandName, productsPerPage]);

  useEffect(() => {
    fetchCategoryOffers({
      category: categoryName,
      brand: brandName,
      page: categoryOfferPagination.currentPage,
      limit: offersPerPage,
    });
  }, [categoryOfferPagination.currentPage, categoryName, brandName, offersPerPage]);


  const displayedProducts = categoryProducts.filter(
    (p) => !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const displayedOffers = categoryOffers.filter(
    (p) => !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleProductPageJump = (page) => setCategoryCurrentPage(page);
  const handleOfferPageJump = (page) => setCategoryOfferCurrentPage(page);


  return (
    <div className="category-page">
      {/* Header */}
      <header className="cat-header">
        <h1>{brandName || categoryName || "Products"} Products</h1>
        <div className="search-cat">
          <Search />
          <input
            type="search"
            placeholder="Search Products.."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* ---------- Desktop Layout ---------- */}
      {!isMobile && (
        <>
          {/* Products Section */}
          <main id="cat-container">
          <div className="products-grid-container cat-grid">
            
              {displayedProducts.length > 0 ? (
                displayedProducts.map((product) => (
                  <ProductGrid key={product.id || product._id}  product={product} />
                ))
              ) : (
                <div className="loading-container">
                  <h2>Loading..</h2>
                </div>
              )}
          </div>
          
            

            {categoryPagination.totalPages > 1 && (
              <Pagination
                totalPages={categoryPagination.totalPages}
                currentPage={categoryPagination.currentPage}
                onPageChange={handleProductPageJump}
              />
            )}
         </main>

          {/* Offers Section */}
           
            <main id="cat-container">

            <header>
              <h1>Offers for {brandName || categoryName || "Products"}</h1>
            </header>

             <div className="products-grid-container cat-grid">
              {displayedOffers.length > 0 ? (
                displayedOffers.map((product) => (
                  <ProductGrid
                    key={product.id || product._id}
                    product={product}
                  />
                ))
              ) : (
                <div className="loading-container">
                  <h2>Loading..</h2>
                </div>
              )}
            </div>

            {categoryOfferPagination.totalPages > 1 && (
              <Pagination totalPages={categoryOfferPagination.totalPages} currentPage={categoryOfferPagination.currentPage} onPageChange={handleOfferPageJump}/>
            )}
             </main>
          </>
    )}

      {/* ---------- Mobile Layout ---------- */}
      {isMobile && (
        <main id="mob-pr-container">
          {/* Mobile Products */}
          <div className="mob-pr-cards">
            {displayedProducts.length > 0 ? (
              displayedProducts.map((p) => (
                <MobileCard key={p.id || p._id} product={p}  />
              ))
            ) : (
              <div className="mob-loading">No products found.</div>
            )}
          </div>

          <Pagination totalPages={categoryPagination.totalPages} 
           currentPage={categoryPagination.currentPage} 
           onPageChange={handleProductPageJump}
          />

          {/* Mobile Offers */}
          <header id="offers-header">
            <h1>Offers for {brandName || categoryName || "Products"}</h1>
          </header>
          <div className="mob-pr-cards">
            {displayedOffers.length > 0 ? (
              displayedOffers.map((p) => (
                <MobileCard
                  key={p.id || p._id}
                  product={p}
                />
              ))
            ) : (
              <div className="mob-loading">No offers found.</div>
            )}
          </div>

          <Pagination
            totalPages={categoryOfferPagination.totalPages}
            currentPage={categoryOfferPagination.currentPage}
            onPageChange={handleOfferPageJump}
            mobile
          />
        </main>
      )}
    </div>
  );
};

export default CategoryNavigation;
