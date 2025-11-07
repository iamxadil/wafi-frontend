import React, { useRef, useState, useEffect } from "react";

/**
 * Responsive, lazy-loading, high-quality image optimizer
 */
const OptimizeImage = ({
  src,
  alt = "",
  className = "",
  aspectRatio = 1, // e.g. 1 for square, 16/9 for wide images
  quality = 100,
  format = "webp",
  style = {},
  lazyBackground = "#1a1a1a",
}) => {
  const [visible, setVisible] = useState(false);
  const [containerWidth, setContainerWidth] = useState(null);
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  /* ============================================================
     👁️ 1. Lazy load when visible
  ============================================================ */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "250px" }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  /* ============================================================
     📏 2. Detect container width (for responsive optimization)
  ============================================================ */
  useEffect(() => {
    if (!visible || !containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        if (width !== containerWidth) setContainerWidth(Math.round(width));
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [visible]);

  /* ============================================================
     🧠 3. Compute optimized URL
  ============================================================ */
  let optimizedUrl = src;
  if (visible && containerWidth) {
    const dpr =
      typeof window !== "undefined"
        ? Math.min(window.devicePixelRatio || 1, 2)
        : 1;

    optimizedUrl = `${src}?tr=w-${Math.round(
      containerWidth * dpr
    )},q-${quality},f-${format},dpr-${dpr}`;
  }

  /* ============================================================
     🎨 4. Placeholder layout (no shift)
  ============================================================ */
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

  /* ============================================================
     🖼️ 5. Actual image render
  ============================================================ */
  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio,
        overflow: "hidden",
        borderRadius: 8,
        ...style,
      }}
    >
      <img
        ref={imgRef}
        src={optimizedUrl}
        alt={alt}
        className={className}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          transition: "opacity 0.4s ease",
          opacity: visible ? 1 : 0,
        }}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};

export default OptimizeImage;
