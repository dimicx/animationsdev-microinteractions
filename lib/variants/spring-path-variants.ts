import { TargetAndTransition } from "motion/react";
import { IndexedVariant } from "@/lib/helpers";
import { bounceAcceleratedX } from "@/lib/bounce-physics";

const BOUNCE_DURATION = 1.1;

const pathVariants: Record<"initial" | "animate", TargetAndTransition> = {
  initial: {
    pathLength: 1,
    strokeOpacity: 1,
  },
  animate: {
    pathLength: [1, 0.01],
    strokeOpacity: [1, 1, 0],
    transition: {
      delay: 0.045,
      duration: BOUNCE_DURATION - 0.1,
      ease: bounceAcceleratedX, // Path shrinks in sync with X movement
      strokeOpacity: {
        duration: BOUNCE_DURATION - 0.1,
        ease: "easeOut",
        times: [0, 0.75, 0.76],
      },
    },
  },
};

const secondaryCircleVariants: Record<
  "initial" | "animate",
  TargetAndTransition
> = {
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
      times: [0, 0.1, 0.85, 0.87],
    },
  },
};

const backgroundVariants: Record<
  "initial" | "animate" | "click",
  TargetAndTransition
> = {
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
      "rotate(7deg) scale(1)",
    ],
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const ballVariants: Record<"initial" | "idle", TargetAndTransition> = {
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
};

const bubblesVariants: Record<"initial" | "animate" | "click", IndexedVariant> =
  {
    initial: () => ({
      transform: "translateY(0%) translateX(0%)",
    }),
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
              "translateY(-35%) translateX(-20%)",
              "translateY(-50%) translateX(-25%)",
              "translateY(-35%) translateX(-20%)",
            ]
          : [
              "translateY(-60%) translateX(20%)",
              "translateY(-120%) translateX(40%)",
              "translateY(-60%) translateX(20%)",
            ],
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  };

const bubblesAppearVariants: Record<"hidden" | "visible", TargetAndTransition> =
  {
    hidden: {
      scale: 0,
      x: 40,
      y: -60,
      opacity: 0,
    },
    visible: {
      scale: 1,
      x: 0,
      y: 0,
      opacity: 1,
    },
  };

export {
  BOUNCE_DURATION,
  pathVariants,
  secondaryCircleVariants,
  backgroundVariants,
  ballVariants,
  bubblesVariants,
  bubblesAppearVariants,
};
