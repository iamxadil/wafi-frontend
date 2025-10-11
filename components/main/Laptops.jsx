import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/productscards.css";
import useProductStore from "../stores/useProductStore.jsx";
import useCartStore from "../stores/useCartStore.jsx";
import useAuthStore from "../stores/useAuthStore.jsx";
import { toast } from "react-toastify";
import useWindowWidth from "../hooks/useWindowWidth.jsx";
import ProductCard from "./ProductCard.jsx";
import MobileCard from "../../components/main/MobileCard.jsx";
import Pagination from "../../components/main/Pagination.jsx";
import { AnimatePresence } from "framer-motion";

const LaptopProducts = () => {
  const fetchLaptops = useProductStore((state) => state.fetchLaptops);
  const laptopProducts = useProductStore((state) => state.laptopProducts);
  const laptopPagination = useProductStore((state) => state.laptopPagination);
  const addToCart = useCartStore((state) => state.addToCart);
  const width = useWindowWidth();

  const [selectedBrand, setSelectedBrand] = useState("");

  // Fetch laptops on mount or brand change
  useEffect(() => {
    fetchLaptops({
      page: 1,
      brands: selectedBrand ? [selectedBrand] : [],
      limit: width > 650 ? 4 : 6,
    });
  }, [fetchLaptops, selectedBrand, width]);

  const handleAddToCart = (product, quantity = 1) => {
    if (product.countInStock <= 0) {
      toast.error("Sorry, this product is out of stock");
      return;
    }
    const token = useAuthStore.getState().token;
    addToCart(product, quantity, token);
  };

  const handlePageJump = (page) => {
    if (page !== laptopPagination.currentPage) {
      fetchLaptops({
        page,
        brands: selectedBrand ? [selectedBrand] : [],
        limit: width > 650 ? 4 : 6,
      });

      // Scroll mobile cards to start
      if (width <= 650) {
        const container = document.querySelector(".mob-pr-cards");
        if (container) container.scrollTo({ left: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <>
      {/* Desktop */}
      {width > 650 && (
        <main id="pc-pr-container">
          <header id="pc-pr-header">
            <h1>Laptops</h1>
            <div className="select-wrap">
              <select
                className="custom"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                <option value="">All Brands</option>
                <option value="Acer">Acer</option>
                <option value="Asus">Asus</option>
                <option value="Apple">Apple</option>
                <option value="Lenovo">Lenovo</option>
                <option value="HP">HP</option>
              </select>
            </div>
          </header>


        <div id="pc-pr-cards-container">
        <div className="pc-pr-cards">
          {laptopProducts && laptopProducts.length > 0 ? (
            laptopProducts.map((product) => (
              <ProductCard
                key={product.id || product._id}
                product={product}
                onAddToCart={handleAddToCart}
                onView={() => navigate(`/product/${product.id || product._id}`)}
              />
            ))
          ) : (
            <p>Loading laptops...</p>
          )}
            </div>
          </div>


          <Pagination
            currentPage={laptopPagination.currentPage}
            totalPages={laptopPagination.totalPages}
            onPageChange={handlePageJump}
          />
        </main>
      )}

      {/* Mobile */}
      {width <= 650 && (
        <main id="mob-pr-container">
          <header className="mob-pr-header">
            <h1> <Link to="/laptops">Laptops</Link></h1>
            <div className="mob-select-wrap">
              <select
                className="mob-custom"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                <option value="">All Brands</option>
                <option value="Acer">Acer</option>
                <option value="Asus">Asus</option>
                <option value="Apple">Apple</option>
                <option value="Lenovo">Lenovo</option>
                <option value="HP">HP</option>
              </select>
            </div>
          </header>

          <div className="mob-pr-cards">
            <AnimatePresence initial={false}>
            {laptopProducts.map((product, index) => (
              <MobileCard
                key={product._id || product.id}
                product={product}
                customDelay={index * 0.01} // subtle stagger
              />
            ))}
          </AnimatePresence>
          </div>

          <Pagination
            currentPage={laptopPagination.currentPage}
            totalPages={laptopPagination.totalPages}
            onPageChange={handlePageJump}
            mobile
          />
        </main>
      )}
    </>
  );
};

export default LaptopProducts;
