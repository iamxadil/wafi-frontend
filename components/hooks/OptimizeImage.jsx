import React, { useRef, useState, useEffect } from "react";

const OptimizeImage = ({
  src,
  alt = "",
  className = "",
  width = 400,
  height = 400,
  quality = 80,
  format = "webp",
  style = {},
}) => {
  const [visible, setVisible] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "100px" } 
    );
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  if (!visible) return <div ref={imgRef} style={{ width, height, background: "#222" }} />;

  const optimizedUrl = `${src}?tr=w-${width},h-${height},q-${quality},f-${format},cm-fit`;

  return (
    <img
      ref={imgRef}
      src={optimizedUrl}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      decoding="async"
    />
  );
};

export default OptimizeImage;
