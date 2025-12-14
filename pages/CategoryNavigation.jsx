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
   🌍 CATEGORY TRANSLATIONS (ONLY CATEGORIES, NOT BRANDS)
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
  ram: "الرامات",
};

/* Helper: translate category only */
const translateCategory = (name, t) => {
  if (!name) return "";
  const ar = CATEGORY_TRANSLATIONS[name.toLowerCase()] || name;
  return t(name, ar);
};

const CategoryNavigation = () => {
  const width = useWindowWidth();
  const isMobile = width < 650;
  const t = useTranslate();

  const { categoryName, brandName } = useParams();
  const category = categoryName?.trim() || "";
  const brand = brandName?.trim() || "";

  const isArabic = t("en", "ar") === "ar";

  /* =====================================
     🔥 DISPLAY NAMES
  ===================================== */
  const translatedCategory = translateCategory(category, t);
  const displayBrand = brand; // ❗ brand is NEVER translated

  const {
    productsParams,
    setProductsParams,
    offersParams,
    setOffersParams,
    searchTerm,
    setSearchTerm,
  } = useCategoryStore();

  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  /* =====================================
     🔍 Debounce Search
  ===================================== */
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const location = useLocation();

  /* =====================================
     ♻️ Reset on Navigation
  ===================================== */
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

  /* =====================================
     📡 Fetch Data
  ===================================== */
  const { data: productsData, isLoading: loadingProducts } =
    useCategoryQuery({
      ...productsParams,
      category,
      ...(brand && { brand }),
    });

  const { data: offersData, isLoading: loadingOffers } =
    useCategoryQuery({
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

  /* ============================================================
     🖥️ RENDER
  ============================================================= */
  return (
    <div
      className="category-page"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {nothingAtAll ? (
        <div className="coming-soon">
          <h1>{t("Coming Soon...", "..يتوفر قريباً")}</h1>
        </div>
      ) : (
        <>
          {/* ================= HEADER ================= */}
          <header
            className="cat-header"
            style={{
              alignItems: isArabic && isMobile && t.alignItems ,
            }}
          >
            <h1 style={{ textAlign: isArabic ? "right" : "left" }}>
              {isArabic
                ? `${t("Products", "منتجات")} ${
                    displayBrand || translatedCategory
                  }`
                : `${displayBrand || translatedCategory} ${t(
                    "Products",
                    "منتجات"
                  )}`}
            </h1>

            <div
              className="search-cat"
              style={{
                flexDirection: isArabic ? "row-reverse" : "row",
              }}
            >
              <Search />
              <input
                type="search"
                dir={isArabic ? "rtl" : "ltr"}
                style={{ textAlign: isArabic ? "right" : "left" }}
                placeholder={t(
                  "Search Products...",
                  "بحث المنتجات..."
                )}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </header>

          {/* ================= DESKTOP ================= */}
          {!isMobile && (
            <>
              <main id="cat-container">
                <div
                  className="pc-pr-cards"
                  style={{ justifyContent: "center", padding: 0 }}
                >
                  {loadingProducts ? (
                    <div className="loading-container">
                      <h2>
                        Loading <Spin />
                      </h2>
                    </div>
                  ) : displayedProducts.length ? (
                    displayedProducts.map((p) => (
                      <ProductCard key={p._id} product={p} />
                    ))
                  ) : (
                    <div>{t("No Products Found", "لا توجد منتجات")}</div>
                  )}
                </div>

                {productsData?.pagination.totalPages > 1 && (
                  <Pagination
                    currentPage={productsData.pagination.currentPage}
                    totalPages={productsData.pagination.totalPages}
                    onPageChange={(page) =>
                      setProductsParams({ page })
                    }
                  />
                )}
              </main>

              {/* ================= OFFERS ================= */}
              <main id="cat-container">
                <header className="offers-header">
                  <h1 style={{ textAlign: isArabic ? "right" : "left" }}>
                    {isArabic
                      ? `${t("Offers", "عروض")} ${
                          displayBrand || translatedCategory
                        }`
                      : `${displayBrand || translatedCategory} ${t(
                          "Offers",
                          "عروض"
                        )}`}
                  </h1>
                </header>

                <div className="pc-pr-cards">
                  {loadingOffers ? (
                    <Spin />
                  ) : displayedOffers.length ? (
                    displayedOffers.map((p) => (
                      <ProductCard key={p._id} product={p} />
                    ))
                  ) : (
                    <div>{t("No Offers Found", "لا توجد عروض")}</div>
                  )}
                </div>

                {offersData?.pagination.totalPages > 1 && (
                  <Pagination
                    currentPage={offersData.pagination.currentPage}
                    totalPages={offersData.pagination.totalPages}
                    onPageChange={(page) =>
                      setOffersParams({ page })
                    }
                  />
                )}
              </main>
            </>
          )}

          {/* ================= MOBILE ================= */}
          {isMobile && (
            <main className="mob-pr-container">
              <div className="mobile-grid">
                {displayedProducts.map((p) => (
                  <ProductBlock key={p._id} product={p} />
                ))}
              </div>

              <Pagination
                currentPage={productsData?.pagination.currentPage || 1}
                totalPages={productsData?.pagination.totalPages || 1}
                onPageChange={(page) =>
                  setProductsParams({ page })
                }
              />

              <header className="offers-header">
                <h1 style={{ textAlign: isArabic ? "right" : "left" }}>
                  {isArabic
                    ? `${t("Offers", "عروض")} ${
                        displayBrand || translatedCategory
                      }`
                    : `${t("Offers for", "Offers for")} ${
                        displayBrand || translatedCategory
                      }`}
                </h1>
              </header>

              <div className="mobile-grid">
                {displayedOffers.map((p) => (
                  <ProductBlock key={p._id} product={p} />
                ))}
              </div>

              <Pagination
                currentPage={offersData?.pagination.currentPage || 1}
                totalPages={offersData?.pagination.totalPages || 1}
                onPageChange={(page) =>
                  setOffersParams({ page })
                }
              />
            </main>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryNavigation;
