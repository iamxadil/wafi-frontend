import React, { useEffect, useRef, useState, useMemo } from "react";
import useOrderStore from "../../stores/useOrderStore.jsx";
import "../../../styles/myorderspage.css";
import { Link } from "react-router-dom";
import {motion} from 'framer-motion';
import useAuthStore from "../../stores/useAuthStore.jsx";

const MyOrdersPage = () => {
  //User
  const user = useAuthStore((state) => state.user);


 if (!user) {
  return (
    <main id='not-signed-in-page'>
      <motion.div 
        className='not-signed-in-glass'
         initial={{ opacity: 0, y: 50 }}   // start 50px below
        animate={{ opacity: 1, y: 0 }}    // move to original position
        transition={{ duration: 0.7, ease: "easeOut" }}
        >
        <h2>Welcome!</h2>
        <p>You need to sign in or register to view your orders.</p>
        <div className='auth-buttons'>
          <Link to='/signin' className='btn-login'>Sign In</Link>
          <Link to='/register' className='btn-register'>Register</Link>
        </div>
      </motion.div>
    </main>
  );
}

  const cardRefs = useRef([]);

  // Fetching states
  const fetchMyOrders = useOrderStore((state) => state.fetchMyOrders);
  const myOrders = useOrderStore((state) => state.myOrders || []);
  const attachedOrders = useOrderStore((state) => state.attachedOrders || {});
  const loadingMyOrders = useOrderStore((state) => state.loadingMyOrders);

  // Attach states
  const attachOrderToUser = useOrderStore((state) => state.attachOrderToUser);
  const attachLoading = useOrderStore((state) => state.attachLoading);
  const attachErrorFromStore = useOrderStore((state) => state.attachError);

  const [attachId, setAttachId] = useState("");
  const [attachError, setAttachError] = useState(null);



  // Combine myOrders and attachedOrders safely
  const combinedOrders = useMemo(() => {
    return [...Object.values(attachedOrders), ...myOrders];
  }, [attachedOrders, myOrders]);

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("pr-order-card-visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    cardRefs.current.forEach((card) => card && observer.observe(card));
    return () => observer.disconnect();
  }, [combinedOrders]);

  const handleAttachOrder = async () => {
    if (!attachId.trim()) return;
    setAttachError(null);

    try {
      await attachOrderToUser(attachId.trim());
      setAttachId("");
      fetchMyOrders(); // Refresh main orders
    } catch (err) {
      setAttachError(err.response?.data?.message || err.message || "Failed to attach order");
    }
  };

  return (
    <main className="pr-orders-page">
      <header className="pr-orders-page-header">
        <h1>My Orders</h1>
        <p style={{ marginTop: "20px" }}>View your recent purchases and track them</p>
      </header>

      <section className="pr-orders-attach">
        <input
          type="text"
          placeholder="Enter your order ID to attach"
          value={attachId}
          onChange={(e) => setAttachId(e.target.value)}
        />
        <button onClick={handleAttachOrder} disabled={attachLoading}>
          {attachLoading ? "Attaching..." : "Attach Order"}
        </button>
        {(attachError || attachErrorFromStore) && (
          <span className="pr-orders-attach-error">
            {attachError || attachErrorFromStore}
          </span>
        )}
      </section>

      <section className="pr-orders-grid">
        {loadingMyOrders ? (
          <p>Loading your orders...</p>
        ) : combinedOrders.length === 0 ? (
          <div className="pr-orders-empty">
            <h2>No orders yet</h2>
            <p>Your purchases will appear here after ordering</p>
          </div>
        ) : (
          combinedOrders.map((order, idx) => (
            <div
              className="pr-order-card"
              key={order._id}
              ref={(el) => (cardRefs.current[idx] = el)}
            >
              <div className="pr-order-card-header">
                <span className="pr-order-id">Order #{order.orderNumber || order._id}</span>
                <span className={`pr-order-status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>

              <div className="pr-order-card-items">
                {order.items.map((item, i) => (
                  <div className="pr-order-item" key={i}>
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      className="pr-item-img"
                    />
                    <span className="pr-item-name">{item.name}</span>
                    <span className="pr-item-qty">x{item.quantity}</span>
                    <span className="pr-item-price">
                      {item.price.toLocaleString()} IQD
                    </span>
                  </div>
                ))}
              </div>

              <div className="pr-order-card-footer">
                <span className="pr-order-date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
                <span className="pr-order-total">
                  {order.totalPrice.toLocaleString()} IQD
                </span>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
};

export default MyOrdersPage;
