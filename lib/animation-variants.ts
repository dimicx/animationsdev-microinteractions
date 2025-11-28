import { Variants } from "motion/react";

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
