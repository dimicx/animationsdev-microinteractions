import { TargetAndTransition } from "motion";

const timelineTimes = [0, 0.2, 0.35, 0.65, 0.8, 1];
const timelineDuration = 1.7;

const scaleVariants: Record<string, TargetAndTransition> = {
  initial: {
    transform: "scale(1)",
  },
  animate: {
    transform: ["scale(1)", "scale(0.97)", "scale(1.02)", "scale(1)"],
    transition: {
      duration: 0.5,
      times: [0, 0.25, 0.6, 1],
      ease: "easeOut",
    },
  },
  click: {
    transform: ["scale(1)", "scale(0.97)", "scale(1.02)", "scale(1)"],
    transition: {
      duration: 0.5,
      times: [0, 0.25, 0.6, 1],
      ease: "easeOut",
    },
  },
};

const timelineOneVariants: Record<string, TargetAndTransition> = {
  initial: {
    pathLength: 1,
  },
  animate: {
    pathLength: [1, 0.4, 0.4, 0.4, 1],
    transition: {
      duration: timelineDuration,
      times: timelineTimes,
      ease: "easeInOut",
    },
  },
  idle: {
    pathLength: [1, 0.8, 1],
    transition: {
      duration: 3,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: 4,
      delay: 4,
    },
  },
  click: {
    pathLength: [1, 0.4, 1],
    transition: {
      duration: 1,
      ease: "easeInOut",
    },
  },
};

const timelineTwoVariants: Record<string, TargetAndTransition> = {
  initial: {
    pathLength: 1,
    transform: "translateY(0%) translateX(0%)",
  },
  animate: {
    pathLength: [1, 0.4, 0.4, 0.4, 1],
    transform: [
      "translateY(0%) translateX(0%)",
      "translateY(0%)  translateX(0%)",
      "translateY(235%) translateX(-5%)",
      "translateY(0%) translateX(0%)",
      "translateY(0%) translateX(0%)",
    ],
    transition: {
      delay: 0.1,
      duration: timelineDuration,
      times: timelineTimes,
      ease: "easeInOut",
    },
  },
  idle: {
    pathLength: [1, 0.8, 1],
    transition: {
      duration: 2.5,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: 3.6,
      delay: 3.6,
    },
  },
  click: {
    pathLength: [1, 0.5, 1],
    transition: {
      duration: 1,
      delay: 0.1,
      ease: "easeInOut",
    },
  },
};

const timelineThreeVariants: Record<string, TargetAndTransition> = {
  initial: {
    pathLength: 1,
    transform: "translateY(0%) translateX(0%)",
  },
  animate: {
    pathLength: [1, 0.25, 0.25, 0.25, 1],
    transform: [
      "translateY(0%) translateX(0%)",
      "translateY(0%) translateX(0%)",
      "translateY(-235%) translateX(5%)",
      "translateY(0%) translateX(0%)",
      "translateY(0%) translateX(0%)",
    ],
    transition: {
      delay: 0.13,
      duration: timelineDuration,
      times: timelineTimes,
      ease: "easeInOut",
    },
  },
  idle: {
    pathLength: [1, 0.8, 1],
    transition: {
      duration: 2.4,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: 3.2,
      delay: 3.2,
    },
  },
  click: {
    pathLength: [1, 0.5, 1],
    transition: {
      duration: 1,
      delay: 0.2,
      ease: "easeInOut",
    },
  },
};

const timelineContainerVariants: Record<string, TargetAndTransition> = {
  initial: {
    transform: "rotate(0deg)",
  },
  animate: {
    transform: [
      "rotate(0deg)",
      "rotate(-12deg)",
      "rotate(-8.5deg)",
      "rotate(-9deg)",
    ],
    transition: {
      duration: 0.7,
    },
  },
  click: {
    transform: [
      "rotate(-9deg) scale(1)",
      "rotate(-9deg) scale(0.95)",
      "rotate(-9deg) scale(1.03)",
      "rotate(-9deg) scale(1)",
    ],
    transition: {
      duration: 0.4,
      times: [0, 0.25, 0.6, 1],
      ease: "easeOut",
    },
  },
};

export type VariantKey =
  | keyof typeof scaleVariants
  | keyof typeof timelineContainerVariants
  | keyof typeof timelineOneVariants
  | keyof typeof timelineTwoVariants
  | keyof typeof timelineThreeVariants;

export {
  scaleVariants,
  timelineOneVariants,
  timelineTwoVariants,
  timelineThreeVariants,
  timelineContainerVariants,
};
