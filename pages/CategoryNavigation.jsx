// src/pages/CategoryNavigation.jsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";

import ProductCard from "../components/main/ProductCard.jsx";
import ProductBlock from "../components/main/ProductBlock.jsx";
import Pagination from "../components/main/Pagination.jsx";
import { Spin } from "antd";

import useCategoryStore from "../components/stores/useCategoryStore.jsx";
import { useCategoryQuery } from "../components/hooks/useCategoryQuery.jsx";
import "../styles/categorynavigation.css";
import useTranslate from "../components/hooks/useTranslate.jsx";

/* ============================================================
   🌍 TRANSLATION MAPS (Category + Brand)
   - Only define once
   - Auto-translates dynamically using your t() hook
============================================================ */

const CATEGORY_TRANSLATIONS = {
  laptops: "لابتوبات",
  accessories: "اكسسوارات",
  networking: "معدات الشبكة",
  monitors: "الشاشات",
  printers: "طابعات",
  components: "قطع الحاسبة",
  storage: "ذواكر و أقراص",
  headphones: "السماعات",
  speakers: "المكبرات الصوتية",
  bags: "الحقائب",
  mice: "الماوسات",
  keyboards: "لوحات المفاتيح",
  "combo kb & m": "لوحات مفاتيح + ماوسات",
  "cooling pads": "قواعد التبريد",
  "mousepads & deskpads": "لوحات الماوسات",
  "hard disks & ssds": "التخزين",
  "ram": "الرامات"

};

const BRAND_TRANSLATIONS = {
  asus: "أسوس",
  acer: "أيسر",
  lenovo: "لينوفو",
  hp: "اتش بي",
  dell: "ديل",
  apple: "آبل",
  samsung: "سامسونغ",
  logitech: "لوجيتك",
  razer: "ريزر",
  msi: "أم أس آي",
  huawei: "هواوي",
  xiaomi: "شاومي",
  sony: "سوني",
  microsfot: "مايكروسوفت"
};

/* Helper to dynamically translate category or brand */
const translateName = (name, map, t) => {
  if (!name) return ""; // fallback
  const en = name;
  const ar = map[name.toLowerCase()] || name; // fallback to same text
  return t(en, ar);
};

const CategoryNavigation = () => {
  const width = useWindowWidth();
  const isMobile = width < 650;
  const t = useTranslate();

  const { categoryName, brandName } = useParams();
  const category = categoryName?.trim() || "";
  const brand = brandName?.trim() || "";

  /* =====================================
     🔥 DYNAMIC TRANSLATION FOR TITLES
  ===================================== */
  const translatedCategory = translateName(category, CATEGORY_TRANSLATIONS, t);
  const translatedBrand = translateName(brand, BRAND_TRANSLATIONS, t);

  const {
    productsParams,
    setProductsParams,
    offersParams,
    setOffersParams,
    searchTerm,
    setSearchTerm,
  } = useCategoryStore();

  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const location = useLocation();

  // Reset search + params on navigation
  useEffect(() => {
    setSearchTerm("");
    setDebouncedSearch("");

    setProductsParams((prev) => ({
      ...prev,
      page: 1,
      category,
      ...(brand ? { brand } : {}),
      search: "",
    }));

    setOffersParams((prev) => ({
      ...prev,
      page: 1,
      category,
      ...(brand ? { brand } : {}),
      search: "",
    }));
  }, [location.pathname, location.key]);

  /* Fetch data */
  const { data: productsData, isLoading: loadingProducts } = useCategoryQuery({
    ...productsParams,
    category,
    ...(brand && { brand }),
  });

  const { data: offersData, isLoading: loadingOffers } = useCategoryQuery({
    ...offersParams,
    category,
    ...(brand && { brand }),
  });

  const displayedProducts = (productsData?.products || []).filter(
    (p) =>
      !debouncedSearch ||
      p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const displayedOffers = (offersData?.products || []).filter(
    (p) =>
      !debouncedSearch ||
      p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const nothingAtAll =
    !loadingProducts &&
    !loadingOffers &&
    !searchTerm &&
    productsData?.products?.length === 0 &&
    offersData?.products?.length === 0;

  const isArabic = t("en", "ar") === "ar";
  /* ============================================================
     RENDER
  ============================================================= */
  return (
    <div className="category-page">
      {/* 🌟 Coming Soon */}
      {nothingAtAll ? (
        <div className="coming-soon">
          <h1>{t("Coming Soon...", "..يتوفر قريباً")}</h1>
        </div>
      ) : (
        <>
          {/* HEADER */}
          <header className="cat-header" style={{...(isArabic && width < 650 && { alignItems: t.flexAlign })}}>
            <h1>
            {isArabic
              ? `${t("Products", "منتجات")} ${translatedBrand || translatedCategory}`
              : `${translatedBrand || translatedCategory} ${t("Products", "منتجات")}`
            }
          </h1>

            <div className="search-cat">
              <Search />
              <input
                type="search"
                placeholder={t("Search Products...", "بحث المنتجات...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </header>

          {/* DESKTOP */}
          {!isMobile && (
            <>
              {/* PRODUCTS */}
              <main id="cat-container">
                <div
                  className="pc-pr-cards"
                  style={{ justifyContent: "center", padding: "0" }}
                >
                  {loadingProducts ? (
                    <div className="loading-container">
                      <h2 style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        Loading <Spin />
                      </h2>
                    </div>
                  ) : displayedProducts.length > 0 ? (
                    displayedProducts.map((p) => (
                      <ProductCard key={p._id} product={p} />
                    ))
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      {t("No Products Found", "لا توجد منتجات")}
                    </div>
                  )}
                </div>

                {productsData?.pagination.totalPages > 1 && (
                  <Pagination
                    currentPage={productsData.pagination.currentPage}
                    totalPages={productsData.pagination.totalPages}
                    onPageChange={(page) => setProductsParams({ page })}
                  />
                )}
              </main>

              {/* OFFERS */}
              <main id="cat-container">
                <header className="offers-header" >
                 <h1>
                {isArabic
                  ? `${t("Offers", "عروض")} ${translatedBrand || translatedCategory}`
                  : `${translatedBrand || translatedCategory} ${t("Offers", "عروض")}`
                }
              </h1>
                </header>

                <div
                  className="pc-pr-cards"
                  style={{
                    justifyContent: "center",
                    marginTop: "4rem",
                    padding: "0",
                  }}
                >
                  {loadingOffers ? (
                    <div className="loading-container">
                      <h2 style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        Loading <Spin />
                      </h2>
                    </div>
                  ) : displayedOffers.length > 0 ? (
                    displayedOffers.map((p) => (
                      <ProductCard key={p._id} product={p} />
                    ))
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      {t("No Offers Found", "لا توجد عروض")}
                    </div>
                  )}
                </div>

                {offersData?.pagination.totalPages > 1 && (
                  <Pagination
                    currentPage={offersData.pagination.currentPage}
                    totalPages={offersData.pagination.totalPages}
                    onPageChange={(page) => setOffersParams({ page })}
                  />
                )}
              </main>
            </>
          )}

          {/* MOBILE */}
          {isMobile && (
            <main className="mob-pr-container">
              <div className="mobile-grid">
                {displayedProducts.length > 0 ? (
                  displayedProducts.map((p) => (
                    <ProductBlock key={p._id} product={p} />
                  ))
                ) : (
                  <div className="mob-loading">
                    {t("No Products Found", "لا توجد منتجات")}
                  </div>
                )}
              </div>

              <Pagination
                currentPage={productsData?.pagination.currentPage || 1}
                totalPages={productsData?.pagination.totalPages || 1}
                onPageChange={(page) => setProductsParams({ page })}
              />

              <header className="offers-header" >
                <h1>
                  {t("Offers for", "عروض")}{" "}
                  {translatedBrand || translatedCategory}
                </h1>
              </header>

              <div className="mobile-grid">
                {displayedOffers.length > 0 ? (
                  displayedOffers.map((p) => (
                    <ProductBlock key={p._id} product={p} />
                  ))
                ) : (
                  <div className="mob-loading">
                    {t("No Offers Found", "لا توجد عروض")}
                  </div>
                )}
              </div>

              <Pagination
                currentPage={offersData?.pagination.currentPage || 1}
                totalPages={offersData?.pagination.totalPages || 1}
                onPageChange={(page) => setOffersParams({ page })}
              />
            </main>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryNavigation;
