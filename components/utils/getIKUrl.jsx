export const getIKUrl = (src, opts = {}) => {
  const { w = 800, q = 70, f = "webp" } = opts;

  const BASE = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;
  
  if (!src) return "";

  // If full ImageKit URL → strip the domain and re-apply transformations
  if (src.startsWith("https://ik.imagekit.io")) {
    if (!BASE) return src;
    const cleaned = src.replace(/^https:\/\/ik\.imagekit\.io\/[^/]+\//, "");
    return `${BASE}/${cleaned}?tr=w-${w},q-${q},f-${f}`;
  }

  // Raw filename → use ImageKit (only if BASE is configured)
  if (!BASE) return src;
  return `${BASE}/${src}?tr=w-${w},q-${q},f-${f}`;
};
