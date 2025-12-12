import React, { useRef, useState, useEffect } from "react";

const OptimizeImage = ({
  src,
  alt = "",
  className = "",
  aspectRatio = 1,
  style = {},
  lazyBackground = "#1a1a1a",
}) => {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef(null);

  const IMAGEKIT_URL = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

  /* --------------------------------------------
     1. Lazy Load
  -------------------------------------------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (!src) return null;

  /* --------------------------------------------
     2. Normalize source → prevent duplicates!
  -------------------------------------------- */
  let finalUrl;

  // A. Full URL
  if (src.startsWith("http")) {
    finalUrl = src;
  }
  // B. Already a CDN URL
  else if (src.startsWith(IMAGEKIT_URL)) {
    finalUrl = src;
  }
  // C. Raw filename stored in DB
  else {
    finalUrl = `${IMAGEKIT_URL}/${src.replace(/^\//, "")}`;
  }

  /* --------------------------------------------
     3. Placeholder
  -------------------------------------------- */
  if (!visible) {
    return (
      <div
        ref={containerRef}
        style={{
          aspectRatio,
          width: "100%",
          background: lazyBackground,
          borderRadius: 8,
        }}
      />
    );
  }

  /* --------------------------------------------
     4. Render (CDN will auto-optimize)
  -------------------------------------------- */
  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        aspectRatio,
        overflow: "hidden",
        borderRadius: 8,
        ...style,
      }}
    >
      <img
        src={finalUrl}
        alt={alt}
        className={className}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          opacity: 1,
          transition: "opacity 0.3s ease",
        }}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};

export default OptimizeImage;
