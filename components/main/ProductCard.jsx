// src/components/ProductCard.jsx
import React from "react";
import OptimizeImage from "../hooks/OptimizeImage.jsx";
import { useNavigate } from "react-router-dom";
import useCartStore from "../stores/useCartStore.jsx";
import useAuthStore from "../stores/useAuthStore.jsx";
import useFavoritesStore from "../stores/useFavoritesStore.jsx";

import { toast } from "react-toastify";
import { Heart } from "lucide-react";

const ProductCard = ({product}) => {

  //Id Normalization
  const id = product.id || product._id

  //Stores
  const addToCart = useCartStore((state) => state.addToCart);
  const token = useAuthStore.getState().token;
  
  const navigate = useNavigate();
  const handleAddToCart = (product) => { if (product.countInStock <= 0) return toast.error("Out of stock"); addToCart(product, 1, token); };

  //Favorites
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const favorite = isFavorite(product.id || product._id);

  return (
    <div className="pc-pr-card" onClick={() => navigate(`/product/${id}`)}>
      
      {/* Badges */}
      {product.countInStock === 0 && <span className="badge out-of-stock">Out of Stock</span>}
      {product.countInStock > 0 && <span className="badge in-stock">In Stock</span>}
      {product.discountPrice > 0 && (
        <span className="badge offer">
          {Math.round((product.discountPrice / product.price) * 100)}% OFF
        </span>
      )}

      {/* Image */}
      <div className="pc-image-wrapper">
        <OptimizeImage src={product.images?.[0]} alt={product.name} className="pc-pr-image" />
      </div>

      {/* Details */}
      <div className="pc-pr-details">
        <p>{product.brand}</p>
        <h2 className="pr-name">{product.name}</h2>
        <p className="pr-price">
          {product.discountPrice > 0 ? 
          <>
         <span style={{textDecoration:"line-through"}}>{product.price.toLocaleString()} IQD</span> 
         <span style={{fontWeight: "bold"}}>{product.finalPrice.toLocaleString()} IQD</span>
         </>
         : <span>{product.finalPrice.toLocaleString()} IQD</span>
          }
         
        </p>
      </div>

      {/* Add to Cart */}
      <div className="add-to-cart">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart(product);
          }}
        >
          Add to Cart
        </button>
      </div>

      <div className="heart-btn" onClick={(e) => {e.stopPropagation(); toggleFavorite(product)}}>
      { favorite ? <Heart fill="red" stroke="none" size={18}/> : <Heart size={18} />}
      </div>
    </div>
  );
};

export default ProductCard;
