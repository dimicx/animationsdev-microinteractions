import { Variants } from "motion";

const rotateVariants: Variants = {
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
      delay: 0.1,
      duration: 0.5,
      times: [0, 0.4, 0.7, 1],
      ease: "easeInOut",
    },
  },
};

const caretLeftVariants: Variants = {
  initial: {
    transform: "translateX(0%) translateY(0%)",
  },
  animate: {
    transform: [
      "translateX(0%) translateY(0%)",
      "translateX(15%) translateY(-3%)",
      "translateX(-90%) translateY(12%)",
      "translateX(-80%) translateY(10%)",
    ],
    transition: {
      duration: 0.7,
      times: [0, 0.2, 0.55, 1],
      ease: "easeInOut",
    },
  },
};

const caretRightVariants: Variants = {
  initial: {
    transform: "translateX(0%) translateY(0%)",
  },
  animate: {
    transform: [
      "translateX(0%) translateY(0%)",
      "translateX(-15%) translateY(3%)",
      "translateX(90%) translateY(-12%)",
      "translateX(80%) translateY(-10%)",
    ],
    transition: {
      duration: 0.7,
      times: [0, 0.2, 0.55, 1],
      ease: "easeInOut",
    },
  },
};

const slashVariants: Variants = {
  initial: {
    transform: "translateX(0%) translateY(0%) rotate(0deg)",
  },
  animate: {
    transform: [
      "translateX(0%) translateY(0%) rotate(0deg)",
      "translateX(80%) translateY(-3%) rotate(-8deg)",
      "translateX(-1700%) translateY(19%) rotate(8deg)",
      "translateX(-1650%) translateY(17%) rotate(0deg)",
    ],
    transition: {
      duration: 0.7,
      times: [0, 0.2, 0.55, 1],
      ease: "easeInOut",
    },
  },
};

const codePathVariants: Variants = {
  initial: {
    transform: "translateX(0%) translateY(0%)",
  },
  animate: {
    transform: [
      "translateX(0%) translateY(0%)",
      "translateX(-10%) translateY(0%)",
      "translateX(43%) translateY(-12%)",
      "translateX(38%) translateY(-10%)",
    ],
    transition: {
      duration: 0.7,
      times: [0, 0.2, 0.55, 1],
      ease: "easeInOut",
    },
  },
};

export {
  rotateVariants,
  caretLeftVariants,
  caretRightVariants,
  slashVariants,
  codePathVariants,
};
