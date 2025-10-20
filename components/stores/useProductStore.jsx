import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";



const useProductStore = create((set, get) => ({

  allProducts: [],

  // Laptops States
  laptopProducts: [], 
  laptopPagination: { totalPages: 1, currentPage: 1 }, 
  laptopLimit: 4,   
  topLaptopProducts: [],

  // Single Product State
  selectedProduct: null,

  // Offers State
    offerProducts: [],
    offerPagination: { totalPages: 1, currentPage: 1 },
    offerLimit: 4, // number of offers per page
    offersLoading: false,
    

  //tredning States
  trendingProducts: [],
  trendingLoading: false,
  trendingPagination: { totalPages: 1, currentPage: 1 },

  //reviews states
  reviewLoading: false,
  reviewError: null,
  reviewSuccess: null,


  // Arrays States
  products: [],
  filteredProducts: [],
  selectedItems: [],
  isSearching: false,
  searchTerm: "",
  sort: "",
  filters: { category: "", brand: "" },
  page: 1,
  limit: 5,

  //Arrays for Categories
  categoryProducts: [],
  categoryPagination: { totalPages: 1, currentPage: 1 },
  categoryOffers: [],
  categoryOfferPagination: { totalPages: 1, currentPage: 1 },
  
  setPage: (newPage) => set({ page: newPage }),

 normalizeProduct: (product) => ({
  ...product,
  id: product._id,
  images: (product.images || []).map(img =>
    img.startsWith("http") ? img : `${API_URL}:5000/${img}`
  ),
  finalPrice: Number(product.price || 0) - Number(product.discountPrice || 0),
}),

  // Fetch products
  fetchProducts: async (searchTerm = "", sort = "", filters = {}, page= 1, limit=5, admin) => {
    try {
      const query = new URLSearchParams();
      if (searchTerm) query.append("search", searchTerm);
      if (sort) query.append("sort", sort);

      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          if (key === "category" || key === "brand") {
            if (Array.isArray(value)) value.forEach(v => query.append(key, v.toLowerCase()));
            else query.append(key, value.toLowerCase());
          } else {
            query.append(key, value);
          }
        }
      });

      query.append("page", page);
      query.append("limit", limit);
      if (admin) query.append("admin", "true");

      const res = await axios.get(`${API_URL}/api/products?${query.toString()}`, { withCredentials: true });
      const products = Array.isArray(res.data.products) ? res.data.products : [];
      const normalized = products.map(get().normalizeProduct);

      set({ products: normalized, filteredProducts: normalized, isSearching: !!searchTerm, page, limit });
    } catch (err) {
      console.error("❌ Failed to fetch products:", err);
      set({ products: [], filteredProducts: [], isSearching: false });
    }
  },

  // Add product
  addProduct: async (formData) => {
    try {
      const res = await axios.post(`${API_URL}/api/products`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      const product = res.data.product || res.data;
      if (product) {
        const normalizedProduct = get().normalizeProduct(product);
        set((state) => ({ products: [...state.products, normalizedProduct] }));
        return res.data.message;
      }
      get().fetchProducts();
    } catch (err) {
      console.error("❌ Error adding product:", err.response?.data || err.message);
      throw err;
    }
  },

  // Update product
  updateProduct: async (id, formData) => {
    try {
      const res = await axios.put(`${API_URL}/api/products/${id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      const updatedProduct = res.data.product || res.data;
      const normalizedProduct = get().normalizeProduct(updatedProduct);

      set((state) => ({
        products: state.products.map((p) => (p.id === id ? normalizedProduct : p)),
        filteredProducts: state.filteredProducts.map((p) => (p.id === id ? normalizedProduct : p)),
      }));

      return normalizedProduct;
    } catch (err) {
      console.error("❌ Error updating product:", err.response?.data || err.message);
      throw err;
    }
  },

  // Delete products
  deleteProducts: async () => {
    const { selectedItems, products, filteredProducts } = get();
    if (selectedItems.length === 0) return;
    try {
      await Promise.all(
        selectedItems.map((id) =>
          axios.delete(`${API_URL}/api/products/${id}`, { withCredentials: true })
        )
      );

      const updatedProducts = products.filter((p) => !selectedItems.includes(p.id));
      const updatedFiltered = filteredProducts.filter((p) => !selectedItems.includes(p.id));

      set({ products: updatedProducts, filteredProducts: updatedFiltered, selectedItems: [] });
    } catch (err) {
      console.error("❌ Error deleting products:", err.response?.data || err.message);
      throw err;
    }
  },

  // Selection helpers
  setSelectedItems: (items) => set({ selectedItems: items }),
  toggleSelectItem: (id) => {
    const { selectedItems } = get();
    if (selectedItems.includes(id)) {
      set({ selectedItems: selectedItems.filter((itemId) => itemId !== id) });
    } else {
      set({ selectedItems: [...selectedItems, id] });
    }
  },

  // Approve or deny product
  setProductApproval: async (id, action) => {
    try {
      const res = await axios.put(
        `${API_URL}/api/products/approve/${id}`,
        { action },
        { withCredentials: true }
      );

      const updatedProduct = res.data.product;
      const normalizedProduct = get().normalizeProduct(updatedProduct);

      set((state) => ({
        products: state.products.map((p) => (p.id === id ? normalizedProduct : p)),
        filteredProducts: state.filteredProducts.map((p) => (p.id === id ? normalizedProduct : p)),
      }));

      return { message: res.data.message, product: normalizedProduct };
    } catch (err) {
      console.error("❌ Error approving/denying product:", err.response?.data || err.message);
      throw err;
    }
  },

  deleteSingleProduct: async (id) => {
    try {
      await axios.delete(`${API_URL}/api/products/${id}`, {
        withCredentials: true,
      });

      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        filteredProducts: state.filteredProducts.filter((p) => p.id !== id),
      }));
    } catch (err) {
      console.error("❌ Error deleting product:", err.response?.data || err.message);
      throw err;
    }
  },

  countAllProducts: async() => {
    try {
      const res = await axios.get(`${API_URL}/api/products`, {withCredentials: true});
      const products = res.data.products;
      set({ allProducts: products.map(get().normalizeProduct) });
    } catch(err) {
      console.log(err);
    }
  },

  fetchLaptops: async ({ page = 1, limit, brands = [], minPrice, maxPrice, sort, search } = {}) => {
  try {
    const state = get();
    const pageLimit = limit ?? 4; 

    let query = `category=Laptops&page=${page}&limit=${pageLimit}`;
    if (brands.length > 0) query += `&brand=${brands.join(",")}`;
    if (minPrice != null) query += `&minPrice=${minPrice}`;
    if (maxPrice != null) query += `&maxPrice=${maxPrice}`;
    if (sort) query += `&sort=${sort}`;
    if (search) query += `&search=${encodeURIComponent(search)}`;

    const res = await axios.get(`${API_URL}/api/products?${query}`, { withCredentials: true });
    const laptops = Array.isArray(res.data.products) ? res.data.products : [];
    const normalized = laptops.map(get().normalizeProduct);
    const totalPages = res.data.total > 0 ? res.data.pages : 0;

    set({
      laptopProducts: normalized,
      laptopPagination: {
        currentPage: res.data.page || page,
        totalPages,
      },
      laptopLimit: pageLimit, // updates the store
    });

    return res.data;
  } catch (error) {
    console.error("❌ Failed to fetch laptops:", error);
    set({ laptopProducts: [] });
  }
},


  fetchProduct: async (id) => {
    set({ loading: true, error: null, selectedProduct: null });
    try {
      const res = await axios.get(`${API_URL}/api/products/${id}`, { withCredentials: true });
      const product = res.data?.product || res.data;
      const normalized = get().normalizeProduct(product);

      set({ selectedProduct: normalized, loading: false });
      return normalized;
    } catch (err) {
      console.error("❌ Failed to fetch product:", err);
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
        selectedProduct: null,
      });
    }
  },



fetchTrendingProducts: async ({ page = 1, limit, brands = [], minPrice, maxPrice, sort, search } = {}) => {
  set({ trendingLoading: true });

  try {
    const pageLimit = limit ?? 4; // default limit
    let query = `category=Laptops&page=${page}&limit=${pageLimit}`;

    if (brands.length > 0) query += `&brand=${brands.join(",")}`;
    if (minPrice != null) query += `&minPrice=${minPrice}`;
    if (maxPrice != null) query += `&maxPrice=${maxPrice}`;
    if (sort) query += `&sort=${sort}`;
    if (search) query += `&search=${encodeURIComponent(search)}`;

    const res = await axios.get(`${API_URL}/api/products/trending?${query}`, {
      withCredentials: true,
    });

    const products = Array.isArray(res.data.products) ? res.data.products : [];
    const normalized = products.map(get().normalizeProduct);
    const totalPages = res.data.pages && res.data.pages > 0 ? res.data.pages : 0;

    set({
      trendingProducts: normalized,
      trendingPagination: {
        totalPages,
        currentPage: res.data.page || page,
      },
      trendingLimit: pageLimit, // store current page limit
    });

    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch trending products:", err);
    set({ 
      trendingProducts: [], 
      trendingPagination: { totalPages: 1, currentPage: 1 } 
    });
  } finally {
    set({ trendingLoading: false });
  }
},


searchProducts: async (query, filters = {}) => {
    try {
      // Build query params
      const params = { search: query, ...filters };
      const queryString = new URLSearchParams(params).toString();

      const res = await axios.get(`${API_URL}/api/products?${queryString}`);
      // Map and normalize products if needed
      return res.data.products.map(get().normalizeProduct); 
    } catch (err) {
      console.error("Failed to search products:", err);
      return [];
    }
  },

// --- Add Review ---
addReview: async (productId, rating, comment) => {
  set({ reviewLoading: true, reviewError: null, reviewSuccess: null });
  try {
    const res = await axios.post(
      `${API_URL}/api/products/${productId}/reviews`,
      { rating, comment },
      { withCredentials: true }
    );

    // Merge the returned review info into selectedProduct
    set((state) => ({
      selectedProduct: {
        ...state.selectedProduct,
        reviews: res.data.reviews,
        numReviews: res.data.numReviews,
        rating: res.data.rating,
      },
      reviewLoading: false,
      reviewSuccess: "Review submitted successfully!",
    }));
  } catch (err) {
    console.error("❌ Failed to add review:", err);
    set({
      reviewError: err.response?.data?.message || err.message,
      reviewLoading: false,
    });
  }
},

// --- Delete Review ---
deleteReview: async (productId, reviewId) => {
  set({ reviewLoading: true, reviewError: null, reviewSuccess: null });
  try {
    const res = await axios.delete(
      `${API_URL}/api/products/${productId}/reviews/${reviewId}`,
      { withCredentials: true }
    );

    // Merge the returned review info into selectedProduct
    set((state) => ({
      selectedProduct: {
        ...state.selectedProduct,
        reviews: res.data.reviews,
        numReviews: res.data.numReviews,
        rating: res.data.rating,
      },
      reviewLoading: false,
      reviewSuccess: "Review deleted successfully!",
    }));
  } catch (err) {
    console.error("❌ Failed to delete review:", err);
    set({
      reviewError: err.response?.data?.message || err.message,
      reviewLoading: false,
    });
  }
},

 fetchTopLaptops: async (limit = 4) => {
  try {
    const res = await axios.get(`${API_URL}/api/products?category=Laptops&isTopProduct=true&limit=${limit}`);
    const topLaptops = res.data.products.map(get().normalizeProduct);
    set({ topLaptopProducts: topLaptops });
  } catch (err) {
    console.error("Failed to fetch top laptops", err);
    set({ topLaptopProducts: [] });
  }
}



}));

export default useProductStore;
