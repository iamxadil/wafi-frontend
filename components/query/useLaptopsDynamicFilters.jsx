import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const useLaptopsDynamicFilters = () => {
  return useQuery({
    queryKey: ["laptopFilters"],
    queryFn: async () => {
      const res = await axios.get(
        `${API_URL}/api/products/dynamic-filters`,
        {
          params: { category: "Laptops" },
        }
      );

      const data = res.data;

      const filters = [];

      // ===== CPU =====
      if (data?.specs?.cpu) {
        filters.push({
          id: "cpuModel",
          label: "CPU",
          type: "checkbox",
          options: data.specs.cpu, // grouped {Intel:[], AMD:[], Apple:[]}
        });
      }

      // ===== GPU =====
      if (data?.specs?.gpu) {
        filters.push({
          id: "gpuFamily",
          label: "GPU",
          type: "checkbox",
          options: data.specs.gpu, // {Integrated:{}, Dedicated:{Nvidia:[...]}}
        });
      }

      // ===== RAM =====
      if (data?.specs?.ram) {
        filters.push({
          id: "ramSize",
          label: "RAM",
          type: "checkbox",
          options: data.specs.ram, // {DDR4:[..], DDR5:[..]}
        });
      }

      // ===== Storage =====
      if (data?.specs?.storage) {
        filters.push({
          id: "storageTier",
          label: "Storage",
          type: "checkbox",
          options: data.specs.storage, // ['256GB','512GB']
        });
      }

      // ===== Screen =====
      if (data?.specs?.screen) {
        filters.push({
          id: "screenRange",
          label: "Screen Size",
          type: "checkbox",
          options: data.specs.screen, // ['14" – 14.9"', ...]
        });
      }

      // ===== Brand =====
      if (data?.brands?.length) {
        filters.push({
          id: "brand",
          label: "Brand",
          type: "checkbox",
          options: data.brands.sort(),
        });
      }

      // ===== Tags =====
      if (data?.tags?.length) {
        filters.push({
          id: "tags",
          label: "Tags",
          type: "checkbox",
          options: data.tags.sort(),
        });
      }

      // ===== Price Range =====
      if (data?.priceRange) {
        filters.push({
          id: "price",
          label: "Price",
          type: "range",
          min: data.priceRange.min,
          max: data.priceRange.max,
          step: 10000,
        });
      }

      return {
        raw: data,
        filters,
      };
    },
  });
};
