import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Star } from "lucide-react";
import OptimizeImage from "../hooks/OptimizeImage.jsx";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore.jsx";
import useCartStore from "../stores/useCartStore.jsx";
import useFavoritesStore from "../stores/useFavoritesStore.jsx";
import { toast } from "react-toastify";
import useTranslate from "../hooks/useTranslate.jsx";

/* ============================================================
   🌟 ProductGrid (Pagination-Safe)
============================================================ */
const ProductGrid = ({ product }) => {
  const cardRef = useRef(null);
  const waveTimeout = useRef(null);

  const [waveActive, setWaveActive] = useState(false);
  const [overlayActive, setOverlayActive] = useState(false);

  const t = useTranslate();
  const id = product._id || product.id;
  const navigate = useNavigate();

  // === Stores ===
  const addToCart = useCartStore((s) => s.addToCart);
  const token = useAuthStore.getState().token;
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const favorite = isFavorite(id);

  /* ============================================================
     ⭐ Utility Components
  ============================================================= */
  const StarsRow = ({ rating = 0 }) => (
    <span className="rating-stars" aria-hidden>
      {[...Array(5)].map((_, i) => {
        const diff = rating - i;
        const type = diff >= 1 ? "full" : diff >= 0.25 ? "half" : "empty";
        return (
          <span className="star-wrapper" key={i}>
            <Star size={14} className="star-empty" />
            {type !== "empty" && (
              <Star
                size={14}
                className={type === "full" ? "star-full" : "star-half"}
              />
            )}
          </span>
        );
      })}
    </span>
  );

  /* ============================================================
     🛒 Handlers
  ============================================================= */
  const handleAddToCart = (product) => {
    if (product.countInStock <= 0)
      return toast.error(t("Out of stock", "غير متوفر"));
    addToCart(product, 1, token);
  };

  const handleWave = () => {
    setWaveActive(true);
    setOverlayActive(true);
    clearTimeout(waveTimeout.current);
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

  /* ============================================================
     🎬 Animations (smooth & pagination-safe)
  ============================================================= */
  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
  };

  /* ============================================================
     🧩 Render
  ============================================================= */
  return (
    <motion.div
      className="gr-product-card"
      ref={cardRef}
      onClick={handleWave}
      variants={cardVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      layout="position" // allows minor shifts, not full layout reflow
    >
      {/* ❤️ Favorite Button */}
      <motion.div
        className="heart-button"
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(product);
        }}
        whileHover={{ scale: 1.15 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={favorite ? "filled" : "empty"}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25, duration: 0.1 }}
          >
            {favorite ? (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: [1.2, 0.95, 1] }}
                transition={{ duration: 0.3 }}
              >
                <Heart fill="red" stroke="none" />
              </motion.div>
            ) : (
              <Heart />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* 💧 Wave overlay */}
      <AnimatePresence>
        {waveActive && (
          <motion.div
            className="wave-overlay"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* 🏷️ Badges */}
      {product.countInStock === 0 && (
        <span className="badge out-of-stock">
          {t("Out of Stock", "غير متوفر")}
        </span>
      )}
      {product.countInStock > 0 && (
        <span className="badge in-stock">{t("In Stock", "متوفر")}</span>
      )}
      {product.discountPrice > 0 && (
        <span className="badge offer">
          {Math.round((product.discountPrice / product.price) * 100)}%{" "}
          {t("Off", "تخفيض")}
        </span>
      )}

      {/* 🖼️ Image */}
      <div className="gr-image-wrapper">
        <OptimizeImage
          src={product.images?.[0]}
          alt={product.name}
          className="gr-image"
        />
      </div>

      {/* 🧾 Info */}
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-brand">
          <span>{product.brand}</span>
          <StarsRow rating={product.rating || 0} />
        </p>
        <div className="product-price">
          {product.discountPrice > 0 ? (
            <>
              <span
                className="original-price"
                style={{ textDecoration: "line-through" }}
              >
                {product.price?.toLocaleString()} IQD
              </span>
              <span className="final-price" style={{ fontWeight: "bold" }}>
                {product.finalPrice?.toLocaleString()} IQD
              </span>
            </>
          ) : (
            <span className="final-price">
              {product.finalPrice?.toLocaleString()} IQD
            </span>
          )}
        </div>
      </div>

      {/* 🧩 Overlay Buttons */}
      <AnimatePresence>
        {overlayActive && (
          <motion.div
            className="card-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/product/${id}`);
              }}
            >
              {t("View Product", "الذهاب إلى المنتج")}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(product);
              }}
            >
              {t("Add To Cart", "أضف إلى السلة")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductGrid;
