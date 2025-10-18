// src/components/ThreeCarousel.jsx
import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Environment, ContactShadows, useGLTF } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/threecarousel.css";
import Search from "./Search.jsx";

// === Models with per-model responsive settings ===
const models = [
  {
    name: "Laptop 1",
    path: "/models/laptop3.glb",
    scale: 0.8,
    landingOffset: [0, -0.1, 0],
    landingRotation: [-0.5, 1, 0],
    text: "Seamless Experience",
    desc: "Every click, every move — smoother than ever.",
    spinAxis: "x",
    spinSpeed: 0.01,
    positionSpeed: 0.01,
    rotationSpeed: 0.06,
    ambientIntensity: 3,
    ambientColor: "#ffffff",
    lightPosition: [3, 5, 3],
    lightIntensity: 2,
    lightColor: "crimson",
    lightPosition2: [-4, 2, -3],
    lightIntensity2: 0.25,
    environmentPreset: "city",
    shadowPosition: [0, -1, 0],
    shadowOpacity: 0.2,
    shadowScale: 5,
    shadowBlur: 3,
    shadowFar: 1,
    responsive: { lift: 1.2, scale: 0.65 },
  },
  {
    name: "Laptop 2",
    path: "/models/laptop2.glb",
    scale: 0.9,
    landingOffset: [0.5, -0.6, 0],
    landingRotation: [0, 0, 0],
    text: "Engineered for Excellence",
    desc: "Maximum power, minimum compromise.",
    spinAxis: "y",
    spinSpeed: 0.01,
    positionSpeed: 0.01,
    rotationSpeed: 0.01,
    ambientIntensity: 2,
    ambientColor: "#ffeedd",
    lightPosition: [4, 3, 2],
    lightIntensity: 1.5,
    lightColor: "purple",
    lightPosition2: [-2, 2, -3],
    lightIntensity2: 0.7,
    environmentPreset: "city",
    shadowPosition: [0, -0.55, 0],
    shadowOpacity: 0.4,
    shadowScale: 5,
    shadowBlur: 4,
    shadowFar: 1,
    responsive: { lift: 1, scale: 1 },
  },
  {
    name: "Mouse",
    path: "/models/mouse2.glb",
    scale: 20,
    landingOffset: [0, 0.5, 0],
    landingRotation: [0, 1, 0],
    text: "Unmatched Precision",
    desc: "Ultra-responsive, ultra-durable, ultra-sleek.",
    spinAxis: "x",
    spinSpeed: 0.01,
    positionSpeed: 0.02,
    rotationSpeed: 0.01,
    ambientIntensity: 1.5,
    ambientColor: "#ddddff",
    lightPosition: [2, 4, 2],
    lightIntensity: 1.2,
    lightColor: "blue",
    lightPosition2: [-3, 1, -2],
    lightIntensity2: 1,
    environmentPreset: "city",
    shadowPosition: [0, -0.55, 0],
    shadowOpacity: 0.5,
    shadowScale: 3,
    shadowBlur: 2,
    shadowFar: 0.8,
    responsive: { lift: 0.75, scale: 0.9 },
  },
];

// === Preload all models ===
models.forEach((m) => useGLTF.preload(m.path));

// === SceneModel ===
function SceneModel({ model, activeKey, responsiveLift = 0, responsiveScale = 1, dragOffset = 0 }) {
  const ref = useRef();
  const { scene } = useGLTF(model.path);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.rotation.set(0, 0, 0);
    ref.current.position.set(0, 0, 0);
  }, [activeKey]);

  useFrame(() => {
    if (!ref.current) return;

    // Smooth landing
    ref.current.position.x += (model.landingOffset[0] + dragOffset - ref.current.position.x) * model.positionSpeed;
    ref.current.position.y += (model.landingOffset[1] + responsiveLift - ref.current.position.y) * model.positionSpeed;
    ref.current.position.z += (model.landingOffset[2] - ref.current.position.z) * model.positionSpeed;

    // Spin
    if (model.spinAxis === "x") ref.current.rotation.x += model.spinSpeed;
    if (model.spinAxis === "y") ref.current.rotation.y += model.spinSpeed;
    if (model.spinAxis === "z") ref.current.rotation.z += model.spinSpeed;

    // Smooth rotation
    ref.current.rotation.x += (model.landingRotation[0] - ref.current.rotation.x) * model.rotationSpeed;
    ref.current.rotation.y += (model.landingRotation[1] - ref.current.rotation.y) * model.rotationSpeed;
    ref.current.rotation.z += (model.landingRotation[2] - ref.current.rotation.z) * model.rotationSpeed;
  });

  return (
    <>
      <ambientLight intensity={model.ambientIntensity} color={model.ambientColor} />
      <directionalLight position={model.lightPosition} intensity={model.lightIntensity} color={model.lightColor} castShadow />
      <directionalLight position={model.lightPosition2} intensity={model.lightIntensity2} color={model.lightColor2 || model.lightColor} />
      <Environment preset={model.environmentPreset} />
      <ContactShadows
        position={model.shadowPosition}
        opacity={model.shadowOpacity}
        scale={model.shadowScale}
        blur={model.shadowBlur}
        far={model.shadowFar}
      />
      <primitive ref={ref} object={scene} scale={model.scale * responsiveScale} />
    </>
  );
}

// === Camera Controller ===
function CameraController({ camRef, targetPos }) {
  useFrame(() => {
    if (!camRef.current) return;
    camRef.current.position.x += (targetPos[0] - camRef.current.position.x) * 0.1;
    camRef.current.position.y += (targetPos[1] - camRef.current.position.y) * 0.1;
    camRef.current.position.z += (targetPos[2] - camRef.current.position.z) * 0.1;
    camRef.current.lookAt(0, 0.2, 0);
  });
  return null;
}

// === Main Carousel ===
export default function ThreeCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const camRef = useRef();
  const dragOffset = useRef(0);
  const lastSwipe = useRef(0);
  const swipeCooldown = 250; // ms

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = viewportWidth < 768;
  const currentModel = models[currentIndex];
  const responsiveLift = isMobile ? currentModel.responsive.lift : 0;
  const responsiveScale = isMobile ? currentModel.responsive.scale : 1;

  // Swipe / Drag
  const startX = useRef(0);
  const isDragging = useRef(false);

  const nextModel = () => {
    if (Date.now() - lastSwipe.current < swipeCooldown) return;
    lastSwipe.current = Date.now();
    setCurrentIndex((prev) => (prev + 1) % models.length);
  };

  const prevModel = () => {
    if (Date.now() - lastSwipe.current < swipeCooldown) return;
    lastSwipe.current = Date.now();
    setCurrentIndex((prev) => (prev - 1 + models.length) % models.length);
  };

  // Handle start
  const handleDragStart = (x) => {
    startX.current = x;
    isDragging.current = true;
  };

  // Handle move
  const handleDragMove = (x) => {
    if (!isDragging.current) return;
    dragOffset.current = (x - startX.current) * 0.01; // move object slightly
  };

  // Handle end
  const handleDragEnd = () => {
    if (!isDragging.current) return;
    const delta = dragOffset.current;
    dragOffset.current = 0;
    isDragging.current = false;
    if (delta < -0.5) nextModel();
    else if (delta > 0.5) prevModel();
  };

  return (
    <section
      style={{ width: "100%", height: "100vh", overflow: "hidden", position: "relative" }}
      onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
      onTouchEnd={handleDragEnd}
      onMouseDown={(e) => handleDragStart(e.clientX)}
      onMouseMove={(e) => handleDragMove(e.clientX)}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      <Canvas style={{ width: "100%", height: "100%" }} shadows dpr={[1, 2]}>
        <PerspectiveCamera ref={camRef} makeDefault position={[0, 0, 5]} fov={isMobile ? 55 : 45} />
        <CameraController camRef={camRef} targetPos={[0, 0, 5]} />
        <Suspense fallback={null}>
          <SceneModel
            model={currentModel}
            activeKey={currentIndex}
            responsiveLift={responsiveLift}
            responsiveScale={responsiveScale}
            dragOffset={dragOffset.current}
          />
        </Suspense>
      </Canvas>

      {/* Text overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          style={{
            position: "absolute",
            bottom: isMobile ? "50%" : "40%",
            width: "100%",
            textAlign: "center",
            color: "white",
            padding: "0 1rem",
          }}
        >
          <div className="model-texts">
            <h1 style={{ fontSize: isMobile ? "1.4rem" : "2rem", fontWeight: 700, color: "var(--accent-clr)" }}>
              {currentModel.text}
            </h1>
            <p style={{ fontSize: isMobile ? "0.96rem" : "1.25rem", color: "var(--line-clr)" }}>
              {currentModel.desc}
            </p>
          </div>
          <div className="cta-buttons">
            <Search />
            <button>Navigate</button>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
