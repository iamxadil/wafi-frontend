import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "antd/dist/reset.css";
import App from "./App.jsx";
import favicon from "../assets/svg/wafi-logo-outline.svg";



// Create a small wrapper to handle favicon setup
function Root() {
  useEffect(() => {
    const link =
      document.querySelector("link[rel~='icon']") || document.createElement("link");
    link.rel = "icon";
    link.type = "image/svg+xml";
    link.href = favicon;
    document.head.appendChild(link);
  }, []);

  return (
    <Router>
      <App />
    </Router>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
