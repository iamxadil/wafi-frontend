import React, { useRef, useState, useEffect } from "react";

const OptimizeImage = ({
  src,
  alt = "",
  className = "",
  aspectRatio = 1,
  style = {},
  widths = [400, 600, 900, 1200], // responsive breakpoints
  quality = 60,
  format = "webp", // can be webp or avif
  background = "#1a1a1a",
}) => {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef(null);

  const IMAGEKIT_URL = import.meta.env.IMAGEKIT_URL_ENDPOINT;

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
     2. Normalize Source URL
  -------------------------------------------- */
  let baseUrl;

  if (src.startsWith("http")) {
    baseUrl = src;
  } else if (src.startsWith(IMAGEKIT_URL)) {
    baseUrl = src;
  } else {
    baseUrl = `${IMAGEKIT_URL}/${src.replace(/^\//, "")}`;
  }

  /* --------------------------------------------
     3. Generate responsive srcset
  -------------------------------------------- */
  const srcSet = widths
    .map(
      (w) =>
        `${baseUrl}?tr=w-${w},q-${quality},f-${format} ${w}w`
    )
    .join(", ");

  const largest = widths[widths.length - 1];

  const finalUrl = `${baseUrl}?tr=w-${largest},q-${quality},f-${format}`;

  /* --------------------------------------------
     4. Placeholder (before visible)
  -------------------------------------------- */
  if (!visible) {
    return (
      <div
        ref={containerRef}
        style={{
          aspectRatio,
          width: "100%",
          background,
          borderRadius: 8,
        }}
      />
    );
  }

  /* --------------------------------------------
     5. Render optimized responsive image
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
        srcSet={srcSet}
        sizes="(max-width: 600px) 100vw, 50vw"
        alt={alt}
        className={className}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          transition: "opacity 0.4s ease",
        }}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};

export default OptimizeImage;
