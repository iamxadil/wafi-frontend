import React, { useEffect, useState } from "react";
import "../../styles/cart.css";
import { TbArrowNarrowLeft as Back } from "react-icons/tb";
import { TiPlus as Plus, TiMinus as Minus } from "react-icons/ti";
import { RiDeleteBinLine as Delete } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

import useCartStore from "../stores/useCartStore.jsx";
import useWindowWidth from "../hooks/useWindowWidth.jsx";
import useTranslate from "../hooks/useTranslate.jsx";
import Loading from '../main/Loading.jsx';

// Suggestions Hook
import { useWindowsKeySuggestions } from "../query/useWindowsKeySuggestions.jsx";

const Cart = () => {
  const navigate = useNavigate();
  const t = useTranslate();
  const width = useWindowWidth();

  // Init Cart
  const initCart = useCartStore((s) => s.initCart);
  const cartLoading = useCartStore((s) => s.cartLoading);

  useEffect(() => {
    initCart();
  }, []);

  const cart = useCartStore((s) => s.cart);
  const hydrated = useCartStore((s) => s.hydrated);

  const add = useCartStore((s) => s.addToCart);
  const update = useCartStore((s) => s.updateQty);
  const remove = useCartStore((s) => s.removeFromCart);
  const clear = useCartStore((s) => s.clearCart);

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.finalPrice || item.price) * item.qty,
    0
  );
  const isEmpty = cart.length === 0;

  // Detect laptop in cart
  const hasLaptop =
    hydrated &&
    cart.some((item) => {
      const cat = item.category?.toLowerCase();
      const type = item.type?.toLowerCase();
      const name = item.name?.toLowerCase();
      const specs = item.specs || {};

      return (
        (cat && cat.includes("laptop")) ||
        (type && type.includes("laptop")) ||
        (name && name.includes("laptop")) ||
        specs.cpu ||
        specs.ram ||
        specs.gpu
      );
    });

  // Fetch suggestions
  const { data: suggestions = [] } = useWindowsKeySuggestions(hydrated && hasLaptop);

  // Track hidden suggestions
  const [hidden, setHidden] = useState([]);

  // Hide suggestions already in cart on refresh/mount
  useEffect(() => {
    if (!hydrated || !suggestions.length) return;

    const alreadyInCart = suggestions
      .filter((p) => cart.some((c) => c._id === p._id))
      .map((p) => p._id);

    if (alreadyInCart.length > 0) {
      setHidden((prev) => [...new Set([...prev, ...alreadyInCart])]);
    }
  }, [hydrated, suggestions, cart]);

  // Filter visible suggestions
  const visibleSuggestions = suggestions.filter((p) => !hidden.includes(p._id));

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

      {cartLoading && <Loading message={t("Loading cart...", "جاري تحميل السلة...")}></Loading>}

      {/* EMPTY */}
      {!cartLoading && isEmpty && (
        <div className="cu-empty">
          <div className="cu-empty-icon">🛒</div>
          <p>{t("Your cart is empty.", "سلة التسوق فارغة.")}</p>
        </div>
      )}

      {/* CART CONTENT */}
      {!cartLoading && !isEmpty && (
        <>
          {width > 650 && (
            <div className="cu-labels">
              <span>{t("Product", "المنتج")}</span>
              <span className="center">{t("Quantity", "الكمية")}</span>
              <span className="end">{t("Price", "السعر")}</span>
            </div>
          )}

          {/* Cart Rows */}
          <section className="cu-list">
            {cart.map((item) => {
              const finalPrice =
                item.discountPrice > 0 ? item.finalPrice : item.price;

              return (
                <article className="cu-row" key={item._id}>
                  <div className="cu-product">
                    <div className="cu-img">
                      <img src={item.images?.[0]} alt={item.name} />
                    </div>
                    <div className="cu-info">
                      <p className="cu-brand">{item.brand}</p>
                      <h3 className="cu-name">{item.name}</h3>

                      {width <= 650 && (
                        <div className="cu-mobile-price">
                          {item.discountPrice > 0 && (
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
                    <button className="cu-qty-btn" onClick={() => add(item)}>
                      <Plus size={15} />
                    </button>

                    <span className="cu-qty-num">{item.qty}</span>

                    <button
                      className="cu-qty-btn"
                      onClick={() =>
                        item.qty - 1 <= 0
                          ? remove(item._id)
                          : update(item._id, item.qty - 1)
                      }
                    >
                      <Minus size={15} />
                    </button>
                  </div>

                  {/* Price + delete */}
                  <div className="cu-side">
                    {width > 650 && (
                      <div className="cu-desktop-price">
                        {item.discountPrice > 0 && (
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

          {/* SUGGESTIONS */}
          {hasLaptop && visibleSuggestions.length > 0 && (
            <section className="cu-suggest ultra-wrap">
              <h3 className="cu-suggest-title" style={{textAlign: t.textAlign}}>
                {t("Recommended for your laptop", "مقترح لجهازك")}
              </h3>

              <div className="aura-strip">
                {visibleSuggestions.map((p) => {
                  const price = p.finalPrice || p.price;

                  return (
                    <div key={p._id} className="aura-item">
                      <div className="aura-orbit"></div>

                      <div
                        className="aura-img-box"
                        onClick={() => navigate(`/product/${p._id}`)}
                      >
                        <img src={p.images?.[0]} alt={p.name} className="aura-img" />
                      </div>

                      <div
                        className="aura-info"
                        onClick={() => navigate(`/product/${p._id}`)}
                      >
                        <p className="aura-name">{p.name}</p>
                        <p className="aura-price">
                          {price.toLocaleString()} IQD
                        </p>
                      </div>

                      <button
                        className="aura-btn"
                        onClick={() => {
                          add({
                            ...p,
                            qty: 1,
                            countInStock: p.countInStock || 999,
                            finalPrice: price,
                          });

                          // Hide suggestion
                          setHidden((prev) => [...prev, p._id]);
                        }}
                      >
                        {t("Add", "أضف")}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

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

          {/* Footer */}
          <footer className="cu-actions">
            <button className="cu-btn primary" onClick={() => navigate("/payment")}>
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
