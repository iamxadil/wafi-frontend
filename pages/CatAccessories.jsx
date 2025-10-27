import React from "react";
import "../styles/cataccessories.css";
import SearchDropdown from "../components/main/SearchDropdown.jsx";
import useAccessoriesStore from "../components/stores/useAccessoriesStore.jsx";
import { useAccessoriesQuery } from "../components/hooks/useAccessoriesQuery.jsx";
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";
import Pagination from "../components/main/Pagination.jsx";
import Loading from "../components/main/Loading.jsx";
import MobileCard from "../components/main/MobileCard.jsx";
import ProductGrid from "../components/main/ProductGrid.jsx";
import useTranslate from "../components/hooks/useTranslate.jsx";

const CatAccessories = () => {
  const width = useWindowWidth();
  const t = useTranslate();

  // Zustand state
  const params = useAccessoriesStore((state) => state.accessoriesPageParams);
  const setParams = useAccessoriesStore((state) => state.setAccessoriesPageParams);
  const searchParam = useAccessoriesStore((state) => state.searchParam);
  const setSearchParam = useAccessoriesStore((state) => state.setSearchParam);

  // Query
  const { data: accessories, isLoading, isError } = useAccessoriesQuery(params);
  const products = accessories?.products || [];
  const pagination = accessories?.pagination || { currentPage: 1, totalPages: 0 };

  // Search
  const { data: searchData } = useAccessoriesQuery({
    ...params,
    search: searchParam,
    page: 1,
    limit: 5,
  });
  const searchResults = searchData?.products || [];

  // Handlers
  const handlePageChange = (page) => {
    if (page !== pagination.currentPage) setParams({ page });
  };

  const handleSelectSearch = (product) => {
    setParams({ search: product.name, page: 1 });
    setSearchParam("");
  };

  // Handle Errors
  if (isLoading) return <Loading message={t("Loading Accessories...", "جاري تحميل الإكسسوارات...")} />;
  if (isError)
    return <p style={{ textAlign: "center" }}>{t("Failed to load accessories.", "فشل تحميل الإكسسوارات.")}</p>;

  return (
    <>
      {/* === HERO SECTION === */}
      <section className="accessories-hero">
        <div className="hero-content">
          {/* Gradient glows ONLY behind text */}
          <div className="blur-shape blur-1"></div>
          <div className="blur-shape blur-2"></div>

          <h1 className="hero-title">
            {t("Elevate Your", "ارتقِ بـ")} <span>{t("Accessories", "إكسسواراتك")}</span> {t("Game", "إلى المستوى التالي")}
          </h1>
          <p className="hero-subtitle" style={{marginTop: "2rem"}}>
            {t(
              "Discover precision-crafted designs made for performance, style, and innovation.",
              "اكتشف تصاميم دقيقة الصنع تجمع بين الأداء والأناقة والابتكار."
            )}
          </p>
        </div>

        {/* Search Dropdown */}
        <div className="search-dropdown-wrapper">
          <SearchDropdown
            width={600}
            products={searchResults}
            value={searchParam}
            onChange={(e) => setSearchParam(e.target.value)}
            onSelect={handleSelectSearch}
          />
        </div>
      </section>

      {/* === MAIN CONTENT === */}
      <main id="pc-pr-container">
        <header className="pr-header" style={{flexDirection: t.rowReverse}}>
          <h1>{t("Accessories", "الإكسسوارات")}</h1>
        </header>

        <div className={width > 650 ? "products-grid-container cat-grid" : "mob-pr-cards"}>
          {products.length > 0 ? (
            products.map((product, i) =>
              width > 650 ? (
                <ProductGrid key={product._id || product.id} product={product} />
              ) : (
                <MobileCard key={product._id || product.id} product={product} customDelay={i * 0.08} />
              )
            )
          ) : (
            <p style={{ textAlign: "center" }}>
              {t("No accessories found.", "لم يتم العثور على إكسسوارات.")}
            </p>
          )}
        </div>

        {products.length > 0 && pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </main>
    </>
  );
};

export default CatAccessories;
