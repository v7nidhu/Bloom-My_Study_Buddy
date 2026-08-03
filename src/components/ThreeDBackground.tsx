import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

// Define static properties for shapes
interface ShapeConfig {
  id: number;
  size: number;
  color: string;
  shadow: string;
  x: string;
  y: string;
  speed: number;
  delay: number;
  depth: number;
}

const SHAPES_CONFIG: ShapeConfig[] = [
  { id: 1, size: 280, color: 'from-pink-300/40 to-pink-500/20', shadow: 'shadow-pink-300/50', x: '10%', y: '15%', speed: 25, delay: 0, depth: -120 },
  { id: 2, size: 220, color: 'from-blue-300/40 to-indigo-400/25', shadow: 'shadow-blue-300/50', x: '80%', y: '20%', speed: 30, delay: 2, depth: -90 },
  { id: 3, size: 180, color: 'from-purple-300/45 to-rose-400/20', shadow: 'shadow-purple-300/50', x: '75%', y: '75%', speed: 20, delay: 4, depth: -150 },
  { id: 4, size: 130, color: 'from-amber-200/40 to-pink-400/15', shadow: 'shadow-amber-200/40', x: '15%', y: '70%', speed: 35, delay: 1, depth: -80 },
  { id: 5, size: 90, color: 'from-emerald-200/35 to-teal-400/15', shadow: 'shadow-emerald-200/40', x: '45%', y: '45%', speed: 18, delay: 3, depth: -200 },
];

interface FloatingShapeProps {
  shape: ShapeConfig;
  springX: any;
  springY: any;
  windowSize: { width: number; height: number };
}

const FloatingShape: React.FC<FloatingShapeProps> = ({ shape, springX, springY, windowSize }) => {
  const factor = shape.depth / 1000;
  
  // Clean, rule-of-hooks-friendly reactive transforms
  const xOffset = useTransform(springX, (v: number) => v * factor * windowSize.width);
  const yOffset = useTransform(springY, (v: number) => v * factor * windowSize.height);

  return (
    <motion.div
      className="absolute rounded-full flex items-center justify-center pointer-events-none"
      style={{
        left: shape.x,
        top: shape.y,
        width: shape.size,
        height: shape.size,
        x: xOffset,
        y: yOffset,
        z: shape.depth,
        transformStyle: 'preserve-3d',
      }}
      animate={{
        y: [0, -18, 0],
        rotateX: [0, 360],
        rotateY: [0, 180, 360],
      }}
      transition={{
        y: {
          duration: shape.speed / 4,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
          delay: shape.delay,
        },
        rotateX: {
          duration: shape.speed,
          repeat: Infinity,
          ease: 'linear',
        },
        rotateY: {
          duration: shape.speed * 1.5,
          repeat: Infinity,
          ease: 'linear',
        },
      }}
    >
      {/* Glossy Glassmorphic Sphere Overlay */}
      <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${shape.color} backdrop-blur-[1px] border border-white/40 shadow-2xl ${shape.shadow} overflow-hidden`}>
        {/* Highlight / Specular Reflection Ring */}
        <div className="absolute top-[8%] left-[8%] w-[35%] h-[35%] rounded-full bg-gradient-to-br from-white/70 to-transparent filter blur-[0.5px]" />
        {/* Soft glow edge */}
        <div className="absolute inset-0 rounded-full border-[1.5px] border-white/20 filter blur-[0.5px]" />
      </div>
    </motion.div>
  );
};

export const ThreeDBackground: React.FC = () => {
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out mouse movements using spring physics
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) - 0.5;
      const normY = (e.clientY / window.innerHeight) - 0.5;
      mouseX.set(normX);
      mouseY.set(normY);
    };

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" style={{ perspective: 1000 }}>
      {/* 3D Moving Mesh / Grid line backplane */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            radial-gradient(circle, var(--theme-500) 1px, transparent 1.5px),
            linear-gradient(to right, var(--theme-500) 1px, transparent 1px),
            linear-gradient(to bottom, var(--theme-500) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px, 80px 80px, 80px 80px',
          transform: 'translateZ(-300px) scale(2.2)',
        }}
      />

      {/* Floating 3D Graphic Shapes rendered via Subcomponents */}
      {SHAPES_CONFIG.map((shape) => (
        <FloatingShape
          key={shape.id}
          shape={shape}
          springX={springX}
          springY={springY}
          windowSize={windowSize}
        />
      ))}

      {/* Additional floating 3D Star elements */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, idx) => {
          const size = Math.random() * 6 + 4;
          const left = `${Math.random() * 100}%`;
          const top = `${Math.random() * 100}%`;
          const speed = 6 + Math.random() * 6;
          const delay = Math.random() * 4;
          return (
            <motion.div
              key={idx}
              className="absolute bg-white rounded-full opacity-60 shadow-lg"
              style={{
                left,
                top,
                width: size,
                height: size,
                boxShadow: '0 0 8px 1px var(--theme-300)',
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3],
                y: [0, -25, 0],
              }}
              transition={{
                duration: speed,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
                delay,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

// Refined Card hover wrapper component for interactive smooth hovers without text blur
interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  disabledHoverScale?: boolean;
}

export const ThreeDCard: React.FC<ThreeDCardProps> = ({ children, className = '', id, disabledHoverScale = false }) => {
  return (
    <motion.div
      id={id}
      whileHover={disabledHoverScale ? {
        y: -3,
        boxShadow: '0 12px 24px -8px var(--theme-200)'
      } : { 
        scale: 1.02,
        y: -5,
        boxShadow: '0 20px 35px -8px var(--theme-300)'
      }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      className={`transition-shadow duration-300 ${className}`}
      style={{
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitFontSmoothing: 'subpixel-antialiased',
      }}
    >
      <div>
        {children}
      </div>
    </motion.div>
  );
};
