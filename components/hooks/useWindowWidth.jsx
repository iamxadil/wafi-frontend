import { useState, useEffect } from "react";

function useWindowWidth() {
  const [width, setWidth] = useState(0); // start with 0 or null

  useEffect(() => {
    // Now this only runs in the browser
    const handleResize = () => setWidth(window.innerWidth);

    // Set initial width
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

export default useWindowWidth;
