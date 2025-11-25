import { Variants } from "motion/react";

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
