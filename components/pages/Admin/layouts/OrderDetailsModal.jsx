import React from "react";
import useOrderStore from "../../../stores/useOrderStore.jsx";
import OrderTrackingModal from "../layouts/OrderTrackingModal.jsx";
import { 
  MdOutlineCloseFullscreen as DeExpand,
  MdOutlineLocationSearching as Track
} from "react-icons/md";

import { UserRound as Person, MapPin as Pin, Smartphone as Phone, Mail as Email, Truck as Truck} from 'lucide-react';


import { useNavigate } from "react-router-dom";

import '../styles/orderdetailsmodal.css';

const OrderDetailsModal = () => {

  const selectedOrder = useOrderStore((state) => state.selectedOrder);
  const setSelectedOrder = useOrderStore((state) => state.setSelectedOrder);
  const trackModal = useOrderStore((state) => state.trackModal);
  const setTrackModal = useOrderStore((state) => state.setTrackModal);
  const navigate = useNavigate();

  if (!selectedOrder) return null;

  const { orderNumber, status, createdAt, shippingInfo, items, itemsPrice } = selectedOrder;

  return (
    <>
      {/* Details Modal */}
      <div className="modal-overlay">
        <main className="order-deails-container">

          {/* Header */}
          <header className="order-header">
            <div className="order-number">
              <h3>Order #{orderNumber}</h3>
              <DeExpand onClick={() => setSelectedOrder(null)} />
            </div>
            <div className="order-status-date">
               <h3 className={status.toLowerCase().replace(/\s+/g, "-")}>{status}</h3>
              <h4>
                {new Date(createdAt).toLocaleString("en-US", { 
                  month: "short", 
                  day: "numeric", 
                  hour: "2-digit", 
                  minute: "2-digit" 
                })}
              </h4>
            </div>

            <h2><Person /> <span>{shippingInfo.fullName}</span></h2>
            <h2><Pin /> <span>{shippingInfo.address}, {shippingInfo.city} {shippingInfo.postalCode}</span></h2>
            <h2><Phone /> <span>{shippingInfo.phone}</span></h2>
            <h2><Email /> <span>{shippingInfo.email}</span></h2>
         {status.toLowerCase() === "delivered" && (
              <h2>
                <span role="img" aria-label="delivered"><Truck /></span>
                <span>
                  Delivered on{" "}
                  {new Date(selectedOrder.deliveredAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </h2>
            )}
          </header>

          {/* User Info */}
          <section className="user-credentials">
            <div className="user-credentials-header">
              <div className="user-first-letter">
                <h3>{selectedOrder.user?.name ? selectedOrder.user.name[0].toUpperCase() : "?"}</h3>
              </div>
              <div className="account-names">
                {selectedOrder.user ? (
                  <>
                    <h4>Name: {selectedOrder.user.name}</h4>
                    <h4>Email: {selectedOrder.user.email}</h4>
                  </>
                ) : (
                  <h4>User not found</h4>
                )}
              </div>
            </div>
          </section>

          {/* Order Items */}
          <section className="order-items-container">
            <div className="order-items-text"><h3>Order Items</h3></div>
            <div className="order-items">
              {items.map((item, index) => (
                <div className="order-item" key={index}>
                  <div className="order-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="order-item-details">
                       <h5 
                    className="order-item-sku" 
                    onClick={() => navigate(`/product/${item.product}`)} 
                    style={{ cursor: "pointer", color: "#1890ff", fontSize: "0.85", fontWeight: "800" }}
                  >
                    Navigate to Page
                  </h5>
                  <h4 className="order-item-name">
                    {item.name} <span>x{item.quantity}</span>
                  </h4>
                  <h4 className="order-item-price">{item.price.toLocaleString()} IQD</h4>
                </div>
                </div>
              ))}
            </div>
          </section>

          {/* Total */}
          <section className="order-item-total">
            <h2>Total <span>{itemsPrice.toLocaleString()} IQD</span></h2>
          </section>

          {/* Actions */}
          <section className="order-action-buttons">
            <button onClick={() => setTrackModal(true)}>Track <Track /></button>
            <button>Refund</button>
          </section>
        </main>
      </div>

      {/* Tracking Modal */}
      {trackModal && (
        <OrderTrackingModal/>
      )}
    </>
  );
};

export default OrderDetailsModal;
