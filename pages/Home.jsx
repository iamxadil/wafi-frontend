import React from "react";
import LandingPage from '../components/main/LandingPage.jsx';
import BrandCards from '../components/main/BrandCards.jsx';
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";
import TopProducts from "../components/main/TopProducts.jsx";
import Laptops from "../components/main/Laptops.jsx";
import Offers from '../components/main/Offers.jsx';
import TrendingProducts from "../components/main/TrendingProducts.jsx";
import MobLandingPage from "../components/main/MobLandingPage.jsx";

const Home = () => {

  const width = useWindowWidth();
  return (
    <>
      {width > 650 && <LandingPage />}
      {width <= 650 && <MobLandingPage/>}
      <BrandCards />

      {/*Desktop View */}
      <TopProducts />
      <Laptops />
      <Offers />
      <TrendingProducts />
      {/*Mobile View */}

    </>
  );
};

export default Home;
