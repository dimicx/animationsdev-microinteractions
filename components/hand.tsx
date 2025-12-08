import { useCallback, useEffect, useRef } from "react";
import { useFlubber } from "@/lib/flubber";
import {
  animate,
  motion,
  Transition,
  useAnimation,
  useMotionValue,
  Variants,
} from "motion/react";
import { fadeScaleVariants, UNIVERSAL_DELAY } from "@/lib/animation-variants";
import { useHoverTimeout } from "@/lib/use-hover-timeout";
import { useClickTimeout } from "@/lib/use-click-timeout";

const REPEAT_DELAY = 6;

const backgroundVariants: Variants = {
  initial: {
    transform: "scale(1)",
  },
  animate: {
    transform: ["scale(1)", "scale(1)", "scale(0.97)", "scale(1)"],
    transition: {
      duration: 0.5,
      times: [0, 0.6, 0.75, 1],
      ease: "easeOut",
    },
  },
  idle: {
    transform: ["scale(1)", "scale(1)", "scale(0.97)", "scale(1)", "scale(1)"],
    transition: {
      duration: 0.65,
      times: [0, 0.25, 0.4, 0.6, 1],
      ease: "easeOut",
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: REPEAT_DELAY,
      delay: REPEAT_DELAY / 2,
    },
  },
  click: {
    transform: ["scale(1)", "scale(0.97)", "scale(1)"],
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

const idleRayPathLengths = [1, 0.45, 0.1];

const rayVariants: Variants = {
  initial: (i: number) => ({
    pathLength: idleRayPathLengths[i],
    strokeOpacity: 0.5,
  }),
  animate: (i: number) => {
    const pathLength = idleRayPathLengths[i];
    return {
      pathLength: [pathLength, 1, 1, 0.01, 0.01, 1],
      strokeOpacity: [0, 0.5, 0, 0, 0.5, 0.5],
      transition: {
        delay: 0.3 + (i === 1 ? 0 : 0.075),
        duration: 0.65,
        times: [0, 0, 0, 0.1, 0.1, 0.4],
      },
    };
  },
  idle: (i: number) => {
    const pathLength = idleRayPathLengths[i];
    return {
      pathLength: [pathLength, pathLength, 0.01, 0.01, pathLength],
      strokeOpacity: [0.5, 0, 0, 0.5, 0.5],
      transition: {
        delay: REPEAT_DELAY / 2 + 0.2,
        duration: 0.65,
        times: [0, 0, 0.1, 0.2, 0.4],
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: REPEAT_DELAY,
      },
    };
  },
  click: (i: number) => {
    const pathLength = idleRayPathLengths[i];
    return {
      pathLength: [pathLength, 1, 1, 0.01, 0.01, 1],
      strokeOpacity: [0, 0.5, 0, 0, 0.5, 0.5],
      transition: {
        delay: 0.15 + (i === 1 ? 0 : 0.05),
        duration: 0.5,
        times: [0, 0, 0, 0.1, 0.1, 0.4],
      },
    };
  },
};

const raysOpacityVariants: Variants = {
  initial: { opacity: 1 },
  animate: {
    opacity: [1, 0, 0, 1],
    transition: {
      duration: 0.45,
      times: [0, 0.1, 0.9, 1],
    },
  },
  idle: {
    opacity: [1, 0, 0, 1],
    transition: {
      duration: 0.65,
      times: [0, 0.1, 0.55, 0.65],
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: REPEAT_DELAY,
      delay: REPEAT_DELAY / 2,
    },
  },
};

const handVariants: Variants = {
  initial: {
    transform: "translateX(0%) translateY(0%) rotate(0deg) scale(1)",
  },
  animate: {
    transform: [
      "translateX(0%) translateY(0%) rotate(0deg) scale(1)",
      "translateX(-11%) translateY(8%) rotate(25deg) scale(1)",
      "translateX(-11%) translateY(8%) rotate(25deg) scale(0.95)",
      "translateX(-11%) translateY(8%) rotate(25deg) scale(1)",
    ],
    transition: {
      duration: 1,
      times: [0, 0.2, 0.4, 0.75],
      ease: "easeInOut",
    },
  },
  click: {
    transform: [
      "translateX(-11%) translateY(8%) rotate(25deg) scale(1)",
      "translateX(-11%) translateY(8%) rotate(25deg) scale(1)",
      "translateX(-11%) translateY(8%) rotate(25deg) scale(0.95)",
      "translateX(-11%) translateY(8%) rotate(25deg) scale(1)",
    ],
    transition: {
      duration: 0.4,
      times: [0, 0.2, 0.4, 0.75],
      ease: "easeInOut",
    },
  },
};

const handPaths = [
  "M58.54 194.442c1.697.182 2.766-1.777 1.696-3.105l-10.972-13.618a3.686 3.686 0 0 1 5.739-4.624l3.344 4.15a3.97 3.97 0 0 0 4.212 1.319l8.106-2.383a9.826 9.826 0 0 1 11.536 4.985l2.764 5.452a7.94 7.94 0 0 1-2.1 9.775l-8.207 6.611a7.94 7.94 0 0 1-6.846 1.536l-12.624-3.048a3.7 3.7 0 0 1 1.264-7.275z",
  "M58.7084 193.515C60.4054 193.697 61.2218 192.681 60.1518 191.353L50.564 180.132C49.9773 179.369 49.7127 178.406 49.8267 177.45C49.9408 176.494 50.4244 175.62 51.1742 175.016C51.924 174.412 52.8804 174.125 53.8388 174.217C54.7973 174.309 55.6817 174.772 56.303 175.508L58.2628 177.261C58.7555 177.873 59.4188 178.325 60.1686 178.56C60.9184 178.795 61.721 178.802 62.4748 178.58L70.5808 176.197C72.7831 175.55 75.1427 175.694 77.2499 176.604C79.3571 177.515 81.079 179.134 82.1168 181.182L84.8808 186.634C85.7041 188.257 85.9448 190.114 85.5625 191.894C85.1802 193.673 84.1982 195.267 82.7808 196.409L74.5738 203.02C73.6266 203.783 72.5166 204.319 71.3296 204.585C70.1426 204.851 68.9103 204.841 67.7278 204.556L55.3564 200.565C54.4436 200.344 53.6491 199.784 53.1341 198.999C52.619 198.213 52.4219 197.261 52.5826 196.336C52.7434 195.411 53.2501 194.581 53.9999 194.016C54.7496 193.45 55.6865 193.191 56.6204 193.29L58.7084 193.515Z",
  "M58.54 194.442c1.697.182 2.766-1.777 1.696-3.105l-10.972-13.618a3.686 3.686 0 0 1 5.739-4.624l3.344 4.15a3.97 3.97 0 0 0 4.212 1.319l8.106-2.383a9.826 9.826 0 0 1 11.536 4.985l2.764 5.452a7.94 7.94 0 0 1-2.1 9.775l-8.207 6.611a7.94 7.94 0 0 1-6.846 1.536l-12.624-3.048a3.7 3.7 0 0 1 1.264-7.275z",
];

const handProgressTransition: Transition = {
  duration: 0.65,
  times: [0, 0.4, 0.65],
  ease: "easeInOut",
  repeat: Infinity,
  repeatType: "loop",
  repeatDelay: REPEAT_DELAY,
  delay: REPEAT_DELAY / 2,
};

export function Hand() {
  const controls = useAnimation();
  const handPathProgress = useMotionValue(0);
  const handPath = useFlubber(handPathProgress, handPaths);
  const isAnimated = useRef(false);
  const isHovering = useRef(false);

  const startAnimations = useCallback(() => {
    controls.start("idle");
    animate(handPathProgress, [0, 1, 2], handProgressTransition);
  }, [controls, handPathProgress]);

  useEffect(() => {
    startAnimations();
  }, [startAnimations]);

  const { handleMouseEnter, handleMouseLeave } = useHoverTimeout({
    delay: UNIVERSAL_DELAY,
    onHoverStart: async () => {
      isHovering.current = true;
      handPathProgress.set(0);
      controls.start("animate");
      await animate(handPathProgress, [0, 1, 2], {
        duration: 0.5,
        times: [0, 0.7, 1],
        ease: "easeInOut",
      });
      isAnimated.current = true;
    },
    onHoverEnd: async () => {
      isHovering.current = false;
      handPathProgress.set(0);
      await controls.start("initial");
      await Promise.all([
        controls.start("idle"),
        animate(handPathProgress, [0, 1, 2], handProgressTransition),
      ]);
      isAnimated.current = false;
    },
  });

  const onClick = useCallback(async () => {
    if (!isAnimated.current || !isHovering.current) {
      return;
    }
    handPathProgress.set(0);
    animate(handPathProgress, [0, 1, 2], {
      duration: 0.35,
      times: [0, 0.7, 1],
      ease: "easeInOut",
    });
    controls.start("click");
  }, [controls, handPathProgress]);

  const { handleClick } = useClickTimeout({
    delay: 500,
    onClick: onClick,
  });

  return (
    <motion.g
      variants={fadeScaleVariants}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className="origin-bottom! cursor-pointer"
    >
      <motion.g
        initial={{
          transform: "translateY(0px)",
        }}
        animate={{
          transform: ["translateY(-2px)", "translateY(2px)"],
        }}
        transition={{
          delay: 0.5,
          duration: 2.5,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <motion.g
          initial={{
            transform: "rotate(0deg)",
          }}
          animate={{
            transform: ["rotate(-3deg)", "rotate(2deg)"],
          }}
          transition={{
            duration: 4,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="filter-[url(#filter4_i_359_1453)] dark:filter-[url(#filter4_i_368_1560)]"
        >
          <motion.g
            variants={backgroundVariants}
            initial="initial"
            animate={controls}
          >
            <path
              d="M14.904 133.163c4.089 9.715 8.508 20.268 10.663 25.567.817 2.007.064 4.171-1.78 5.308l-11.056 6.815a4.914 4.914 0 0 0-1.142 7.392l7.762 8.998a4.914 4.914 0 0 1 .01 6.407L1.339 214.677c-3.036 3.542.11 8.924 4.686 8.017l25.492-5.055a4.914 4.914 0 0 1 5.704 3.56l3.912 14.74c.895 3.376 4.929 4.765 7.714 2.657l11.864-8.979a4.91 4.91 0 0 1 5.978.037l14.675 11.394c2.88 2.237 7.106.668 7.829-2.905l3.374-16.668a4.914 4.914 0 0 1 6.233-3.73l16.687 5.028c4.467 1.346 8.12-3.709 5.439-7.528l-14.585-20.776a4.914 4.914 0 0 1 .897-6.614l16.079-13.25c2.857-2.355 2.183-6.903-1.235-8.328l-12.919-5.383a4.915 4.915 0 0 1-2.879-5.719l5.329-21.472c1.13-4.551-4.15-7.947-7.823-5.032L84.2 144.218c-2.559 2.031-6.35 1.045-7.596-1.975l-6.553-15.882c-1.48-3.585-6.337-4.123-8.565-.947l-9.606 13.693a4.913 4.913 0 0 1-6.477 1.434l-23.506-13.552c-4.082-2.353-8.82 1.832-6.993 6.174"
              className="fill-[#F8F8F8] dark:fill-[#252525]"
            ></path>
          </motion.g>
        </motion.g>

        <motion.g
          variants={handVariants}
          initial="initial"
          animate={controls}
          className="transform-border"
        >
          <motion.path
            d={handPath}
            className="fill-[#989898] dark:fill-[#D6D6D6]"
          ></motion.path>
        </motion.g>

        <motion.g
          variants={raysOpacityVariants}
          initial="initial"
          animate={controls}
        >
          <motion.line
            variants={rayVariants}
            initial="initial"
            animate={controls}
            custom={2}
            x1="62.8541"
            y1="162.459"
            x2="64.5595"
            y2="157.929"
            strokeOpacity="0.5"
            strokeWidth="3.7"
            strokeLinecap="round"
            className="stroke-[#989898] dark:stroke-[#D6D6D6]"
          />
          <motion.line
            variants={rayVariants}
            initial="initial"
            animate={controls}
            custom={1}
            x1="53.0553"
            y1="161.328"
            x2="52.3227"
            y2="156.544"
            strokeOpacity="0.5"
            strokeWidth="3.7"
            strokeLinecap="round"
            className="stroke-[#989898] dark:stroke-[#D6D6D6]"
          />
          <motion.line
            variants={rayVariants}
            initial="initial"
            animate={controls}
            custom={0}
            x1="44.047"
            y1="165.362"
            x2="41.0059"
            y2="161.592"
            strokeOpacity="0.5"
            strokeWidth="3.7"
            strokeLinecap="round"
            className="stroke-[#989898] dark:stroke-[#D6D6D6]"
          />
        </motion.g>
      </motion.g>
    </motion.g>
  );
}
