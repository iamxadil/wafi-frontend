import { create } from "zustand";

export const useVitalsStore = create((set) => ({
  metrics: {
    INP: 0,
    LCP: 0,
    CLS: 0,
    TTFB: 0,
  },
  device: {
    userAgent: "",
    platform: "",
    connection: {
      downlink: null,
      effectiveType: null,
      rtt: null,
    },
  },
  lastUpdated: "",
  trendData: [],

  // === setters ===
  setMetrics: (partial) =>
    set((state) => ({
      metrics: { ...state.metrics, ...partial },
      lastUpdated: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    })),

  setDevice: (partial) =>
    set((state) => ({
      device: { ...state.device, ...partial },
    })),

  setTrendData: (updater) =>
    set((state) => ({
      trendData:
        typeof updater === "function" ? updater(state.trendData) : updater,
    })),

  resetVitals: () =>
    set({
      metrics: { INP: 0, LCP: 0, CLS: 0, TTFB: 0 },
      trendData: [],
      lastUpdated: "",
    }),
}));
