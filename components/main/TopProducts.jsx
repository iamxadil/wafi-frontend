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

  const handleAddToCart = (product) => {
    addToCart(product);
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
                  <div className="pc-product-card" key={product._id}>
                    <div className="product-image-wrapper">
                      <div
                        className="pc-product-image"
                        style={{ backgroundImage: `url(${product.images?.[0]})` }}
                      ></div>
                    </div>

                    <div className="pc-product-details">
                      <p>{product.brand}</p>
                      <h2>{product.name}</h2>
                      <p>{product.price.toLocaleString()} IQD</p>
                    </div>

                    <div className="add-to-cart">
                      <button className="atc-btn" onClick={() => handleAddToCart(product)}>
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
