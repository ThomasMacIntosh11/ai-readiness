import type { Transition, Variants } from "framer-motion";

const BASE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const MOTION_DURATION = {
  fast: 0.2,
  medium: 0.3,
  slow: 0.45,
} as const;

const HERO_SPRING = {
  type: "spring" as const,
  stiffness: 240,
  damping: 24,
  mass: 0.7,
};

export const easingTransition: Transition = {
  duration: MOTION_DURATION.medium,
  ease: BASE_EASE,
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: easingTransition,
  },
};

export const panelReveal: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.995 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: easingTransition,
  },
};

export const chapterPulse: Variants = {
  idle: { opacity: 0.72, y: 0 },
  active: {
    opacity: 1,
    y: -1,
    transition: {
      duration: MOTION_DURATION.fast,
      ease: BASE_EASE,
    },
  },
};

export const milestoneGlow: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: easingTransition,
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

export const cardStagger = (delayChildren = 0.08, staggerChildren = 0.06): Variants => ({
  hidden: {},
  visible: {
    transition: {
      delayChildren,
      staggerChildren,
    },
  },
});

export const heroStaggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.09,
    },
  },
};

export const heroStaggerItem: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: HERO_SPRING,
  },
};

/** Use for prefers-reduced-motion: no blur / no travel */
export const heroStaggerItemStatic: Variants = {
  hidden: { opacity: 1, y: 0, filter: "blur(0px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0 } },
};

export function transitionForReducedMotion(reducedMotion: boolean, fallbackDuration = MOTION_DURATION.medium): Transition {
  if (reducedMotion) {
    return { duration: 0 };
  }

  return {
    duration: fallbackDuration,
    ease: BASE_EASE,
  };
}
