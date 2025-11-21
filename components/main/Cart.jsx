import React from "react";
import "../../styles/cart.css";
import { TbArrowNarrowLeft as Back } from "react-icons/tb";
import { TiPlus as Plus, TiMinus as Minus } from "react-icons/ti";
import { RiDeleteBinLine as Delete } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

import useCartStore from "../stores/useCartStore.jsx";
import useWindowWidth from "../hooks/useWindowWidth.jsx";
import useTranslate from "../hooks/useTranslate.jsx";

const Cart = () => {
  const navigate = useNavigate();
  const t = useTranslate();
  const width = useWindowWidth();

  const cart = useCartStore((s) => s.cart);
  const add = useCartStore((s) => s.addToCart);
  const update = useCartStore((s) => s.updateQty);
  const remove = useCartStore((s) => s.removeFromCart);
  const clear = useCartStore((s) => s.clearCart);

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.finalPrice || item.price) * item.qty,
    0
  );

  const isEmpty = cart.length === 0;

  return (
    <main id="cart-ultra">
      {/* Header */}
      <header className="cu-header">
        <button className="cu-back" onClick={() => navigate(-1)}>
          <Back size={22} />
        </button>
        <h2 className="cu-count">
          {cart.length}{" "}
          {t(
            `Item${cart.length !== 1 ? "s" : ""}`,
            cart.length > 1 ? "عناصر" : "عنصر"
          )}
        </h2>
      </header>

      {/* Empty */}
      {isEmpty && (
        <div className="cu-empty">
          <div className="cu-empty-icon">🛒</div>
          <p>{t("Your cart is empty.", "سلة التسوق فارغة.")}</p>
        </div>
      )}

      {/* Content */}
      {!isEmpty && (
        <>
          {/* Labels */}
          {width > 650 && (
            <div className="cu-labels">
              <span>{t("Product", "المنتج")}</span>
              <span className="center">{t("Quantity", "الكمية")}</span>
              <span className="end">{t("Price", "السعر")}</span>
            </div>
          )}

          {/* List */}
          <section className="cu-list">
            {cart.map((item) => {
              const hasDiscount = item.discountPrice > 0;
              const finalPrice = hasDiscount ? item.finalPrice : item.price;

              return (
                <article className="cu-row" key={item._id}>
                  {/* Product block */}
                  <div className="cu-product">
                    <div className="cu-img">
                      <img src={item.images?.[0]} alt={item.name} />
                    </div>

                    <div className="cu-info">
                      <p className="cu-brand">{item.brand}</p>
                      <h3 className="cu-name">{item.name}</h3>

                      {/* Price on mobile only */}
                      {width <= 650 && (
                        <div className="cu-mobile-price">
                          {hasDiscount && (
                            <span className="cu-old">
                              {item.price.toLocaleString()} IQD
                            </span>
                          )}
                          <span className="cu-new">
                            {finalPrice.toLocaleString()} IQD
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="cu-qty">
                    <button
                      className="cu-qty-btn"
                      onClick={() => add(item)}
                    >
                      <Plus size={15} />
                    </button>

                    <span className="cu-qty-num">{item.qty}</span>

                  <button
                        className="cu-qty-btn"
                        onClick={() => {
                          if (item.qty - 1 <= 0) {
                            remove(item._id); 
                          } else {
                            update(item._id, item.qty - 1);
                          }
                        }}
                      >
                        <Minus size={15} />
                      </button>
                  </div>

                  {/* Price desktop + delete */}
                  {/* Price desktop + delete */}
                <div className="cu-side">
                  {width > 650 && (
                    <div className="cu-desktop-price">
                      {hasDiscount && (
                        <span className="cu-old">
                          {item.price.toLocaleString()} IQD
                        </span>
                      )}
                      <span className="cu-new">
                        {finalPrice.toLocaleString()} IQD
                      </span>
                    </div>
                  )}

                  <button className="cu-delete" onClick={() => remove(item._id)}>
                    <Delete size={15} />
                  </button>
                </div>

                </article>
              );
            })}
          </section>

          {/* Totals */}
          <section className="cu-totals">
            <div className="cu-trow">
              <span>{t("Subtotal", "المجموع")}</span>
              <span>{subtotal.toLocaleString()} IQD</span>
            </div>
            <div className="cu-trow">
              <span>{t("Delivery", "التوصيل")}</span>
              <span>0 IQD</span>
            </div>
            <div className="cu-trow cu-main-total">
              <span>{t("Total", "الإجمالي")}</span>
              <span>{subtotal.toLocaleString()} IQD</span>
            </div>
          </section>

          {/* Actions */}
          <footer className="cu-actions">
            <button
              className="cu-btn primary"
              onClick={() => navigate("/payment")}
            >
              {t("Proceed to Payment", "المتابعة إلى الدفع")}
            </button>
            <button className="cu-btn secondary" onClick={clear}>
              {t("Clear Cart", "مسح السلة")}
            </button>
          </footer>
        </>
      )}
    </main>
  );
};

export default Cart;
