import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css"; 
import App from "./App.jsx";
import favicon from "../assets/svg/wafi-logo-filled-white.svg";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import '../styles/landingpage.css';
import '../styles/productscards.css';
import '../styles/pagination.css';
import '../styles/grids.css';
import '../styles/darkmode.css';
import '../styles/navbar.css';
import '../styles/profilepage.css';
import '../styles/bottomnavbar.css';
import MaintenancePage from "./MaintenancePage.jsx";
import useAuthStore from "../components/stores/useAuthStore.jsx";

  const theme = createTheme({
    primaryColor: "blue",
  });

 const queryClient = new QueryClient();

function isStaffRole(role) {
  return role === "admin" || role === "moderator";
}

  function Root() {
    const user = useAuthStore((s) => s.user);
    const [authReady, setAuthReady] = useState(false);

    useEffect(() => {
      const link =
        document.querySelector("link[rel~='icon']") || document.createElement("link");
      link.rel = "icon";
      link.type = "image/svg+xml";
      link.href = favicon;
      document.head.appendChild(link);
    }, []);

    useEffect(() => {
      let cancelled = false;
      (async () => {
        try {
          await useAuthStore.getState().profile();
        } finally {
          if (!cancelled) setAuthReady(true);
        }
      })();
      return () => {
        cancelled = true;
      };
    }, []);

    const showApp = authReady && isStaffRole(user?.role);

  return (
  <HelmetProvider>
    <Router>
      <MantineProvider theme={theme}>
       <QueryClientProvider client={queryClient}>
          <App />
      </QueryClientProvider>
      </MantineProvider>
    </Router>
  </HelmetProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
