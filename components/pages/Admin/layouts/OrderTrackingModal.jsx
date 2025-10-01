import React, { useState } from "react";
import useOrderStore from "../../../stores/useOrderStore.jsx";
import "../styles/ordertrackingmodal.css";

const statuses = ["Waiting", "Packaging", "On the way", "Delivered"];

const OrderTrackingModal = () => {
  const selectedOrder = useOrderStore((state) => state.selectedOrder);
  const setSelectedOrder = useOrderStore((state) => state.setSelectedOrder);
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);
  const trackModal = useOrderStore((state) => state.trackModal);
  const closeTrackModal = useOrderStore((state) => state.closeTrackModal);
  
  if (!selectedOrder) return null;

  const currentStep = statuses.indexOf(selectedOrder.status);

  const handleStatusClick = async (status, index) => {
    if (index <= currentStep) return; // Only allow moving forward

    const confirmChange = window.confirm(
      `Are you sure you want to update the status to "${status}"?`
    );
    if (!confirmChange) return;

    try {
      await updateOrderStatus(selectedOrder._id, status);
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleCancel = async () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmCancel) return;
    try {
      await updateOrderStatus(selectedOrder._id, "Canceled");
      setSelectedOrder(null);
    } catch (error) {
      console.error("Failed to cancel order", error);
    }
  };

  return (
    <div className="modal-overlay">
      <main className="tracking-modal">

        {/* Status Progress Bar */}
        <section className="status-bar">
          {statuses.map((status, index) => (
            <div key={status} className="status-step">
              <div
                className={`status-circle ${index <= currentStep ? "active" : ""}`}
                onClick={() => handleStatusClick(status, index)}
              >
                {index + 1}
              </div>
              <p className={`status-label ${index <= currentStep ? "active" : ""}`}>
                {status}
              </p>
              {index < statuses.length - 1 && (
                <div className={`status-line ${index < currentStep ? "active" : ""}`} />
              )}
            </div>
          ))}
          {selectedOrder.status === "Canceled" && (
            <p className="canceled-label">Canceled</p>
          )}
        </section>

        {/* Action Buttons */}
        <section className="tracking-actions">
          {selectedOrder.status !== "Canceled" && selectedOrder.status !== "Delivered" && (
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel Order
            </button>
          )}
          <button className="close-btn" onClick={() => closeTrackModal(false)}>
            Close
          </button>
        </section>
      </main>
    </div>
  );
};

export default OrderTrackingModal;
