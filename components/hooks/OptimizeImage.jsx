// src/components/OptimizeImage.jsx
import React from "react";

const OptimizeImage = ({
  src,
  alt = "",
  className = "",
  responsive = true,
  width = 400,
  height = 400,
  quality = 80,
  format = "webp",
  style = {},
}) => {
  if (!src) return null;

const optimizedUrl = `${src}?tr=w-${width},h-${height},q-${quality},f-${format},cm-fit`;

  const srcSet = responsive
    ? `
      ${src}?tr=w-${width},h-${height},q-${quality},f-${format} ${width}w,
      ${src}?tr=w-${width * 2},h-${height * 2},q-${quality},f-${format} ${width * 2}w,
      ${src}?tr=w-${width * 3},h-${height * 3},q-${quality},f-${format} ${width * 3}w
    `
    : undefined;

  return (
    <img
      src={optimizedUrl}
      srcSet={srcSet}
      sizes={responsive ? `(max-width: ${width}px) ${width}px, ${width * 2}px` : undefined}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
    />
  );
};

export default OptimizeImage;
