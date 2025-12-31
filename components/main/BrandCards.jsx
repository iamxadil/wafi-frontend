import React from "react";
import "../../styles/brandcards.css";
import {
  SiAsus,
  SiApple,
  SiAcer,
  SiMsibusiness as MSI,
  SiLenovo,
  SiHp,
  SiDell,
  SiLogitech as Logitech,
} from "react-icons/si";

import { TiVendorMicrosoft as Microsoft} from "react-icons/ti";

import { useNavigate } from "react-router-dom";
import useTranslate from "../hooks/useTranslate";
import useWindowWidth from '../hooks/useWindowWidth.jsx';

const BrandCards = () => {

  const navigate = useNavigate();
  const t = useTranslate();
  const width = useWindowWidth();

  const cards = [
    { name: "Asus", icon: <SiAsus /> },
    { name: "MSI", icon: <MSI /> },
    { name: "Lenovo", icon: <SiLenovo /> },
    { name: "HP", icon: <SiHp /> },
    { name: "Dell", icon: <SiDell /> }, 
    { name: "Apple", icon: <SiApple /> },
    { name: "Acer", icon: <SiAcer /> },
    { name: "Microsoft", icon: <Microsoft /> },
  ];

  return (
    <main id="brand-cards-container">
      <header className={ width > 650 ? "brand-header" : "mob-brand-header"}  style={{ alignItems: t.flexAlign }}>
        <h1>{t("Our Brands", "علاماتُنا التجارية")}</h1>
        <p>
          {t(
            "Explore the pioneers of innovation and performance.",
            "اكتشف روّاد الابتكار والأداء المتميز."
          )}
        </p>
      </header>

      <section className="brand-slider-container">
        <div className="brand-slider-wrapper">
          <div className="brand-slider">
            {cards.map((card) => (
              <div
                key={card.name}
                className="brand-card"
                onClick={() => navigate(`/category/laptops/${card.name}`)}
              >
                <div className="icon">{card.icon}</div>
                <h2>{card.name}</h2>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default BrandCards;
