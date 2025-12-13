import React from "react";
import OptimizeImage from "../hooks/OptimizeImage.jsx";
import { useNavigate } from "react-router-dom";
import useCartStore from "../stores/useCartStore.jsx";
import useAuthStore from "../stores/useAuthStore.jsx";
import useFavoritesStore from "../stores/useFavoritesStore.jsx";
import { toast } from "react-toastify";
import { Heart } from "lucide-react";
import useTranslate from "../hooks/useTranslate.jsx";
import "../../styles/prdcard.css";

const ProductCard = ({ product }) => {
  const id = product.id || product._id;
  const addToCart = useCartStore((s) => s.addToCart);
  const token = useAuthStore.getState().token;
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const favorite = isFavorite(id);
  const navigate = useNavigate();
  const t = useTranslate();

  const handleAddToCart = (p) => {
    if (p.countInStock <= 0) return toast.error(t("Out of stock", "غير متوفر"));
    addToCart(p, 1, token);
  };

  const finalPrice = Number(
    product.finalPrice ?? (product.price ?? 0) - (product.discountPrice ?? 0)
  );

  return (
    <div
      className="prd-card"
      onClick={() => navigate(`/product/${id}`)}
    >
      {/* 🏷️ Badges */}
      {product.countInStock === 0 && (
        <span className="prd-badge out">{t("Out of Stock", "غير متوفر")}</span>
      )}
      {product.countInStock > 0 && (
        <span className="prd-badge in">{t("In Stock", "متوفر")}</span>
      )}
      {product.discountPrice > 0 && (
        <span className="prd-badge offer">
          {Math.round((product.discountPrice / product.price) * 100)}%{" "}
          {t("Off", "تخفيض")}
        </span>
      )}

      {/* 🖼️ Image */}
      <div className="prd-img-wrap">
        <OptimizeImage
          src={product.images?.[0]}
          aspectRatio={1}
          widths={[300, 500]}
          quality={60}
          alt={product.name}
          className="prd-img"
        />
      </div>

      {/* 📦 Details */}
      <div className="prd-details">
        <p className="prd-brand">{product.brand}</p>
        <h2 className="prd-name">{product.name}</h2>
        <p className="prd-price">
          {product.discountPrice > 0 ? (
            <>
              <span className="prd-old">
                {product.price.toLocaleString()} IQD
              </span>
              <span className="prd-new">
                {product.finalPrice.toLocaleString()} IQD
              </span>
            </>
          ) : (
            <span className="prd-new">{finalPrice.toLocaleString()} IQD</span>
          )}
        </p>
      </div>

      {/* 🛒 Add to Cart */}
      <div className="prd-cart">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart(product);
          }}
        >
          {t("Add To Cart", "اضف إلى السلة")}
        </button>
      </div>

      {/* ❤️ Favorite */}
      <div
        className="prd-heart"
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
      </div>
    </div>
  );
};

export default ProductCard;
