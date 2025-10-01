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
  const [category, setCategory] = useState(productToEdit?.category || categories[0]);
  const [specs, setSpecs] = useState(defaultSpecs);

  useEffect(() => {
    if (productToEdit?.images) {
      setImagePreviews(productToEdit.images.map((url) => ({ url, isExisting: true })));
    } else {
      setImagePreviews([]);
    }
    setImages([]);

    setPriceInput(productToEdit?.price?.toLocaleString() || '');
    setDiscountPriceInput(productToEdit?.discountPrice?.toLocaleString() || '');
    setCategory(productToEdit?.category || categories[0]);
    setSpecs({
      ...defaultSpecs,
      ...productToEdit?.specs,
      colorOptions: productToEdit?.specs?.colorOptions?.join(", ") || "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", e.target.name.value);
    if (productToEdit?.sku) formData.append("sku", productToEdit.sku); // readonly
    formData.append("brand", e.target.brand.value);
    formData.append("countInStock", e.target.countInStock.value || 0);
    formData.append("category", category);
    formData.append("price", Number(priceInput.replace(/,/g, '')));
    formData.append("discountPrice", Number(discountPriceInput.replace(/,/g, '')) || 0);
    formData.append("description", e.target.description.value || "");
    formData.append("isTopProduct", e.target.isTopProduct.checked);

    // Laptop specs only if category is Laptops
    if (category === "Laptops") {
      const specsData = { ...specs, colorOptions: specs.colorOptions.split(",").map(c => c.trim()) };
      Object.keys(specsData).forEach(key => formData.append(`specs[${key}]`, specsData[key]));
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
                <input name="name" placeholder="Product Name" required defaultValue={productToEdit?.name || ''} />
                
                {/* SKU readonly */}
                <input name="sku" placeholder="SKU" value={productToEdit?.sku || 'Auto-generated'} readOnly />

                <input name="brand" placeholder="Brand" required defaultValue={productToEdit?.brand || ''} />
                <input name="countInStock" type="number" placeholder="Quantity" required defaultValue={productToEdit?.countInStock} />

                {/* Category select */}
                <select name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>

                <input
                  name="price"
                  type="text"
                  placeholder="Price"
                  required
                  value={priceInput}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/\D/g, '');
                    setPriceInput(Number(cleaned).toLocaleString());
                  }}
                />
                <input
                  name="discountPrice"
                  type="text"
                  placeholder="Discount Price"
                  value={discountPriceInput}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/\D/g, '');
                    setDiscountPriceInput(Number(cleaned).toLocaleString());
                  }}
                />

                <textarea name="description" placeholder="Description" defaultValue={productToEdit?.description || ''} />
              </div>

              {/* Laptop Specs */}
              {category === "Laptops" && (
                <div className="laptop-specs">
                  <h4>Laptop Specs</h4>
                  <input type="text" placeholder="RAM" value={specs.ram} onChange={(e) => setSpecs(prev => ({ ...prev, ram: e.target.value }))} />
                  <input type="text" placeholder="CPU" value={specs.cpu} onChange={(e) => setSpecs(prev => ({ ...prev, cpu: e.target.value }))} />
                  <input type="text" placeholder="GPU" value={specs.gpu} onChange={(e) => setSpecs(prev => ({ ...prev, gpu: e.target.value }))} />
                  <input type="text" placeholder="Storage" value={specs.storage} onChange={(e) => setSpecs(prev => ({ ...prev, storage: e.target.value }))} />
                  <input type="number" placeholder="Screen Size (inches)" value={specs.screenSize} onChange={(e) => setSpecs(prev => ({ ...prev, screenSize: e.target.value }))} />
                  <input type="text" placeholder="Resolution" value={specs.resolution} onChange={(e) => setSpecs(prev => ({ ...prev, resolution: e.target.value }))} />
                  <input type="text" placeholder="OS" value={specs.os} onChange={(e) => setSpecs(prev => ({ ...prev, os: e.target.value }))} />
                  <input type="text" placeholder="Battery" value={specs.battery} onChange={(e) => setSpecs(prev => ({ ...prev, battery: e.target.value }))} />
                  <input type="text" placeholder="Weight" value={specs.weight} onChange={(e) => setSpecs(prev => ({ ...prev, weight: e.target.value }))} />
                  <input type="text" placeholder="Ports" value={specs.ports} onChange={(e) => setSpecs(prev => ({ ...prev, ports: e.target.value }))} />
                  <input type="number" placeholder="Release Year" value={specs.releaseYear} onChange={(e) => setSpecs(prev => ({ ...prev, releaseYear: e.target.value }))} />
                  <label>
                    <input type="checkbox" checked={specs.touchscreen} onChange={(e) => setSpecs(prev => ({ ...prev, touchscreen: e.target.checked }))} />
                    Touchscreen
                  </label>
                  <input type="text" placeholder="Warranty" value={specs.warranty} onChange={(e) => setSpecs(prev => ({ ...prev, warranty: e.target.value }))} />
                  <input type="text" placeholder="Color Options (comma separated)" value={specs.colorOptions} onChange={(e) => setSpecs(prev => ({ ...prev, colorOptions: e.target.value }))} />
                </div>
              )}

              <div className="top-product-field">
                <label>
                  <input type="checkbox" name="isTopProduct" defaultChecked={productToEdit?.isTopProduct || false} />
                  Mark as Top Product
                </label>
              </div>

              <label className="file-upload-label">
                <input type="file" multiple accept="image/*" onChange={handleImageChange} />
                + Upload Images
              </label>

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
