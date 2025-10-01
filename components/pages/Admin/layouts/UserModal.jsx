import React, { useState, useEffect } from "react";
import useUserStore from "../../../stores/useUserStore.jsx";
import "../styles/usermodal.css";

const UserModal = ({ user, isOpen, onClose }) => {
  const { updateUser } = useUserStore();

  // Local form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  // Populate form when modal opens or user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle save
  const handleSave = async () => {
    if (!user?._id) return;
    await updateUser(user._id, formData);
    onClose(); // close modal after saving
  };

  if (!isOpen) return null;

  return (
    <div className="user-modal-backdrop" onClick={onClose}>
      <div className="user-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Edit User</h2>

        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <div className="user-modal-actions">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
