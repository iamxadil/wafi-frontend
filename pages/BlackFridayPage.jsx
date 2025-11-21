import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useBlackFridayQuery } from "../components/hooks/useBlackFridayQuery";
import useTranslate from "../components/hooks/useTranslate";
import Pagination from "../components/main/Pagination";
import useWindowWidth from "../components/hooks/useWindowWidth";
import ProductCard from "../components/main/ProductCard";
import ProductBlock from "../components/main/ProductBlock";
import "../styles/blackfridaypage.css";
import '../styles/swipe.css'

const BlackFridayPage = () => {
  const [page, setPage] = useState(1);
  const limit = 4;

  const { data, isLoading, isError } = useBlackFridayQuery(page, limit);
  const t = useTranslate();
  const width = useWindowWidth();

  const products = data?.products || [];
  const totalPages = data?.pages || 1;
  const currentPage = data?.page || page;

  // ============================
  // 🔥 Swipe Pagination (mobile)
  // ============================
  const handleSwipeEnd = (e, info) => {
    const offset = info.offset.x;

    if (offset < -120 && currentPage < totalPages) {
      setPage(currentPage + 1); // Swipe left → next
    }
    if (offset > 120 && currentPage > 1) {
      setPage(currentPage - 1); // Swipe right → prev
    }
  };

  // ============================
  // ⭐ Countdown Logic
  // ============================
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, mins: 0, secs: 0,
  });

  useEffect(() => {
    const end = new Date("2025-11-30T23:59:59").getTime();
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = end - now;

      setTimeLeft({
        days: Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))),
        hours: Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24)),
        mins: Math.max(0, Math.floor((diff / 1000 / 60) % 60)),
        secs: Math.max(0, Math.floor((diff / 1000) % 60)),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const format = (num) => String(num).padStart(2, "0");

  return (
    <div id="black-friday-page" style={{ paddingBottom: "4rem" }}>
      {/* ============================== */}
      {/* ⭐ BUTTERY HERO */}
      {/* ============================== */}
      <section
        className="bf-hero-butter"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          e.currentTarget.style.setProperty("--x", `${x}px`);
          e.currentTarget.style.setProperty("--y", `${y}px`);
        }}
      >
        <div className="bf-butter-content">
          <h1>{t("Black Friday Offers", "عروض الجمعة السوداء")}</h1>

          <p>
            {t(
              "Premium discounts for a limited time.",
              "خصومات مميزة لفترة محدودة."
            )}
          </p>

          <div className="bf-butter-countdown">
            <div><span>{format(timeLeft.days)}</span><label>{t("Days","يوم")}</label></div>
            <div><span>{format(timeLeft.hours)}</span><label>{t("Hours","ساعة")}</label></div>
            <div><span>{format(timeLeft.mins)}</span><label>{t("Minutes","دقيقة")}</label></div>
            <div><span>{format(timeLeft.secs)}</span><label>{t("Seconds","ثانية")}</label></div>
          </div>
        </div>

        {/* particles */}
        <div className="bf-butter-particle p1"></div>
        <div className="bf-butter-particle p2"></div>
        <div className="bf-butter-particle p3"></div>
      </section>

      {/* ============================== */}
      {/* ⭐ PRODUCTS */}
      {/* ============================== */}
      <div className="bf-grid-wrapper">
        {isLoading && <p className="bf-loading">{t("Loading...", "جاري التحميل...")}</p>}
        {isError && (
          <p className="bf-error">
            {t("Failed to load products.", "فشل تحميل المنتجات.")}
          </p>
        )}

        {!isLoading && products.length === 0 && (
          <p className="bf-empty">
            {t("No Black Friday deals available.", "لا توجد عروض للجمعة السوداء.")}
          </p>
        )}

        {/* ========================== */}
        {/* ⭐ Desktop — normal grid */}
        {/* ========================== */}
        {width > 650 && (
          <div className="pc-pr-cards">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}

        {/* ========================== */}
        {/* ⭐ Mobile — SWIPE PAGINATION */}
        {/* ========================== */}
        {width <= 650 && (
          <div className="swipe-lock">
          <motion.div
            className="swipe-mobile"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.22}
            onDragEnd={handleSwipeEnd}
              dragTransition={{ power: 0.2 }}
          >
            <div className="mobile-grid">
              {products.map((p) => (
                <ProductBlock key={p._id} product={p} />
              ))}
            </div>
          </motion.div>
          </div>
        )}

        {/* ========================== */}
        {/* ⭐ Bottom Pagination */}
        {/* ========================== */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}
      </div>
    </div>
  );
};

export default BlackFridayPage;
