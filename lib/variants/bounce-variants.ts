import { bounceAcceleratedXFast } from "../bounce-physics";

const BOUNCE_DURATION = 1.1;

const pathVariants = {
  initial: {
    strokeDashoffset: 0,
  },
  animate: {
    strokeDashoffset: [0, 1.05],
    transition: {
      delay: 0.1,
      duration: BOUNCE_DURATION - 0.15,
      ease: bounceAcceleratedXFast, // Optimized: Path shrinks in sync with X movement
    },
  },
};

const secondaryCircleVariants = {
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
      times: [0, 0.1, 0.83, 0.83],
    },
  },
};

const backgroundVariants = {
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
  click: {
    transform: [
      "rotate(7deg) scale(1)",
      "rotate(7deg) scale(0.98)",
      "rotate(7deg) scale(1.015)",
      "rotate(7deg) scale(1)",
    ],
    transition: {
      duration: 0.4,
      times: [0, 0.25, 0.6, 1],
      ease: "easeOut",
    },
  },
};

const ballVariants = {
  initial: {
    transform: "translateY(0%) translateX(0%)",
  },
  idle: {
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
  click: {
    transform: ["scale(1)", "scale(0.95)", "scale(1.03)", "scale(1)"],
    transition: {
      duration: 0.4,
      times: [0, 0.25, 0.6, 1],
      ease: "easeOut",
    },
  },
};

const bubblesVariants = {
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
  click: (i: number) => ({
    transform:
      i === 0
        ? [
            "translateY(-35%) translateX(-20%) scale(1)",
            "translateY(-50%) translateX(-20%) scale(0.95)",
            "translateY(-30%) translateX(-20%) scale(1.03)",
            "translateY(-35%) translateX(-20%) scale(1)",
          ]
        : [
            "translateY(-60%) translateX(20%) scale(1)",
            "translateY(-120%) translateX(20%) scale(0.95)",
            "translateY(-50%) translateX(20%) scale(1.03)",
            "translateY(-60%) translateX(20%) scale(1)",
          ],
    transition: {
      duration: 0.4,
      times: [0, 0.25, 0.6, 1],
      ease: "easeOut",
    },
  }),
};

export {
  backgroundVariants,
  ballVariants,
  BOUNCE_DURATION,
  bubblesVariants,
  pathVariants,
  secondaryCircleVariants,
};
