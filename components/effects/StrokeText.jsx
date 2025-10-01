import React from "react";
import { motion } from "framer-motion";
import "../../styles/strokeText.css";

const StrokeText = ({ children }) => {
  return (
    <h1 className="stroke-text-wrapper">
      <span className="stroke-layer">{children}</span>
      <motion.span
        className="fill-layer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 2, ease: "easeInOut" }}
      >
        {children}
      </motion.span>
    </h1>
  );
};

export default StrokeText;
