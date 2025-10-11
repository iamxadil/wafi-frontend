import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useProductStore from "../components/stores/useProductStore";
import OptimizeImage from "../components/hooks/OptimizeImage";
import { FastAverageColor } from "fast-average-color";
import { Star } from "lucide-react";
import "../styles/grids.css";

const fac = new FastAverageColor();

const Static = () => {
  const { laptopProducts, fetchLaptops } = useProductStore();
  const [gradients, setGradients] = useState({});
  const [activeCard, setActiveCard] = useState(null);
  const [waves, setWaves] = useState({});

  useEffect(() => {
    fetchLaptops({ limit: 12 });
  }, [fetchLaptops]);

      // Lighten or darken a hex color by a percentage
    const adjustColor = (hex, percent) => {
      const num = parseInt(hex.replace("#", ""), 16);
      let r = (num >> 16) + percent;
      let g = ((num >> 8) & 0x00FF) + percent;
      let b = (num & 0x0000FF) + percent;

      r = Math.min(255, Math.max(0, r));
      g = Math.min(255, Math.max(0, g));
      b = Math.min(255, Math.max(0, b));

      return `#${(b | (g << 8) | (r << 16)).toString(16).padStart(6, "0")}`;
    };


useEffect(() => {
  laptopProducts.forEach((laptop) => {
    if (laptop.images?.[0]) {
      fac
        .getColorAsync(laptop.images[0])
        .then((color) => {
          const lighter = adjustColor(color.hex, 25); // 25 = slightly lighter
          const gradient = `linear-gradient(185deg, ${lighter}, ${color.hex})`;

          setGradients((prev) => ({
            ...prev,
            [laptop._id]: gradient,
          }));
        })
        .catch(() => {
          setGradients((prev) => ({
            ...prev,
            [laptop._id]: "linear-gradient(135deg, #f5f5f5, #e0e0e0)",
          }));
        });
    }
  });
}, [laptopProducts]);

  const handleWave = (id) => {
    setWaves((prev) => ({ ...prev, [id]: true }));
    setActiveCard(id);
    setTimeout(() => {
      setWaves((prev) => ({ ...prev, [id]: false }));
    }, 400);
  };

  // Detect click outside overlay buttons
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close if an overlay is active
      if (activeCard) {
        const overlayElement = document.getElementById(`overlay-${activeCard}`);
        if (overlayElement && !overlayElement.contains(event.target)) {
          setActiveCard(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeCard]);

  return (
    <main className="products-grid-container">
      {laptopProducts.map((laptop) => (
        <motion.div key={laptop._id}className="gr-product-card" 
         style={{ background: gradients[laptop._id] || "rgba(255,255,255,0.05)",}}
          onClick={() => handleWave(laptop._id)} whileHover="hover" initial="rest"animate="rest">


            <motion.div
            className="moving-stroke"
            initial={{ opacity: 0, backgroundPosition: "0% 0%" }}
            whileHover={{ opacity: 1, backgroundPosition: "200% 0%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          
          <AnimatePresence>
            {waves[laptop._id] && (
              <motion.div className="wave-overlay" initial={{ scale: 0, opacity: 1 }} animate={{ scale: 3, opacity: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}/>
            )}
          </AnimatePresence>

      

            
          <div className="gr-image-wrapper">
            <OptimizeImage  src={laptop.images?.[0]}  alt={laptop.name}className="gr-image"/>
          </div>

          <div className="product-info">

            <h3 className="product-title">{laptop.name}</h3>
             <p className="product-brand">
              <span>{laptop.brand}</span>
             <span className="rating-stars">
                  {[...Array(5)].map((_, i) => {
                    const ratingValue = i + 1;
                    const decimal = laptop.rating - i;
                    let fillType = "empty";

                    if (decimal >= 1) fillType = "full";
                    else if (decimal >= 0.25) fillType = "half";

                    return (
                      <span className="star-wrapper" key={i}>
                        <Star size={14} className="star-empty" />
                        {(fillType === "full" || fillType === "half") && (
                          <Star
                            size={14}
                            className={fillType === "full" ? "star-full" : "star-half"}
                          />
                        )}
                      </span>
                    );
                  })}
                </span>

                </p>


            <div className="product-price">
            <p>
              {laptop.discountPrice > 0 ? (
                <>
                  <span style={{ textDecoration: "line-through", color: "#eeeeeeff", marginRight: "8px", fontSize: "14px" }}>
                    {laptop.price.toLocaleString()} IQD
                  </span>
                  <span style={{ color: "#e53935", fontWeight: "bold" }}>
                    {laptop.finalPrice.toLocaleString()} IQD
                  </span>
                </>
              ) : (
                <span style={{ fontWeight: "bold" }}>{laptop.finalPrice} IQD</span>
              )}
            </p>
            </div>
          </div>

          {/* Overlay buttons */}
          <AnimatePresence>
            {activeCard === laptop._id && (
              <motion.div id={`overlay-${laptop._id}`}  className="card-overlay" initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}  exit={{ opacity: 0 }} >

                <button>View Product</button>
                <button>Add to Cart</button>

              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </main>
  );
};

export default Static;
