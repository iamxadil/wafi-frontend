const buildFilters = (filtersData, t) => {
  if (!filtersData) return [];

  const { categories = [], brands = [], tags = [], specs = {}, priceRange = {} } = filtersData;
  const sections = [];

  /* =========================================================
     🗂️ Categories
  ========================================================= */
  if (categories.length > 0) {
    sections.push({
      id: "category",
      label: t ? t("Category", "الفئة") : "Category",
      type: "checkbox",
      options: categories.sort(),
    });
  }

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
     💻 Specs
  ========================================================= */
  Object.entries(specs).forEach(([key, values]) => {
    if (values && Object.keys(values).length > 0) {
      sections.push({
        id: key,
        label: t ? t(key.toUpperCase(), key.toUpperCase()) : key.toUpperCase(),
        type: "checkbox",
        options: values,
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
