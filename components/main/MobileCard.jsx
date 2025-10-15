import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { IoAdd as Add } from "react-icons/io5";
import OptimizeImage from "../hooks/OptimizeImage.jsx";
import { useNavigate } from "react-router-dom";
import useCartStore from "../stores/useCartStore.jsx";
import useAuthStore from "../stores/useAuthStore.jsx";
import useFavoritesStore from "../stores/useFavoritesStore.jsx";
import { toast } from "react-toastify";

const MobileCard = ({ product, customDelay = 0 }) => {

  const id = product.id || product._id;
  const navigate = useNavigate();

  //Cart
  const addToCart = useCartStore((state) => state.addToCart);
  const token = useAuthStore.getState().token;


   //Favorites
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const favorite = isFavorite(product.id || product._id);

  const handleAddToCart = (p) => {
    if (p.countInStock <= 0) return toast.error("Out of stock");
    addToCart(p, 1, token);
  };

  return (
    <motion.div
      className="mob-pr-card"
      initial={{ opacity: 0, x: 0, filter: "blur(6px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, x: 0, filter: "blur(4px)" }}
      transition={{
        duration: 0.6,
        ease: [0.42, 0, 0.58, 1],
        delay: customDelay,
      }}
      onClick={() => navigate(`/product/${id}`)}
    >
      {/* Badges */}
      {product.countInStock === 0 && <span className="badge out-of-stock">Out of Stock</span>}
      {product.countInStock > 0 && <span className="badge in-stock">In Stock</span>}
      {product.discountPrice > 0 && (
        <span className="badge offer">
          {Math.round((product.discountPrice / product.price) * 100)}% OFF
        </span>
      )}

      {/* Image */}
      <div className="mob-pr-image">
        <OptimizeImage src={product.images?.[0]} alt={product.name} className="mob-pr-image" />
      </div>

      {/* Details */}
      <div className="mob-pr-details">
        <p>{product.brand}</p>
        <h2>{product.name}</h2>
        <p>{(product.price - (product.discountPrice || 0)).toLocaleString()} IQD</p>
      </div>

      {/* Action Buttons */}
      <div className="mob-pr-buttons">
        <button onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}><Add /></button>
        <button onClick={(e) => {e.stopPropagation(); toggleFavorite(product)}}>
         { favorite ? <Heart fill="red" stroke="none" size={16}/> : <Heart  size={16}/>}
        </button>
      </div>
    </motion.div>
  );
};

export default MobileCard;
