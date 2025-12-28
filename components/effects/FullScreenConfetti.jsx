import React from 'react';
import animationData from "../../assets/json/congratulation.json";
import Lottie from 'react-lottie';

const FullScreenConfetti = () => {
  const defaultOptions = {
    loop: false,
    autoplay: false,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        zIndex: 650,
        overflow: "hidden",
      }}
    >
      <Lottie 
        options={defaultOptions}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default FullScreenConfetti;
