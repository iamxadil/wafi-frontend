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
import { Card, Button, Rate, Divider, Carousel } from "antd";
import { Cpu, Gpu, Monitor, Palette, MemoryStick , Ruler, MousePointer, HardDriveDownload} from "lucide-react";
import { Spin } from "antd";

const keywordIcons = {
  GPU: <Gpu/>,
  CPU: <Cpu/>,
  Display: <Monitor/>,
  STORAGE: <HardDriveDownload />,
  Color: <Palette />,
  RAM: <MemoryStick/>,
  Size: <Ruler />,
  Sensitivity: <MousePointer/>,
};


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

  if (!selectedProduct) return <Spin fullscreen/>;

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
  ? selectedProduct.description
      // Normalize newlines
      .replace(/\r\n|\r/g, "\n")
      // Split on ". " but keep the dot at the end of each sentence
      .split(/(?<=\.) +/)
      // Trim whitespace
      .map(line => line.trim())
      // Remove empty lines
      .filter(Boolean)
      // Add bullets and optional icons
      .map(line => {
        const matchedKeyword = Object.keys(keywordIcons).find(keyword =>
          line.toLowerCase().startsWith(keyword.toLowerCase())
        );

        const bullet = line.match(/^[•\-–—]/) ? "" : "• ";

        return matchedKeyword
          ? (
            <span key={line} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {keywordIcons[matchedKeyword]} {line}
            </span>
          )
          : bullet + line;
      })
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
  <div className="dt-container" style={{ padding: "2rem" }}>
    <Card
      variant="outlined"
      styles={{ body: { padding: 0 } }}
      style={{
        width: "100%",
        borderRadius: 12,
        background: "transparent",
        boxShadow: "none",
        padding: "0 2rem"
      }}
    >
      {/* Image Carousel */}
      <div style={{ position: "relative" }}>
        <Carousel
          dots={{ className: "carousel-dots" }}
          autoplay={false}
          style={{ borderRadius: 8, overflow: "hidden" }}
        >
          {selectedProduct.images.map((img, index) => (
            <div key={index}>
              <img
                src={img}
                alt={`${selectedProduct.name}-${index}`}
                style={{
                  width: "100%",
                  height: 250,
                  objectFit: "contain"
                }}
              />
            </div>
          ))}
        </Carousel>
        <Button
          shape="circle"
          icon={<FiShare2 />}
          onClick={handleShare}
          style={{
            position: "absolute",
            top: 10,
            right: -20,
            border: "1px solid var(--text)",
            color: "var(--text)",
            background: "transparent",
            zIndex: 10
          }}
        />
      </div>

      {/* Product Info */}
      <div style={{ marginTop: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, }}>
          {selectedProduct.brand &&
            React.createElement(brandIcons[selectedProduct.brand] || SiAsus, {
              size: 25,
              color: "var(--text)"
            })}
          <span style={{ color: "var(--secondary-text-clr)", fontSize: 14 }}>
            {selectedProduct.countInStock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        <h2 style={{ marginBottom: 12, color: "var(--text)" }}>{selectedProduct.name}</h2>

        <Rate
          value={Math.round(avgRating)}
          disabled
          style={{ color: "var(--accent-clr)" }}
          character={({ index }) => (
            <span style={{ color: index < Math.round(avgRating) ? "var(--accent-clr)" : "var(--line-clr)" }}>★</span>
          )}
        />

        {selectedProduct.reviews?.length > 0 && (
          <span style={{ fontSize: 12, color: "var(--line-clr)" }}>
            ({selectedProduct.reviews.length} reviews)
          </span>
        )}

        <Divider style={{ borderColor: "var(--line-clr)" }} />

        {/* Price */}
        <div style={{ marginBottom: "1rem" }}>
          {selectedProduct.discountPrice > 0 ? (
            <>
              <span style={{ textDecoration: "line-through", color: "var(--secondary-text-clr)", marginRight: 8 }}>
                {selectedProduct.price.toLocaleString()} IQD
              </span>
              <span style={{ fontWeight: "bold", fontSize: "1.2rem", color: "var(--accent-clr)" }}>
                {getFinalPrice(selectedProduct).toLocaleString()} IQD
              </span>
            </>
          ) : (
            <span style={{ fontWeight: "bold", fontSize: "1.2rem", color: "var(--text)" }}>
              {selectedProduct.price.toLocaleString()} IQD
            </span>
          )}
        </div>

        {/* Quantity Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1rem" }}>
          <Button
            size="small"
            type="text"
            style={{
              color: "var(--text)",
              border: "1px solid var(--accent-clr)",
              borderRadius: 6
            }}
            onClick={() => setQty(prev => Math.max(prev - 1, 1))}
          >
            <Minus />
          </Button>
          <span style={{ minWidth: 30, textAlign: "center", color: "var(--text)" }}>
            {selectedProduct.countInStock === 0 ? 0 : qty}
          </span>
          <Button
            size="small"
            type="text"
            style={{
              color: "var(--text)",
              border: "1px solid var(--accent-clr)",
              borderRadius: 6
            }}
            onClick={() => setQty(prev => Math.min(prev + 1, selectedProduct.countInStock))}
          >
            <Plus />
          </Button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <Button
            type="default"
            style={{
              flex: 1,
              color: "var(--text)",
              border: "1px solid var(--accent-clr)",
              borderRadius: 8,
              fontWeight: 600,
              background: "transparent",
              transition: "all 0.3s"
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--accent-clr)22")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
          <Button
            type="default"
            style={{
              flex: 1,
              color: "var(--text)",
              border: "1px solid #ff4d4f",
              borderRadius: 8,
              fontWeight: 600,
              background: "transparent",
              transition: "all 0.3s"
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#ff4d4f33")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            onClick={handleBuyNow}
          >
            Buy Now
          </Button>
        </div>
      </div>
    </Card>
  </div>
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
            {descriptionLines.map((line, index) => (
              <li key={index}>
                {line}
              </li>
            ))}
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
                    <span>{review.name}</span>
                    <span className="comment-rating">
                      {[1,2,3,4,5].map(i => (
                        <span key={i} className="star-icon" style={{ color: i <= review.rating ? "#f5b50a" : "#d0d0d0" }}>★</span>
                      ))}
                    </span>
                  </p>

                <p className="comment-text">
                  {review.comment}
                  <span className="comment-date">{new Date(review.updatedAt || review.createdAt).toLocaleDateString()}</span>
                </p>
                
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
