import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useProductStore from "../../../stores/useProductStore.jsx";
import '../styles/modal.css';
import { toast } from "react-toastify";

// Framer-Motion variants
const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };
const modalVariants = { hidden: { y: -50, opacity: 0 }, visible: { y: 0, opacity: 1 }, exit: { y: -50, opacity: 0 } };
const imageVariants = { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.8 } };

const categories = ["Laptops", "Headphones", "Mice", "Keyboards", "Bags"];

const defaultSpecs = {
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
  touchscreen: false,
  warranty: "",
  colorOptions: "",
};

const ProductModal = ({ isOpen, onClose, productToEdit }) => {
  const addProduct = useProductStore((state) => state.addProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const [priceInput, setPriceInput] = useState('');
  const [discountPriceInput, setDiscountPriceInput] = useState('');
  const [category, setCategory] = useState(productToEdit?.category ?? categories[0]);
  const [specs, setSpecs] = useState(defaultSpecs);

  useEffect(() => {
    if (productToEdit?.images) {
      setImagePreviews(productToEdit.images.map((url) => ({ url, isExisting: true })));
    } else {
      setImagePreviews([]);
    }
    setImages([]);

    setPriceInput(productToEdit?.price?.toLocaleString() ?? '');
    setDiscountPriceInput(productToEdit?.discountPrice?.toLocaleString() ?? '');
    setCategory(productToEdit?.category ?? categories[0]);
    setSpecs({
      ...defaultSpecs,
      ...productToEdit?.specs,
      colorOptions: productToEdit?.specs?.colorOptions?.join(", ") ?? "",
    });
  }, [productToEdit, isOpen]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => ({ url: URL.createObjectURL(file), file, isExisting: false }));
    setImagePreviews(prev => [...prev, ...newPreviews]);
    setImages(prev => [...prev, ...files]);
  };

  const handleRemoveImage = (index) => {
    const removed = imagePreviews[index];
    if (!removed.isExisting && removed.file) setImages(prev => prev.filter(f => f !== removed.file));
    URL.revokeObjectURL(removed.url);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    const newPreviews = files.map(file => ({ url: URL.createObjectURL(file), file, isExisting: false }));
    setImagePreviews(prev => [...prev, ...newPreviews]);
    setImages(prev => [...prev, ...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", e.target.name.value);
    if (productToEdit?.sku) formData.append("sku", productToEdit.sku);
    formData.append("brand", e.target.brand.value);
    formData.append("countInStock", e.target.countInStock.value || 0);
    formData.append("category", category);
    formData.append("price", Number(priceInput.replace(/,/g, '')));
    formData.append("discountPrice", Number(discountPriceInput.replace(/,/g, '')) || 0);
    formData.append("description", e.target.description.value || "");
    formData.append("isTopProduct", e.target.isTopProduct.checked);

    if (category === "Laptops") {
      const specsData = { ...specs, colorOptions: specs.colorOptions.split(",").map(c => c.trim()) };
      
      // Convert numeric fields safely
      ['screenSize', 'releaseYear'].forEach(key => {
        const value = specsData[key];
        specsData[key] = value !== "" ? Number(value) : undefined;
      });

      Object.keys(specsData).forEach(key => {
        if (specsData[key] !== undefined) formData.append(`specs[${key}]`, specsData[key]);
      });
    }

    images.forEach(file => formData.append("images", file));

    if (productToEdit?.images) {
      const removedImages = productToEdit.images.filter(url => !imagePreviews.some(p => p.isExisting && p.url === url));
      formData.append("removedImages", JSON.stringify(removedImages));
    }

    try {
      if (productToEdit) {
        await updateProduct(productToEdit._id, formData);
        toast.success("Product Updated");
      } else {
        await addProduct(formData);
        toast.success("Product Added");
      }
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setImages([]);
      setImagePreviews([]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h2>{productToEdit ? "Edit Product" : "Add Product"}</h2>
            <form onSubmit={handleSubmit}>

              <div className="form-inputs">
                <input name="name" placeholder="Product Name" required defaultValue={productToEdit?.name ?? ''} />
                <input name="sku" placeholder="SKU" value={productToEdit?.sku ?? 'Auto-generated'} readOnly />
                <input name="brand" placeholder="Brand" required defaultValue={productToEdit?.brand ?? ''} />
                <input
                  name="countInStock"
                  type="number"
                  placeholder="Quantity"
                  required
                  defaultValue={productToEdit?.countInStock ?? 0}
                />
                <select name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <input
                  name="price"
                  type="text"
                  placeholder="Price"
                  required
                  value={priceInput ?? ""}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/\D/g, '');
                    setPriceInput(cleaned ? Number(cleaned).toLocaleString() : "");
                  }}
                />
                <input
                  name="discountPrice"
                  type="text"
                  placeholder="Discount Price"
                  value={discountPriceInput ?? ""}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/\D/g, '');
                    setDiscountPriceInput(cleaned ? Number(cleaned).toLocaleString() : "");
                  }}
                />
                <textarea name="description" placeholder="Description" defaultValue={productToEdit?.description ?? ''} />
              </div>

              {category === "Laptops" && (
                <div className="laptop-specs">
                  <h4>Laptop Specs</h4>
                  {Object.keys(defaultSpecs).map((key) => {
                    if (key === "touchscreen") {
                      return (
                        <label key={key}>
                          <input type="checkbox" checked={specs.touchscreen} onChange={(e) => setSpecs(prev => ({ ...prev, touchscreen: e.target.checked }))} />
                          Touchscreen
                        </label>
                      );
                    }
                    return (
                      <input
                        key={key}
                        type={key === "screenSize" || key === "releaseYear" ? "number" : "text"}
                        placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                        value={specs[key] ?? ""}
                        onChange={(e) => setSpecs(prev => ({ ...prev, [key]: e.target.value }))}
                      />
                    );
                  })}
                </div>
              )}

              <div className="top-product-field">
                <label>
                  <input type="checkbox" name="isTopProduct" defaultChecked={productToEdit?.isTopProduct ?? false} />
                  Mark as Top Product
                </label>
              </div>

              {/* Drag & Drop Image Upload */}
              <div
                className="file-dropzone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput').click()}
              >
                <p>Drag & Drop Images Here or Click to Upload</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  id="fileInput"
                />
              </div>

              <div className="image-preview-grid">
                <AnimatePresence>
                  {imagePreviews.map((img, idx) => (
                    <motion.div
                      key={idx}
                      className="preview-img-wrapper"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={imageVariants}
                    >
                      <img src={img.url} alt={`Preview ${idx}`} className="preview-img" />
                      <button type="button" className="remove-img-btn" onClick={() => handleRemoveImage(idx)}>
                        &times;
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="modal-actions">
                <button type="submit" disabled={loading}>
                  {loading ? "Saving..." : productToEdit ? "Update" : "Add"}
                </button>
                <button type="button" onClick={onClose} disabled={loading}>Cancel</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
