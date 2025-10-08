import React, { useEffect, useState } from "react";
import "../../styles/productscards.css";
import useProductStore from "../stores/useProductStore.jsx";
import useCartStore from "../stores/useCartStore.jsx";
import useAuthStore from "../stores/useAuthStore.jsx";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import useWindowWidth from "../hooks/useWindowWidth.jsx";
import { useNavigate } from "react-router-dom";
import {BiRightArrowAlt as ArrowRight, BiHeart as Heart, BiLeftArrowAlt as ArrowLeft} from "react-icons/bi"
import { IoAdd as Add} from "react-icons/io5";


const LaptopProducts = () => {
  const fetchLaptops = useProductStore((state) => state.fetchLaptops);
  const laptopProducts = useProductStore((state) => state.laptopProducts);
  const laptopPagination = useProductStore((state) => state.laptopPagination);
  const addToCart = useCartStore((state) => state.addToCart);

  const [direction, setDirection] = useState(0); // +1 next, -1 prev
  const width = useWindowWidth();

  const [selectedBrand, setSelectedBrand] = useState("");


  //Navigation
  const navigate = useNavigate();

  // fetch laptops whenever component mounts or brand changes
  useEffect(() => {
    fetchLaptops({ page: 1, brands: selectedBrand ? [selectedBrand] : [] });
  }, [fetchLaptops, selectedBrand]);


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

  // handle pagination while keeping brand filter
  const handlePageJump = (page) => {
  if (page !== laptopPagination.currentPage) {
    setDirection(page > laptopPagination.currentPage ? 1 : -1);
    fetchLaptops({
      page,
      brands: selectedBrand ? [selectedBrand] : [],
    });

    // Scroll the mobile cards container to the start
    if (width < 650) {
      const container = document.querySelector(".mob-pr-cards");
      if (container) {
        container.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      }
    }
  }
};


  const handleCardClick = (id) => {
  navigate(`/product/${id}`);
};


const [mobPage, setMobPage] = useState(1);
const [mobProducts, setMobProducts] = useState([]);

// Fetch first page on mount or brand change
useEffect(() => {
  const fetchPage = async () => {
    const laptops = await fetchLaptops({ page: 1, brands: selectedBrand ? [selectedBrand] : [] });
    setMobProducts(laptops);
    setMobPage(1);
  };
  fetchPage();
}, [selectedBrand, fetchLaptops]);

// Load next page when user scrolls near the end
const handleScroll = async (e) => {
  const container = e.target;
  if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 50) {
    if (mobPage < laptopPagination.totalPages) {
      const nextPage = mobPage + 1;
      const newLaptops = await fetchLaptops({
        page: nextPage,
        brands: selectedBrand ? [selectedBrand] : [],
      });
      setMobProducts((prev) => [...prev, ...newLaptops]);
      setMobPage(nextPage);
    }
  }
};

  return (
    <>
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

         <section id="pc-pr-cards-container">
  <div className="pc-pr-cards">
    {laptopProducts && laptopProducts.length > 0 ? (
      laptopProducts.map((product) => (
        <motion.div
          key={product.id}
          className="pc-pr-card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
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
            <p>{product.price.toLocaleString()} IQD</p>
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
        </motion.div>
      ))
    ) : (
      <p>Loading laptops...</p>
    )}
  </div>
</section>

          <div className="pagination-controls">
            {Array.from(
              { length: laptopPagination.totalPages },
              (_, index) => index + 1
            ).map((page) => (
              <button
                key={page}
                onClick={() => handlePageJump(page)}
                disabled={page === laptopPagination.currentPage}
                className={page === laptopPagination.currentPage ? "active" : ""}
              >
                {page}
              </button>
            ))}
          </div>
        </main>
      )}


 

{width < 650 && (
  <main id="mob-pr-container">
    <header className="mob-pr-header">
      <h1>Laptops</h1>
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
      {laptopProducts && laptopProducts.length > 0 ? (
        laptopProducts.map((product) => (
          <div
            className="mob-pr-card"
            key={product.id}
            onClick={() => handleCardClick(product.id)}
          >
            <div className="mob-pr-badges">
              {product.countInStock === 0 && <span className="mob-badge out-of-stock">Out of Stock</span>}
              {product.countInStock > 0 && <span className="mob-badge in-stock">In Stock</span>}
              {product.discountPrice > 0 && <span className="mob-badge offer">{Math.round((product.discountPrice / product.price) * 100)}%</span>}
            </div>

            <div className="mob-pr-image">
              <img src={product.images[0]} alt={product.name} />
            </div>

            <div className="mob-pr-details">
              <h3>{product.brand}</h3>
              <h3>{product.name}</h3>
              <h3>{product.price.toLocaleString()} IQD</h3>
            </div>

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
        <div className="mob-loading">Loading laptops...</div>
      )}
    </div>

    <div className="mob-pagination-controls">
      <button
        onClick={() => handlePageJump(laptopPagination.currentPage - 1)}
        disabled={laptopPagination.currentPage === 1}
      >
        <ArrowLeft />
      </button>

      <span className="mob-page-indicator">
        {laptopPagination.currentPage} of {laptopPagination.totalPages}
      </span>

      <button
        onClick={() => handlePageJump(laptopPagination.currentPage + 1)}
        disabled={laptopPagination.currentPage === laptopPagination.totalPages}
      >
        <ArrowRight />
      </button>
    </div>
  </main>
)}



    </>
  );
};

export default LaptopProducts;
