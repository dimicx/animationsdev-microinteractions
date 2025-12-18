import { IndexedVariant } from "@/lib/use-animate-variants";
import { TargetAndTransition, Transition } from "motion/react";

const REPEAT_DELAY = 6;
const DURATION = 0.53;

const backgroundVariants: Record<
  "initial" | "animate" | "idle" | "click",
  TargetAndTransition
> = {
  initial: {
    transform: "scale(1)",
  },
  animate: {
    transform: ["scale(1)", "scale(0.97)", "scale(1)"],
    transition: {
      duration: DURATION,
      times: [0.5, 0.8, 1],
      ease: "easeOut",
    },
  },
  idle: {
    transform: ["scale(1)", "scale(0.97)", "scale(1.015)", "scale(1)"],
    transition: {
      duration: DURATION,
      times: [0.15, 0.3, 0.5, 1],
      ease: "easeOut",
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: REPEAT_DELAY,
      delay: REPEAT_DELAY / 2,
    },
  },
  click: {
    transform: ["scale(1)", "scale(0.97)", "scale(1.015)", "scale(1)"],
    transition: {
      duration: DURATION,
      times: [0.25, 0.5, 0.8, 1],
      ease: "easeOut",
    },
  },
};

const idleRayPathLengths = [1, 0.45, 0.1];
const idleRayTransition: Transition = {
  delay: REPEAT_DELAY / 2,
  duration: DURATION,
  repeat: Infinity,
  repeatType: "loop",
  repeatDelay: REPEAT_DELAY,
};

const rayVariants: Record<
  "initial" | "animate" | "idle" | "click",
  IndexedVariant
> = {
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
  idle: (i: number) => {
    const pathLength = idleRayPathLengths[i];
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
};

const handVariants: Record<
  "initial" | "animate" | "click",
  TargetAndTransition
> = {
  initial: {
    transform: "translateX(0%) translateY(0%) rotate(0deg) scale(1)",
  },
  animate: {
    transform: [
      "translateX(0%) translateY(0%) rotate(0deg) scale(1)",
      "translateX(-11%) translateY(8%) rotate(25deg) scale(1)",
      "translateX(-11%) translateY(8%) rotate(25deg) scale(0.95)",
      "translateX(-11%) translateY(8%) rotate(25deg) scale(1)",
    ],
    transition: {
      duration: DURATION,
      times: [0.2, 0.5, 1],
      ease: "easeInOut",
    },
  },
  click: {
    transform: [
      "translateX(-11%) translateY(8%) rotate(25deg) scale(1)",
      "translateX(-11%) translateY(8%) rotate(25deg) scale(1)",
      "translateX(-11%) translateY(8%) rotate(25deg) scale(0.95)",
      "translateX(-11%) translateY(8%) rotate(25deg) scale(1)",
    ],
    transition: {
      duration: DURATION,
      times: [0, 0.2, 0.4, 0.75],
      ease: "easeInOut",
    },
  },
};

export {
  backgroundVariants,
  handVariants,
  rayVariants,
  REPEAT_DELAY,
  DURATION,
};
