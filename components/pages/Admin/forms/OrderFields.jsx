import React, { useEffect } from "react";
import { motion } from "framer-motion";
import useWindowWidth from "../../../hooks/useWindowWidth.jsx";
import useOrderStore from "../../../stores/useOrderStore.jsx";
import OrderDetailsModal from "../layouts/OrderDetailsModal.jsx";
import "../styles/orderFields.css";

const OrderFields = ({handlePageChange}) => {
  const width = useWindowWidth();

  // Order Store
  const archiveOrder = useOrderStore((state) => state.archiveOrder);
  const allOrders = useOrderStore((state) => state.allOrders);
  const loading = useOrderStore((state) => state.loading);
  const setSelectedOrder = useOrderStore((state) => state.setSelectedOrder);

  const totalPages = useOrderStore((state) => state.totalPages);
  const currentPage = useOrderStore((state) => state.currentPage);

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

  const handleArchive = async (orderId) => {
    const confirm = window.confirm("Are you sure you want to archive this order?");
    if (!confirm) return;

    try {
      await archiveOrder(orderId);
    } catch (error) {
      console.error("Failed to archive order:", error);
    }
  };

  return (
    <>
      {/* ✅ PC Version (Table) */}
      {width > 935 && (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th className="th-status">Status</th>
              <th className="th-total">Total</th>
              <th>Date</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "1rem" }}>
                  Loading orders...
                </td>
              </tr>
            ) : allOrders.length > 0 ? (
              allOrders.map((order) => {
                const statusClass = order.status.toLowerCase().replace(/\s+/g, "-");
                return (
                  <tr key={order._id}>
                    <td>#{order.orderNumber}</td>
                    <td>{order.shippingInfo.fullName}</td>
                    <motion.td
                      layout
                      key={order.status}
                      className={`status ${statusClass}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    >
                      {order.status}
                    </motion.td>
                    <td className="td-total">{order.totalPrice.toLocaleString()} IQD</td>
                    <td className="td-date">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="order-options">
                      <button onClick={() => handleArchive(order._id)}>Archive</button>
                      <button onClick={() => setSelectedOrder(order)}>Details</button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "1rem" }}>
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* ✅ Mobile Version (Cards) */}
  {width <= 935 && (
  <div className="orders-cards">
    {loading ? (
      <p className="loading">Loading orders...</p>
    ) : allOrders.length > 0 ? (
      allOrders.map((order) => {
        const statusClass = order.status.toLowerCase().replace(/\s+/g, "-");

        return (
          <motion.div
            key={order._id}
            className="order-card"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            layout
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, info) => {
              if (info.offset.x < 350) {
                // Swiped left far enough
                handleArchive(order._id);
              }
            }}
          >
            <header className="order-card-header">
              <h2>Order #{order.orderNumber}</h2>
              <motion.span
                className={`status ${statusClass}`}
                key={order.status}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 250, damping: 15 }}
              >
                {order.status}
              </motion.span>
            </header>

            <div className="order-card-body">
              <p><strong>Customer:</strong> {order.shippingInfo.fullName}</p>
              <p><strong>Total:</strong> {order.totalPrice.toLocaleString()} IQD</p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>

            <footer className="order-card-actions">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedOrder(order)}
              >
                Details
              </motion.button>
            </footer>
          </motion.div>
        );
      })
    ) : (
      <p className="no-orders">No orders found.</p>
    )}
  </div>
)}

<div className="pagination-controls">
  {/* Previous button */}
  <button
    onClick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 1} // disable if first page
  >
    Prev
  </button>

  {/* Page number buttons */}
  {pageNumbers.map((page) => (
    <button
      key={page}
      onClick={() => handlePageChange(page)}
      className={page === currentPage ? "active" : ""}
    >
      {page}
    </button>
  ))}

  {/* Next button */}
  <button
    onClick={() => handlePageChange(currentPage + 1)}
    disabled={currentPage === totalPages} // disable if last page
  >
    Next
  </button>
</div>


      <OrderDetailsModal />
    </>
  );
};

export default OrderFields;
