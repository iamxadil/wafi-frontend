// src/components/ProductCard.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import OptimizeImage from "../hooks/OptimizeImage.jsx";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore.jsx";
import useCartStore from "../stores/useCartStore.jsx";
import { toast } from "react-toastify";

const ProductGrid = ({ product, onAddToCart, onView }) => {
  const cardRef = useRef(null);
  const waveTimeout = useRef(null);
  const [waveActive, setWaveActive] = useState(false);
  const [overlayActive, setOverlayActive] = useState(false);

  const id = product.id || product._id;

  //Stores
  const addToCart = useCartStore((state) => state.addToCart);
  const token = useAuthStore.getState().token;

  const navigate = useNavigate();
  const handleAddToCart = (product) => { if (product.countInStock <= 0) return toast.error("Out of stock"); addToCart(product, 1, token); };

  const StarsRow = ({ rating = 0 }) => (
    <span className="rating-stars" aria-hidden>
      {[...Array(5)].map((_, i) => {
        const decimal = rating - i;
        let fillType = "empty";
        if (decimal >= 1) fillType = "full";
        else if (decimal >= 0.25) fillType = "half";
        return (
          <span className="star-wrapper" key={i}>
            <Star size={14} className="star-empty" />
            {(fillType === "full" || fillType === "half") && (
              <Star size={14} className={fillType === "full" ? "star-full" : "star-half"} />
            )}
          </span>
        );
      })}
    </span>
  );

  const handleWave = () => {
    setWaveActive(true);
    setOverlayActive(true);
    if (waveTimeout.current) clearTimeout(waveTimeout.current);
    waveTimeout.current = setTimeout(() => setWaveActive(false), 400);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (overlayActive && cardRef.current && !cardRef.current.contains(e.target)) {
        setOverlayActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [overlayActive]);

  return (
    <motion.div
      className="gr-product-card"
      onClick={handleWave}
      ref={cardRef}
    >
      {/* Wave animation */}
      <AnimatePresence>
        {waveActive && (
          <motion.div
            className="wave-overlay"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

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

      {/* Card content */}
      <div className="gr-image-wrapper">
        <OptimizeImage src={product.images?.[0]} alt={product.name} className="gr-image" />
      </div>

      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-brand">
          <span>{product.brand}</span>
          <StarsRow rating={product.rating || 0} />
        </p>

        <div className="product-price">
          {product.discountPrice > 0 ? (
            <>
              <span style={{fontSize: "0.9rem"}} className="original-price">{product.price?.toLocaleString()} IQD</span>
              <span style={{color: "var(--text)", fontWeight: "bold"}} className="final-price">{product.finalPrice?.toLocaleString()} IQD</span>
            </>
          ) : (
            <span style={{color: "var(--text)"}} className="final-price">{product.finalPrice?.toLocaleString()} IQD</span>
          )}
        </div>
      </div>

      {/* Overlay buttons */}
      <AnimatePresence>
        {overlayActive && (
          <motion.div
            className="card-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button onClick={(e) => { e.stopPropagation(); navigate(`/product/${id}`) }}>View Product</button>
            <button onClick={(e) => { e.stopPropagation(); handleAddToCart(product) }}>Add to Cart</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductGrid;
