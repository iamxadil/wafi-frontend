import React from "react";
import "../../styles/cart.css";
import { TbArrowNarrowLeftDashed as ArrowLeft } from "react-icons/tb";
import { TiPlus as Increase, TiMinus as Decrease } from "react-icons/ti";
import { RiDeleteBinLine as Delete } from "react-icons/ri";
import useWindowWidth from "../hooks/useWindowWidth.jsx";
import { useNavigate } from "react-router-dom";
import useCartStore from "../stores/useCartStore.jsx";
import useTranslate from "../hooks/useTranslate.jsx";

const Cart = () => {
  const width = useWindowWidth();
  const navigate = useNavigate();
  const t = useTranslate();

  const cartItems = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const updateQty = useCartStore((state) => state.updateQty);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);

  // Totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.finalPrice || item.price) * item.qty,
    0
  );
  const delivery = 0;

  return (
    <main id="cart-page">
      {/* Header */}
      <section id="cart-header">
        <h1
          style={{ cursor: "pointer" }}
          onClick={() => navigate(-1)}
          title={t("Go Back", "العودة")}
        >
          <ArrowLeft />
        </h1>
        <h2>
          {cartItems.length}{" "}
          {t(
            `Item${cartItems.length !== 1 ? "s" : ""}`,
            `${cartItems.length > 1 ? "عناصر" : "عنصر"}`
          )}
        </h2>
      </section>

      {/* Labels */}
      {cartItems.length > 0 && (
        <section id="cart-labels">
          <label>{t("Product", "المنتج")}</label>
          <label>{t("Quantity", "الكمية")}</label>
          {width > 850 && <label>{t("Actions", "الإجراءات")}</label>}
        </section>
      )}

      {/* Content */}
      <section id="cart-content">
        {cartItems.length === 0 ? (
          <p style={{ padding: "2rem" }}>
            {t("Your cart is empty.", "سلة التسوق فارغة.")}
          </p>
        ) : (
          cartItems.map((item) => {
            const hasDiscount = item.discountPrice && item.discountPrice > 0;
            const finalPrice = hasDiscount ? item.finalPrice : item.price;

            return (
              <div className="cart-product" key={item._id}>
                <div className="cart-info">
                  {/* Product Details */}
                  <div className="cart-details">
                    <div className="cart-image">
                      <img
                        src={item?.images?.[0] || "https://placehold.co/100"}
                        alt={item.name}
                      />
                    </div>

                    <div className="details-container">
                      <p>{item.brand || t("Unknown", "غير معروف")}</p>
                      <h2>{item.name || t("Unnamed Product", "منتج بدون اسم")}</h2>

                      <p>
                        {hasDiscount ? (
                          <>
                            <span className="original-price">
                              {item.price.toLocaleString()} IQD
                            </span>
                            <br />
                            <span className="final-price">
                              {finalPrice.toLocaleString()} IQD
                            </span>
                          </>
                        ) : (
                          <span className="final-price">
                            {finalPrice.toLocaleString()} IQD
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controller */}
                  <div className="qty-controller">
                    <button className="inc-qty" onClick={() => addToCart(item)}>
                      <Increase />
                    </button>
                    <span className="qty">{item.qty}</span>
                    <button
                      className="dec-qty"
                      onClick={() => updateQty(item._id, item.qty - 1)}
                    >
                      <Decrease />
                    </button>
                  </div>

                  {/* Actions */}
                  {width > 850 && (
                    <div className="action-product">
                      <button
                        className="delete-btn"
                        onClick={() => removeFromCart(item._id)}
                      >
                        <Delete />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Totals */}
      {cartItems.length > 0 && (
        <>
          <section id="totals">
            {width > 850 && <hr />}
            <h2 style={{flexDirection: t.rowReverse}}>
              {t("Delivery:", ":التوصيل")}{" "}
              <span>{delivery.toLocaleString()} IQD</span>
            </h2>
            <h2 style={{flexDirection: t.rowReverse}}>
              {t("Subtotal:", ":المجموع")}{" "}
              <span>{subtotal.toLocaleString()} IQD</span>
            </h2>
            <h2 style={{flexDirection: t.rowReverse}}>
              {t("Total:", ":الإجمالي")}{" "}
              <span>{(subtotal + delivery).toLocaleString()} IQD</span>
            </h2>
          </section>

          {/* Footer Buttons */}
          <footer id="cart-action-btns">
            <button
              id="proceed-btn"
              onClick={() => navigate("/payment")}
              disabled={cartItems.length === 0}
            >
              {t("Proceed to Payment", "المتابعة إلى الدفع")}
            </button>
            <button id="clear-btn" onClick={() => clearCart()}>
              {t("Clear Cart", "مسح السلة")}
            </button>
          </footer>
        </>
      )}
    </main>
  );
};

export default Cart;
