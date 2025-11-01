import { useEffect } from "react";
import { onCLS, onINP, onLCP, onTTFB } from "web-vitals";
import { useVitalsStore } from "../stores/useVitalsStore.jsx";

/**
 * 🔹 Global Vitals Tracker
 * - Collects live Web Vitals and network/device information.
 * - Actively pings to estimate real RTT.
 * - Updates Zustand store for use across the app.
 */
const VitalsTracker = () => {
  const setMetrics = useVitalsStore((s) => s.setMetrics);
  const setDevice = useVitalsStore((s) => s.setDevice);
  const setTrendData = useVitalsStore((s) => s.setTrendData);

  useEffect(() => {
    // === Initialize network info ===
    const connection =
      navigator.connection || navigator.webkitConnection || {};

    const updateDeviceInfo = (rttOverride) => {
      setDevice({
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        connection: {
          downlink: connection.downlink ?? null,
          effectiveType: connection.effectiveType ?? "unknown",
          rtt:
            typeof rttOverride === "number"
              ? rttOverride
              : connection.rtt ?? null,
        },
      });
    };

    updateDeviceInfo();

    // === Active latency measurement (works everywhere) ===
    const measureLatency = async () => {
      try {
        const start = performance.now();
        await fetch(window.location.origin, {
          cache: "no-store",
          mode: "no-cors",
        });
        const latency = Math.round(performance.now() - start);
        updateDeviceInfo(latency);
      } catch {
        updateDeviceInfo(null);
      }
    };

    // Run initially & every 15 seconds
    measureLatency();
    const latencyInterval = setInterval(measureLatency, 15000);

    // === Core Web Vitals (INP, LCP, CLS, TTFB) ===
    const handleMetric = (metric) => {
      setMetrics({
        [metric.name]: metric.value.toFixed(metric.name === "CLS" ? 3 : 1),
      });
    };

    const lcp = onLCP(handleMetric);
    const cls = onCLS(handleMetric);
    const inp = onINP(handleMetric);
    const ttfb = onTTFB(handleMetric);

    // === Re-measure on user navigation ===
    const handleUserActivity = () => {
      setTrendData([]); // restart trend to show fresh interaction
      onINP(handleMetric);
      onLCP(handleMetric);
      onCLS(handleMetric);
      onTTFB(handleMetric);
      measureLatency();
    };

    window.addEventListener("click", handleUserActivity);
    window.addEventListener("scroll", handleUserActivity, { passive: true });

    // === Cleanup ===
    return () => {
      window.removeEventListener("click", handleUserActivity);
      window.removeEventListener("scroll", handleUserActivity);
      clearInterval(latencyInterval);
      // Stop observers cleanly
      lcp?.disconnect?.();
      cls?.disconnect?.();
      inp?.disconnect?.();
      ttfb?.disconnect?.();
    };
  }, [setMetrics, setDevice, setTrendData]);

  return null;
};

export default VitalsTracker;
