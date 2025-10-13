import React, { useEffect } from "react";
import useWindowWidth from "../hooks/useWindowWidth";
import "../../styles/topproductscards.css";
import useProductStore from "../stores/useProductStore";
import ProductCard from '../main/ProductCard.jsx';

const TopProducts = () => {
  const width = useWindowWidth();
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const products = useProductStore((state) => state.products);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const topProducts = products.filter(product => product.isTopProduct && product.approved);

  return (
    <>
      {width > 650 && (
        <>
        <header className="lg-header"><h1>Our Top Picks</h1></header>
        <div id="pc-pr-cards-container">
          <div className="pc-pr-cards">
          {topProducts.map((product) => <ProductCard key={product.id || product._id} product={product}/>)}
          </div>
        </div>
        </>
      )}
    </>
  );
};

export default TopProducts;
