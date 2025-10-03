import '../styles/productdetails.css';
import { SiAsus, SiApple, SiLenovo, SiHp, SiAcer, SiLogitech, SiRazer } from "react-icons/si";
import { FiChevronDown, FiShare2, FiTrash2 } from "react-icons/fi";
import { TiPlus as Plus, TiMinus as Minus } from "react-icons/ti";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useProductStore from "../components/stores/useProductStore.jsx";
import useCartStore from "../components/stores/useCartStore.jsx";
import useAuthStore from "../components/stores/useAuthStore.jsx";
import { toast } from "react-toastify";
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";



const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const width = useWindowWidth();

  const fetchProduct = useProductStore(state => state.fetchProduct);
  const addReview = useProductStore(state => state.addReview);
  const deleteReview = useProductStore(state => state.deleteReview);
  const selectedProduct = useProductStore(state => state.selectedProduct);
  const reviewLoading = useProductStore(state => state.reviewLoading);

  const addToCart = useCartStore(state => state.addToCart);
  const clearCart = useCartStore(state => state.clearCart);
  const user = useAuthStore(state => state.user);

  const [qty, setQty] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [fade, setFade] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");

  useEffect(() => { if (id) fetchProduct(id); }, [id]);
  useEffect(() => {
    if (selectedProduct && selectedProduct.images?.length > 0) setMainImage(selectedProduct.images[0]);
  }, [selectedProduct]);

  if (!selectedProduct) return <p>Loading product...</p>;

  const brandIcons = {
    Asus: SiAsus, Apple: SiApple, Lenovo: SiLenovo,
    HP: SiHp, Acer: SiAcer, Logitech: SiLogitech, Razer: SiRazer
  };

  const handleThumbnailClick = (img) => {
    if (img === mainImage) return;
    setFade(true);
    setTimeout(() => { setMainImage(img); setFade(false); }, 200);
  };

  const getFinalPrice = (product) => product.discountPrice > 0
    ? product.price - product.discountPrice
    : product.price;

  const handleAddToCart = () => {
    addToCart({
      ...selectedProduct,
      originalPrice: selectedProduct.price,
      discountPrice: selectedProduct.discountPrice,
      finalPrice: getFinalPrice(selectedProduct)
    }, qty);
  };

  const handleBuyNow = () => {
    clearCart(false);
    handleAddToCart();
    navigate("/cart");
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: selectedProduct.name, text: "Check out this product!", url }); }
      catch (err) { console.error("Share failed", err); }
    } else { navigator.clipboard.writeText(url); alert("Product link copied to clipboard!"); }
  };

  const handleSubmitReview = async () => {
    if (!user) return toast.warning("You must be logged in to post a review");
    const alreadyReviewed = selectedProduct.reviews?.some(r => r.userId === user._id);
    if (alreadyReviewed) return toast.info("You already reviewed this product");
    if (newRating < 1 || newRating > 5) return toast.warning("Select a rating between 1 and 5");
    if (!newComment.trim()) return toast.warning("Comment cannot be empty");

    try {
      await addReview(selectedProduct.id, newRating, newComment);
      setNewRating(0);
      setNewComment("");
      toast.success("Review posted successfully!");
    } catch (err) { toast.error(err.message || "Failed to post review"); }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    await deleteReview(selectedProduct.id, reviewId);
  };

  const descriptionLines = selectedProduct.description
    ? selectedProduct.description.split(/(?<=\.|\?|!)/).map(line => line.trim()).filter(Boolean)
    : [];

  const avgRating = selectedProduct.reviews?.length
    ? selectedProduct.reviews.reduce((acc, r) => acc + r.rating, 0) / selectedProduct.reviews.length
    : 0;



  return (
    <>

    {width > 950 && (
      <div className="dt-container">
        <main id='product-card'>
          <div className="dt-brand">{selectedProduct.brand && React.createElement(brandIcons[selectedProduct.brand] || SiAsus)}</div>

          <section className='pr-img-container'>
            <div className="image-wrapper">
              <div className="image-overlay"><FiShare2 className="share-icon" onClick={handleShare} /></div>
              <div className="main-pr-img">
                <img src={mainImage || null} alt={selectedProduct.name} className={fade ? "fade-out" : "fade-in"} />
              </div>
            </div>
            <div className="thumbnail-row">
              {selectedProduct.images.map((img, i) => (
                <img key={i} src={img} alt={`thumb${i + 1}`} onClick={() => handleThumbnailClick(img)}
                  className={mainImage === img ? "active-thumb" : ""} />
              ))}
            </div>
          </section>

          <section className='pr-details-container'>
            <div className="dt-name">
              <h1>{selectedProduct.name}</h1>
              <p>
                SKU: {selectedProduct.sku || "N/A"} <span>-</span>
                <span>{selectedProduct.countInStock > 0 ? "In Stock" : "Out of Stock"}</span>
                {selectedProduct.reviews?.length > 0 && <span className="reviews">({selectedProduct.reviews.length} reviews)</span>}
              </p>
              <div className="dt-rating">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className="star-icon" style={{ color: i <= Math.round(avgRating) ? "#f5b50a" : "#d0d0d0" }}>★</span>
                ))}
              </div>
            </div>

            <div className="dt-price">
              {selectedProduct.discountPrice > 0 ? (
                <>
                  <span className="original-price">{selectedProduct.price.toLocaleString()} IQD</span>
                  <span className="discounted-price">{getFinalPrice(selectedProduct).toLocaleString()} IQD</span>
                </>
              ) : <span className="regular-price">{selectedProduct.price.toLocaleString()} IQD</span>}
            </div>

            <div className="dt-quantity">
              <button disabled={selectedProduct.countInStock === 0} onClick={() => setQty(prev => Math.max(prev - 1, 1))}><Minus/></button>
              <span>{selectedProduct.countInStock === 0 ? 0 : qty}</span>
              <button disabled={selectedProduct.countInStock === 0} onClick={() => setQty(prev => Math.min(prev + 1, selectedProduct.countInStock))}><Plus/></button>
            </div>

            <div className="dt-buttons">
              <button onClick={handleAddToCart}>Add to Cart</button>
              <button onClick={handleBuyNow}>Buy Now</button>
            </div>
          </section>
        </main>
      </div>)}

      {width < 950 && (
        <h1>Product</h1>
      )}

      {/* Description & Reviews always rendered */}
      <div className="dt-container">
      <div className="pr-description-container">
        <div className="description-header" onClick={() => setExpanded(!expanded)}>
          <h3>Description</h3>
          <FiChevronDown className={`arrow ${expanded ? "rotated" : ""}`} />
        </div>
        <div className={`description-content ${expanded ? "expanded" : "collapsed"}`}>
          <ul className="description-list">
            {descriptionLines.map((line, index) => <li key={index}>{line}</li>)}
          </ul>
        </div>
      </div>
       </div>
              
      <main id='comments-main-container'>
        <div className="pr-comments-container">
          <h3>Customer Reviews </h3>
          {selectedProduct.reviews?.length > 0 ? selectedProduct.reviews.map(review => (
            <div key={review._id} id={`review-${review._id}`} className="comment-box">
              <div className="comment-avatar">{review.name[0]}</div>
              <div className="comment-content">
                <p className="comment-author">
                    {review.name}
                    {review.role && (review.role === "admin" || review.role === "moderator") && (
                      <span className={`role-badge ${review.role}`}>{review.role}</span>
                    )}
                    <span className="comment-rating">
                      {[1,2,3,4,5].map(i => (
                        <span key={i} className="star-icon" style={{ color: i <= review.rating ? "#f5b50a" : "#d0d0d0" }}>★</span>
                      ))}
                    </span>
                  </p>
                <p className="comment-text">{review.comment}</p>
                <span className="comment-date">{new Date(review.updatedAt || review.createdAt).toLocaleDateString()}</span>
              </div>
              {(user && (user._id === review.userId || user.role === "admin")) && (
                <FiTrash2 className="delete-icon" onClick={() => handleDeleteReview(review._id)} />
              )}
            </div>
          )) : <p>No reviews yet.</p>}

          {user ? (
            <div className="add-comment-box">
              <div className="avatar-container">
                  <div className="avatar-placeholder">{user.name[0]}</div>
                  <div className="rating-input">
                  {[1,2,3,4,5].map(star => (
                    <span key={star} className={`star ${star <= newRating ? "selected" : ""}`} onClick={() => setNewRating(star)}>★</span>
                  ))}
                </div>
              </div>
            
              <div className="input-area">
                <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write your comment..." rows="3" />
                <button className="post-btn" onClick={handleSubmitReview} disabled={reviewLoading}>Post Review</button>
              </div>
            </div>
          ) : <p>Please <span className="login-link" onClick={() => navigate("/signin")}>login</span> to post a review.</p>}
        </div>
      </main>
    </>
  );
};

export default ProductDetails;
