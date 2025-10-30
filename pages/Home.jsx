import React, { Suspense, lazy } from "react";
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";

// 🧩 Lazy-load heavy sections
const Land = lazy(() => import("../components/main/Land.jsx"));
const BrandCards = lazy(() => import("../components/main/BrandCards.jsx"));
const Laptops = lazy(() => import("../components/main/Laptops.jsx"));
const Offers = lazy(() => import("../components/main/Offers.jsx"));
const TrendingProducts = lazy(() => import("../components/main/TrendingProducts.jsx"));
const AccessoriesProducts = lazy(() => import("../components/main/AccessoriesProducts.jsx"));
const MobLandingPage = lazy(() => import("../components/main/MobLandingPage.jsx"));

// Simple fallback while chunks load
const Loader = () => <div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>;

const Home = () => {
  const width = useWindowWidth();

  return (
    <Suspense fallback={<Loader />}>
      
      {width > 650 ? <Land /> : <MobLandingPage />}

      <BrandCards />
      <Laptops />
      <AccessoriesProducts />
      <Offers />
      <TrendingProducts />
    </Suspense>
  );
};

export default Home;
