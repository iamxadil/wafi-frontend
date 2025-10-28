import React, { useState, useRef } from "react";
import "../styles/test.css";
import { useAddProductMutation } from "../components/hooks/useManageProducts.jsx";

const Static = () => {

  //Query Mutation
  const { mutate, isPending } = useAddProductMutation();

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

  const [specs, setSpecs] = useState({
    ram: "",
    cpu: "",
    gpu: "",
    storage: "",
    screenSize: "",
    resolution: "",
    os: "",
    battery: "",
    weight: "",
    ports: "",
    releaseYear: "",
    warranty: "",
    colorOptions: "",
    touchscreen: false,
    fingerPrint: false,
    faceId: false,
    pen: "",
  });

  const [images, setImages] = useState([]); // preview + upload
  const fileInputRef = useRef(null);

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

  // === IMAGE HANDLERS ===
  const handleFiles = (files) => {
    const valid = Array.from(files).filter((file) =>
      ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );
    const mapped = valid.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...mapped]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  };

  const handleFileChange = (e) => {
    handleFiles(e.target.files);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

const handleSubmit = (e) => {
  e.preventDefault();

  const form = new FormData();

  for (const key in formData) {
    form.append(key, formData[key]);
  }

  form.append("specs", JSON.stringify(specs));
  images.forEach((img) => form.append("images", img.file));

  mutate(form); // ✅ send to backend

  // Optionally reset form
  setFormData({
    name: "",
    brand: "",
    category: "",
    price: "",
    discountPrice: "",
    countInStock: "",
    description: "",
    isTopProduct: false,
  });
  setSpecs({});
  setImages([]);
};

  return (
    <div className="static-modal-backdrop">
      <div className="static-modal">
        <h2 className="static-title">Add Product</h2>

        <form className="static-form" onSubmit={handleSubmit}>
          {/* === BASIC INFO === */}
          <div className="static-field">
            <label htmlFor="name">Product Name *</label>
            <input
              id="name"
              type="text"
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="static-field">
            <label htmlFor="brand">Brand</label>
            <input
              id="brand"
              type="text"
              placeholder="e.g. Asus, Apple, Wiwu"
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
              <option value="Accessories">Accessories</option>
              <option value="Networking">Networking</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className="two-grid">
            <div className="static-field">
              <label htmlFor="price">Price *</label>
              <input
                id="price"
                type="number"
                min="0"
                step="1"
                placeholder="Enter price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="static-field">
              <label htmlFor="discountPrice">Discount Price</label>
              <input
                id="discountPrice"
                type="number"
                min="0"
                step="1"
                placeholder="Enter discount amount"
                value={formData.discountPrice}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="static-field">
            <label htmlFor="countInStock">Count In Stock</label>
            <input
              id="countInStock"
              type="number"
              min="0"
              step="1"
              placeholder="Available quantity"
              value={formData.countInStock}
              onChange={handleChange}
            />
          </div>

          <div className="static-field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              rows="3"
              placeholder="Enter product description"
              value={formData.description}
              onChange={handleChange}
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
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

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
              <div className="specs-grid">
                {[
                  ["ram", "RAM", "e.g. 16GB DDR5"],
                  ["cpu", "CPU", "e.g. Intel Core i7"],
                  ["gpu", "GPU", "e.g. RTX 4060"],
                  ["storage", "Storage", "e.g. 1TB SSD"],
                  ["screenSize", "Screen Size", "e.g. 15.6"],
                  ["resolution", "Resolution", "e.g. 1920x1080"],
                  ["os", "Operating System", "e.g. Windows 11"],
                  ["battery", "Battery", "e.g. 75Wh"],
                  ["weight", "Weight", "e.g. 1.8kg"],
                  ["ports", "Ports", "e.g. 2xUSB, HDMI"],
                  ["releaseYear", "Release Year", "e.g. 2024"],
                  ["warranty", "Warranty", "e.g. 1 Year"],
                  ["colorOptions", "Color Options", "e.g. Black, Silver"],
                  ["pen", "Pen", "e.g. Included / Not Included"],
                ].map(([id, label, placeholder]) => (
                  <div key={id}>
                    <label htmlFor={id}>{label}</label>
                    <input
                      id={id}
                      type={id === "releaseYear" ? "number" : "text"}
                      value={specs[id]}
                      onChange={handleSpecsChange}
                      placeholder={placeholder}
                    />
                  </div>
                ))}
              </div>

              <div className="checkbox-group-row">
                {[
                  ["touchscreen", "Touchscreen"],
                  ["fingerPrint", "Finger Print"],
                  ["faceId", "Face ID"],
                ].map(([id, label]) => (
                  <label key={id} className="checkbox-row-inline">
                    <input
                      id={id}
                      type="checkbox"
                      checked={specs[id]}
                      onChange={handleSpecsChange}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* === ACTIONS === */}
          <div className="static-actions">
            <button type="button" className="btn cancel">
              Cancel
            </button>
           <button type="submit" className="btn save" disabled={isPending}>
            {isPending ? "Uploading..." : "Add Product"}
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Static;
