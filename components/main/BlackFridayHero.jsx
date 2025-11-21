import React, { useState, useEffect } from "react";
import useTranslate from "../hooks/useTranslate.jsx";
import "../../styles/blackfriday.css";
import {useNavigate } from "react-router-dom";

const BlackFridayHero = () => {
  const t = useTranslate();
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
  });

  useEffect(() => {
    const end = new Date("2025-11-30T23:59:59").getTime();

    const x = setInterval(() => {
      const now = Date.now();
      const diff = end - now;

      setTimeLeft({
        days: Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))),
        hours: Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24)),
        mins: Math.max(0, Math.floor((diff / 1000 / 60) % 60)),
        secs: Math.max(0, Math.floor((diff / 1000) % 60)),
      });
    }, 1000);

    return () => clearInterval(x);
  }, []);

  return (
    <section className="bf-hero">
      <h1>
        {t("Black Friday Deals", "عروض الجمعة السوداء")}
      </h1>

      <p>
        {t(
          "Massive offers on laptops, accessories and gaming!",
          "أقوى التخفيضات على اللابتوبات والإكسسوارات والأجهزة!"
        )}
      </p>

      <div className="bf-countdown">
        <div className="bf-count-box">
          {timeLeft.days}<br />{t("Days", "يوم")}
        </div>
        <div className="bf-count-box">
          {timeLeft.hours}<br />{t("Hours", "ساعة")}
        </div>
        <div className="bf-count-box">
          {timeLeft.mins}<br />{t("Minutes", "دقيقة")}
        </div>
        <div className="bf-count-box">
          {timeLeft.secs}<br />{t("Seconds", "ثانية")}
        </div>
      </div>

      <button className="bf-btn" onClick={() => navigate("/black-friday")}>
        {t("Shop Now", "تسوق الآن")}
      </button>
    </section>
  );
};

export default BlackFridayHero;
