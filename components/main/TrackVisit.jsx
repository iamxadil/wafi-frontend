import axios from "axios";

export default function trackVisit() {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const params = new URLSearchParams(window.location.search);

  // Extract UTM parameters
  const utm = {
    source: params.get("utm_source") || null,
    medium: params.get("utm_medium") || null,
    campaign: params.get("utm_campaign") || null,
    term: params.get("utm_term") || null,
    content: params.get("utm_content") || null,
  };

  // Browser & device fingerprints
  const browser = detectBrowser();
  const device = detectDevice();

  axios.post(
    `${API_URL}/api/analytics/track`,
    { utm, browser, device },
    { withCredentials: true }
  );
}

// Detect browser
function detectBrowser() {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("chrome")) return "chrome";
  if (ua.includes("safari")) return "safari";
  if (ua.includes("firefox")) return "firefox";
  if (ua.includes("edg")) return "edge";
  return "other";
}

// Detect device type
function detectDevice() {
  const w = window.innerWidth;

  if (/mobile/i.test(navigator.userAgent)) return "mobile";
  if (/tablet/i.test(navigator.userAgent)) return "tablet";
  if (w <= 768) return "mobile";
  if (w <= 1024) return "tablet";
  
  return "desktop";
}
