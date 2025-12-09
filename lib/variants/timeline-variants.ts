import { Variants } from "motion";

const timelineTimes = [0, 0.2, 0.35, 0.65, 0.8, 1];
const timelineDuration = 1.7;

const backgroundVariants: Variants = {
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
};

const timelineOneVariants: Variants = {
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
};

const timelineTwoVariants: Variants = {
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
};

const timelineThreeVariants: Variants = {
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
};

const timelineContainerVariants: Variants = {
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
};

export {
  backgroundVariants,
  timelineOneVariants,
  timelineTwoVariants,
  timelineThreeVariants,
  timelineContainerVariants,
};
