import React, { useEffect } from "react";
import "../styles/cataccessories.css";
import SearchDropdown from "../components/main/SearchDropdown.jsx";
import useAccessoriesStore from "../components/stores/useAccessoriesStore.jsx";
import { useAccessoriesQuery } from "../components/hooks/useAccessoriesQuery.jsx";
import useWindowWidth from "../components/hooks/useWindowWidth.jsx";
import Pagination from "../components/main/Pagination.jsx";
import Loading from "../components/main/Loading.jsx";
import MobileCard from "../components/main/MobileCard.jsx";
import ProductGrid from "../components/main/ProductGrid.jsx";

const CatAccessories = () => {
    
useEffect(() => {
  const handleScroll = () => {
    const hero = document.querySelector(".accessories-hero");
    const blur1 = document.querySelector(".blur-1");
    const blur2 = document.querySelector(".blur-2");
    if (!hero || !blur1 || !blur2) return;

    const scrollY = window.scrollY;
    const fadeHeight = 600;
    const fadeValue = Math.max(0, 1 - scrollY / fadeHeight);
    hero.style.setProperty("--fade-opacity", fadeValue.toFixed(2));

    // 🌫 Parallax offsets
    const offset1 = scrollY * 0.15; // slower drift
    const offset2 = scrollY * 0.25; // slightly faster
    blur1.style.transform = `translateY(${offset1}px)`;
    blur2.style.transform = `translateY(${offset2}px)`;
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);



  
  //Setup
  const width = useWindowWidth();
 

  // Zustand state
  const params = useAccessoriesStore((state) => state.accessoriesPageParams);
  const setParams = useAccessoriesStore((state) => state.setAccessoriesPageParams);
  const searchParam = useAccessoriesStore(state => state.searchParam);
  const setSearchParam = useAccessoriesStore(state => state.setSearchParam);

  // Query
  const { data: accessories, isLoading, isError } = useAccessoriesQuery(params);
  const products = accessories?.products || [];
  const pagination = accessories?.pagination || { currentPage: 1, totalPages: 0 };

  //Search
   const { data: searchData } = useAccessoriesQuery({ 
      ...params,
      search: searchParam,
      page: 1,
      limit: 4
    });
    const searchResults = searchData?.products || [];

  console.log(pagination);

  //States
   const handlePageChange = (page) => {
    if (page !== pagination.currentPage) setParams({ page });
  };

  //Handlers
  const handleSelectSearch = (product) => {
    setParams({ search: product.name, page: 1 }); 
    setSearchParam(""); 
  };


  //Handle Errors
  if (isLoading) return <Loading message="Loading Accessories..." />;
  if (isError) return <p style={{ textAlign: "center" }}>Failed to load laptops.</p>;

  return (
    <>
        <section className="accessories-hero">
        <div className="hero-content">
            {/* Gradient glows ONLY behind text */}
            <div className="blur-shape blur-1"></div>
            <div className="blur-shape blur-2"></div>

            <h1 className="hero-title">
            Elevate Your <span>Accessories</span> Game
            </h1>
            <p className="hero-subtitle">
            Discover precision-crafted designs made for performance, style, and innovation.
            </p>
        </div>

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


  

     <main id='pc-pr-container'>
      <header className='pr-header'>
        <h1>Accessories</h1>
        </header>

       <div className={width > 650 ? "products-grid-container cat-grid" : "mob-pr-cards"}>
        {products.length > 0 ? (
          products.map((product, i) =>
            width > 650 ? (
              <ProductGrid key={product._id || product.id} product={product} />
            ) : (
              <MobileCard
                key={product._id || product.id}
                product={product}
                customDelay={i * 0.08}
              />
            )
          )
        ) : (
          <p style={{ textAlign: "center" }}>No laptops found.</p>
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
