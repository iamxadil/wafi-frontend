import React, { useState } from "react";
import {
  Modal,
  Select,
  Button,
  Group,
  Tooltip,
  Loader,
} from "@mantine/core";
import { Shield, X, UserCog, CheckCircle2 } from "lucide-react";
import "../styles/rolesmodal.css";
import { usePromoteUser } from "../../../hooks/useManageUser.jsx";

const RolesModal = ({ opened, onClose, user }) => {
  const [selectedRole, setSelectedRole] = useState(user?.role || "user");
  const promoteMutation = usePromoteUser();

  if (!user) return null;

  const handleConfirm = () => {
    if (!selectedRole) return;
    promoteMutation.mutate(
      { userId: user._id, role: selectedRole },
      {
        onSuccess: () => {
          setTimeout(onClose, 500);
        },
      }
    );
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="sm"
      withCloseButton={false}
      classNames={{ content: "rolesmodal", body: "rolesmodal__body" }}
    >
      {/* HEADER */}
      <header className="rolesmodal__header">
        <div className="header-left">
          <Shield size={20} color="var(--accent-clr)" />
          <h2>Change Role</h2>
        </div>
        <button className="iconbtn close" onClick={onClose}>
          <X size={18} />
        </button>
      </header>

      <div className="rolesmodal__content">
        <p className="rolesmodal__text">
          Update the role of <strong>{user.name}</strong>. Make sure to assign
          privileges carefully.
        </p>

      <Select
            label="Select Role"
            value={selectedRole}
            onChange={setSelectedRole}
            data={[
                { value: "user", label: "User" },
                { value: "moderator", label: "Moderator" },
                { value: "admin", label: "Admin" },
            ]}
            radius="md"
            classNames={{
                input: "rolesmodal__input",
                dropdown: "rolesmodal__dropdown",
                item: "rolesmodal__item",
                label: "rolesmodal__label",
            }}
            />

        {selectedRole === "admin" && (
          <p className="rolesmodal__warning">
            ⚠️ Admins have full control, including deletion privileges.
          </p>
        )}
      </div>

      <Group justify="space-between" mt="md" className="rolesmodal__actions">
        <Button variant="subtle" color="gray" onClick={onClose}>
          Cancel
        </Button>
        <Tooltip
          label="Apply role change"
          position="left"
        >
          <Button
            color="blue"
            onClick={handleConfirm}
            disabled={promoteMutation.isLoading}
            leftSection={
              promoteMutation.isLoading ? (
                <Loader size={16} color="#fff" />
              ) : (
                <CheckCircle2 size={16} />
              )
            }
          >
            {promoteMutation.isLoading ? "Saving..." : "Confirm"}
          </Button>
        </Tooltip>
      </Group>
    </Modal>
  );
};

export default RolesModal;
