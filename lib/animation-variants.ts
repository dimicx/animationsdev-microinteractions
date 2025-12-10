import { Transition, Variants } from "motion/react";

export const fadeScaleVariants: Variants = {
  initial: {
    opacity: 0,
    transform: "scale(0)",
  },
  animate: {
    opacity: 1,
    transform: "scale(1)",
  },
};

export const UNIVERSAL_DELAY = 100; // 0.1s

// Reusable floating animation props
export interface FloatingAnimationProps {
  initial: { transform: string };
  animate: { transform: string[] };
  transition: Transition;
}

export const createFloatingAnimation = ({
  from = -2,
  to = 2,
  duration = 2.5,
  delay = 0,
}: {
  from?: number;
  to?: number;
  duration?: number;
  delay?: number;
} = {}): FloatingAnimationProps => {
  return {
    initial: { transform: "translateY(0px)" },
    animate: { transform: [`translateY(${from}px)`, `translateY(${to}px)`] },
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
  animate: { transform: string[] };
  transition: Transition;
}

export const createRotationAnimation = ({
  from = -2,
  to = 2,
  duration = 5,
  delay = 0,
}: {
  from?: number;
  to?: number;
  duration?: number;
  delay?: number;
} = {}): RotationAnimationProps => {
  return {
    initial: { transform: "rotate(0deg)" },
    animate: { transform: [`rotate(${from}deg)`, `rotate(${to}deg)`] },
    transition: {
      delay,
      duration,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse",
    },
  };
};
