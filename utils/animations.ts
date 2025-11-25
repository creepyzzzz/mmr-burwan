/**
 * Animation Utilities - Matching landing page animations
 * Respects prefers-reduced-motion
 */

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Animation delay helper for staggered animations
 */
export const getAnimationDelay = (index: number, baseDelay: number = 0.1): string => {
  return `${baseDelay + index * 0.1}s`;
};

/**
 * Fade up animation styles
 */
export const fadeUpAnimation = (delay: number = 0): React.CSSProperties => {
  if (prefersReducedMotion()) {
    return { opacity: 1 };
  }
  return {
    animation: `fadeUp 0.8s ease-out ${delay}s forwards`,
    opacity: 0,
  };
};

/**
 * Fade in animation styles
 */
export const fadeInAnimation = (delay: number = 0): React.CSSProperties => {
  if (prefersReducedMotion()) {
    return { opacity: 1 };
  }
  return {
    animation: `fadeIn 1s ease-out ${delay}s forwards`,
    opacity: 0,
  };
};

/**
 * Float animation class
 */
export const getFloatAnimation = (): string => {
  if (prefersReducedMotion()) return '';
  return 'animate-float';
};

/**
 * Pulse slow animation class
 */
export const getPulseSlowAnimation = (): string => {
  if (prefersReducedMotion()) return '';
  return 'animate-pulse-slow';
};

/**
 * Shimmer animation class
 */
export const getShimmerAnimation = (): string => {
  if (prefersReducedMotion()) return '';
  return 'animate-shimmer';
};

/**
 * Blob animation class
 */
export const getBlobAnimation = (): string => {
  if (prefersReducedMotion()) return '';
  return 'animate-blob';
};

/**
 * Hover lift effect (3D tilt) - matches ActionCard pattern
 */
export interface HoverPosition {
  x: number;
  y: number;
}

export interface HoverRotation {
  x: number;
  y: number;
}

export const calculateHoverRotation = (
  mouseX: number,
  mouseY: number,
  elementWidth: number,
  elementHeight: number,
  maxRotation: number = 3
): HoverRotation => {
  if (prefersReducedMotion()) {
    return { x: 0, y: 0 };
  }

  const centerX = elementWidth / 2;
  const centerY = elementHeight / 2;
  const rotateX = ((mouseY - centerY) / centerY) * -maxRotation;
  const rotateY = ((mouseX - centerX) / centerX) * maxRotation;

  return { x: rotateX, y: rotateY };
};

/**
 * Get transform style for 3D hover effect
 */
export const getHoverTransform = (rotation: HoverRotation): React.CSSProperties => {
  if (prefersReducedMotion() || (rotation.x === 0 && rotation.y === 0)) {
    return {};
  }
  return {
    transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
    transformStyle: 'preserve-3d',
  };
};

/**
 * Spotlight effect gradient
 */
export const getSpotlightGradient = (
  x: number,
  y: number,
  color: string,
  size: number = 600
): string => {
  return `radial-gradient(${size}px circle at ${x}px ${y}px, ${color}, transparent 40%)`;
};

