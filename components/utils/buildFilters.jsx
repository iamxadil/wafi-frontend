/**
 * 🧩 buildFilters()
 * Reusable helper to transform backend filter data
 * (brands, tags, specs, priceRange) into standardized Filter.jsx sections.
 *
 * @param {Object} filtersData - API response from /api/products/filters
 * @param {Function} [t] - optional translation helper (useTranslate)
 * @returns {Array} formatted sections for the Filter component
 */
const buildFilters = (filtersData, t) => {
  if (!filtersData) return [];

  const { brands = [], tags = [], specs = {}, priceRange = {} } = filtersData;
  const sections = [];

  /* =========================================================
     🏷️ Brands
  ========================================================= */
  if (brands.length > 0) {
    sections.push({
      id: "brand",
      label: t ? t("Brand", "العلامة التجارية") : "Brand",
      type: "checkbox",
      options: brands.sort(),
    });
  }

  /* =========================================================
     🏷️ Tags
  ========================================================= */
  if (tags.length > 0) {
    sections.push({
      id: "tags",
      label: t ? t("Tags", "الوسوم") : "Tags",
      type: "checkbox",
      options: tags.sort(),
    });
  }

  /* =========================================================
     💻 Specs (CPU, RAM, GPU, etc.)
  ========================================================= */
  Object.entries(specs).forEach(([key, values]) => {
    if (values && Object.keys(values).length > 0) {
      sections.push({
        id: key,
        label: t ? t(key.toUpperCase(), key.toUpperCase()) : key.toUpperCase(),
        type: "checkbox",
        options: values, // supports nested objects (Intel → Core i7)
      });
    }
  });

  /* =========================================================
     💰 Price Range
  ========================================================= */
  if (priceRange.min !== undefined && priceRange.max !== undefined) {
    sections.push({
      id: "price",
      label: t ? t("Price Range", "نطاق السعر") : "Price Range",
      type: "range",
      min: priceRange.min,
      max: priceRange.max,
      step: 50,
    });
  }

  return sections;
};

export default buildFilters;
