import React, { Suspense, lazy } from "react";
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";
import { Helmet } from "react-helmet-async";

// 🧩 Lazy-load heavy sections
const Land = lazy(() => import("../components/main/Land.jsx"));
const BrandCards = lazy(() => import("../components/main/BrandCards.jsx"));
const Laptops = lazy(() => import("../components/main/Laptops.jsx"));
const Offers = lazy(() => import("../components/main/Offers.jsx"));
const TrendingProducts = lazy(() => import("../components/main/TrendingProducts.jsx"));
const AccessoriesProducts = lazy(() => import("../components/main/AccessoriesProducts.jsx"));
const MobLandingPage = lazy(() => import("../components/main/MobLandingPage.jsx"));
const BlackFridayHero = lazy(() => import("../components/main/BlackFridayHero.jsx"));

const Loader = () => <div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>;

const Home = () => {
  const width = useWindowWidth();

  return (
    <>
      {/* ⭐ SEO Head Tags */}
      <Helmet>
        {/* Title */}
        <title>Al-Wafi for Computers</title>

        {/* Description */}
        <meta
          name="description"
          content="Al-Wafi Computers: Best laptops, gaming PCs, accessories, and electronics in Iraq. Original products, fast delivery, and great prices."
        />

        {/* Canonical URL */}
        <link rel="canonical" href="https://alwafi.net/" />

        {/* Language SEO */}
        <meta name="language" content="en, ar" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:locale:alternate" content="ar_IQ" />

        {/* Open Graph */}
        <meta property="og:title" content="Al-Wafi Computers | Laptops & Gaming" />
        <meta
          property="og:description"
          content="Shop laptops, gaming gear, accessories, and electronics in Iraq at the best prices with fast delivery."
        />
        <meta 
          property="og:image" 
          content="https://alwafi.net/home-banner.png" 
        />
        <meta property="og:url" content="https://alwafi.net/" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Al-Wafi Computers | Laptops & Gaming" />
        <meta
          name="twitter:description"
          content="Best laptops, gaming gear and electronics in Iraq."
        />
        <meta 
          name="twitter:image" 
          content="https://alwafi.net/og-banner.png" 
        />

        {/* Organization Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Al-Wafi Computers",
            url: "https://alwafi.net",
            logo: "https://alwafi.net/favicon.svg",
            sameAs: [
              "https://www.facebook.com/alwafi",
              "https://www.instagram.com/alwafi",
              "https://t.me/alwafi"
            ],
          })}
        </script>

        {/* Website Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Al-Wafi Computers",
            url: "https://alwafi.net",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://alwafi.net/search?q={search_term}",
              "query-input": "required name=search_term"
            }
          })}
        </script>
      </Helmet>

      {/* === Page Content === */}
      <Suspense fallback={<Loader />}>
        {width > 650 ? <Land /> : <MobLandingPage />}
        <BrandCards />
        <Laptops />
        <AccessoriesProducts />
        <Offers />
      </Suspense>
    </>
  );
};

export default Home;
