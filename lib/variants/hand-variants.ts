import { IndexedVariant } from "@/lib/use-animate-variants";
import { TargetAndTransition } from "motion/react";

const REPEAT_DELAY = 6;

const backgroundVariants: Record<
  "initial" | "animate" | "idle" | "click",
  TargetAndTransition
> = {
  initial: {
    transform: "scale(1)",
  },
  animate: {
    transform: ["scale(1)", "scale(1)", "scale(0.97)", "scale(1)"],
    transition: {
      duration: 0.5,
      times: [0, 0.6, 0.75, 1],
      ease: "easeOut",
    },
  },
  idle: {
    transform: ["scale(1)", "scale(1)", "scale(0.97)", "scale(1)", "scale(1)"],
    transition: {
      duration: 0.65,
      times: [0, 0.25, 0.4, 0.6, 1],
      ease: "easeOut",
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: REPEAT_DELAY,
      delay: REPEAT_DELAY / 2,
    },
  },
  click: {
    transform: ["scale(1)", "scale(0.97)", "scale(1)"],
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

const idleRayPathLengths = [1, 0.45, 0.1];

const rayVariants: Record<
  "initial" | "animate" | "idle" | "click",
  IndexedVariant
> = {
  initial: (i: number) => ({
    pathLength: idleRayPathLengths[i],
    strokeOpacity: 0.5,
  }),
  animate: (i: number) => {
    const pathLength = idleRayPathLengths[i];
    return {
      pathLength:
        i === 1
          ? [pathLength, 1, 1, 0.01, 0.01, 1, 1]
          : [pathLength, 0.6, 0.6, 0.01, 0.01, 0.6, 0.6],
      strokeOpacity: [0, 0.5, 0, 0, 0.5, 0.5, 0.5],
      transition: {
        delay: 0.3 + (i === 1 ? 0 : 0.075),
        duration: 0.65,
        times: [0, 0, 0, 0.1, 0.1, 0.4, 1],
      },
    };
  },
  idle: (i: number) => {
    const pathLength = idleRayPathLengths[i];
    return {
      pathLength: [pathLength, pathLength, 0.01, 0.01, pathLength, pathLength],
      strokeOpacity: [0.5, 0, 0, 0.5, 0.5, 0.5],
      transition: {
        delay: REPEAT_DELAY / 2 + 0.2,
        duration: 0.65,
        times: [0, 0, 0.1, 0.2, 0.4, 1],
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: REPEAT_DELAY,
      },
    };
  },
  click: (i: number) => {
    const pathLength = idleRayPathLengths[i];
    return {
      pathLength:
        i === 1
          ? [pathLength, 1, 1, 0.01, 0.01, 1, 1]
          : [pathLength, 0.6, 0.6, 0.01, 0.01, 0.6, 0.6],
      strokeOpacity: [0, 0.5, 0, 0, 0.5, 0.5, 0.5],
      transition: {
        delay: 0.15 + (i === 1 ? 0 : 0.05),
        duration: 0.5,
        times: [0, 0, 0, 0.1, 0.1, 0.4, 1],
      },
    };
  },
};

const raysOpacityVariants: Record<
  "initial" | "animate" | "idle",
  TargetAndTransition
> = {
  initial: { opacity: 1 },
  animate: {
    opacity: [1, 0, 0, 1],
    transition: {
      duration: 0.45,
      times: [0, 0.1, 0.9, 1],
    },
  },
  idle: {
    opacity: [1, 0, 0, 1, 1],
    transition: {
      duration: 0.65,
      times: [0, 0.1, 0.55, 0.65, 1],
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: REPEAT_DELAY,
      delay: REPEAT_DELAY / 2,
    },
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
      duration: 1,
      times: [0, 0.2, 0.4, 0.75],
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
      duration: 0.4,
      times: [0, 0.2, 0.4, 0.75],
      ease: "easeInOut",
    },
  },
};

export {
  backgroundVariants,
  handVariants,
  raysOpacityVariants,
  rayVariants,
  REPEAT_DELAY,
};
