import React, { useEffect, useState } from "react";
import useWindowWidth from "../hooks/useWindowWidth";
import "../../styles/topproductscards.css";
import useProductStore from "../stores/useProductStore";
import { 
  TbArrowNarrowRightDashed as ArrowRight,
  TbArrowNarrowLeftDashed as ArrowLeft
} from "react-icons/tb";
import useCartStore from "../stores/useCartStore";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";
import OptimizeImage from '../hooks/OptimizeImage.jsx';

const TopProducts = () => {
  const width = useWindowWidth();
  const navigate = useNavigate();
  
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const products = useProductStore((state) => state.products);
  const addToCart = useCartStore((state) => state.addToCart);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const topProducts = products.filter(product => product.isTopProduct && product.approved);
  const cardWidth = 420;
  const visibleCounts = Math.floor(width / cardWidth);
  const total = topProducts.length;

  const next = () => setCurrentIndex(prev => (prev + 1) % total);
  const previous = () => setCurrentIndex(prev => (prev - 1 + total) % total);

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

  const handleCardClick = (id) => {
  navigate(`/product/${id}`);
};

  const getVisibleProducts = () => {
    if (total <= visibleCounts) return topProducts;
    const endIndex = currentIndex + visibleCounts;
    if (endIndex <= total) return topProducts.slice(currentIndex, endIndex);
    return [...topProducts.slice(currentIndex), ...topProducts.slice(0, endIndex - total)];
  };

  const visibleProducts = getVisibleProducts();

  return (
    <>
      {width > 650 && (
        <main id="top-products-container">
          <header id="top-products">
            <h1>Our Top Products</h1>
          </header>

          <section id="top-products-cards">
            <div className="carousel-wrapper">
              <button className="carousel-arrow left" onClick={previous}><ArrowLeft /></button>

              <div className="carousel-track">
                {visibleProducts.map(product => (
                  <div className="pc-pr-card" key={product._id} onClick={() => handleCardClick(product.id)}>
                    <div className="pc-image-wrapper">
                     <OptimizeImage src={product.images[0]} alt={product.name} className="pc-pr-image" />
                    </div>

                    <div className="pc-pr-details">
                      <p>{product.brand}</p>
                      <h2>{product.name}</h2>
                      <p>{product.finalPrice.toLocaleString()} IQD</p>
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

              <button className="carousel-arrow right" onClick={next}><ArrowRight /></button>
            </div>
          </section>
        </main>
      )}
    </>
  );
};

export default TopProducts;
