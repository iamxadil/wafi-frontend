export const getIKUrl = (src, opts = {}) => {
  const { w = 800, q = 70, f = "webp" } = opts;

  const BASE = import.meta.env.IMAGEKIT_URL_ENDPOINT;
  if (!src) return "";

  // If full URL → strip the domain
  if (src.startsWith("http")) {
    const cleaned = src.replace(/^https:\/\/ik\.imagekit\.io\/[^/]+\//, "");
    return `${BASE}/${cleaned}?tr=w-${w},q-${q},f-${f}`;
  }

  // Raw filename
  return `${BASE}/${src}?tr=w-${w},q-${q},f-${f}`;
};
