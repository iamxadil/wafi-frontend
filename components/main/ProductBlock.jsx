import React from "react";
import { motion } from "framer-motion";
import { Heart, Star, Plus } from "lucide-react";
import OptimizeImage from "../hooks/OptimizeImage.jsx";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore.jsx";
import useCartStore from "../stores/useCartStore.jsx";
import useFavoritesStore from "../stores/useFavoritesStore.jsx";
import { toast } from "react-toastify";
import useTranslate from "../hooks/useTranslate.jsx";
import "../../styles/productblock.css";

/* ============================================================
   💎 ProductBlock — WAFI Essence x Motion Edition
============================================================ */
const ProductBlock = ({ product }) => {
  const t = useTranslate();
  const navigate = useNavigate();
  const id = product._id || product.id;

  const addToCart = useCartStore((s) => s.addToCart);
  const token = useAuthStore.getState().token;
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const favorite = isFavorite(id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (product.countInStock <= 0)
      return toast.error(t("Out of stock", "غير متوفر"));
    addToCart(product, 1, token);
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    toggleFavorite(product);
  };

  const handleView = () => navigate(`/product/${id}`);

  /* === Rating Stars === */
  const StarsRow = ({ rating = 0 }) => (
    <span className="essence-stars">
      {[...Array(5)].map((_, i) => {
        const diff = rating - i;
        const fill = diff >= 1 ? "full" : diff >= 0.25 ? "half" : "empty";
        return (
          <span key={i} className="essence-star">
            <Star size={12} className="star-empty" />
            {fill !== "empty" && (
              <Star
                size={12}
                className={fill === "full" ? "star-full" : "star-half"}
              />
            )}
          </span>
        );
      })}
    </span>
  );

  return (
    <motion.div
      className="essence-card motion-card"
      onClick={handleView}
      whileTap={{ scale: 0.97 }}
      layout
    >
      {/* === IMAGE === */}
      <motion.div className="essence-img-wrap" layoutId={`img-${id}`}>
        <OptimizeImage
          src={product.images?.[0]}
          alt={product.name}
          className="essence-img"
        />
        
        <div className="essence-status">
        {product.discountPrice > 0 && (
          <motion.span
            className="essence-offer"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
             {Math.round((product.discountPrice / product.price) * 100)}% 
          </motion.span>
        )}

        {product.countInStock <= 0 && (
          <motion.span
            className="essence-out-of-stock"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {t("Out of Stock", "غير متوفر")}
          </motion.span>
        )}

        {product.countInStock > 0 && (
          <motion.span
            className="essence-in-stock"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {t("In Stock", "متوفر")}
          </motion.span>
        )}
        </div>
        
        <motion.button
          className={`essence-fav ${favorite ? "active" : ""}`}
          onClick={handleFavorite}
          aria-label="Favorite"
          whileTap={{ scale: 0.8 }}
          transition={{ duration: 0.15 }}
        >
          <Heart size={16} />
        </motion.button>

        {/* soft glass aura */}
        <div className="essence-glow" />
      </motion.div>

      {/* === INFO === */}
      <motion.div
        className="essence-info"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="essence-brand">{product.brand}</p>
        <StarsRow rating={product.rating || 0} />

        <h3 className="essence-name">{product.name}</h3>

        <div className="essence-bottom">
          <div className="essence-prices">
            {product.discountPrice > 0 ? (
              <>
                <span className="essence-original">
                  {product.price?.toLocaleString()} IQD
                </span>
                <span className="essence-final">
                  {product.finalPrice?.toLocaleString()} IQD
                </span>
              </>
            ) : (
              <span className="essence-final">
                {product.finalPrice?.toLocaleString()} IQD
              </span>
            )}
          </div>

          <motion.button
            className="essence-cart"
            onClick={handleAddToCart}
            aria-label="Add to cart"
            whileTap={{ scale: 0.85 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Plus size={18} />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductBlock;
