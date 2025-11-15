import "../styles/productdetails.css";
import { useRef } from "react";
import {
  SiAsus,
  SiApple,
  SiLenovo,
  SiHp,
  SiAcer,
  SiLogitech,
  SiRazer,
  SiRedragon,
  SiMsibusiness as SiMsi,
} from "react-icons/si";

import { FiChevronDown, FiShare2, FiTrash2 } from "react-icons/fi";
import { TiPlus as Plus, TiMinus as Minus } from "react-icons/ti";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Rate, Divider, Carousel, Spin } from "antd";
import {
  Cpu,
  Gpu,
  Monitor,
  Palette,
  MemoryStick,
  Ruler,
  MousePointer,
  HardDriveDownload,
  Brackets,
  Battery,
  ShieldCheck,
  Fingerprint,
  PenTool,
  PaletteIcon,
  Usb,
  Expand,
  CalendarCheck2,
  Disc3,
  ScanFace,
  MonitorSmartphone,
  PackagePlus,
} from "lucide-react";

import { toast } from "react-toastify";
import useProductStore from "../components/stores/useProductStore.jsx";
import useCartStore from "../components/stores/useCartStore.jsx";
import useAuthStore from "../components/stores/useAuthStore.jsx";
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";
import useTranslate from "../components/hooks/useTranslate.jsx";

const keywordIcons = {
  GPU: <Gpu />,
  CPU: <Cpu />,
  DISPLAY: <Monitor />,
  SCREENSIZE: <Monitor />,
  STORAGE: <HardDriveDownload />,
  RAM: <MemoryStick />,
  COLOR: <Palette />,
  SIZE: <Ruler />,
  BATTERY: <Battery />,
  WEIGHT: <Ruler />,
  WARRANTY: <ShieldCheck />,
  TOUCHSCREEN: <MonitorSmartphone />,
  FINGERPRINT: <Fingerprint />,
  FACEID: <ScanFace />,
  PEN: <PenTool />,
  COLOROPTIONS: <PaletteIcon />,
  PORTS: <Usb />,
  RESOLUTION: <Expand />,
  RELEASEYEAR: <CalendarCheck2 />,
  OS: <Disc3 />,
  ACCESSORIES: <PackagePlus />,
};

const keywordLabels = {
  CPU: { en: "CPU", ar: "المعالج" },
  GPU: { en: "GPU", ar: "بطاقة الرسومات" },
  DISPLAY: { en: "Display", ar: "الشاشة" },
  SCREENSIZE: { en: "Screen Size", ar: "حجم الشاشة" },
  STORAGE: { en: "Storage", ar: "التخزين" },
  RAM: { en: "RAM", ar: "الذاكرة" },
  COLOR: { en: "Color", ar: "اللون" },
  COLOROPTIONS: { en: "Color Options", ar: "خيارات الألوان" },
  SIZE: { en: "Size", ar: "الحجم" },
  WEIGHT: { en: "Weight", ar: "الوزن" },
  BATTERY: { en: "Battery", ar: "البطارية" },
  OS: { en: "Operating System", ar: "نظام التشغيل" },
  WARRANTY: { en: "Warranty", ar: "الضمان" },
  TOUCHSCREEN: { en: "Touchscreen", ar: "شاشة اللمس" },
  FINGERPRINT: { en: "Fingerprint Sensor", ar: "مستشعر البصمة" },
  FACEID: { en: "Face ID", ar: "التعرف على الوجه" },
  PEN: { en: "Stylus / Pen Support", ar: "دعم القلم" },
  PORTS: { en: "Ports", ar: "المنافذ" },
  RESOLUTION: { en: "Resolution", ar: "الدقة" },
  RELEASEYEAR: { en: "Release Year", ar: "سنة الإصدار" },
  ACCESSORIES: { en: "Accessories", ar: "الاكسسوارات" },
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const width = useWindowWidth();
  const t = useTranslate();
  const fetchProduct = useProductStore((s) => s.fetchProduct);
  const addReview = useProductStore((s) => s.addReview);
  const deleteReview = useProductStore((s) => s.deleteReview);
  const selectedProduct = useProductStore((s) => s.selectedProduct);
  const reviewLoading = useProductStore((s) => s.reviewLoading);
  const addToCart = useCartStore((s) => s.addToCart);
  const clearCart = useCartStore((s) => s.clearCart);
  const user = useAuthStore((s) => s.user);
  const [qty, setQty] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [fade, setFade] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const imgRef = React.useRef(null);
  const [zoom, setZoom] = useState(false);
  const [touchZoom, setTouchZoom] = useState(false);
  const [touchPosition, setTouchPosition] = useState({ x: 50, y: 50 });
  const lastTapRef = useRef(0);

  useEffect(() => {
    if (id) fetchProduct(id);
  }, [id]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0)
      setMainImage(selectedProduct.images[0]);
  }, [selectedProduct]);

  if (!selectedProduct) return <Spin fullscreen />;

  const brandIcons = {
    Asus: SiAsus,
    Apple: SiApple,
    Lenovo: SiLenovo,
    HP: SiHp,
    Acer: SiAcer,
    Logitech: SiLogitech,
    Razer: SiRazer,
    MSI: SiMsi,
    Redragon: SiRedragon,
  };

  const getFinalPrice = (p) =>
    p.discountPrice > 0 ? p.price - p.discountPrice : p.price;

  const handleThumbnailClick = (img) => {
    if (img === mainImage) return;

    setFade(true);

    setTimeout(() => {
      setMainImage(img);

      setFade(false);
    }, 200);
  };

  const handleAddToCart = () => {
    addToCart(
      {
        ...selectedProduct,
        originalPrice: selectedProduct.price,
        discountPrice: selectedProduct.discountPrice,
        finalPrice: getFinalPrice(selectedProduct),
      }, qty);
  };

  const handleBuyNow = () => {
    clearCart(false);
    handleAddToCart();
    navigate("/cart");
  };

const handleShare = async () => {
  const shareUrl = `${window.location.origin}/product/${id}/preview`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: selectedProduct.name,
        text: "Check out this product!",
        url: shareUrl,
      });
    } catch (err) {
      console.error("Share failed", err);
    }
  } else {
    navigator.clipboard.writeText(shareUrl);
    alert("Product link copied to clipboard!");
  }
};


  const handleMagnify = (e) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = ((e.pageX - rect.left) / rect.width) * 100;
    const y = ((e.pageY - rect.top) / rect.height) * 100;
    setZoom(true);
    container.style.backgroundPosition = `${x}% ${y}%`;
  };

  const handleDoubleTap = (e) => {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastTapRef.current;
    if (timeDiff < 300 && timeDiff > 0) {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      const touch = e.changedTouches[0];
      const x = ((touch.pageX - rect.left) / rect.width) * 100;
      const y = ((touch.pageY - rect.top) / rect.height) * 100;
      // toggle zoom
      if (touchZoom) {
        setTouchZoom(false);
      } else {
        setTouchZoom(true);
        setTouchPosition({ x, y });
      }
    }

    lastTapRef.current = currentTime;
  };

  const handleTouchMove = (e) => {
    if (!touchZoom || e.touches.length !== 1) return;
    e.stopPropagation();

    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();

    // Calculate normalized position (0 → 1)
    const x = (touch.pageX - rect.left) / rect.width;
    const y = (touch.pageY - rect.top) / rect.height;

    // Flip horizontally and vertically for natural feel
    const newX = 100 - x * 100;
    const newY = 100 - y * 100;

    setTouchPosition({ x: newX, y: newY });
  };

  const handleSubmitReview = async () => {
    if (!user)
      return toast.warning(
        t(
          "You must be logged in to post a review",
          "يجب تسجيل الدخول لإضافة مراجعة"
        )
      );

    const alreadyReviewed = selectedProduct.reviews?.some(
      (r) => r.userId === user._id
    );

    if (alreadyReviewed)
      return toast.info(
        t(
          "You already reviewed this product",
          "لقد قمت بمراجعة هذا المنتج مسبقًا"
        )
      );

    if (newRating < 1 || newRating > 5)
      return toast.warning(
        t("Select a rating between 1 and 5", "اختر تقييماً بين 1 و 5")
      );

    if (!newComment.trim())
      return toast.warning(
        t("Comment cannot be empty", "لا يمكن ترك التعليق فارغاً")
      );

    try {
      await addReview(selectedProduct.id, newRating, newComment);
      setNewRating(0);
      setNewComment("");
      toast.success(t("Review posted successfully!", "تم نشر المراجعة بنجاح"));
    } catch (err) {
      toast.error(err.message || "Failed to post review");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (
      !window.confirm(
        t(
          "Are you sure you want to delete this review?",
          "هل أنت متأكد أنك تريد حذف هذه المراجعة؟"
        )
      )
    )
      return;
    await deleteReview(selectedProduct.id, reviewId);
  };

  // === Build formatted specs list ===
  const specOrder = [
    "cpu",
    "ram",
    "storage",
    "gpu",
    "screenSize",
    "resolution",
    "os",
    "battery",
    "weight",
    "ports",
    "releaseYear",
    "warranty",
    "colorOptions",
    "touchscreen",
    "fingerPrint",
    "faceId",
    "accessories",
  ];

  const specsList = specOrder
    .map((key) => {
      const value = selectedProduct.specs?.[key];

      // ✅ Skip all "empty" cases:
      if (
        value === null ||
        value === undefined ||
        value === "" ||
        value === "0" ||
        value === 0 ||
        value === false ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return null;
      }

      const label = t(
        keywordLabels[key.toUpperCase()]?.en || key,
        keywordLabels[key.toUpperCase()]?.ar || key
      );
      const icon = keywordIcons[key.toUpperCase()] || <Brackets />;

      let formattedValue = value;
      if (Array.isArray(value)) formattedValue = value.join(", ");
      else if (typeof value === "boolean") {
        formattedValue = value
          ? t("Included", "متوفر")
          : t("Not Included", "غير متوفر");
      }

      return (
        <li key={key} className="spec-line" style={{ textAlign: t.flexAlign, flexDirection: t.rowReverse,alignItems: t.flexAlign}} >
          <span className="spec-div" style={{ flexDirection: t.rowReverse }}>
            <span className="spec-icon">{icon}</span>
            <span className="spec-key" style={{ justifyContent: t.flexAlign }}>
              {label}{" "}
            </span>
          </span>

          <span className="spec-value">{formattedValue}</span>
        </li>
      );
    })
    .filter(Boolean);

  const descriptionLines = selectedProduct.description
    ? selectedProduct.description

        .replace(/\r\n|\r/g, "\n")

        .split(/(?<=\.) +/)

        .map((l) => l.trim())

        .filter(Boolean)

        .map((line) => {
          const matchedKeyword = Object.keys(keywordIcons).find((keyword) =>
            line.toLowerCase().startsWith(keyword.toLowerCase())
          );

          return (
            <li key={line} className="desc-line">
              {matchedKeyword && (
                <span className="desc-icon">
                  {keywordIcons[matchedKeyword]}
                </span>
              )}

              <span>{line}</span>
            </li>
          );
        })
    : [];

  const avgRating = selectedProduct.reviews?.length
    ? selectedProduct.reviews.reduce((acc, r) => acc + r.rating, 0) /
      selectedProduct.reviews.length
    : 0;

  return (
    <>
      {/* Desktop */}

      {width > 950 && (
        <div className="dt-container">
          <main id="product-card">
            <div className="dt-brand">
              {selectedProduct.brand &&
                React.createElement(
                  brandIcons[selectedProduct.brand] || Brackets
                )}
            </div>

            {/* Image & Thumbnails */}

            <section className="pr-img-container">
              <div className="image-wrapper">
                <div className="image-overlay">
                  <FiShare2 className="share-icon" onClick={handleShare} />
                </div>

                <div
                  className="main-pr-img magnifier"
                  onMouseMove={(e) => handleMagnify(e)}
                  onMouseLeave={() => setZoom(false)}
                  style={{
                    backgroundImage: zoom ? `url(${mainImage})` : "none",
                  }}
                >
                  <img
                    ref={imgRef}
                    src={mainImage}
                    alt={selectedProduct.name}
                    className={fade ? "fade-out" : "fade-in"}
                    style={{ minWidth: "350px" }}
                  />
                </div>
              </div>

              <div className="thumbnail-row">
                {selectedProduct.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`thumb${i + 1}`}
                    onClick={() => handleThumbnailClick(img)}
                    className={mainImage === img ? "active-thumb" : ""}
                  />
                ))}
              </div>
            </section>

            {/* Product Details */}

            <section className="pr-details-container">
              <div className="dt-name">
                <h1>{selectedProduct.name}</h1>

                <p>
                  SKU: {selectedProduct.sku || "N/A"} <span>-</span>
                  <span>
                    {selectedProduct.countInStock > 0
                      ? t("In Stock", "متوفر")
                      : t("Out of Stock", "غير متوفر")}
                  </span>
                  {selectedProduct.reviews?.length > 0 && (
                    <span className="reviews">
                      ({selectedProduct.reviews.length}{" "}
                      {t("Reviews", "مراجعات")})
                    </span>
                  )}
                </p>

                <div className="dt-rating">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span
                      key={i}
                      className="star-icon"
                      style={{
                        color:
                          i <= Math.round(avgRating) ? "#f5b50a" : "#d0d0d0",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
                
              <div className="dt-price">
                {selectedProduct.discountPrice > 0 ? (
                  <>
                    <span className="original-price">
                      {selectedProduct.price.toLocaleString()} IQD
                    </span>

                    <span className="discounted-price">
                      {getFinalPrice(selectedProduct).toLocaleString()} IQD
                    </span>
                  </>
                ) : (
                  <span className="regular-price">
                    {selectedProduct.price.toLocaleString()} IQD
                  </span>
                )}
              </div>

              {/* Quantity + Buttons */}

              <div className="dt-quantity">
                <button onClick={() => setQty((p) => Math.max(p - 1, 1))}>
                  <Minus />
                </button>

                <span>{qty}</span>

                <button
                  onClick={() =>
                    setQty((p) => Math.min(p + 1, selectedProduct.countInStock))
                  }
                >
                  <Plus />
                </button>
              </div>

              <div className="dt-buttons">
                <button onClick={handleAddToCart}>
                  {t("Add to Cart", "أضف إلى السلة")}
                </button>

                <button onClick={handleBuyNow}>
                  {t("Buy Now", "اشتري الآن")}
                </button>
              </div>
            </section>
          </main>
        </div>
      )}

      {width < 950 && (
        <div className="dt-container" style={{ padding: "1.5rem" }}>
          <Card
            variant="outlined"
            styles={{ body: { padding: "1rem" } }}
            style={{
              width: "100%",
              borderRadius: 14,
              background: "transparent",
              boxShadow: "none",
            }}
          >
            {/* === Image Section === */}
            <div
              style={{
                position: "relative",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <Carousel
                dots={{ className: "carousel-dots" }}
                autoplay={false}
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                {selectedProduct.images.map((img, index) => (
                  <div key={index}>
                    <div
                      className="mobile-magnifier"
                      onTouchEnd={handleDoubleTap}
                      onTouchMove={handleTouchMove}
                      style={{
                        backgroundImage: touchZoom ? `url(${img})` : "none",
                        backgroundSize: touchZoom ? "300%" : "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: `${touchPosition.x}% ${touchPosition.y}%`,
                        transition:
                          "background-size 0.3s ease, background-position 0.3s ease",
                      }}
                    >
                      <img
                        src={img}
                        alt={`${selectedProduct.name}-${index}`}
                        style={{
                          width: "100%",
                          height: 280,
                          objectFit: "contain",
                          opacity: touchZoom ? 0 : 1,
                          transition: "opacity 0.3s ease",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </Carousel>

              <Button
                shape="circle"
                icon={<FiShare2 />}
                onClick={handleShare}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  border: "1px solid var(--text)",
                  color: "var(--text)",
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(8px)",
                  zIndex: 10,
                }}
              />
            </div>

            {/* === Product Info === */}
            <div style={{ marginTop: "1.2rem" }}>
              {/* Brand + Availability */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {selectedProduct.brand &&
                    React.createElement(
                      brandIcons[selectedProduct.brand] || Brackets,
                      {
                        size: 25,
                        color: "var(--text)",
                      }
                    )}
                  <span
                    style={{ color: "var(--secondary-text-clr)", fontSize: 14 }}
                  >
                    {selectedProduct.countInStock > 0
                      ? t("In Stock", "متوفر")
                      : t("Out of Stock", "غير متوفر")}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--line-clr)",
                  }}
                >
                  SKU: {selectedProduct.sku || "N/A"}
                </span>
              </div>

              {/* Name + Rating */}
              <h2
                style={{
                  marginBottom: 8,
                  color: "var(--text)",
                  fontSize: "1.25rem",
                  lineHeight: 1.4,
                }}
              >
                {selectedProduct.name}
              </h2>

              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Rate
                  value={Math.round(avgRating)}
                  disabled
                  style={{ color: "var(--accent-clr)", fontSize: "1rem" }}
                  character={({ index }) => (
                    <span
                      style={{
                        color:
                          index < Math.round(avgRating)
                            ? "var(--accent-clr)"
                            : "var(--line-clr)",
                      }}
                    >
                      ★
                    </span>
                  )}
                />
                {selectedProduct.reviews?.length > 0 && (
                  <span style={{ fontSize: 13, color: "var(--line-clr)" }}>
                    ({selectedProduct.reviews.length})
                  </span>
                )}
              </div>

              <Divider
                style={{ borderColor: "var(--line-clr)", margin: "1rem 0" }}
              />

              {/* Price */}
              <div style={{ marginBottom: "1.2rem" }}>
                {selectedProduct.discountPrice > 0 ? (
                  <>
                    <span
                      style={{
                        textDecoration: "line-through",
                        color: "var(--secondary-text-clr)",
                        marginRight: 8,
                        fontSize: "0.9rem",
                      }}
                    >
                      {selectedProduct.price.toLocaleString()} IQD
                    </span>
                    <span
                      style={{
                        fontWeight: "bold",
                        fontSize: "1.3rem",
                        color: "var(--accent-clr)",
                      }}
                    >
                      {getFinalPrice(selectedProduct).toLocaleString()} IQD
                    </span>
                  </>
                ) : (
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "1.3rem",
                      color: "var(--text)",
                    }}
                  >
                    {selectedProduct.price.toLocaleString()} IQD
                  </span>
                )}
              </div>

              {/* Quantity Selector */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: "1rem",
                }}
              >
                <Button
                  size="small"
                  type="text"
                  style={{
                    color: "var(--text)",
                    border: "1px solid var(--accent-clr)",
                    borderRadius: 6,
                  }}
                  onClick={() => setQty((prev) => Math.max(prev - 1, 1))}
                >
                  <Minus />
                </Button>

                <span
                  style={{
                    minWidth: 30,
                    textAlign: "center",
                    color: "var(--text)",
                    fontSize: "1rem",
                  }}
                >
                  {selectedProduct.countInStock === 0 ? 0 : qty}
                </span>

                <Button
                  size="small"
                  type="text"
                  style={{
                    color: "var(--text)",
                    border: "1px solid var(--accent-clr)",
                    borderRadius: 6,
                  }}
                  onClick={() =>
                    setQty((prev) =>
                      Math.min(prev + 1, selectedProduct.countInStock)
                    )
                  }
                >
                  <Plus />
                </Button>
              </div>

              {/* Action Buttons */}
              <div
                style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}
              >
                <Button
                  type="default"
                  style={{
                    flex: 1,
                    color: "var(--text)",
                    border: "1px solid var(--accent-clr)",
                    borderRadius: 8,
                    fontWeight: 600,
                    background: "transparent",
                    transition: "all 0.3s",
                  }}
                  onClick={handleAddToCart}
                >
                  {t("Add to Cart", "أضف إلى السلة")}
                </Button>

                <Button
                  type="default"
                  style={{
                    flex: 1,
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 600,
                    background:
                      "linear-gradient(135deg, var(--accent-clr), #ff4d4f)",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                    transition: "all 0.3s",
                  }}
                  onClick={handleBuyNow}
                >
                  {t("Buy Now", "اشتري الآن")}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Description + Specs */}

      <div className="dt-container">
        <div className="pr-description-container">
          <div
            className="description-header"
            onClick={() => setExpanded(!expanded)}
          >
            <h3 style={{ justifyContent: t.flexAlign }}>
              {t("Description", "الوصف والمواصفات")}
            </h3>

            <FiChevronDown className={`arrow ${expanded ? "rotated" : ""}`} />
          </div>

          <div
            className={`description-content ${
              expanded ? "expanded" : "collapsed"
            }`}
          >
            <ul className="description-list">
              {selectedProduct.category?.toLowerCase() === "laptops" &&
                specsList.length > 0 && (
                  <>
                    {specsList}
                    <Divider
                      style={{
                        margin: "1rem 0",
                        borderColor: "var(--line-clr)",
                      }}
                    />
                  </>
                )}

              {descriptionLines.length > 0 && <>{descriptionLines}</>}
            </ul>
          </div>
        </div>
      </div>

      {/* Comments Section */}

      <main id="comments-main-container">
        <div className="pr-comments-container">
          <h3 style={{ justifyContent: t.flexAlign }}>
            {t("Customer Reviews", "مراجعات الزبائن")}
          </h3>

          {selectedProduct.reviews?.length > 0 ? (
            selectedProduct.reviews.map((review) => (
              <div key={review._id} className="comment-box">
                <div className="comment-avatar">{review.name[0]}</div>

                <div className="comment-content">
                  <p className="comment-author">
                    <span>{review.name}</span>

                    <span className="comment-rating">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span
                          key={i}
                          className="star-icon"
                          style={{
                            color: i <= review.rating ? "#f5b50a" : "#d0d0d0",
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </span>
                  </p>

                  <p className="comment-text">
                    {review.comment}

                    <span className="comment-date">
                      {new Date(
                        review.updatedAt || review.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </p>
                </div>

                {user &&
                  (user._id === review.userId || user.role === "admin") && (
                    <FiTrash2
                      className="delete-icon"
                      onClick={() => handleDeleteReview(review._id)}
                    />
                  )}
              </div>
            ))
          ) : (
            <p style={{ justifyContent: t.flexAlign }}>
              {t("No reviews yet.", "لا توجد مراجعات بعد.")}
            </p>
          )}

          {user ? (
            <div className="add-comment-box">
              <div
                className="avatar-container"
                style={{ flexDirection: t.rowReverse }}
              >
                <div className="avatar-placeholder">{user.name[0]}</div>

                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${star <= newRating ? "selected" : ""}`}
                      onClick={() => setNewRating(star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div className="input-area">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={t("Write your comment...", "اكتب تعليقك...")}
                  rows="3"
                  dir={t("ltr", "rtl")}
                  style={{
                    textAlign: t("left", "right"),
                  }}
                />

                <button
                  className="post-btn"
                  onClick={handleSubmitReview}
                  disabled={reviewLoading}
                >
                  {t("Post Review", "نشر المراجعة")}
                </button>
              </div>
            </div>
          ) : (
            <p>
              {t("Please", "يرجى")}{" "}
              <span className="login-link" onClick={() => navigate("/signin")}>
                {t("login", "تسجيل الدخول")}
              </span>{" "}
              {t("to post a review.", "لإضافة مراجعة.")}
            </p>
          )}
        </div>
      </main>
    </>
  );
};

export default ProductDetails;
