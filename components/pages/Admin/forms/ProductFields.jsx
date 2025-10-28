import React, { useEffect, useState } from "react";
import "../styles/productfields.css";
import useProductStore from "../../../stores/useProductStore.jsx";
import useAuthStore from "../../../stores/useAuthStore.jsx";
import { motion, AnimatePresence } from "framer-motion";

const ProductFields = () => {
  const { user } = useAuthStore();
  const userRole = user?.role === "admin" ? "admin" : "user";

  // Product store hooks
  const filteredProducts = useProductStore((state) => state.filteredProducts);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const setSelectedItems = useProductStore((state) => state.setSelectedItems);
  const toggleSelectItem = useProductStore((state) => state.toggleSelectItem);
  const selectedItems = useProductStore((state) => state.selectedItems);
  const page = useProductStore((state) => state.page);
  const limit = useProductStore((state) => state.limit);
  const setPage = useProductStore((state) => state.setPage);
  const sort = useProductStore((state) => state.sort);
  const searchTerm = useProductStore((state) => state.searchTerm);
  const category = useProductStore((state) => state.category);

  const [selectAll, setSelectAll] = useState(false);

  // Fetch products on mount or filter change
  useEffect(() => {
    fetchProducts(
      searchTerm,
      sort,
      { category, admin: userRole === "admin" || "moderator" ? "true" : undefined },
      page,
      5
    );
  }, [fetchProducts, searchTerm, sort, category, page, limit, userRole]);

  // Handle Select All toggle
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredProducts.map((p) => p.id));
    }
    setSelectAll(!selectAll);
  };

  // Keep selectAll state synced with individual selections
  useEffect(() => {
    setSelectAll(
      filteredProducts.length > 0 &&
      selectedItems.length === filteredProducts.length
    );
  }, [selectedItems, filteredProducts]);

  const handlePrevPage = () => page > 1 && setPage(page - 1);
  const handleNextPage = () => setPage(page + 1);


  const renderTableRows = () =>
    filteredProducts.length > 0 ? (
      filteredProducts.map((p) => (
        <motion.tr
          key={p.id}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.3 }}
          layout
        >
          <td>
            <input
              type="checkbox"
              checked={selectedItems.includes(p.id)}
              onChange={() => toggleSelectItem(p.id)}
            />
          </td>
          <td className="product-img-cell">
            {p.images?.[0] ? <img src={p.images[0]} alt={p.name} /> : <span>No Image</span>}
          </td>
          <td>{p.name}</td>
          <td>{p.sku}</td>
          <td>{p.brand}</td>
          <td>{p.countInStock}</td>
          <td>{p.price.toLocaleString()} IQD</td>
          <td>{p.category}</td>
          <td>{p.discountPrice ? p.discountPrice.toLocaleString() + " IQD" : "-"}</td>
          <td>{p.rating}</td>
          <td>{p.approved ? "Approved ✅" : "Pending ❌"}</td>
        </motion.tr>
      ))
    ) : (
      <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <td colSpan={userRole === "admin" ? 12 : 11} style={{ textAlign: "center" }}>
          {filteredProducts.length === 0 ? "No products available" : "No products found"}
        </td>
      </motion.tr>
    );

  const renderMobileCards = () =>
    filteredProducts.length > 0 ? (
      filteredProducts.map((p) => (
        <motion.div
          key={p.id}
          className="mob-card"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.3 }}
          layout
        >
          <div className="image-container">
            <input
              type="checkbox"
              checked={selectedItems.includes(p.id)}
              onChange={() => toggleSelectItem(p.id)}
            />
            {p.images?.[0] ? <img src={p.images[0]} alt={p.name} /> : <span>No Image</span>}
          </div>
          <div className="mob-card-info">
            <h1>{p.name}</h1>
            <p>SKU: {p.sku}</p>
            <p>Brand: {p.brand}</p>
            <p>In Stock: {p.countInStock}</p>
            <p>Price: {p.price.toLocaleString()} IQD</p>
            <p>Category: {p.category}</p>
            <p>Discount: {p.discountPrice ? p.discountPrice.toLocaleString() + " IQD" : "-"}</p>
            <p>Rating: {p.rating}</p>
            <p>Status: {p.approved ? "Approved ✅" : "Pending ❌"}</p>
          </div>
        </motion.div>
      ))
    ) : (
      <motion.div
        className="no-products"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        No products available
      </motion.div>
    );

  return (
    <>
      {/* PC version */}
      <div className="pc-version">
        <div className="product-fields">
          <table>
            <thead>
              <tr>
                <th>
                  <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                </th>
                <th>Image</th>
                <th>Product</th>
                <th>SKU</th>
                <th>Brand</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Category</th>
                <th>Discount</th>
                <th>Rating</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>{renderTableRows()}</AnimatePresence>
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination-controls">
            <button onClick={handlePrevPage} disabled={page === 1}>
              Previous
            </button>
            <span>Page {page}</span>
            <button onClick={handleNextPage} disabled={filteredProducts.length < limit}>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Mobile version */}
      <div className="mob-version">
        <header className="mob-header-actions">
          <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
          <label>Select All</label>
        </header>
        <div className="mob-cards-container">
          <AnimatePresence>{renderMobileCards()}</AnimatePresence>
        </div>
        <div className="pagination-controls">
          <button onClick={handlePrevPage} disabled={page === 1}>
            Previous
          </button>
          <span>Page {page}</span>
          <button onClick={handleNextPage} disabled={filteredProducts.length < limit}>
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductFields;
