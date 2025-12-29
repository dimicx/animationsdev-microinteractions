import { Transition } from "motion/react";

const REPEAT_DELAY = 8;
const INITIAL_DELAY = 1;
const DURATION = 0.7;

const wholeVariants = {
  initial: {
    transform: "translateY(0%) rotate(0deg) scale(1)",
  },
  animate: {
    transform: [
      "translateY(0px) rotate(0deg) scale(1)",
      "translateY(6%) rotate(1.5deg) scale(0.99)",
      "translateY(-8%) rotate(-2.5deg) scale(1.02)",
      "translateY(-6%) rotate(-1.5deg) scale(1)",
    ],
    transition: {
      duration: DURATION,
      times: [0, 0.25, 0.6, 1],
      ease: "easeInOut",
    },
  },
  click: {
    transform: [
      "translateY(-6%) rotate(-1.5deg) scale(1)",
      "translateY(2%) rotate(1.5deg) scale(0.99)",
      "translateY(-9%) rotate(-2.5deg) scale(1.02)",
      "translateY(-6%) rotate(-1.5deg) scale(1)",
    ],
    transition: {
      duration: DURATION,
      times: [0, 0.25, 0.6, 1],
      ease: "easeInOut",
    },
  },
};

const backgroundVariants = {
  initial: {
    transform: "scale(1)",
  },
  animate: {
    transform: ["scale(1)", "scale(0.98)", "scale(1.02)", "scale(1)"],
    transition: {
      duration: DURATION,
      times: [0, 0.2, 0.45, 0.6],
      ease: "easeOut",
    },
  },
  click: {
    transform: ["scale(1)", "scale(0.98)", "scale(1.02)", "scale(1)"],
    transition: {
      duration: DURATION,
      times: [0, 0.2, 0.45, 0.6],
      ease: "easeOut",
    },
  },
};

const bulbVariants = {
  initial: {
    opacity: 1,
    transform: "translateY(0%) translateX(0%)",
  },
  animate: {
    opacity: [0.3, 0.3, 1],
    transform: [
      "translateY(0%) translateX(0%)",
      "translateY(-7%) translateX(3%)",
      "translateY(0%) translateX(0%)",
    ],
    transition: {
      duration: DURATION,
      times: [0.2, 0.45, 0.6],
    },
  },
  idle: (initialDelay: boolean) => ({
    opacity: [1, 0.3, 1, 0.3, 0.3, 1],
    transition: {
      duration: DURATION,
      times: [0, 0.05, 0.1, 0.2, 0.5, 0.7],
      delay: initialDelay ? INITIAL_DELAY : REPEAT_DELAY,
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: REPEAT_DELAY,
    },
  }),
  click: {
    opacity: [0.3, 0.3, 1],
    transform: [
      "translateY(0%) translateX(0%)",
      "translateY(-7%) translateX(3%)",
      "translateY(0%) translateX(0%)",
    ],
    transition: {
      duration: DURATION,
      times: [0.2, 0.45, 0.6],
    },
  },
};

const stemVariants = {
  initial: {
    opacity: 1,
  },
  animate: {
    opacity: [0.3, 0.3, 1],
    transition: {
      duration: DURATION,
      times: [0.2, 0.45, 0.6],
    },
  },
  idle: (initialDelay: boolean) => ({
    opacity: [1, 0.3, 1, 0.3, 0.3, 1],
    transition: {
      duration: DURATION,
      times: [0, 0.05, 0.1, 0.2, 0.5, 0.7],
      delay: initialDelay ? INITIAL_DELAY : REPEAT_DELAY,
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: REPEAT_DELAY,
    },
  }),
  click: {
    opacity: [0.3, 0.3, 1],
    transition: {
      duration: DURATION,
      times: [0.2, 0.45, 0.6],
    },
  },
};

const bulbMaskVariants = {
  initial: {
    transform: "translateY(0%) translateX(0%) rotate(0deg)",
    opacity: 1,
  },
  animate: {
    transform: [
      "translateY(15%) translateX(15%) rotate(15deg)",
      "translateY(-8%) translateX(-8%) rotate(-8deg)",
      "translateY(0%) translateX(0%) rotate(0deg)",
    ],
    opacity: [0, 1, 1],
    transition: {
      duration: DURATION,
      times: [0.45, 0.75, 1],
    },
  },
  idle: (initialDelay: boolean) => ({
    opacity: [1, 0, 0, 1],
    transition: {
      duration: DURATION,
      times: [0, 0.05, 0.5, 0.7],
      delay: initialDelay ? INITIAL_DELAY : REPEAT_DELAY,
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: REPEAT_DELAY,
    },
  }),
  click: {
    transform: [
      "translateY(15%) translateX(15%) rotate(15deg)",
      "translateY(-8%) translateX(-8%) rotate(-8deg)",
      "translateY(0%) translateX(0%) rotate(0deg)",
    ],
    opacity: [0, 1, 1],
    transition: {
      duration: DURATION,
      times: [0.45, 0.75, 1],
    },
  },
};

const getIdleLineTransition = (initialDelay: boolean): Transition => ({
  duration: DURATION,
  delay: initialDelay ? INITIAL_DELAY : REPEAT_DELAY,
  repeat: Infinity,
  repeatType: "loop",
  repeatDelay: REPEAT_DELAY,
});

const lineVariants = {
  initial: { pathLength: 1, strokeOpacity: 0.5 },
  animate: {
    pathLength: [0.01, 1],
    strokeOpacity: [0, 0.5],
    transition: {
      pathLength: {
        times: [0.5, 0.7],
        duration: DURATION,
      },
      strokeOpacity: {
        times: [0.5, 0.51],
        duration: DURATION,
      },
    },
  },
  idle: (initialDelay: boolean) => {
    const idleLineTransition = getIdleLineTransition(initialDelay);
    return {
      pathLength: [1, 0, 0, 1],
      strokeOpacity: [0.5, 0, 0, 0.5],
      transition: {
        pathLength: {
          times: [0, 0.05, 0.5, 0.7],
          ...idleLineTransition,
        },
        strokeOpacity: {
          times: [0, 0.01, 0.5, 0.51],
          ...idleLineTransition,
        },
      },
    };
  },
  click: {
    pathLength: [0, 1],
    strokeOpacity: [0, 0.5],
    transition: {
      pathLength: {
        times: [0.5, 0.7],
        duration: DURATION,
      },
      strokeOpacity: {
        times: [0.5, 0.51],
        duration: DURATION,
      },
    },
  },
};

export {
  backgroundVariants,
  bulbMaskVariants,
  bulbVariants,
  lineVariants,
  stemVariants,
  wholeVariants,
};
