import React, { useState } from 'react';
import { motion } from 'motion/react';

/* ------------------------------
   LiquidGlassCard Component
-------------------------------- */

const LiquidGlass = ({
  children,
  className = '',
  draggable = true,
  expandable = false,
  width,
  height,
  expandedWidth,
  expandedHeight,
  blurIntensity = 'xl',
  borderRadius = '32px',
  glowIntensity = 'sm',
  shadowIntensity = 'md',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpansion = (e) => {
    if (!expandable) return;
    if (e.target.closest('a, button, input, select, textarea')) return;
    setIsExpanded((v) => !v);
  };

  /* ------------------------------
     Styles Maps
  -------------------------------- */
  const blurMap = {
    sm: 'blur(6px)',
    md: 'blur(12px)',
    lg: 'blur(18px)',
    xl: 'blur(24px)',
  };

  const shadowStyles = {
    none: 'inset 0 0 0 rgba(255,255,255,0)',
    xs: 'inset 1px 1px 1px rgba(255,255,255,0.3), inset -1px -1px 1px rgba(255,255,255,0.3)',
    sm: 'inset 2px 2px 2px rgba(255,255,255,0.35), inset -2px -2px 2px rgba(255,255,255,0.35)',
    md: 'inset 3px 3px 3px rgba(255,255,255,0.45), inset -3px -3px 3px rgba(255,255,255,0.45)',
    lg: 'inset 4px 4px 4px rgba(255,255,255,0.5), inset -4px -4px 4px rgba(255,255,255,0.5)',
    xl: 'inset 6px 6px 6px rgba(255,255,255,0.55), inset -6px -6px 6px rgba(255,255,255,0.55)',
  };

  const glowStyles = {
    none: '0 0 8px rgba(0,0,0,0.1)',
    xs: '0 0 12px rgba(255,255,255,0.05)',
    sm: '0 0 24px rgba(255,255,255,0.1)',
    md: '0 0 32px rgba(255,255,255,0.15)',
    lg: '0 0 40px rgba(255,255,255,0.2)',
    xl: '0 0 48px rgba(255,255,255,0.25)',
  };

  /* ------------------------------
     Motion Variants
  -------------------------------- */
  const containerVariants = expandable
    ? {
        collapsed: {
          width: width || 'auto',
          height: height || 'auto',
          transition: { duration: 0.4, ease: [0.5, 1.5, 0.5, 1] },
        },
        expanded: {
          width: expandedWidth || 'auto',
          height: expandedHeight || 'auto',
          transition: { duration: 0.4, ease: [0.5, 1.5, 0.5, 1] },
        },
      }
    : {};

  /* ------------------------------
     Motion Props
  -------------------------------- */
  const motionProps = {
    drag: draggable || undefined,
    variants: expandable ? containerVariants : undefined,
    animate: expandable ? (isExpanded ? 'expanded' : 'collapsed') : undefined,
    dragElastic: draggable ? 0.3 : undefined,
    whileHover: { scale: 1.01 },
    whileTap: draggable || expandable ? { scale: 0.98 } : undefined,
    whileDrag: draggable ? { scale: 1.02 } : undefined,
    onClick: expandable ? handleToggleExpansion : undefined,
  };

  return (
    <>
      {/* SVG Glass Distortion */}
      <svg style={{ display: 'none' }}>
        <defs>
          <filter id="glass-blur">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.003 0.007"
              numOctaves="1"
              result="turbulence"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="200"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <motion.div
        className={className}
        style={{
          position: 'relative',
          cursor: draggable ? 'grab' : expandable ? 'pointer' : 'default',
          borderRadius,
          width: !expandable ? width : undefined,
          height: !expandable ? height : undefined,
        }}
        {...motionProps}
      >
        {/* Backdrop Blur Layer */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius,
            backdropFilter: blurMap[blurIntensity],
            WebkitBackdropFilter: blurMap[blurIntensity],
            filter: 'url(#glass-blur)',
            zIndex: 0,
          }}
        />

        {/* Glow Layer */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius,
            boxShadow: glowStyles[glowIntensity],
            zIndex: 1,
          }}
        />

        {/* Inner Edge Highlight */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius,
            boxShadow: shadowStyles[shadowIntensity],
            zIndex: 2,
          }}
        />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 3 }}>{children}</div>
      </motion.div>
    </>
  );
};

export default LiquidGlass;
