import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "../../styles/optmodal.css";
import useTranslate from "../hooks/useTranslate.jsx";

const OtpMethodModal = ({
  isOpen,
  onClose,
  email,
  phone,     
  phone2,     
  onSelect,
}) => {
  const t = useTranslate();
  const modalRef = useRef(null);

  const [selected, setSelected] = useState(null);

  /* ---------------------------------------------------------
     ESC to close
  --------------------------------------------------------- */
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  /* ---------------------------------------------------------
     Prevent scroll + reset state
  --------------------------------------------------------- */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setSelected(null);
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  /* ---------------------------------------------------------
     Submit
  --------------------------------------------------------- */
  const handleSend = () => {
    if (!selected) return;
    onSelect(selected);
  };

  return createPortal(
    <div className="otp-modal-overlay" role="dialog" aria-modal="true">
      <div className="otp-modal" ref={modalRef}>
        <h2 style={{textAlign: t.textAlign}}>{t("Choose OTP Method", "اختر طريقة الإرسال")}</h2>

        <p className="otp-modal-desc" style={{textAlign: t.textAlign}}>
          {t("Send verification code to:", ":إرسال رمز التحقق إلى")}
        </p>

        <div className="otp-options">
          {/* EMAIL */}
          {email && (
            <label className={`otp-option ${selected?.type === "email" ? "selected" : ""}`}>
              <input
                type="radio"
                name="otp"
                checked={selected?.type === "email"}
                onChange={() =>
                  setSelected({ type: "email", value: email })
                }
              />
              <span className="custom-check" />
              <div className="otp-option-text">
                <strong>{t("Email", "البريد الإلكتروني")}</strong>
                <span>{email}</span>
              </div>
            </label>
          )}

          {/* PRIMARY PHONE */}
          {phone && (
            <label className={`otp-option ${selected?.key === "primary" ? "selected" : ""}`}>
              <input
                type="radio"
                name="otp"
                checked={selected?.key === "primary"}
                onChange={() =>
                  setSelected({
                    type: "whatsapp",
                    key: "primary",
                    value: phone,
                  })
                }
              />
              <span className="custom-check" />
              <div className="otp-option-text">
                <strong>{t("WhatsApp (Primary)", "واتساب (الرئيسي)")}</strong>
                <span>{`+964${phone}`}</span>
              </div>
            </label>
          )}

          {/* SECONDARY PHONE */}
          {phone2 && (
            <label className={`otp-option ${selected?.key === "secondary" ? "selected" : ""}`}>
              <input
                type="radio"
                name="otp"
                checked={selected?.key === "secondary"}
                onChange={() =>
                  setSelected({
                    type: "whatsapp",
                    key: "secondary",
                    value: phone2,
                  })
                }
              />
              <span className="custom-check" />
              <div className="otp-option-text">
                <strong>{t("WhatsApp (Backup)", "واتساب (البديل)")}</strong>
                <span>{`+964${phone2}`}</span>
              </div>
            </label>
          )}
        </div>

        <div className="otp-modal-buttons">
          <button
            className="otp-btn primary"
            disabled={!selected}
            onClick={handleSend}
          >
            {t("Send OTP", "إرسال الرمز")}
          </button>

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
