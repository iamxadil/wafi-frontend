// src/pages/TestDropdown.jsx
import React from "react";
import SearchDropdown from '../components/main/SearchDropdown.jsx';

const Static = () => {
  // Static array of products
  const products = [
    {
      id: 1,
      name: "MacBook Pro",
      brand: "Apple",
      images: ["https://via.placeholder.com/50"],
    },
    {
      id: 2,
      name: "ThinkPad X1",
      brand: "Lenovo",
      images: ["https://via.placeholder.com/50"],
    },
    {
      id: 3,
      name: "Dell XPS 13",
      brand: "Dell",
      images: ["https://via.placeholder.com/50"],
    },
  ];

  return (
    <div style={{ padding: "2rem", maxWidth: "400px" }}>
      <h2>Test Search Dropdown</h2>
      <SearchDropdown products={products} />
    </div>
  );
};

export default Static;
