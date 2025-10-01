import React, { useEffect, useState } from "react";
import "../styles/productfields.css";
import useProductStore from "../../../stores/useProductStore";
import { motion, AnimatePresence } from "framer-motion";

const ProductFields = ({ userRole = "user" }) => {
  const { selectedItems, toggleSelectItem, isSearching } = useProductStore();
  const filteredProducts = useProductStore((state) => state.filteredProducts);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const setSelectedItems = useProductStore((state) => state.setSelectedItems);
  const page = useProductStore((state) => state.page);
  const limit = useProductStore((state) => state.limit);
  const setPage = useProductStore((state) => state.setPage);
  const sort = useProductStore((state) => state.sort);
  const searchTerm = useProductStore((state) => state.searchTerm);
  const category = useProductStore((state) => state.category);
  const updateProduct = useProductStore((state) => state.updateProduct);

  const [selectAll, setSelectAll] = useState(false);

  // Display filtered products
  const displayProducts = filteredProducts;

  useEffect(() => {
    fetchProducts(searchTerm, sort, { category }, page, limit);
  }, [fetchProducts, searchTerm, sort, category, page, limit]);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(displayProducts.map((p) => p.id));
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    if (displayProducts.length > 0) {
      setSelectAll(selectedItems.length === displayProducts.length);
    }
  }, [selectedItems, displayProducts]);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handleApprovalToggle = async (product) => {
    try {
      await updateProduct(product.id, { ...product, approved: !product.approved });
    } catch (err) {
      console.error("Error updating approval:", err);
    }
  };

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
                {userRole === "admin" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {displayProducts.length > 0 ? (
                  displayProducts.map((p) => (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.4 }}
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
                      {userRole === "admin" && (
                        <td>
                          <button onClick={() => handleApprovalToggle(p)}>
                            {p.approved ? "Deny" : "Approve"}
                          </button>
                        </td>
                      )}
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <td colSpan={userRole === "admin" ? 12 : 11} style={{ textAlign: "center" }}>
                      {isSearching ? "No products found" : "No products available"}
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination-controls">
            <button onClick={handlePrevPage} disabled={page === 1}>
              Previous
            </button>
            <span>Page {page}</span>
            <button onClick={handleNextPage} disabled={displayProducts.length < limit}>
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
          <AnimatePresence>
            {displayProducts.length > 0 ? (
              displayProducts.map((p) => (
                <motion.div
                  key={p.id}
                  className="mob-card"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.4 }}
                  layout
                >
                  <div className="image-container">
                    <input
                      type="checkbox"
                      className="select-product"
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
                    {userRole === "admin" && (
                      <button onClick={() => handleApprovalToggle(p)}>
                        {p.approved ? "Deny" : "Approve"}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="no-products"
              >
                {isSearching ? "No products found" : "No products available"}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="pagination-controls">
          <button onClick={handlePrevPage} disabled={page === 1}>
            Previous
          </button>
          <span>Page {page}</span>
          <button onClick={handleNextPage} disabled={displayProducts.length < limit}>
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductFields;
