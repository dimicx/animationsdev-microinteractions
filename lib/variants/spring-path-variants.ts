import { Variants } from "motion";
import { bounceAcceleratedX } from "../bounce-physics";

const BOUNCE_DURATION = 1.1;

const pathVariants: Variants = {
  initial: {
    pathLength: 1,
    strokeOpacity: 1,
  },
  animate: {
    pathLength: [1, 0.01],
    strokeOpacity: [1, 1, 0],
    transition: {
      delay: 0.03,
      duration: BOUNCE_DURATION,
      ease: bounceAcceleratedX, // Path shrinks in sync with X movement
      strokeOpacity: {
        duration: BOUNCE_DURATION,
        ease: "easeOut",
        times: [0, 0.75, 0.76],
      },
    },
  },
};

const secondaryCircleVariants: Variants = {
  initial: {
    stroke: "var(--stroke-color)",
    opacity: 1,
  },
  animate: {
    stroke: [
      "var(--stroke-color)",
      "var(--stroke-highlight)",
      "var(--stroke-highlight)",
      "var(--bg-fill)",
    ],
    transition: {
      duration: BOUNCE_DURATION - 0.1,
      ease: "easeOut",
      times: [0, 0.1, 0.85, 0.87],
    },
  },
};

const backgroundVariants: Variants = {
  initial: {
    transform: "rotate(0deg) scale(1)",
  },
  animate: {
    transform: [
      "rotate(0deg) scale(1)",
      "rotate(8deg) scale(0.99)",
      "rotate(7deg) scale(1)",
    ],
    transition: {
      duration: 0.7,
      times: [0, 0.25, 0.6],
      ease: "easeInOut",
    },
  },
};

const idleVariants: Variants = {
  initial: {
    transform: "translateY(0%) translateX(0%)",
  },
  animate: {
    transform: [
      "translateY(0%) translateX(0%)",
      "translateY(-25%) translateX(-20%)",
      "translateY(0%) translateX(0%)",
    ],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    },
  },
};

const bubblesVariants: Variants = {
  initial: {
    transform: "translateY(0%) translateX(0%)",
  },
  animate: (i: number) => ({
    transform:
      i === 0
        ? [
            "translateY(0%) translateX(0%)",
            "translateY(-40%) translateX(-25%)",
            "translateY(-35%) translateX(-20%)",
          ]
        : [
            "translateY(0%) translateX(0%)",
            "translateY(-80%) translateX(28%)",
            "translateY(-60%) translateX(20%)",
          ],
    transition: {
      duration: 0.7,
      times: [0, 0.25, 0.6],
      ease: "easeInOut",
    },
  }),
};

export {
  BOUNCE_DURATION,
  pathVariants,
  secondaryCircleVariants,
  backgroundVariants,
  idleVariants,
  bubblesVariants,
};
