import { useCallback } from "react";
import {
  animate,
  motion,
  useAnimation,
  useMotionValue,
  Variants,
} from "motion/react";
import { useFlubber } from "@/lib/flubber";
import { fadeScaleVariants, UNIVERSAL_DELAY } from "@/lib/animation-variants";

const rotateVariants: Variants = {
  initial: {
    transform: "rotate(0deg)",
  },
  animate: {
    transform: "rotate(10deg)",
    transition: {
      delay: 0.1,
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
      "translateX(20%) translateY(0%)",
      "translateX(-80%) translateY(10%)",
    ],
    transition: {
      duration: 0.6,
      times: [0, 0.3, 0.8],
      ease: "easeInOut",
      delay: 0.1,
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
      "translateX(-20%) translateY(0%)",
      "translateX(80%) translateY(-10%)",
    ],
    transition: {
      duration: 0.6,
      times: [0, 0.3, 0.8],
      ease: "easeInOut",
      delay: UNIVERSAL_DELAY / 1000,
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
      "translateX(-100%) translateY(0%) rotate(5deg)",
      "translateX(500%) translateY(-10%) rotate(-30deg)",
    ],
    transition: {
      duration: 0.6,
      times: [0, 0.3, 0.8],
      ease: "easeInOut",
      delay: UNIVERSAL_DELAY / 1000,
    },
  },
};

const codePaths = [
  "M402.625 268.175C402.51 267.54 402.522 266.888 402.659 266.258C402.797 265.627 403.057 265.03 403.425 264.5C403.794 263.97 404.263 263.518 404.806 263.17C405.349 262.821 405.956 262.583 406.591 262.47L409.815 261.89C410.45 261.775 411.101 261.787 411.732 261.924C412.362 262.061 412.96 262.322 413.49 262.69C414.019 263.058 414.471 263.527 414.82 264.071C415.168 264.614 415.406 265.22 415.52 265.856L417.84 278.751C418.07 280.033 417.782 281.355 417.038 282.425C416.295 283.495 415.156 284.225 413.874 284.457L410.65 285.037C409.367 285.267 408.046 284.979 406.976 284.235C405.906 283.491 405.175 282.353 404.944 281.071L402.625 268.175Z",
  "M403.67 266.711C403.326 264.529 404.816 262.481 406.998 262.136L407.851 262.002C410.033 261.658 412.082 263.147 412.426 265.33L414.81 280.443C415.154 282.625 413.664 284.673 411.482 285.017L410.629 285.152C408.447 285.496 406.399 284.006 406.054 281.824L403.67 266.711Z",
  "M396.244 269.906C395.727 266.633 397.962 263.561 401.235 263.045L414.792 260.906C418.065 260.389 421.137 262.624 421.653 265.898L423.414 277.06C423.931 280.333 421.696 283.405 418.423 283.921L404.866 286.06C401.593 286.576 398.521 284.341 398.004 281.068L396.244 269.906Z",
];

export function Code() {
  const controls = useAnimation();

  const codePathProgress = useMotionValue(0);
  const codePath = useFlubber(codePathProgress, codePaths);

  const handleMouseEnter = useCallback(() => {
    controls.start("animate");
    animate(codePathProgress, [0, 1, 2], {
      duration: 0.6,
      times: [0, 0.3, 0.8],
      ease: "easeInOut",
      delay: UNIVERSAL_DELAY / 1000,
    });
  }, [controls, codePathProgress]);
  const handleMouseLeave = useCallback(() => {
    controls.start("initial");
    animate(codePathProgress, 0, {
      duration: 0.6,
      ease: "easeOut",
    });
  }, [controls, codePathProgress]);

  return (
    <motion.g
      variants={fadeScaleVariants}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="origin-bottom-left! group"
    >
      <motion.g
        animate={{
          transform: ["translateY(-1px)", "translateY(2px)"],
          transition: {
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          },
        }}
      >
        <motion.g
          variants={rotateVariants}
          initial="initial"
          animate={controls}
        >
          <g className="filter-[url(#filter8_i_359_1453)] dark:filter-[url(#filter8_i_368_1560)]">
            <path
              d="M425.217 236.652C443.467 233.369 460.923 245.503 464.206 263.753C467.489 282.003 455.355 299.459 437.105 302.742L408.026 307.972C401.42 309.172 394.605 308.353 388.471 305.622C388.141 306.321 387.71 306.967 387.192 307.54C384.266 310.776 380.349 312.95 376.055 313.722L374.302 314.037C372.384 314.382 370.829 312.493 371.537 310.677L372.153 309.096C373.031 306.846 373.268 304.396 372.841 302.018L369.037 280.871C365.754 262.621 377.888 245.165 396.138 241.883L425.217 236.652Z"
              className="fill-[#F8F8F8] dark:fill-[#252525]"
            />
          </g>
          <motion.g
            variants={caretLeftVariants}
            initial="initial"
            animate={controls}
          >
            <path
              d="M400.254 282.746L392.234 277.171C392.045 277.04 391.951 276.975 391.905 276.888C391.863 276.812 391.847 276.725 391.86 276.639C391.873 276.542 391.939 276.448 392.07 276.259L397.645 268.239"
              strokeWidth="2.457"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-[#989898] dark:stroke-[#D6D6D6]"
            />
          </motion.g>
          <motion.g
            variants={slashVariants}
            initial="initial"
            animate={controls}
          >
            <path
              d="M423.804 261.037L423.126 271.144L422.447 281.25"
              strokeWidth="2.457"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-[#989898] dark:stroke-[#D6D6D6]"
            />
          </motion.g>
          <motion.g
            variants={caretRightVariants}
            initial="initial"
            animate={controls}
          >
            <path
              d="M429.881 262.438L437.901 268.013C438.09 268.144 438.184 268.209 438.23 268.296C438.271 268.372 438.287 268.46 438.275 268.545C438.262 268.642 438.196 268.736 438.065 268.925L432.49 276.945"
              strokeWidth="2.457"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-[#989898] dark:stroke-[#D6D6D6]"
            />
          </motion.g>
          <g className="animate-pulse [animation-duration:1.5s]">
            <motion.path
              opacity="0.4"
              d={codePath}
              className="fill-[#989898] dark:fill-[#D6D6D6]"
            />
          </g>
        </motion.g>
      </motion.g>
    </motion.g>
  );
}
