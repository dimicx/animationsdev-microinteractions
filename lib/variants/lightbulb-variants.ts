import { Variants } from "motion";

const REPEAT_DELAY = 10;

const wholeVariants: Variants = {
  initial: {
    transform: "translateY(0%) rotate(0deg) scale(1)",
  },
  animate: {
    transform: [
      "translateY(0px) rotate(0deg) scale(1)",
      "translateY(4%) rotate(1.5deg) scale(0.99)",
      "translateY(-8%) rotate(-2.5deg) scale(1.02)",
      "translateY(-6%) rotate(-1.5deg) scale(1)",
    ],
    transition: {
      duration: 0.7,
      times: [0, 0.25, 0.6, 1],
      ease: "easeInOut",
    },
  },
  click: {
    transform: [
      "translateY(-6%) rotate(-1.5deg) scale(1)",
      "translateY(4%) rotate(1.5deg) scale(0.99)",
      "translateY(-8%) rotate(-2.5deg) scale(1.02)",
      "translateY(-6%) rotate(-1.5deg) scale(1)",
    ],
    transition: {
      duration: 0.7,
      times: [0, 0.25, 0.6, 1],
      ease: "easeInOut",
    },
  },
};

const backgroundVariants: Variants = {
  initial: {
    transform: "scale(1)",
  },
  animate: {
    transform: ["scale(1)", "scale(0.985)", "scale(1.02)", "scale(1)"],
    transition: {
      duration: 0.5,
      times: [0, 0.25, 0.6, 1],
      ease: "easeInOut",
    },
  },
  click: {
    transform: ["scale(1)", "scale(0.985)", "scale(1.02)", "scale(1)"],
    transition: {
      duration: 0.5,
      times: [0, 0.25, 0.6, 1],
      ease: "easeInOut",
    },
  },
};

const bulbVariants: Variants = {
  initial: {
    opacity: 1,
    transform: "translateY(0%) translateX(0%)",
  },
  animate: {
    opacity: [1, 0.2, 0.2, 1],
    transform: [
      "translateY(0%) translateX(0%)",
      "translateY(0%) translateX(0%)",
      "translateY(-5%) translateX(3%)",
      "translateY(0%) translateX(0%)",
      "translateY(0%) translateX(0%)",
    ],
    transition: {
      duration: 0.7,
      times: [0, 0.2, 0.5, 0.7],
    },
  },
  idle: {
    opacity: [1, 0.2, 1, 0.2, 0.2, 1],
    transition: {
      duration: 0.7,
      times: [0, 0.05, 0.1, 0.2, 0.5, 0.7],
      delay: REPEAT_DELAY / 2,
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: REPEAT_DELAY,
    },
  },
  click: {
    opacity: [1, 0.2, 0.2, 1],
    transform: [
      "translateY(0%) translateX(0%)",
      "translateY(0%) translateX(0%)",
      "translateY(-5%) translateX(3%)",
      "translateY(0%) translateX(0%)",
      "translateY(0%) translateX(0%)",
    ],
    transition: {
      duration: 0.7,
      times: [0, 0.2, 0.5, 0.7],
    },
  },
};

const stemVariants: Variants = {
  initial: {
    opacity: 1,
  },
  animate: {
    opacity: [1, 0.3, 0.3, 1],
    transition: {
      duration: 0.7,
      times: [0, 0.2, 0.5, 0.7],
    },
  },
  idle: {
    opacity: [1, 0.3, 1, 0.3, 0.3, 1],
    transition: {
      duration: 0.7,
      times: [0, 0.05, 0.1, 0.2, 0.5, 0.7],
      delay: REPEAT_DELAY / 2,
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: REPEAT_DELAY,
    },
  },
  click: {
    opacity: [1, 0.3, 0.3, 1],
    transition: {
      duration: 0.7,
      times: [0, 0.2, 0.5, 0.7],
    },
  },
};

const bulbMaskVariants: Variants = {
  initial: {
    transform: "translateY(0%) translateX(0%) rotate(0deg)",
    opacity: 1,
  },
  animate: {
    transform: [
      "translateY(0%) translateX(0%) rotate(0deg)",
      "translateY(0%) translateX(0%) rotate(0deg)",
      "translateY(15%) translateX(15%) rotate(15deg)",
      "translateY(15%) translateX(15%) rotate(15deg)",
      "translateY(-8%) translateX(-8%) rotate(-8deg)",
      "translateY(0%) translateX(0%) rotate(0deg)",
    ],
    opacity: [1, 0, 0, 0, 1, 1],
    transition: {
      duration: 0.7,
      times: [0, 0.2, 0.3, 0.5, 0.8, 1],
    },
  },
  idle: {
    opacity: [1, 0, 0, 0, 0, 1],
    transition: {
      duration: 0.7,
      times: [0, 0.05, 0.1, 0.2, 0.5, 0.7],
      delay: REPEAT_DELAY / 2,
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: REPEAT_DELAY,
    },
  },
  click: {
    transform: [
      "translateY(0%) translateX(0%) rotate(0deg)",
      "translateY(0%) translateX(0%) rotate(0deg)",
      "translateY(15%) translateX(15%) rotate(15deg)",
      "translateY(15%) translateX(15%) rotate(15deg)",
      "translateY(-8%) translateX(-8%) rotate(-8deg)",
      "translateY(0%) translateX(0%) rotate(0deg)",
    ],
    opacity: [1, 0, 0, 0, 1, 1],
    transition: {
      duration: 0.7,
      times: [0, 0.2, 0.3, 0.5, 0.8, 1],
    },
  },
};

const rayVariants: Variants = {
  initial: { pathLength: 1, strokeOpacity: 0.5 },
  animate: {
    pathLength: [1, 1, 0, 0, 1],
    strokeOpacity: [0.5, 0, 0, 0.5, 0.5],
    transition: {
      delay: 0.2,
      duration: 0.7,
      times: [0, 0, 0.2, 0.2, 0.5],
    },
  },
  idle: {
    pathLength: [1, 1, 0, 0, 1],
    strokeOpacity: [0.5, 0, 0, 0.5, 0.5],
    transition: {
      delay: REPEAT_DELAY / 2 + 0.2,
      duration: 0.7,
      times: [0, 0, 0.2, 0.2, 0.5],
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: REPEAT_DELAY,
    },
  },
  click: {
    pathLength: [1, 1, 0, 0, 1],
    strokeOpacity: [0.5, 0, 0, 0.5, 0.5],
    transition: {
      delay: 0.2,
      duration: 0.7,
      times: [0, 0, 0.2, 0.2, 0.5],
    },
  },
};

const raysOpacityVariants: Variants = {
  initial: { opacity: 1 },
  animate: {
    opacity: [1, 0, 0, 1],
    transition: {
      duration: 0.4,
      times: [0, 0.1, 0.9, 1],
    },
  },
  idle: {
    opacity: [1, 0, 0, 1],
    transition: {
      delay: REPEAT_DELAY / 2,
      duration: 0.7,
      times: [0, 0.1, 0.5, 0.6],
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: REPEAT_DELAY,
    },
  },
  click: {
    opacity: [1, 0, 0, 1],
    transition: {
      duration: 0.4,
      times: [0, 0.1, 0.9, 1],
    },
  },
};

export {
  wholeVariants,
  backgroundVariants,
  bulbVariants,
  stemVariants,
  bulbMaskVariants,
  rayVariants,
  raysOpacityVariants,
};
