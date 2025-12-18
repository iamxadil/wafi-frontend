import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import "../styles/productsmodal.css";
import {
  useAddProductMutation,
  useEditProductMutation,
} from "../../../hooks/useManageProducts.jsx";
import {
  MonitorSmartphone,
  ScanFace,
  Fingerprint,
  Star,
  StarOff,
  Eye,
  EyeOff,
  GripVertical,
  XCircle,
} from "lucide-react";

const ProductsModal = ({
  setIsModalOpen,
  editData = null,
  isEditing = false,
  allProducts = [],
}) => {
  const fileInputRef = useRef(null);

  const [uploadProgress, setUploadProgress] = useState(0);

  // === Mutations ===
  const { mutate: addProduct, isPending: isAdding } = useAddProductMutation(
    null,
    setUploadProgress
  );
  const { mutate: editProduct, isPending: isEditingRequest } =
    useEditProductMutation(null, setUploadProgress);

  const isPending = isAdding || isEditingRequest;

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
    priority: 0,
    hidden: false,
  });

  const [specs, setSpecs] = useState({});
  const [images, setImages] = useState([]); // [{file, preview, existing}]
  const [deletedImages, setDeletedImages] = useState([]); // urls of removed existing images
  const [tags, setTags] = useState([]); // 🏷️
  const [tagInput, setTagInput] = useState("");
  

  // Helper: stable id for reorder (needed when previews duplicate or change)
  const makeImgId = () =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  // Always normalize images to include id for Reorder.Item key stability
  const normalizeImagesWithIds = (arr) =>
    arr.map((img) => ({
      id: img.id || makeImgId(),
      ...img,
    }));

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
        priority: editData?.priority || 0,
        hidden: editData.hidden ?? false,
      });

      setSpecs(editData.specs || {});

      // ✅ Always parse tags properly
      if (typeof editData.tags === "string") {
        try {
          const parsed = JSON.parse(editData.tags);
          setTags(Array.isArray(parsed) ? parsed : []);
        } catch {
          setTags([]);
        }
      } else {
        setTags(Array.isArray(editData.tags) ? editData.tags : []);
      }

      if (Array.isArray(editData.images)) {
        setImages(
          normalizeImagesWithIds(
            editData.images.map((url) => ({
              preview: url,
              existing: true,
            }))
          )
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handlePriceChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, "");
    const num = parseFloat(rawValue);
    if (!isNaN(num)) {
      setFormData((prev) => ({ ...prev, price: num }));
    } else if (rawValue === "") {
      setFormData((prev) => ({ ...prev, price: "" }));
    }
  };

  const handleDiscountPriceChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, "");
    const num = parseFloat(rawValue);
    if (!isNaN(num)) {
      setFormData((prev) => ({ ...prev, discountPrice: num }));
    } else if (rawValue === "") {
      setFormData((prev) => ({ ...prev, discountPrice: "" }));
    }
  };

  // === Image Handling ===
  const handleFiles = (files) => {
    const valid = Array.from(files).filter((file) =>
      ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );

    const mapped = valid.map((file) => ({
      id: makeImgId(),
      file,
      preview: URL.createObjectURL(file),
      existing: false,
    }));

    setImages((prev) => normalizeImagesWithIds([...prev, ...mapped]));
  };

  const handleFileChange = (e) => handleFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  };

  // Main image = images[0]
  const removeImage = (index) => {
    setImages((prev) => {
      if (index === 0 && prev.length > 1) {
        alert(
          "This is the main image. Drag another image to the first position before deleting."
        );
        return prev;
      }

      const removed = prev[index];
      if (removed?.existing && removed?.preview) {
        setDeletedImages((d) => [...d, removed.preview]);
      }

      // cleanup objectURL for new images (optional but good)
      if (!removed?.existing && removed?.preview?.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(removed.preview);
        } catch {}
      }

      return prev.filter((_, i) => i !== index);
    });
  };

  // === TAGS ===
  const handleTagInputChange = (e) => setTagInput(e.target.value);

  const handleAddTag = (e) => {
    e.preventDefault();
    const newTag = tagInput.trim().toLowerCase();
    if (newTag && !tags.includes(newTag)) {
      setTags((prev) => [...prev, newTag]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  // --- Image order payload for backend (existing URLs + new placeholders)
  const imageOrderPayload = useMemo(() => {
    return images.map((img) => {
      if (img.existing) return { type: "existing", url: img.preview };
      return { type: "new", clientId: img.id };
    });
  }, [images]);

  // === Submit ===
  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData();
    for (const key in formData) form.append(key, formData[key]);

    form.append("specs", JSON.stringify(specs));
    form.append("tags", JSON.stringify(tags));

    // ✅ Main image is FIRST after reorder
    form.append("mainImageIndex", 0);

    // ✅ Send order to backend (so it can reorder final URLs after upload)
    form.append("imageOrder", JSON.stringify(imageOrderPayload));

    // Attach new images only
    // IMPORTANT: backend should map these to the "new" entries by arrival order,
    // OR you can additionally send "newImageClientIds" array for exact mapping.
    const newClientIds = [];
    images.forEach((img) => {
      if (!img.existing && img.file) {
        form.append("images", img.file);
        newClientIds.push(img.id);
      }
    });
    form.append("newImageClientIds", JSON.stringify(newClientIds));

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

  // === UI ===
  return (
    <div className="static-modal-backdrop">
      <motion.div
        className="static-modal"
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.18 }}
      >
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

              <optgroup label="Laptops">
                <option value="Laptops">Laptops</option>
              </optgroup>

              <optgroup label="Components">
                <option value="Hard Disks & SSDs">Hard Disks & SSDs</option>
                <option value="RAM">RAM</option>
              </optgroup>

              <optgroup label="Accessories">
                <option value="Mice">Mice</option>
                <option value="Keyboards">Keyboards</option>
                <option value="Combo KB & Mouse">Combo KB & Mouse</option>
                <option value="Headphones">Headphones</option>
                <option value="Speakers">Speakers</option>
                <option value="Bags">Bags</option>
                <option value="Mousepads & Deskpads">
                  Mousepads & Deskpads
                </option>
                <option value="Cooling Pads">Cooling Pads</option>
              </optgroup>

              <optgroup label="Others">
                <option value="Monitors">Monitors</option>
                <option value="Adapters">Adapters</option>
                <option value="Cables">Cables</option>
                <option value="Flash Drives">Flash Drives</option>
                <option value="Others">Others</option>
              </optgroup>
            </select>
          </div>

          <div className="static-field">
            <label htmlFor="priority">Priority</label>
            <input
              id="priority"
              type="number"
              value={formData.priority ?? 0}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  priority: Number(e.target.value),
                }))
              }
              placeholder="Higher number appears first"
            />
            <p className="helper-text">
              Repeated priorities are allowed — newest one goes on top.
            </p>
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

          {/* === TAGS === */}
          <div className="static-field">
            <label>Tags</label>
            <div className="tags-input-container">
              <input
                type="text"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddTag(e);
                }}
                placeholder="Type a tag and press Enter"
              />
              <button
                type="button"
                className="add-tag-btn"
                onClick={handleAddTag}
              >
                Add
              </button>
            </div>

            {tags.length > 0 && (
              <div className="tags-list">
                {tags.map((tag, i) => (
                  <div key={i} className="tag-item">
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="remove-tag-btn"
                      title="Remove tag"
                    >
                      <XCircle />
                    </button>
                  </div>
                ))}
              </div>
            )}
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

          {/* === IMAGE PREVIEW (DRAG REORDER) === */}
          {images.length > 0 && (
            <Reorder.Group
              axis="x"
              values={images}
              onReorder={setImages}
              className="image-preview-grid"
            >
              <AnimatePresence>
                {images.map((img, i) => (
                  <Reorder.Item
                    key={img.id}
                    value={img}
                    className={`image-preview ${i === 0 ? "main-image" : ""}`}
                    whileDrag={{ scale: 1.03 }}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.12 }}
                  >
                    <img src={img.preview} alt={`preview-${i}`} />

                    {/* Drag handle indicator */}
                    <div className="drag-handle" title="Drag to reorder">
                      <GripVertical size={16} />
                    </div>

                    {/* Main badge */}
                    {i === 0 && (
                      <div className="main-badge" title="Main image">
                        <Star size={14} />
                      </div>
                    )}

                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeImage(i)}
                      title="Remove image"
                    >
                      <XCircle />
                    </button>

                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="upload-overlay">
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p>{uploadProgress}%</p>
                      </div>
                    )}
                  </Reorder.Item>
                ))}
              </AnimatePresence>
            </Reorder.Group>
          )}

          {/* === TOP PRODUCT TOGGLE === */}
          <div className="toggle-row">
            <label className="toggle-container">
              <input
                id="isTopProduct"
                type="checkbox"
                checked={formData.isTopProduct}
                onChange={handleChange}
              />
              <span className="toggle-icon">
                {formData.isTopProduct ? (
                  <Star size={18} />
                ) : (
                  <StarOff size={18} />
                )}
              </span>
              <span className="toggle-label">
                {formData.isTopProduct ? "Top Product" : "Mark as Top Product"}
              </span>
            </label>
          </div>

          {/* === HIDDEN toggle === */}
          <div className="toggle-row hide-toggle">
            <label className="toggle-container">
              <input
                id="hidden"
                type="checkbox"
                checked={formData.hidden}
                onChange={handleChange}
              />
              <span className="toggle-icon">
                {formData.hidden ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
              <span className="toggle-label">
                {formData.hidden ? "Hidden from Public" : "Visible to Public"}
              </span>
            </label>
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
                  ["screenSize", "Screen Size", 'e.g. 15.6"'],
                  ["resolution", "Resolution", "e.g. 1920x1080"],
                  ["os", "OS", "e.g. Windows 11"],
                  ["battery", "Battery", "e.g. 75Wh"],
                  ["weight", "Weight", "e.g. 1.8kg"],
                  ["ports", "Ports", "e.g. HDMI, USB-C"],
                  ["releaseYear", "Release Year", "e.g. 2024"],
                  ["warranty", "Warranty", "e.g. 1 Year"],
                  ["colorOptions", "Colors", "e.g. Black, Silver"],
                  [
                    "accessories",
                    "Included Accessories",
                    "e.g. Charger, Stylus, Bag",
                  ],
                  ["keyboard", "Keyboard Features", "e.g. Arabic, RGB, etc.."],
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

              <div className="specs-checkboxes">
                {[
                  [
                    "touchscreen",
                    "Touch Screen",
                    <MonitorSmartphone size={18} />,
                  ],
                  ["faceId", "Face ID", <ScanFace size={18} />],
                  [
                    "fingerPrint",
                    "Fingerprint Sensor",
                    <Fingerprint size={18} />,
                  ],
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

            <button type="submit" className="btn save">
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
      </motion.div>
    </div>
  );
};

export default ProductsModal;
