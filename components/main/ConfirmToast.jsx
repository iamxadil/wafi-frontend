// src/components/ConfirmToast.jsx
import React from "react";
import { toast } from "react-toastify";
import "../../styles/confirmtoast.css";

const ConfirmToast = ({ message, onConfirm }) => {
  const handleConfirm = async () => {
    await onConfirm();
    toast.dismiss(); // close toast
  };

  const handleCancel = () => {
    toast.dismiss();
  };

  return (
    <div className="confirm-toast">
      <p>{message}</p>
      <div className="toast-buttons">
        <button className="toast-yes" onClick={handleConfirm}>
          Yes
        </button>
        <button className="toast-no" onClick={handleCancel}>
          No
        </button>
      </div>
    </div>
  );
};

export const showConfirmToast = (message, onConfirm) => {
  toast.info(<ConfirmToast message={message} onConfirm={onConfirm} />, {
    position: "top-center",
    autoClose: false,
    closeOnClick: false,
    draggable: false,
  });
};
