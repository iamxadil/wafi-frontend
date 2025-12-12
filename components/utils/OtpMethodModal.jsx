import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "../../styles/optmodal.css";
import useTranslate from "../hooks/useTranslate.jsx";

const OtpMethodModal = ({ isOpen, onClose, email, phone, onSelect }) => {
  const t = useTranslate();
  const modalRef = useRef(null);
  const firstButtonRef = useRef(null);

  /* ---------------------------------------------------------
     ESC to close
  --------------------------------------------------------- */
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  /* ---------------------------------------------------------
     Prevent background scroll + autofocus modal
  --------------------------------------------------------- */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      setTimeout(() => {
        firstButtonRef.current?.focus();
      }, 15);
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  /* ---------------------------------------------------------
     Completely remove from DOM when closed
     (Prevents React static flag warnings!)
  --------------------------------------------------------- */
  if (!isOpen) return null;

  /* ---------------------------------------------------------
     Modal Content
  --------------------------------------------------------- */
  return createPortal(
    <div className="otp-modal-overlay" role="dialog" aria-modal="true">

      <div className="otp-modal" ref={modalRef}>

        <h2>{t("Choose OTP Method", "إختر طريقة الإرسال")}</h2>

        <p className="otp-modal-desc">
          {t("Send verification code to:", "إرسال رمز التحقق إلى:")}
        </p>

        <div className="otp-option-display">
          <p><strong>Email:</strong> {email || "—"}</p>
          <p><strong>WhatsApp:</strong> {phone ? `+964${phone}` : "—"}</p>
        </div>

        <div className="otp-modal-buttons">

          {/* EMAIL OPTION */}
          {email && (
            <button
              ref={firstButtonRef}
              className="otp-btn email"
              onClick={() => onSelect("email")}
            >
              {t("Send to Email", "إرسال إلى البريد")}
            </button>
          )}

          {/* WHATSAPP OPTION */}
          {phone && (
            <button
              className="otp-btn whatsapp"
              onClick={() => onSelect("whatsapp")}
              disabled
            >
              {t("Send to WhatsApp", "إرسال إلى واتساب")}
            </button>
          )}

          {/* CANCEL */}
          <button className="otp-btn cancel" onClick={onClose}>
            {t("Cancel", "إلغاء")}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default OtpMethodModal;
