// src/utils/suggestionsMap.js

export const SUGGESTIONS_MAP = {
  laptops: "windows-key",        // If user buys a laptop → suggest Windows Key
  monitors: "hdmi-cable",        // Example
  mouse: "mouse-pad",            // Example
  keyboard: "keyboard-cover",    // Example
};

// Optional normalization for safety
export const normalizeCategory = (cat = "") => {
  const c = cat.toLowerCase();

  if (c === "laptop") return "laptops";
  if (c === "monitor") return "monitors";

  return c;
};
