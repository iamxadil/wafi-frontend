import React from 'react';
import '../../styles/cart.css';
import { TbArrowNarrowLeftDashed as ArrowLeft } from "react-icons/tb";
import { TiPlus as Increase, TiMinus as Decrease } from "react-icons/ti";
import { RiDeleteBinLine as Delete, RiHeartAddLine as Heart } from "react-icons/ri";
import useWindowWidth from "../hooks/useWindowWidth.jsx";
import { useNavigate } from "react-router-dom";
import useCartStore from "../stores/useCartStore.jsx";

const Cart = () => {
  const width = useWindowWidth();
  const navigate = useNavigate();

  const cartItems = useCartStore(state => state.cart);
  const addToCart = useCartStore(state => state.addToCart);
  const updateQty = useCartStore(state => state.updateQty);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const clearCart = useCartStore(state => state.clearCart);

  // Totals using finalPrice
  const subtotal = cartItems.reduce((sum, item) => sum + (item.finalPrice || item.price) * item.qty, 0);
  const delivery = 5000;

  return (
    <main id='cart-page'>
      <section id='cart-header'>
        <h1 style={{ cursor: "pointer" }} onClick={() => navigate(-1)}><ArrowLeft /></h1>
        <h2>{cartItems.length} Item{cartItems.length !== 1 && 's'}</h2>
      </section>

      {cartItems.length > 0 && (
        <section id='cart-labels'>
          <label>Product</label>
          <label>Quantity</label>
          {width > 850 && <label>Actions</label>}
        </section>
      )}

      <section id='cart-content'>
        {cartItems.length === 0 ? (
          <p style={{ padding: '2rem' }}>Your cart is empty.</p>
        ) : (
          cartItems.map(item => {
            const hasDiscount = item.discountPrice && item.discountPrice > 0;
            const finalPrice = hasDiscount ? item.finalPrice : item.price;

            return (
              <div className="cart-product" key={item._id}>
                <div className="cart-info">
                  <div className='cart-details'>
                    <div className="cart-image">
                      <img src={item?.images?.[0] || "https://placehold.co/100"} alt={item.name} />
                    </div>
                    <div className="details-container">
                      <p>{item.brand || "Unknown"}</p>
                      <h2>{item.name || "Unnamed Product"}</h2>

                      <p>
                        {hasDiscount ? (
                          <>
                            <span className="original-price">{item.price.toLocaleString()} IQD</span><br/>
                            <span className="final-price">{finalPrice.toLocaleString()} IQD</span>
                          </>
                        ) : (
                          <span className="final-price">{finalPrice.toLocaleString()} IQD</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="qty-controller">
                    <button className='inc-qty' onClick={() => addToCart(item)}><Increase /></button>
                    <span className='qty'>{item.qty}</span>
                    <button className='dec-qty' onClick={() => updateQty(item._id, item.qty - 1)}><Decrease /></button>
                  </div>

                  {width > 850 && (
                    <div className="action-product">
                      <button className='delete-btn' onClick={() => removeFromCart(item._id)}><Delete /></button>
                      <button className='favorite-btn'><Heart /></button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </section>

      {cartItems.length > 0 && (
        <>
          <section id='totals'>
            {width > 850 && <hr />}
            <h2>Delivery: <span>{delivery.toLocaleString()} IQD</span></h2>
            <h2>Subtotal: <span>{subtotal.toLocaleString()} IQD</span></h2>
            <h2>Total: <span>{(subtotal + delivery).toLocaleString()} IQD</span></h2>
          </section>

          <footer id='cart-action-btns'>
            <button
              id='proceed-btn'
              onClick={() => navigate("/payment")}
              disabled={cartItems.length === 0}
            >
              Proceed to Payment
            </button>
            <button id='clear-btn' onClick={() => clearCart()}>Clear Cart</button>
          </footer>
        </>
      )}
    </main>
  );
}

export default Cart;
