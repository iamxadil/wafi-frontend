import React, { useState, useMemo, useCallback } from "react";
import {
  Modal,
  Textarea,
  Group,
  Button,
  Tooltip,
  Text,
  Divider,
} from "@mantine/core";
import {
  Ban,
  X,
  AlertTriangle,
  CalendarDays,
  Clock,
  Info,
} from "lucide-react";
import "../styles/banmodal.css";
import { useBanUser } from "../../../hooks/useManageUser.jsx";

const BanModal = ({ opened, onClose, user }) => {
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("");
  const banMutation = useBanUser();

  // ✅ Calculate end date dynamically
  const endDate = useMemo(() => {
    const parts = duration.trim().toLowerCase().split(" ");
    if (parts.length !== 2) return null;
    const [amount, unit] = parts;
    const num = parseInt(amount);
    if (isNaN(num)) return null;

    const d = new Date();
    if (unit.startsWith("day")) d.setDate(d.getDate() + num);
    else if (unit.startsWith("week")) d.setDate(d.getDate() + num * 7);
    else if (unit.startsWith("month")) d.setMonth(d.getMonth() + num);
    else if (unit.startsWith("year")) d.setFullYear(d.getFullYear() + num);
    else return null;

    return d;
  }, [duration]);

  const handleConfirm = useCallback(() => {
    if (!reason.trim()) return alert("Please provide a reason before banning.");
    banMutation.mutate(
      { userId: user._id, action: "ban", reason, duration },
      {
        onSuccess: () => {
          setReason("");
          setDuration("");
          setTimeout(onClose, 400);
        },
      }
    );
  }, [user, reason, duration, banMutation, onClose]);

  if (!user) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="sm"
      withCloseButton={false}
      classNames={{ content: "banmodal", body: "banmodal__body" }}
    >
      {/* HEADER */}
      <header className="banmodal__header">
        <div className="header-left">
          <Ban size={20} color="#ef4444" />
          <h2>Ban User</h2>
        </div>
        <button className="iconbtn close" onClick={onClose}>
          <X size={18} />
        </button>
      </header>

      {/* WARNING BANNER */}
      <div className="banmodal__alert">
        <AlertTriangle size={15} style={{ flexShrink: 0 }} />

        <p>
          You are about to ban{" "}
          <strong style={{ color: "var(--accent-clr)" }}>{user.name}</strong>.
          This will revoke their access and disable login.
        </p>
      </div>

      <Divider my="sm" opacity={0.15} />

      {/* FORM CONTENT */}
      <div className="banmodal__content">
        <label>Ban Reason</label>
        <Textarea
          placeholder="Explain the reason (policy violation, fraud, abuse...)"
          autosize
          minRows={3}
          maxRows={6}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="ban-textarea"
        />

        <label>Duration (optional)</label>
        <input
          type="text"
          className="ban-input"
          placeholder='e.g. "7 days", "2 weeks", "1 month", or "permanent"'
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        {endDate && (
          <div className="ban-preview">
            <CalendarDays size={16} />
            <span>
              Ban will end on:{" "}
              <strong>{endDate.toLocaleString()}</strong>
            </span>
          </div>
        )}

        {!endDate && duration.trim() && (
          <div className="ban-preview invalid">
            <Info size={16} />
            <span>
              Could not parse duration. Use phrases like "7 days" or "1 month".
            </span>
          </div>
        )}
      </div>

      {/* ACTION BUTTONS */}
      <Group justify="space-between" mt="md" className="banmodal__actions">
        <Button
          variant="subtle"
          color="gray"
          onClick={onClose}
          leftSection={<X size={16} />}
        >
          Cancel
        </Button>

        <Tooltip
          label={
            reason.trim()
              ? "Confirm ban"
              : "Enter a reason to enable this action"
          }
          position="left"
        >
          <Button
            color="red"
            leftSection={<Ban size={16} />}
            onClick={handleConfirm}
            disabled={!reason.trim() || banMutation.isLoading}
          >
            {banMutation.isLoading ? "Banning..." : "Confirm Ban"}
          </Button>
        </Tooltip>
      </Group>
    </Modal>
  );
};

export default BanModal;
