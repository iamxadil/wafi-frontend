import React from "react";
import LandingPage from '../components/main/LandingPage.jsx';
import Land from '../components/main/Land.jsx';
import BrandCards from '../components/main/BrandCards.jsx';
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";
import Laptops from "../components/main/Laptops.jsx";
import Offers from '../components/main/Offers.jsx';
import TrendingProducts from "../components/main/TrendingProducts.jsx";
import MobLandingPage from "../components/main/MobLandingPage.jsx";

const Home = () => {

  const width = useWindowWidth();
  return (
    <>
      {width > 650 && <Land />}
      {width <= 650 && <MobLandingPage/>}
      <BrandCards />

      {/*Desktop View */}
      <Laptops />
      <Offers />
      <TrendingProducts />

      

    </>
  );
};

export default Home;
