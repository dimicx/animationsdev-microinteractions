import { Transition, Variants } from "motion/react";

export const fadeScaleVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0,
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
};

export const UNIVERSAL_DELAY = 100; // 0.1s

// Reusable floating animation props
export interface FloatingAnimationProps {
  initial: { transform: string };
  animate?: { transform: string[] | string };
  transition?: Transition;
}

export const createFloatingAnimation = ({
  to = 2,
  duration = 2.5,
  delay = 0,
  shouldReduceMotion,
}: {
  to?: number;
  duration?: number;
  delay?: number;
  shouldReduceMotion?: boolean | null;
} = {}): FloatingAnimationProps | undefined => {
  if (shouldReduceMotion) {
    return {
      initial: { transform: "translateY(0px)" },
      animate: { transform: "translateY(0px)" },
    };
  }
  return {
    initial: { transform: "translateY(0px)" },
    animate: {
      transform: ["translateY(0px)", `translateY(${to}px)`],
    },
    transition: {
      delay,
      duration,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse",
    },
  };
};

// Reusable rotation animation props
export interface RotationAnimationProps {
  initial: { transform: string };
  animate: { transform: string[] | string };
  transition?: Transition;
}

export const createRotationAnimation = ({
  to = 2,
  duration = 5,
  delay = 0,
  shouldReduceMotion,
}: {
  to?: number;
  duration?: number;
  delay?: number;
  shouldReduceMotion?: boolean | null;
} = {}): RotationAnimationProps | undefined => {
  if (shouldReduceMotion) {
    return {
      initial: { transform: "rotate(0deg)" },
      animate: { transform: "rotate(0deg)" },
    };
  }
  return {
    initial: { transform: "rotate(0deg)" },
    animate: {
      transform: ["rotate(0deg)", `rotate(${to}deg)`],
    },
    transition: {
      delay,
      duration,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse",
    },
  };
};
