import React from 'react';
import useTranslate from "../components/hooks/useTranslate.jsx";
import "../styles/cataccessories.css";
import AllMonitors from '../sections/AllMonitors.jsx';

const CatMonitors = () => {
  const t = useTranslate();

  return (
    <>
      <section className="accessories-hero">
        <div className="hero-content" style={{marginTop: "6rem"}}>
          <h1 className="hero-title">
            {t("See Beyond Limits", "رؤية تتجاوز الحدود")}{" "}
            <span>
              {t(
                "Precision That Transforms Every Frame",
                "دقة تُحوّل كل إطار"
              )}
            </span>
          </h1>

          <p className="hero-subtitle" style={{ marginTop: "2rem" }}>
            {t(
              "Where clarity meets power, and every pixel hits harder.",
              "حيث يلتقي الوضوح بالقوة، وكل بكسل يشق طريقه بحدة."
            )}
          </p>
        </div>
      </section>
      <AllMonitors />
    </>
  );
};

export default CatMonitors;
