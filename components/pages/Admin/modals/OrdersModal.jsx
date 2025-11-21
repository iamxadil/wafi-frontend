import React, { useMemo, useState } from "react";
import { Modal } from "@mantine/core";
import {
  X,
  Clock,
  MapPin,
  User,
  Package,
  CreditCard,
  Truck,
  Home,
  ClipboardCheck,
  Box,
  CheckCircle2,
  XCircle,
  Archive,
  RotateCcw,
  Printer,
  Download,
  AlertTriangle,
  ArchiveRestore,
  MessageSquare,
  Store,
} from "lucide-react";
import "../styles/ordersmodal.css";
import StatusModal from "./StatusModal.jsx";
import {
  useUpdateOrderStatus,
  useArchiveOrder,
  useUnarchiveOrder,
} from "../../../hooks/useManageOrders.jsx";

// 🟢 Normal delivery steps
const deliverySteps = [
  { key: "Waiting", label: "Order Received", icon: ClipboardCheck },
  { key: "Packaging", label: "Packaging", icon: Box },
  { key: "On the way", label: "In Transit", icon: Truck },
  { key: "Delivered", label: "Delivered", icon: Home },
];

// 🟢 Pickup steps (simplified)
const pickupSteps = [
  { key: "Waiting", label: "Order Received", icon: ClipboardCheck },
  { key: "Picked-Up", label: "Picked Up", icon: CheckCircle2 },
];

const OrdersModal = ({ opened, onClose, order }) => {
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const updateStatus = useUpdateOrderStatus();
  const archiveOrder = useArchiveOrder();
  const unarchiveOrder = useUnarchiveOrder();

  // 🟢 Decide which steps to use
  const steps = order?.pickup ? pickupSteps : deliverySteps;

  const activeIndex = useMemo(() => {
    if (!order?.status) return 0;
    const idx = steps.findIndex((s) => s.key === order.status);
    return idx >= 0 ? idx : 0;
  }, [order?.status, steps]);

  if (!order)
    return (
      <Modal
            opened={opened}
            onClose={onClose}
            centered
            withCloseButton={false}
            lockScroll={false}
            size="lg"
            classNames={{
              content: "omodal",
              body: "omodal__body",
            }}
            scrollAreaComponent="div"   // ⭐ THIS FIXES SCROLL-JUMP
          >

        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p>No order selected</p>
        </div>
      </Modal>
    );

  const {
    orderNumber,
    user,
    shippingInfo,
    items = [],
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
    status,
    isDelivered,
    isArchived,
    createdAt,
    adminNotes = [],
    _id,
    pickup,
  } = order;

  const customerName = user?.name || shippingInfo?.fullName + " (Guest)";
  const customerEmail = user?.email || shippingInfo?.email || "—";
  const isCanceled = status === "Canceled";
  const isRefunded = status === "Refunded";
  const isFinalized = isCanceled || isRefunded;

  const handleMarkDelivered = () => {
    if (status === "Delivered" || status === "Picked-Up") return;
    updateStatus.mutate({
      id: _id,
      status: pickup ? "Picked-Up" : "Delivered",
    });
  };

  const handleArchive = () => {
    if (window.confirm(`Archive order #${orderNumber}?`)) {
      archiveOrder.mutate(_id, { onSuccess: onClose });
    }
  };

  const handleRestore = () => {
    if (window.confirm(`Restore order #${orderNumber}?`)) {
      unarchiveOrder.mutate(_id, { onSuccess: onClose });
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        centered
        withCloseButton={false}
        size="lg"
        yOffset="6vh"
        classNames={{
          content: "omodal",
          body: "omodal__body",
        }}
      >
        {/* HEADER */}
        <header className="omodal__header">
          <div className="head-left">
            <h2>Order #{orderNumber}</h2>
            <p className="meta">
              <Clock size={14} /> Placed on {new Date(createdAt).toLocaleString()}
            </p>
          </div>
          <div className="omodal__tools">
            <button className="iconbtn" title="Print">
              <Printer size={16} />
            </button>
            <button className="iconbtn" title="Download Invoice">
              <Download size={16} />
            </button>
            <button className="iconbtn close" onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </header>

        {/* 🟢 TIMELINE */}
        <div className={`timeline ${isFinalized ? "dimmed" : ""}`}>
          {steps.map((step, i) => {
            const Icon = step.icon;
            const active = !isFinalized && i <= activeIndex;
            return (
              <div key={step.key} className={`t-step ${active ? "active" : ""}`}>
                <div className="t-icon">
                  <Icon size={15} />
                </div>
                <p>{step.label}</p>
                {i < steps.length - 1 && <span className="t-line" />}
              </div>
            );
          })}
        </div>

        {/* NOTICES */}
        {pickup && (
          <div className="notice info">
            <Store size={15} />
            <span>
              This is a <strong>pickup order</strong> — no delivery required.
            </span>
          </div>
        )}

        {isArchived && (
          <div className="notice archived">
            <Archive size={15} />
            <span>This order is archived and cannot be modified.</span>
          </div>
        )}

        {isFinalized && (
          <div className="notice danger">
            <XCircle size={15} />
            <span>
              This order has been {isCanceled ? "canceled" : "refunded"} and is no longer active.
            </span>
          </div>
        )}

        {!isDelivered && !isFinalized && !pickup && (
          <div className="notice warning">
            <AlertTriangle size={15} />
            <span>Payment pending — collect cash on delivery.</span>
          </div>
        )}

        {/* CUSTOMER */}
        <section className="section">
          <h3>
            <User size={16} /> Customer Details
          </h3>
          <div className="details-grid">
            <div>
              <span>Name</span>
              <p>{customerName}</p>
            </div>
            <div>
              <span>Email</span>
              <p>{customerEmail}</p>
            </div>
            <div>
              <span>Primary Phone</span>
              <p>{shippingInfo?.phone || "—"}</p>
            </div>
            {shippingInfo?.phone2 && (
              <div>
                <span>Alternate Phone</span>
                <p>{shippingInfo.phone2}</p>
              </div>
            )}
          </div>
        </section>

        {/* SHIPPING */}
        <section className="section">
          <h3>
            <MapPin size={16} /> Shipping Information
          </h3>
          {pickup ? (
            <div className="field-long">
              <p>
                <strong>Pickup from:</strong> Al-Wafi Computers, Baghdad
              </p>
            </div>
          ) : (
            <>
              <div className="field-long">
                <span>Address</span>
                <p>{shippingInfo?.address}</p>
              </div>
              
              <div className="details-grid">
                <div>
                  <span>City</span>
                  <p>{shippingInfo?.city}</p>
                </div>
                <div>
                  <span>Nearest Landmark</span>
                  <p>{shippingInfo?.postalCode}</p>
                </div>
              </div>
            </>
          )}
        </section>

        {/* ITEMS */}
        <section className="section">
          <h3>
            <Package size={16} /> Ordered Items
          </h3>
          <div className="items">
            {items.map((item, i) => (
              <div key={i} className="item">
                <img src={item.image || "/placeholder.png"} alt={item.name} />
                <div className="i-info">
                  <p className="name">{item.name}</p>
                  <p className="sub">
                    Qty: {item.quantity} × {item.price.toLocaleString()} IQD
                  </p>
                </div>
                <p className="price">
                  {(item.price * item.quantity).toLocaleString()} IQD
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* PAYMENT */}
        <section className="section">
          <h3>
            <CreditCard size={16} /> Payment & Status
          </h3>
          <div className="details-grid">
            <div>
              <span>Method</span>
              <p>{paymentMethod || "Cash on Delivery"}</p>
            </div>
            <div>
              <span>Payment</span>
              <p>
                {status === "Picked-Up" ? (
                  <>
                    <CheckCircle2 size={14} color="#3b82f6" /> Paid at Pickup
                  </>
                ) : isDelivered ? (
                  <>
                    <CheckCircle2 size={14} color="#22c55e" /> Paid on Delivery
                  </>
                ) : pickup ? (
                  <>
                    <XCircle size={14} color="#ef4444" /> Awaiting Pickup
                  </>
                ) : (
                  <>
                    <XCircle size={14} color="#ef4444" /> Pending Delivery
                  </>
                )}
              </p>
            </div>
            <div>
              <span>Current Status</span>
              <p>{status}</p>
            </div>
          </div>
        </section>

        {/* STATUS HISTORY */}
        {adminNotes.length > 0 && (
          <section className="section admin-notes">
            <h3>
              <MessageSquare size={16} /> Status History
            </h3>
            <div className="notes-list">
              {adminNotes
                .slice()
                .reverse()
                .map((n, i) => (
                  <div key={i} className="note-item">
                    <div className="note-header">
                      <strong className="note-status">{n.status || "—"}</strong>
                      <span className="note-date">
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {n.note && <p className="note-text">{n.note}</p>}
                    <small className="note-meta">
                      {n.author?.name || "Admin"}
                    </small>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* SUMMARY */}
        <section className="section total">
          <div className="summary">
            <div>
              <span>Items</span>
              <p>{itemsPrice?.toLocaleString()} IQD</p>
            </div>
            <div>
              <span>Shipping</span>
              <p>{shippingPrice?.toLocaleString()} IQD</p>
            </div>
            <div className="final">
              <strong>Total</strong>
              <strong>{totalPrice?.toLocaleString()} IQD</strong>
            </div>
          </div>
        </section>

        {/* ACTIONS */}
        <section className="section admin-actions">
          {isArchived ? (
            <>
              <button className="btn success" onClick={handleRestore}>
                <ArchiveRestore size={15} /> Restore
              </button>
              <button className="btn danger" onClick={onClose}>
                <XCircle size={15} /> Close
              </button>
            </>
          ) : (
            <>
              {!isFinalized && (
                <>
                  <button className="btn success" onClick={handleMarkDelivered}>
                    <CheckCircle2 size={15} />{" "}
                    {pickup ? "Mark Picked Up" : "Mark Delivered"}
                  </button>
                  <button
                    className="btn warning"
                    onClick={() => setStatusModalOpen(true)}
                  >
                    <RotateCcw size={15} /> Change Status
                  </button>
                </>
              )}
              <button className="btn danger" onClick={handleArchive}>
                <Archive size={15} /> Archive
              </button>
            </>
          )}
        </section>
      </Modal>

      {/* STATUS MODAL */}
      <StatusModal
        opened={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        order={order}
        onSave={(newStatus, note) => {
          updateStatus.mutate(
            { id: _id, status: newStatus, note },
            { onSuccess: () => setStatusModalOpen(false) }
          );
        }}
      />
    </>
  );
};

export default OrdersModal;
