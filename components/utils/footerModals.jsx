import React from "react";
import ReModal from "../main/ReModal.jsx";
import useTranslate from "../hooks/useTranslate.jsx";

export default function FooterModals({
  modalType,
  onClose,
  ABOUT_US_CONTENT,
  SERVICES_CONTENT,
  FAQ_CONTENT,
  t
}) {
  
  return (
    <>
      <ReModal isOpen={modalType === "about"} onClose={onClose} title={ABOUT_US_CONTENT.title}>
        {ABOUT_US_CONTENT.paragraphs.map((p, i) => (
          <div key={i} style={{ marginBottom: "1rem", textAlign: t.textAlign }}>
            {p.heading && <h3 style={{ color: "#6ee7b7", marginBottom: "0.5rem" }}>{p.heading}</h3>}
            <p style={{ lineHeight: 1.6 }}>{p.text}</p>
          </div>
        ))}
      </ReModal>

      <ReModal isOpen={modalType === "services"} onClose={onClose} title={SERVICES_CONTENT.title}>
        {SERVICES_CONTENT.paragraphs.map((p, i) => (
          <div key={i} style={{ marginBottom: "1rem", textAlign: t.textAlign }}>
            {p.heading && <h3 style={{ color: "#6ee7b7", marginBottom: "0.5rem" }}>{p.heading}</h3>}
            <p style={{ lineHeight: 1.6 }}>{p.text}</p>
          </div>
        ))}
      </ReModal>

      <ReModal isOpen={modalType === "faq"} onClose={onClose} title={FAQ_CONTENT.title}>
        {FAQ_CONTENT.items.map((item, i) => (
          <div key={i} style={{ marginBottom: "1rem", textAlign: t.textAlign }}>
            <h3 style={{ color: "#6ee7b7", marginBottom: "0.3rem" }}>{item.question}</h3>
            <p style={{ lineHeight: 1.6 }}>{item.answer}</p>
          </div>
        ))}
      </ReModal>
    </>
  );
}
