import React, { useState, useEffect, useRef } from "react";
import "../styles/productsmodal.css";
import {
  useAddProductMutation,
  useEditProductMutation,
} from "../../../hooks/useManageProducts.jsx";
import { MonitorSmartphone, ScanFace, Fingerprint } from "lucide-react";

const ProductsModal = ({
  setIsModalOpen,
  editData = null,
  isEditing = false,
}) => {
  const fileInputRef = useRef(null);

  // === Mutations ===
  const { mutate: addProduct, isPending: isAdding } = useAddProductMutation();
  const { mutate: editProduct, isPending: isEditingRequest } =
    useEditProductMutation();


  //Handlers
  const handlePriceChange = (e) => {
  const rawValue = e.target.value.replace(/,/g, ""); // remove commas
  const num = parseFloat(rawValue);
  if (!isNaN(num)) {
    setFormData((prev) => ({ ...prev, price: num }));
  } else if (rawValue === "") {
    setFormData((prev) => ({ ...prev, price: "" }));
  }
};

//
const handleDiscountPriceChange = (e) => {
  const rawValue = e.target.value.replace(/,/g, "");
  const num = parseFloat(rawValue);
  if (!isNaN(num)) {
    setFormData((prev) => ({ ...prev, discountPrice: num }));
  } else if (rawValue === "") {
    setFormData((prev) => ({ ...prev, discountPrice: "" }));
  }
};


  // === Form states ===
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    discountPrice: "",
    countInStock: "",
    description: "",
    isTopProduct: false,
  });

  const [specs, setSpecs] = useState({});
  const [images, setImages] = useState([]); // [{file, preview, existing}]
  const [deletedImages, setDeletedImages] = useState([]); // urls of removed existing images

  // 🧠 Prefill when editing
  useEffect(() => {
    if (isEditing && editData) {
      setFormData({
        name: editData.name || "",
        brand: editData.brand || "",
        category: editData.category || "",
        price: editData.price || "",
        discountPrice: editData.discountPrice || "",
        countInStock: editData.countInStock || "",
        description: editData.description || "",
        isTopProduct: !!editData.isTopProduct,
      });

      setSpecs(editData.specs || {});
      if (Array.isArray(editData.images)) {
        setImages(
          editData.images.map((url) => ({
            preview: url,
            existing: true,
          }))
        );
      }
    }
  }, [isEditing, editData]);

  // === Handlers ===
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSpecsChange = (e) => {
    const { id, value, type, checked } = e.target;
    setSpecs((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  // === Image Handling ===
  const handleFiles = (files) => {
    const valid = Array.from(files).filter((file) =>
      ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );

    const mapped = valid.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      existing: false,
    }));

    setImages((prev) => [...prev, ...mapped]);
  };

  const handleFileChange = (e) => handleFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const removed = prev[index];
      if (removed.existing && removed.preview) {
        setDeletedImages((d) => [...d, removed.preview]);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  // === Submit ===
  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData();
    for (const key in formData) form.append(key, formData[key]);
    form.append("specs", JSON.stringify(specs));

    // Attach new images only
    images.forEach((img) => {
      if (!img.existing && img.file) {
        form.append("images", img.file);
      }
    });

    // Attach deleted image URLs
    if (deletedImages.length > 0) {
      form.append("deletedImages", JSON.stringify(deletedImages));
    }

    if (isEditing && editData?._id) {
      editProduct({ id: editData._id, formData: form });
    } else {
      addProduct(form);
    }

    setIsModalOpen(false);
  };

  const isPending = isAdding || isEditingRequest;

  // === UI ===
  return (
    <div className="static-modal-backdrop">
      <div className="static-modal">
        <h2 className="static-title">
          {isEditing ? "Edit Product" : "Add Product"}
        </h2>

        <form className="static-form" onSubmit={handleSubmit}>
          {/* === BASIC FIELDS === */}
          <div className="static-field">
            <label htmlFor="name">Product Name *</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="static-field">
            <label htmlFor="brand">Brand</label>
            <input
              id="brand"
              type="text"
              value={formData.brand}
              onChange={handleChange}
            />
          </div>

          <div className="static-field">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              <option value="Laptops">Laptops</option>
              <option value="Mice">Mice</option>
              <option value="Keyboards">Keyboards</option>
              <option value="Bags">Bags</option>
              <option value="Headphones">Headphones</option>
            </select>
          </div>

         <div className="two-grid">
            <div className="static-field">
              <label htmlFor="price">Price *</label>
              <input
                id="price"
                type="text"
                value={
                  formData.price
                    ? Number(formData.price).toLocaleString("en-US")
                    : ""
                }
                onChange={handlePriceChange}
                placeholder="Enter price"
                required
              />
            </div>

            <div className="static-field">
              <label htmlFor="discountPrice">Discount Price</label>
              <input
                id="discountPrice"
                type="text"
                value={
                  formData.discountPrice
                    ? Number(formData.discountPrice).toLocaleString("en-US")
                    : ""
                }
                onChange={handleDiscountPriceChange}
                placeholder="Enter discount price"
              />
            </div>
          </div>


          <div className="static-field">
            <label htmlFor="countInStock">Stock</label>
            <input
              id="countInStock"
              type="number"
              value={formData.countInStock}
              onChange={handleChange}
              placeholder="Quantity in stock"
            />
          </div>

          <div className="static-field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
            />
          </div>

          {/* === IMAGE UPLOAD === */}
          <div
            className="image-dropzone"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />
            <p>
              Drag & Drop images here, or <span>browse</span> to upload
            </p>
          </div>

          {images.length > 0 && (
            <div className="image-preview-grid">
              {images.map((img, i) => (
                <div key={i} className="image-preview">
                  <img src={img.preview} alt={`preview-${i}`} />
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeImage(i)}
                    title="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* === TOGGLE === */}
          <div className="checkbox-row">
            <input
              id="isTopProduct"
              type="checkbox"
              checked={formData.isTopProduct}
              onChange={handleChange}
            />
            <label htmlFor="isTopProduct">Mark as Top Product</label>
          </div>

          {/* === SPECS === */}
        {formData.category === "Laptops" && (
  <div className="specs-section">
    <h3 className="specs-title">Laptop Specifications</h3>

    {/* === Text Inputs === */}
    <div className="specs-grid">
      {[
        ["ram", "RAM", "e.g. 16GB DDR5"],
        ["cpu", "CPU", "e.g. Intel Core i7"],
        ["gpu", "GPU", "e.g. RTX 4060"],
        ["storage", "Storage", "e.g. 1TB SSD"],
        ["screenSize", "Screen Size", "e.g. 15.6\""],
        ["resolution", "Resolution", "e.g. 1920x1080"],
        ["os", "OS", "e.g. Windows 11"],
        ["battery", "Battery", "e.g. 75Wh"],
        ["weight", "Weight", "e.g. 1.8kg"],
        ["ports", "Ports", "e.g. HDMI, USB-C"],
        ["releaseYear", "Release Year", "e.g. 2024"],
        ["warranty", "Warranty", "e.g. 1 Year"],
        ["colorOptions", "Colors", "e.g. Black, Silver"],
      ].map(([id, label, placeholder]) => (
        <div key={id}>
          <label htmlFor={id}>{label}</label>
          <input
            id={id}
            type={id === "releaseYear" ? "number" : "text"}
            value={specs[id] || ""}
            onChange={handleSpecsChange}
            placeholder={placeholder}
          />
        </div>
      ))}
    </div>

    {/* === Feature Checkboxes with Icons === */}
    <div className="specs-checkboxes">
      {[
        ["touchscreen", "Touch Screen", <MonitorSmartphone size={18} />],
        ["faceId", "Face ID", <ScanFace size={18} />],
        ["fingerPrint", "Fingerprint Sensor", <Fingerprint size={18} />],
      ].map(([id, label, Icon]) => (
        <label key={id} className="spec-checkbox">
          <input
            id={id}
            type="checkbox"
            checked={!!specs[id]}
            onChange={handleSpecsChange}
          />
          <span className="checkbox-icon">{Icon}</span>
          {label}
        </label>
      ))}
    </div>
  </div>
)}


          {/* === ACTION BUTTONS === */}
          <div className="static-actions">
            <button
              type="button"
              className="btn cancel"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn save" disabled={isPending}>
              {isPending
                ? isEditing
                  ? "Saving..."
                  : "Uploading..."
                : isEditing
                ? "Save Changes"
                : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductsModal;
