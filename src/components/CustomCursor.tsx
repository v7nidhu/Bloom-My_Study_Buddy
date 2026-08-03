import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [hoverType, setHoverType] = useState<'button' | 'input' | 'default'>('default');

  // Track cursor coordinates
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth out coordinate tracking with elastic physics
  const springConfig = { stiffness: 400, damping: 28 };
  const cursorSpringX = useSpring(cursorX, springConfig);
  const cursorSpringY = useSpring(cursorY, springConfig);

  // Outer ring spring tracking with slightly more lag for nice organic parallax drag
  const ringSpringX = useSpring(cursorX, { stiffness: 220, damping: 22 });
  const ringSpringY = useSpring(cursorY, { stiffness: 220, damping: 22 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeaveWindow = () => {
      setIsVisible(false);
    };

    const handleMouseEnterWindow = () => {
      setIsVisible(true);
    };

    const handleMouseDown = () => {
      setIsClicked(true);
    };

    const handleMouseUp = () => {
      setIsClicked(false);
    };

    // Detect hovers on interactive components to trigger morphing animations
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactiveEl = target.closest('button, a, input, select, textarea, [role="button"], [onClick]');
      if (interactiveEl) {
        setIsHovered(true);
        if (interactiveEl.tagName === 'INPUT' || interactiveEl.tagName === 'TEXTAREA') {
          setHoverType('input');
        } else {
          setHoverType('button');
        }
      } else {
        setIsHovered(false);
        setHoverType('default');
      }
    };

    if (typeof window !== 'undefined') {
      // Disable custom cursor on touch devices for accessibility and responsive cleanliness
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      if (!isTouchDevice) {
        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeaveWindow);
        document.addEventListener('mouseenter', handleMouseEnterWindow);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseover', handleMouseOver);
      }
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Central High-Intensity Magnetic Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-pink-500 z-50 pointer-events-none mix-blend-difference"
        style={{
          x: cursorSpringX,
          y: cursorSpringY,
          translateX: '-50%',
          translateY: '-50%',
          backgroundColor: 'var(--theme-500)',
        }}
        animate={{
          scale: isClicked ? 0.6 : isHovered ? (hoverType === 'input' ? 1.5 : 1.2) : 1,
        }}
      />

      {/* Floating Parallax Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-pink-400/60 z-50 pointer-events-none mix-blend-normal"
        style={{
          x: ringSpringX,
          y: ringSpringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isClicked ? 48 : isHovered ? (hoverType === 'input' ? 14 : 54) : 24,
          height: isClicked ? 48 : isHovered ? (hoverType === 'input' ? 24 : 54) : 24,
          backgroundColor: isHovered && hoverType === 'button' ? 'var(--theme-100)' : 'transparent',
          borderRadius: isHovered && hoverType === 'input' ? '4px' : '50%',
          borderColor: isClicked ? 'var(--theme-600)' : isHovered ? 'var(--theme-500)' : 'var(--theme-400)',
          boxShadow: isHovered && hoverType === 'button' ? '0 0 12px 2px var(--theme-300)' : 'none',
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      />
    </>
  );
};
