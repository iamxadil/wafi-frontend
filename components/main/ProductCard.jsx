import React from "react";
import { motion } from "framer-motion";
import OptimizeImage from "../hooks/OptimizeImage.jsx";
import { useNavigate } from "react-router-dom";
import useCartStore from "../stores/useCartStore.jsx";
import useAuthStore from "../stores/useAuthStore.jsx";
import useFavoritesStore from "../stores/useFavoritesStore.jsx";
import { toast } from "react-toastify";
import { Heart } from "lucide-react";

const ProductCard = ({ product }) => {
  const id = product.id || product._id;

  // Stores
  const addToCart = useCartStore((state) => state.addToCart);
  const token = useAuthStore.getState().token;
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    if (product.countInStock <= 0) return toast.error("Out of stock");
    addToCart(product, 1, token);
  };

  // Favorites
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const favorite = isFavorite(product.id || product._id);

  // Final Price
  const finalPrice = Number(
    product.finalPrice ?? (product.price ?? 0) - (product.discountPrice ?? 0)
  );

  return (
    <motion.div
      className="pc-pr-card"
      onClick={() => navigate(`/product/${id}`)}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 18,
        duration: 0.25,
      }}
    >
      {/* Badges */}
      {product.countInStock === 0 && (
        <motion.span
          className="badge out-of-stock"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          Out of Stock
        </motion.span>
      )}
      {product.countInStock > 0 && (
        <motion.span
          className="badge in-stock"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          In Stock
        </motion.span>
      )}
      {product.discountPrice > 0 && (
        <motion.span
          className="badge offer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
        >
          {Math.round((product.discountPrice / product.price) * 100)}% OFF
        </motion.span>
      )}

      {/* Image */}
      <motion.div
        className="pc-image-wrapper"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 150, damping: 12 }}
      >
        <OptimizeImage
          src={product.images?.[0]}
          alt={product.name}
          className="pc-pr-image"
        />
      </motion.div>

      {/* Details */}
      <div className="pc-pr-details">
        <p>{product.brand}</p>
        <h2 className="pr-name">{product.name}</h2>
        <p className="pr-price">
          {product.discountPrice > 0 ? (
            <>
              <span style={{ textDecoration: "line-through", opacity: 0.7 }}>
                {product.price.toLocaleString()} IQD
              </span>
              <motion.span
                style={{ fontWeight: "bold", marginLeft: "6px" }}
                animate={{ color: "#007bff" }}
                transition={{ duration: 0.3 }}
              >
                {product.finalPrice.toLocaleString()} IQD
              </motion.span>
            </>
          ) : (
            <span>{finalPrice.toLocaleString()} IQD</span>
          )}
        </p>
      </div>

      {/* Add to Cart */}
      <motion.div
        className="add-to-cart"
        whileTap={{ scale: 0.95 }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart(product);
          }}
         
        >
          Add to Cart
        </button>
      </motion.div>

      {/* Favorite Button */}
      <motion.div
        className="heart-btn"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(product);
        }}
      >
        {favorite ? (
          <Heart fill="red" stroke="none" size={18} />
        ) : (
          <Heart size={18} />
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProductCard;
