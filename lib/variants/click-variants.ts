import { Transition } from "motion/react";

const REPEAT_DELAY = 6;
const INITIAL_DELAY = 2.5;
const DURATION = 0.53;
const IDLE_DURATION = DURATION + 0.1;

const backgroundVariants = {
  initial: {
    transform: "scale(1)",
  },
  hover: {
    transform: ["scale(1)", "scale(0.97)", "scale(1.01)", "scale(1)"],
    transition: {
      duration: DURATION,
      times: [0.1, 0.33, 0.7, 1],
      ease: "easeOut",
      delay: 0.2,
    },
  },
  idle: (initialDelay: boolean) => ({
    transform: ["scale(1)", "scale(0.97)", "scale(1.01)", "scale(1)"],
    transition: {
      duration: IDLE_DURATION,
      times: [0.2, 0.55, 0.92, 1],
      ease: "easeOut",
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: REPEAT_DELAY,
      delay: initialDelay ? INITIAL_DELAY : REPEAT_DELAY,
    },
  }),
  click: {
    transform: ["scale(1)", "scale(0.97)", "scale(1.01)", "scale(1)"],
    transition: {
      duration: DURATION,
      times: [0.1, 0.33, 0.7, 1],
      ease: "easeOut",
    },
  },
};

const getIdleLineTransition = (initialDelay: boolean): Transition => ({
  delay: initialDelay ? INITIAL_DELAY : REPEAT_DELAY,
  duration: IDLE_DURATION,
  repeat: Infinity,
  repeatType: "loop",
  repeatDelay: REPEAT_DELAY,
});
const idleStrokeDashoffset = [0, 0.55, 0.9];

const lineVariants = {
  initial: (i: number) => ({
    strokeDashoffset: idleStrokeDashoffset[i],
  }),
  hover: (i: number) => {
    return {
      strokeDashoffset: i === 1 ? [1.05, 0] : [1.05, 0.4],
      transition: {
        delay: i === 1 ? 0 : 0.04,
        duration: DURATION,
        times: [0.85, 1],
      },
    };
  },
  idle: ({ index, initialDelay }: { index: number; initialDelay: boolean }) => {
    const strokeDashoffset = idleStrokeDashoffset[index];
    const idleLineTransition = getIdleLineTransition(initialDelay);
    return {
      strokeDashoffset: [strokeDashoffset, 1.05, 1.05, strokeDashoffset],
      transition: {
        times: [0.2, 0.2, 0.55, 0.85],
        ...idleLineTransition,
      },
    };
  },
  click: (i: number) => {
    return {
      strokeDashoffset: i === 1 ? [1.05, 0] : [1.05, 0.4],
      transition: {
        delay: i === 1 ? 0 : 0.05,
        times: [0.5, 0.8],
        duration: DURATION,
      },
    };
  },
};

const handVariants = {
  initial: {
    transform: "translateX(0%) translateY(0%) rotate(0deg)",
  },
  hover: {
    transform: [
      "translateX(0%) translateY(0%) rotate(0deg)",
      "translateX(-11%) translateY(8%) rotate(25deg)",
    ],
    transition: {
      duration: DURATION,
      times: [0, 0.4],
      ease: "easeInOut",
    },
  },
  click: {
    transform: "translateX(-11%) translateY(8%) rotate(25deg)",
  },
};

export {
  backgroundVariants,
  DURATION,
  handVariants,
  IDLE_DURATION,
  INITIAL_DELAY,
  lineVariants,
  REPEAT_DELAY,
};
