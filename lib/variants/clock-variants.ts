const REPEAT_DELAY = 6;
const INITIAL_DELAY = 3.5;

const backgroundVariants = {
  initial: {
    transform: "rotate(0deg) scale(1)",
  },
  animate: {
    transform: [
      "rotate(0deg) scale(1)",
      "rotate(-4deg) scale(0.99)",
      "rotate(-3deg) scale(1)",
    ],
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  click: {
    transform: [
      "rotate(-3deg) scale(1)",
      "rotate(-8deg) scale(0.98)",
      "rotate(-6deg) scale(1)",
    ],
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  "scale-click": {
    transform: [
      "rotate(-6deg) scale(1)",
      "rotate(-6deg) scale(0.98)",
      "rotate(-6deg) scale(1.015)",
      "rotate(-6deg) scale(1)",
    ],
    transition: {
      duration: 0.4,
      times: [0, 0.25, 0.6, 1],
      ease: "easeOut",
    },
  },
};

const clockAndBellsVariants = {
  initial: {
    transform: "rotate(0deg) scale(1)",
  },
  click: {
    transform: [
      "rotate(0deg) scale(1)",
      "rotate(-10deg) scale(0.95)",
      "rotate(-8deg) scale(1.03)",
      "rotate(-8deg) scale(1)",
    ],
    transition: {
      duration: 0.5,
      times: [0, 0.25, 0.6, 1],
      ease: "easeOut",
    },
  },
  "scale-click": {
    transform: [
      "rotate(-8deg) scale(1)",
      "rotate(-8deg) scale(0.95)",
      "rotate(-8deg) scale(1.03)",
      "rotate(-8deg) scale(1)",
    ],
    transition: {
      duration: 0.4,
      times: [0, 0.25, 0.6, 1],
      ease: "easeOut",
    },
  },
  idle: {
    transform: ["rotate(0deg) scale(1)"],
  },
};

const clockVariants = {
  initial: {
    y: "0%",
    x: "0%",
  },
  animate: {
    y: ["0%", "-6%"],
    x: ["0%", "-3%", "3.5%", "-3.5%", "3.5%", "-3%", "0%"],
    transition: {
      y: {
        duration: 0.25,
        ease: "easeOut",
      },
      x: {
        duration: 0.25,
        repeat: Infinity,
        ease: "linear",
      },
    },
  },
};

const bellVariants = {
  initial: () => ({
    y: "0%",
    x: "0%",
    rotate: "0deg",
  }),
  animate: (i: number) => ({
    y: i === 0 ? ["0%", "-25%", "-80%"] : ["0%", "-50%", "-120%"],
    x:
      i === 0
        ? ["0%", "-20%", "16%", "-16%", "20%", "-16%", "0%"]
        : ["0%", "-15%", "30%", "-30%", "35%", "-30%", "0%"],
    rotate: i === 0 ? "0deg" : ["0deg", "-5deg"],
    transition: {
      y: {
        duration: 3,
        times: [0, 0.1, 1],
        ease: "easeOut",
      },
      x: {
        duration: 0.25,
        repeat: Infinity,
        ease: "linear",
      },
      rotate: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  }),
};

const bellsVariants = {
  initial: {
    transform: "translateX(0%) translateY(0%) rotate(0deg)",
  },
  idle: (initialDelay: boolean) => ({
    transform: [
      "translateX(0%) translateY(0%) rotate(0deg)",
      "translateX(-12%) translateY(-6%) rotate(-8deg)",
      "translateX(12%) translateY(8%) rotate(8deg)",
      "translateX(0%) translateY(0%) rotate(0deg)",
    ],
    transition: {
      duration: 1,
      ease: "easeOut",
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: 4,
      delay: initialDelay ? INITIAL_DELAY : REPEAT_DELAY,
    },
  }),
};

export {
  backgroundVariants,
  bellsVariants,
  bellVariants,
  clockAndBellsVariants,
  clockVariants,
};
