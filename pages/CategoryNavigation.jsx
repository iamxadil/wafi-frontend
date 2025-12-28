// src/pages/CategoryNavigation.jsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";

import ProductCard from "../components/main/ProductCard.jsx";
import ProductBlock from "../components/main/ProductBlock.jsx";
import Pagination from "../components/main/Pagination.jsx";
import { Spin } from "antd";

import useCategoryStore from "../components/stores/useCategoryStore.jsx";
import { useCategoryQuery } from "../components/hooks/useCategoryQuery.jsx";
import { useCategoryDynamicFilters } from "../components/query/useCategoryDynamicFilters.jsx";
import "../styles/categorynavigation.css";
import useTranslate from "../components/hooks/useTranslate.jsx";
import Filter from "../components/common/Filter.jsx";
import Sort from "../components/common/Sort.jsx";

/* ============================================================
   🌍 CATEGORY TRANSLATIONS
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
  const location = useLocation();

  // Params
  const { categoryName, brandName } = useParams();
  const category = categoryName?.trim() || "";
  const categoryParam = category.charAt(0).toUpperCase() + category.slice(1);
  const brand = brandName?.trim() || "";

  const translatedCategory = translateCategory(category, t);
  const displayBrand = brand;
  const isArabic = t("en", "ar") === "ar";

  // Zustand store
  const {
    productsParams,
    setProductsParams,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    resetFilters,
    sort,
    setSort,
  } = useCategoryStore();

  const [tempFilters, setTempFilters] = useState(filters);

  // Fetch dynamic filters
  const { data: dynamicData, isLoading: filtersLoading } = useCategoryDynamicFilters({
    category: categoryParam,
    brand,
  });
  const dynamicFilters = dynamicData?.filters || [];

  /* =============================
     Reset on navigation
  ============================= */
  useEffect(() => {
    resetFilters();
    setTempFilters({});
    setSearchTerm("");
    setProductsParams({
      page: 1,
      category,
      ...(brand ? { brand } : {}),
      search: "",
    });
  }, [location.pathname, location.key]);

  /* =============================
     Fetch raw products for Coming Soon check
  ============================= */
  const { data: rawProductsData, isLoading: loadingRawProducts } = useCategoryQuery({
    page: 1,
    limit: 10,
    category,
    ...(brand && { brand }),
  });

  const nothingAtAll =
    !loadingRawProducts &&
    (!rawProductsData?.products || rawProductsData.products.length === 0);

  /* =============================
     Fetch products with filters/search
  ============================= */
  const { data: productsData, isLoading: loadingProducts } = useCategoryQuery({
    ...productsParams,
    category,
    ...(brand && { brand }),
    ...filters,
    sort,
    search: searchTerm,
  });

  const products = productsData?.products || [];
  const pagination = productsData?.pagination || { currentPage: 1, totalPages: 1 };

  /* =============================
     Handlers
  ============================= */
  const handlePageChange = (page) =>
    setProductsParams({ ...productsParams, page });

  const handleApplyFilters = (selected) => {
    setFilters(selected);
    setProductsParams({ ...productsParams, page: 1 });
  };

  const handleClearAll = () => {
    resetFilters();
    setTempFilters({});
    setProductsParams({ ...productsParams, page: 1 });
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setProductsParams({ ...productsParams, search: value, page: 1 });
  };

  const handleSwipeEnd = (e, info) => {
    const current = pagination.currentPage;
    const total = pagination.totalPages;
    if (info.offset.x < -120 && current < total) handlePageChange(current + 1);
    if (info.offset.x > 120 && current > 1) handlePageChange(current - 1);
  };

  /* =============================
     Render
  ============================= */
  return (
    <div className="category-page">
      {nothingAtAll ? (
        <div className="coming-soon">
          <h1>{t("Coming Soon...", "..يتوفر قريباً")}</h1>
        </div>
      ) : (
        <>
          {/* Header */}
          <header
            className="cat-header"
            style={{ alignItems: isArabic && isMobile && t.alignItems }}
          >
            <h1 style={{ textAlign: isArabic ? "right" : "left" }}  dir={isArabic ? "rtl" : "ltr"}>
              {isArabic
                ? `${t("Products", "منتجات")} ${displayBrand || translatedCategory}`
                : `${displayBrand || translatedCategory} ${t("Products", "منتجات")}`}
            </h1>

            <div className="search-cat" style={{ flexDirection: isArabic ? "row-reverse" : "row" }}>
              <Search />
              <input
                type="search"
                dir={isArabic ? "rtl" : "ltr"}
                style={{ textAlign: isArabic ? "right" : "left" }}
                placeholder={t("Search Products...", "بحث المنتجات...")}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>

            <div className="header-right">
              <Filter
                title={width > 650 && t("Filters", "الفلاتر")}
                filters={dynamicFilters}
                selected={tempFilters}
                onChange={setTempFilters}
                onClearAll={handleClearAll}
                onApply={handleApplyFilters}
              />

              <Sort
                title={width > 650 && t("Sort", "الترتيب")}
                selected={sort}
                onChange={setSort}
              />
            </div>
          </header>

          {/* Desktop */}
          {!isMobile && (
            <main id="cat-container">
              <div className="pc-pr-cards" style={{ justifyContent: "center", padding: 0 }}>
                {loadingProducts ? (
                  <div className="loading-container">
                    <h2>Loading <Spin /></h2>
                  </div>
                ) : products.length ? (
                  products.map((p) => <ProductCard key={p._id} product={p} />)
                ) : (
                  <div>{t("No Products Found", "لا توجد منتجات")}</div>
                )}
              </div>

              {pagination.totalPages > 1 && (
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </main>
          )}

          {/* Mobile */}
          {isMobile && (
            <main className="mob-pr-container">
              <motion.div
                className="swipe-mobile"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                dragMomentum={false}
                dragPropagation={false}
                onDragEnd={handleSwipeEnd}
              >
                <div className="mobile-grid">
                  {products.map((p) => (
                    <ProductBlock key={p._id} product={p} />
                  ))}
                </div>
              </motion.div>

              {pagination.totalPages > 1 && (
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </main>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryNavigation;
