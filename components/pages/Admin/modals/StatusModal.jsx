import React, { useState, useEffect } from "react";
import { Modal, Textarea } from "@mantine/core";
import {
  ClipboardCheck,
  Box,
  Truck,
  Home,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Lock,
  Store,
  Handshake,
  Check
} from "lucide-react";
import "../styles/statusmodal.css";
import { useUpdateOrderStatus } from "../../../hooks/useManageOrders.jsx";

const statusOptions = [
  { label: "Waiting", value: "Waiting", icon: ClipboardCheck },
  { label: "Accepted", value: "Accepted", icon: Check },
  { label: "On the way", value: "On the way", icon: Truck },
  { label: "Delivered", value: "Delivered", icon: Home },
  { label: "Picked-Up", value: "Picked-Up", icon: Handshake },
  { label: "Canceled", value: "Canceled", icon: XCircle },
  { label: "Refunded", value: "Refunded", icon: RotateCcw },
];

const irreversibleStatuses = ["Delivered", "Picked-Up", "Canceled", "Refunded"];
const statusOrder = ["Waiting", "Accepted", "On the way", "Delivered"];

const StatusModal = ({ opened, onClose, order }) => {
  const updateStatus = useUpdateOrderStatus();

  const [newStatus, setNewStatus] = useState(order?.status || "Waiting");
  const [note, setNote] = useState("");

  const isLocked = irreversibleStatuses.includes(order?.status ?? "");
  const isPickup = !!order?.pickup;
  const currentIndex = statusOrder.indexOf(order?.status ?? "Waiting");


  if (!order) {
    return (
      <Modal opened={opened} onClose={onClose} centered withCloseButton={false}>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p>No order selected</p>
        </div>
      </Modal>
    );
  }

  const shouldDisable = (target) => {
  if (isLocked) return true;

  // === PICKUP ORDERS ============================
  if (isPickup) {
    // Allowed transitions:
    // Waiting → Picked-Up
    // Waiting → Canceled
    const allowed = ["Waiting", "Picked-Up", "Canceled"];

    // Target not allowed?
    if (!allowed.includes(target)) return true;

    // Can't re-select same status
    if (target === order.status) return true;

    return false;
  }

  // === NORMAL ORDERS ============================
  const targetIndex = statusOrder.indexOf(target);
  if (targetIndex !== -1 && targetIndex <= currentIndex) return true;
  return false;
};


  const handleSave = async () => {
    if (!newStatus || newStatus === order.status) {
      onClose();
      return;
    }

    const confirmMsg = `Confirm update:\nOrder #${order.orderNumber}\n${order.status} → ${newStatus}`;
    if (!window.confirm(confirmMsg)) return;

    try {
      await updateStatus.mutateAsync({
        id: order._id,
        status: newStatus,
        note,
      });
      onClose();
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      withCloseButton={false}
      size="sm"
      yOffset="7vh"
      scrollAreaComponent="div" // ✅ prevents mobile freeze
      classNames={{
        content: "statusmodal",
        body: "statusmodal__body",
      }}
       trapFocus={false}
  keepMounted
  lockScroll={false}
  closeOnClickOutside={false}
  closeOnEscape={false}
    >
      {/* HEADER */}
      <div className="statusmodal__header">
        <h2>Update Order Status</h2>
        <p>
          Order <strong>#{order.orderNumber}</strong>
        </p>

        {isPickup && (
          <div className="pickup-banner">
            <Store size={35} />
            <span>
              Pickup order — status can only move directly from{" "}
              <strong>Waiting → Picked-Up</strong>.
            </span>
          </div>
        )}

        {isLocked && (
          <div className="locked-banner">
            <Lock size={20} />
            <span>This order is finalized and cannot be changed.</span>
          </div>
        )}
      </div>

      {/* STATUS OPTIONS */}
      <div className={`status-options ${isLocked ? "disabled" : ""}`}>
        {statusOptions.map(({ label, value, icon: Icon }) => {
          const disabled = shouldDisable(value);
          return (
            <button
              key={value}
              onClick={() => !disabled && setNewStatus(value)}
              disabled={disabled}
              className={`status-btn ${
                newStatus === value ? "active" : ""
              } ${disabled ? "disabled" : ""} status-${value
                .replace(/\s+/g, "-")
                .toLowerCase()}`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* NOTE */}
      {!isLocked && (
        <div className="status-note">
          <label htmlFor="adminNote" className="note-label">
            Admin Note (optional)
          </label>
          <Textarea
            id="adminNote"
            placeholder={
              isPickup
                ? "Add pickup confirmation note (optional)..."
                : "Add a note for internal tracking..."
            }
            autosize
            minRows={2}
            maxRows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="note-textarea"
          />
        </div>
      )}

      {/* ACTIONS */}
      <div className="status-actions">
        <button className="btn cancel" onClick={onClose}>
          Cancel
        </button>
        <button
          className={`btn save ${isLocked ? "disabled" : ""}`}
          onClick={handleSave}
          disabled={isLocked}
        >
          <CheckCircle2 size={16} /> Save
        </button>
      </div>
    </Modal>
  );
};

export default StatusModal;
