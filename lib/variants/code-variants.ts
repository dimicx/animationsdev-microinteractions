const wholeVariants = {
  initial: {
    transform: "rotate(0deg) scale(1)",
  },
  animate: {
    transform: [
      "rotate(0deg) scale(1)",
      "rotate(8deg) scale(0.99)",
      "rotate(12deg) scale(1.01)",
      "rotate(10deg) scale(1)",
    ],
    transition: {
      duration: 0.5,
      times: [0, 0.4, 0.7, 1],
      ease: "easeInOut",
    },
  },
  click: {
    transform: [
      "rotate(10deg) scale(1)",
      "rotate(10deg) scale(0.98)",
      "rotate(10deg) scale(1.015)",
      "rotate(10deg) scale(1)",
    ],
    transition: {
      duration: 0.35,
      times: [0, 0.4, 0.7, 1],
      ease: "easeInOut",
    },
  },
};

const caretLeftVariants = {
  initial: {
    transform: "translateX(0px) translateY(0px)",
  },
  animate: {
    transform: [
      "translateX(0px) translateY(0px)",
      "translateX(2px) translateY(-1px)",
      "translateX(-9px) translateY(1.5px)",
      "translateX(-7px) translateY(1.5px)",
    ],
    transition: {
      duration: 0.7,
      times: [0, 0.2, 0.55, 1],
      ease: "easeInOut",
    },
  },
};

const caretRightVariants = {
  initial: {
    transform: "translateX(0px) translateY(0px)",
  },
  animate: {
    transform: [
      "translateX(0px) translateY(0px)",
      "translateX(-2px) translateY(1px)",
      "translateX(9px) translateY(-1.5px)",
      "translateX(7px) translateY(-1.5px)",
    ],
    transition: {
      duration: 0.7,
      times: [0, 0.2, 0.55, 1],
      ease: "easeInOut",
    },
  },
};

const slashVariants = {
  initial: {
    transform: "translateX(0px) translateY(0px) rotate(0deg)",
  },
  animate: {
    transform: [
      "translateX(0px) translateY(0px) rotate(0deg)",
      "translateX(2px) translateY(0px) rotate(-8deg)",
      "translateX(-24.5px) translateY(4px) rotate(8deg)",
      "translateX(-22.5px) translateY(4px) rotate(0deg)",
    ],
    transition: {
      duration: 0.7,
      times: [0, 0.2, 0.55, 1],
      ease: "easeInOut",
    },
  },
};

const codePathVariants = {
  initial: {
    transform: "translateX(0px) translateY(0px) rotate(0deg) scale(1)",
  },
  animate: {
    transform: [
      "translateX(0px) translateY(0px) rotate(0deg) scale(1)",
      "translateX(-0.5px) translateY(0px) rotate(0deg) scale(1)",
      "translateX(11px) translateY(-2px) rotate(1deg) scale(1)",
      "translateX(9px) translateY(-2px) rotate(1deg) scale(1)",
    ],
    transition: {
      duration: 0.7,
      times: [0, 0.2, 0.55, 1],
      ease: "easeInOut",
    },
  },
  click: {
    transform: [
      "translateX(9px) translateY(-2px) rotate(1deg) scale(1)",
      "translateX(9px) translateY(-2px) rotate(1deg) scale(0.96)",
      "translateX(9px) translateY(-2px) rotate(1deg) scale(1.01)",
      "translateX(9px) translateY(-2px) rotate(1deg) scale(1)",
    ],
    transition: {
      duration: 0.35,
      times: [0, 0.25, 0.6, 1],
      ease: "easeOut",
    },
  },
};

const opacityVariants = {
  initial: {
    opacity: 0.4,
  },
  animate: {
    opacity: 0.4,
    transition: {
      duration: 0.2,
      delay: 0.2,
    },
  },
  idle: {
    opacity: 0.4,
    transition: {
      duration: 0.2,
    },
  },
  click: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
};

const pulseVariants = {
  initial: {
    opacity: 1,
  },
  animate: {
    opacity: [1, 0.65, 1],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop",
      delay: 0.1,
    },
  },
};

export {
  wholeVariants,
  caretLeftVariants,
  caretRightVariants,
  codePathVariants,
  pulseVariants,
  slashVariants,
  opacityVariants,
};
