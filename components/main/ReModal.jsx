import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/remodal.css";

const backdropVariants = {
  hidden: { opacity: 0, pointerEvents: "none" },
  visible: { opacity: 1, pointerEvents: "auto" }
};

const modalVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 }
};

const ReModal = ({ isOpen, onClose, title, children }) => {
  // Prevent scroll ON THE WRAPPER, not on <body>
  useEffect(() => {
    const html = document.documentElement;
    if (isOpen) {
      html.style.overflow = "hidden";
    } else {
      html.style.overflow = "";
    }

    return () => {
      html.style.overflow = "";
    };
  }, [isOpen]);

  // Always mounted -> zero CLS
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="remodal-overlay"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            className="remodal-content"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {title && <h2 className="remodal-title">{title}</h2>}
            <div className="remodal-body">{children}</div>

            <button className="remodal-close" onClick={onClose}>
              ×
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ReModal;
