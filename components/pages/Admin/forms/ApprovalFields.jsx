// ApprovalFields.jsx
import React, { useEffect } from "react";
import useProductStore from "../../../stores/useProductStore";
import "../styles/approvalfields.css";

const ApprovalFields = () => {
  const {
    products,
    fetchProducts,
    setProductApproval,
    deleteSingleProduct,
  } = useProductStore();

  // Fetch all products for admin on mount
  useEffect(() => {
    fetchProducts("", "", {}, 1, 100, "true"); // admin = "true"
  }, [fetchProducts]);

  // Filter products that are not approved yet
  const pendingProducts = products.filter((p) => !p.approved);

  return (
    <div className="approval-wrapper">
      <h2 className="approval-title">Pending Product Approvals</h2>

      {pendingProducts.length === 0 ? (
        <p className="approval-empty">No products awaiting approval 🎉</p>
      ) : (
        <table className="approval-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="approval-thumb"
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>{product.price.toLocaleString()} IQD</td>
                <td>
                  <button
                    onClick={() =>
                      setProductApproval(product.id, "approve")
                    }
                  >
                    Approve
                  </button>
                  <button onClick={() => deleteSingleProduct(product.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApprovalFields;
