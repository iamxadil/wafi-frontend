import React, { useEffect } from "react";
import useWindowWidth from "../../../hooks/useWindowWidth.jsx";
import useOrderStore from "../../../stores/useOrderStore.jsx";
import OrderDetailsModal from "../layouts/OrderDetailsModal.jsx";

const ArchiveFields = () => {
  // Width Adjustment
  const width = useWindowWidth();

  // Order Store
  const fetchArchivedOrders = useOrderStore((state) => state.fetchArchivedOrders);
  const unarchiveOrder = useOrderStore((state) => state.unarchiveOrder);
  const archivedOrders = useOrderStore((state) => state.archivedOrders);
  const loading = useOrderStore((state) => state.loading);
  const setSelectedOrder = useOrderStore((state) => state.setSelectedOrder);

  // Fetch archived orders on mount
  useEffect(() => {
    fetchArchivedOrders();
  }, [fetchArchivedOrders]);

  const handleRestore = async (orderId) => {

    const confirm = window.confirm("Are you sure you want to archive this order?");
    if (!confirm) return; 

    try {
      await unarchiveOrder(orderId);
    } catch (error) {
      console.error("Failed to restore order:", error);
    }
  };

  return (
    <>
      {width > 820 && (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th className="th-status">Status</th>
              <th className="th-total">Total</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "1rem" }}>
                  Loading archived orders...
                </td>
              </tr>
            ) : archivedOrders.length > 0 ? (
              archivedOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order.orderNumber}</td>
                  <td>{order.shippingInfo.fullName}</td>
                  <td className={`status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </td>
                  <td className="td-total">{order.totalPrice.toLocaleString()} IQD</td>
                  <td className="td-date">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="order-options">
                    <button onClick={() => handleRestore(order._id)}>Restore Order</button>
                    <button onClick={() => setSelectedOrder(order)}>View Details</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "1rem" }}>
                  No archived orders.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <OrderDetailsModal />
    </>
  );
};

export default ArchiveFields;
