import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css"; // 👈 required in v8
import "antd/dist/reset.css";      // optional, but keep it before MantineProvider
import App from "./App.jsx";
import favicon from "../assets/svg/wafi-logo-outline.svg";

const theme = createTheme({
  /** optional customizations */
  primaryColor: "blue",
});

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
      <MantineProvider theme={theme}>
        <App />
      </MantineProvider>
    </Router>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
