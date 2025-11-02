import React from "react";
import { Modal, Button, Group } from "@mantine/core";
import { AlertTriangle } from "lucide-react";
import "../../styles/confirmmodal.css";

/**
 * Reusable Confirm Modal
 * --------------------------------
 * Props:
 *  - opened: boolean (modal open state)
 *  - onClose: function (close handler)
 *  - onConfirm: function (confirm handler)
 *  - title: string
 *  - message: string
 *  - confirmLabel?: string (default: "Confirm")
 *  - cancelLabel?: string (default: "Cancel")
 *  - color?: "red" | "yellow" | "blue" | "green" (default: "red")
 */
const ConfirmModal = ({
  opened,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  color = "red",
}) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      withCloseButton={false}
      size="sm"
      classNames={{ content: "cmodal", body: "cmodal__body" }}
    >
      <div className="cmodal__icon">
        <AlertTriangle size={42} color="var(--accent-clr)" style={{ flexShrink: 0 }} />
      </div>

      <h2 className="cmodal__title">{title}</h2>
      <p className="cmodal__message">{message}</p>

      <Group justify="flex-end" mt="lg" gap="sm">
        <Button
          variant="default"
          onClick={onClose}
          className="cmodal__btn cancel"
        >
          {cancelLabel}
        </Button>

        <Button
          color={color}
          onClick={onConfirm} // ✅ Parent handles close after mutation settles
          className="cmodal__btn confirm"
        >
          {confirmLabel}
        </Button>
      </Group>
    </Modal>
  );
};

export default ConfirmModal;
