// src/pages/CatLaptops.jsx
import React from 'react';
import useWindowWidth from '../components/hooks/useWindowWidth.jsx';
import ProductGrid from '../components/main/ProductGrid.jsx';
import MobileCard from '../components/main/MobileCard.jsx';
import Pagination from '../components/main/Pagination.jsx';
import useLaptopsStore from "../components/stores/useLaptopsStore.jsx";
import { useLaptopsQuery } from "../components/hooks/useLaptopsQuery.jsx";
import Loading from '../components/main/Loading.jsx';
import SearchDropdown from '../components/main/SearchDropdown.jsx';
import '../styles/catlaptops.css';

const CatLaptops = () => {
  const width = useWindowWidth();

  // -----------------------------
  // Zustand state for main laptops
  // -----------------------------
  const params = useLaptopsStore(state => state.laptopPageParams);
  const setParams = useLaptopsStore(state => state.setLaptopPageParams);

  // -----------------------------
  // Zustand state for top laptops
  // -----------------------------
  const topParams = useLaptopsStore(state => state.topPageParams);
  const setTopParams = useLaptopsStore(state => state.setTopPageParams);

  // -----------------------------
  // Zustand state for search dropdown
  // -----------------------------
  const searchParam = useLaptopsStore(state => state.searchParam);
  const setSearchParam = useLaptopsStore(state => state.setSearchParam);

  // -----------------------------
  // Fetch main laptops
  // -----------------------------
  const { data, isLoading, isError } = useLaptopsQuery(params);
  const products = data?.products || [];
  const pagination = data?.pagination || { currentPage: 1, totalPages: 0 };

  // -----------------------------
  // Fetch top laptops (backend filter)
  // -----------------------------
  const { data: topData, isTopLoading } = useLaptopsQuery({ ...topParams, isTopProduct: true });
  const topProducts = topData?.products || [];
  const topPagination = topData?.pagination || { currentPage: topParams.page, totalPages: 0 };

  // -----------------------------
  // Fetch search results for dropdown
  // -----------------------------
  const { data: searchData } = useLaptopsQuery({ 
    ...params,
    search: searchParam,
    page: 1,
    limit: 5
  });
  const searchResults = searchData?.products || [];

  // -----------------------------
  // Handlers
  // -----------------------------
  const handlePageChange = (page) => {
    if (page !== pagination.currentPage) setParams({ page });
  };

  const handleTopPageChange = (page) => {
    if (page !== topPagination.currentPage) setTopParams({ page });
  };

  const handleSelectSearch = (product) => {
    setParams({ search: product.name, page: 1 }); // updates main laptops
    setSearchParam(""); // clear search input
  };

  // -----------------------------
  // Loading / Error
  // -----------------------------
  if (isLoading || isTopLoading ) return (
    <main id="cat-laptops-page" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "1200px" }}>
      <Loading message="Loading laptops..." />
    </main>
  );

  if (isError) return <p style={{ textAlign: 'center' }}>Failed to load laptops.</p>;

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <main id="pc-pr-container">

      {/* Header + Search */}
      <header id="cat-laptops-header">
        <div className="lines">
          <h1 className="main-line">Universe of Laptops</h1>
          <p className="subline">Innovation in every pixel.</p>
        </div>

        <SearchDropdown 
          width={500}
          products={searchResults} 
          value={searchParam} 
          onChange={(e) => setSearchParam(e.target.value)}
          onSelect={handleSelectSearch}
        />
      </header>

      {/* Main Laptops */}
      <header className="pr-header"><h1>Laptops</h1></header>
      <div className={width > 650 ? 'products-grid-container' : 'mob-pr-cards'}>
        {products.length > 0 ? (
          products.map((product, index) =>
            width > 650 ? (
              <ProductGrid key={product._id || product.id} product={product} />
            ) : (
              <MobileCard key={product._id || product.id} product={product} customDelay={index * 0.08} />
            )
          )
        ) : (
          <p style={{ textAlign: 'center' }}>No laptops found.</p>
        )}
      </div>

      {products.length > 0 && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Top Laptops */}
      <header className="pr-header"><h1>Top Laptops</h1></header>
      <div className={width > 650 ? 'products-grid-container' : 'mob-pr-cards'}>
        {topProducts.length > 0 ? (
          topProducts.map((product, index) =>
            width > 650 ? (
              <ProductGrid key={product._id || product.id} product={product} />
            ) : (
              <MobileCard key={product._id || product.id} product={product} customDelay={index * 0.08} />
            )
          )
        ) : (
          <p style={{ textAlign: 'center' }}>No top laptops found.</p>
        )}
      </div>

      {topProducts.length > 0 && topPagination.totalPages > 1 && (
        <Pagination
          currentPage={topPagination.currentPage}
          totalPages={topPagination.totalPages}
          onPageChange={handleTopPageChange}
        />
      )}

    </main>
  );
};

export default CatLaptops;
