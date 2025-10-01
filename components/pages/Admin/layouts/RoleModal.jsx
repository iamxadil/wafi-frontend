import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useUserStore from "../../../stores/useUserStore.jsx";
import "../styles/rolemodal.css";

const RoleModal = ({ isOpen, onClose, userToPromote }) => {
  const [role, setRole] = useState(userToPromote?.role || "user");
  const { promoteUserRole } = useUserStore();

  const handleRoleChange = (e) => setRole(e.target.value);

  const handleSubmit = async (e) => {
  e.preventDefault();
  promoteUserRole(userToPromote._id, role); 
  onClose();
};

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <form onSubmit={handleSubmit}>
              <h2>Change Role for {userToPromote.name} </h2>
              <select onChange={handleRoleChange} value={role}>
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>

              <div className="modal-actions">
                <button type="button" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" disabled={role === userToPromote?.role}>
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RoleModal;
