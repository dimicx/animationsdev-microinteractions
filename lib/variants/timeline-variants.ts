const TIMELINE_TIMES = [0, 0.2, 0.35, 0.65, 0.8, 1];
const TIMELINE_DURATION = 1.7;
const CLICK_DURATION = 1;
const REPEAT_DELAY = 5;

const scaleVariants = {
  initial: {
    transform: "scale(1)",
  },
  animate: {
    transform: ["scale(1)", "scale(0.97)", "scale(1.02)", "scale(1)"],
    transition: {
      duration: 0.4,
      times: [0, 0.25, 0.6, 1],
      ease: "easeOut",
    },
  },
  click: {
    transform: ["scale(1)", "scale(0.97)", "scale(1.02)", "scale(1)"],
    transition: {
      duration: 0.4,
      times: [0, 0.25, 0.6, 1],
      ease: "easeOut",
    },
  },
};

const timelineOneVariants = {
  initial: {
    pathLength: 1,
  },
  animate: {
    pathLength: [1, 0.4, 0.4, 0.4, 1],
    transition: {
      duration: TIMELINE_DURATION,
      times: TIMELINE_TIMES,
      ease: "easeInOut",
    },
  },
  idle: {
    pathLength: [1, 0.8, 1],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: REPEAT_DELAY,
      delay: REPEAT_DELAY,
    },
  },
  click: {
    pathLength: [1, 0.4, 1],
    transition: {
      duration: CLICK_DURATION,
      ease: "easeInOut",
    },
  },
};

const timelineTwoVariants = {
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
      duration: TIMELINE_DURATION,
      times: TIMELINE_TIMES,
      ease: "easeInOut",
    },
  },
  idle: {
    pathLength: [1, 0.8, 1],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: REPEAT_DELAY - 0.4,
      delay: REPEAT_DELAY - 0.4,
    },
  },
  click: {
    pathLength: [1, 0.5, 1],
    transition: {
      duration: CLICK_DURATION,
      delay: 0.07,
      ease: "easeInOut",
    },
  },
};

const timelineThreeVariants = {
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
      duration: TIMELINE_DURATION,
      times: TIMELINE_TIMES,
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
      repeatDelay: REPEAT_DELAY - 0.8,
      delay: REPEAT_DELAY - 0.8,
    },
  },
  click: {
    pathLength: [1, 0.5, 1],
    transition: {
      duration: CLICK_DURATION,
      delay: 0.12,
      ease: "easeInOut",
    },
  },
};

const timelineContainerVariants = {
  initial: {
    transform: "rotate(0deg)",
  },
  animate: {
    transform: ["rotate(0deg)", "rotate(-12deg)", "rotate(-9deg)"],
    transition: {
      duration: 0.7,
      times: [0, 0.25, 0.6],
      ease: "easeOut",
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

export {
  scaleVariants,
  timelineOneVariants,
  timelineTwoVariants,
  timelineThreeVariants,
  timelineContainerVariants,
};
