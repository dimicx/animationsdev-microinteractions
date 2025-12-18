import { defineVariants } from "@/lib/use-animate-variants";
import { easeInOut, easeOut, Transition } from "motion/react";

const REPEAT_DELAY = 5;
const INITIAL_DELAY = 2;
const DURATION = 0.53;

const backgroundVariants = defineVariants({
  initial: {
    transform: "scale(1)",
  },
  animate: {
    transform: ["scale(1)", "scale(0.97)", "scale(1)"],
    transition: {
      duration: DURATION,
      times: [0.5, 0.8, 1],
      ease: easeOut,
    },
  },
  idle: (initialDelay = false) => ({
    transform: ["scale(1)", "scale(0.97)", "scale(1.015)", "scale(1)"],
    transition: {
      duration: DURATION,
      times: [0.15, 0.3, 0.5, 1],
      ease: "easeOut",
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: REPEAT_DELAY,
      delay: initialDelay ? INITIAL_DELAY : REPEAT_DELAY,
    },
  }),
  click: {
    transform: ["scale(1)", "scale(0.97)", "scale(1.015)", "scale(1)"],
    transition: {
      duration: DURATION,
      times: [0.1, 0.33, 0.7, 1],
      ease: easeOut,
    },
  },
});

const idleRayPathLengths = [1, 0.45, 0.1];
const getIdleRayTransition = (initialDelay: boolean): Transition => ({
  delay: initialDelay ? INITIAL_DELAY : REPEAT_DELAY,
  duration: DURATION,
  repeat: Infinity,
  repeatType: "loop",
  repeatDelay: REPEAT_DELAY,
});

const rayVariants = defineVariants({
  initial: (i: number) => ({
    pathLength: idleRayPathLengths[i],
    strokeOpacity: 0.5,
  }),
  animate: (i: number) => {
    return {
      pathLength: i === 1 ? [0.01, 1] : [0.01, 0.6],
      strokeOpacity: [0, 0.5],
      transition: {
        pathLength: {
          delay: i === 1 ? 0 : 0.04,
          duration: DURATION,
          times: [0.8, 1],
        },
        strokeOpacity: {
          delay: i === 1 ? 0 : 0.04,
          duration: DURATION,
          times: [0.8, 0.81],
        },
      },
    };
  },
  idle: ({ index, initialDelay }: { index: number; initialDelay: boolean }) => {
    const pathLength = idleRayPathLengths[index];
    const idleRayTransition = getIdleRayTransition(initialDelay);
    return {
      pathLength: [pathLength, 0.01, 0.01, pathLength],
      strokeOpacity: [0.5, 0, 0, 0.5],
      transition: {
        pathLength: {
          times: [0.1, 0.2, 0.5, 0.8],
          ...idleRayTransition,
        },
        strokeOpacity: {
          times: [0, 0.01, 0.5, 0.51],
          ...idleRayTransition,
        },
      },
    };
  },
  click: (i: number) => {
    return {
      pathLength: i === 1 ? [0.01, 1] : [0.01, 0.6],
      strokeOpacity: [0, 0.5],
      transition: {
        pathLength: {
          delay: i === 1 ? 0 : 0.05,
          times: [0.5, 0.8],
          duration: DURATION,
        },
        strokeOpacity: {
          delay: i === 1 ? 0 : 0.05,
          times: [0.5, 0.51],
          duration: DURATION,
        },
      },
    };
  },
});

const handVariants = defineVariants({
  initial: {
    transform: "translateX(0%) translateY(0%) rotate(0deg)",
  },
  animate: {
    transform: [
      "translateX(0%) translateY(0%) rotate(0deg)",
      "translateX(-11%) translateY(8%) rotate(25deg)",
      "translateX(-11%) translateY(8%) rotate(25deg)",
      "translateX(-11%) translateY(8%) rotate(25deg)",
    ],
    transition: {
      duration: DURATION,
      times: [0.2, 0.5, 1],
      ease: easeInOut,
    },
  },
  click: {
    transform: [
      "translateX(-11%) translateY(8%) rotate(25deg)",
      "translateX(-11%) translateY(8%) rotate(25deg)",
      "translateX(-11%) translateY(8%) rotate(25deg)",
      "translateX(-11%) translateY(8%) rotate(25deg)",
    ],
    transition: {
      duration: DURATION,
      times: [0, 0.2, 0.4, 0.75],
      ease: easeInOut,
    },
  },
});

export {
  backgroundVariants,
  DURATION,
  handVariants,
  rayVariants,
  REPEAT_DELAY,
  INITIAL_DELAY,
};
