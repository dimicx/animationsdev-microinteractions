import { motion, useAnimation, Variants } from "motion/react";
import { useEffect } from "react";
import { fadeScaleVariants, UNIVERSAL_DELAY } from "@/lib/animation-variants";
import { useHoverTimeout } from "@/lib/use-hover-timeout";

const timelineTimes = [0, 0.2, 0.35, 0.65, 0.8, 1];
const timelineDuration = 2;

const timelineOneVariants: Variants = {
  initial: {
    pathLength: 1,
  },
  animate: {
    pathLength: [1, 0.4, 0.4, 0.4, 1],
    transition: {
      duration: timelineDuration,
      times: timelineTimes,
      ease: "easeInOut",
    },
  },
  idle: {
    pathLength: [1, 0.4, 0.2, 1, 0.4, 1],
    transition: {
      duration: 5,
      times: timelineTimes,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: 2.7,
      delay: 2.7,
    },
  },
};

const timelineTwoVariants: Variants = {
  initial: {
    pathLength: 1,
    transform: "translateY(0%) translateX(0%)",
  },
  animate: {
    pathLength: [1, 0.4, 0.4, 0.4, 1],
    transform: [
      "translateY(0%) translateX(0%)",
      "translateY(0%)  translateX(0%)",
      "translateY(235%) translateX(-5%)",
      "translateY(0%) translateX(0%)",
      "translateY(0%) translateX(0%)",
    ],
    transition: {
      duration: timelineDuration,
      times: timelineTimes,
      ease: "easeInOut",
    },
  },
  idle: {
    pathLength: [1, 0.4, 1, 0.4, 1],
    transition: {
      duration: 6,
      times: timelineTimes,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: 3.2,
      delay: 3.2,
    },
  },
};

const timelineThreeVariants: Variants = {
  initial: {
    pathLength: 1,
    transform: "translateY(0%) translateX(0%)",
  },
  animate: {
    pathLength: [1, 0.25, 0.25, 0.25, 1],
    transform: [
      "translateY(0%) translateX(0%)",
      "translateY(0%) translateX(0%)",
      "translateY(-235%) translateX(5%)",
      "translateY(0%) translateX(0%)",
      "translateY(0%) translateX(0%)",
    ],
    transition: {
      duration: timelineDuration,
      times: timelineTimes,
      ease: "easeInOut",
    },
  },
  idle: {
    pathLength: [1, 0.25, 0.8, 0.25, 1],
    transition: {
      duration: 4,
      times: timelineTimes,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: 3.5,
      delay: 3.5,
    },
  },
};

const timelineContainerVariants: Variants = {
  initial: {
    transform: "rotate(0deg)",
  },
  animate: {
    transform: [
      "rotate(0deg)",
      "rotate(-12deg)",
      "rotate(-8.5deg)",
      "rotate(-9deg)",
    ],
    transition: {
      duration: 0.7,
    },
  },
};

export function Timeline() {
  const controls = useAnimation();
  const containerControls = useAnimation();

  const { handleMouseEnter, handleMouseLeave } = useHoverTimeout({
    delay: UNIVERSAL_DELAY,
    onHoverStart: async () => {
      containerControls.start("animate");
      await controls.start("initial", {
        duration: 0.2,
        ease: "easeOut",
      });
      controls.start("animate");
    },
    onHoverEnd: async () => {
      containerControls.start("initial");
      await controls.start("initial");
      await controls.start("idle");
    },
  });

  useEffect(() => {
    controls.start("idle");
    containerControls.start("initial");
  }, [controls, containerControls]);

  return (
    <motion.g
      variants={fadeScaleVariants}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="origin-bottom!"
    >
      <motion.g
        initial={{
          transform: "translateY(0px)",
        }}
        animate={{
          transform: ["translateY(-1px)", "translateY(2.5px)"],
        }}
        transition={{
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
            transform: ["rotate(0deg)", "rotate(-360deg)"],
          }}
          transition={{
            duration: 60,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
          className="filter-[url(#filter6_i_359_1453)] dark:filter-[url(#filter6_i_368_1560)]"
        >
          <path
            d="M216.15 23.607c6.663-4.711 15.869-3.23 20.717 3.333a15 15 0 0 0 9.525 5.869c8.042 1.38 13.504 8.937 12.292 17.006a15 15 0 0 0 2.585 10.885c4.711 6.662 3.23 15.868-3.333 20.717a15 15 0 0 0-5.869 9.524c-1.38 8.042-8.937 13.505-17.006 12.292a15 15 0 0 0-10.885 2.585c-6.662 4.711-15.869 3.23-20.717-3.333a15 15 0 0 0-9.524-5.869c-8.042-1.38-13.505-8.937-12.292-17.006a15 15 0 0 0-2.585-10.885c-4.711-6.662-3.23-15.868 3.333-20.716a15 15 0 0 0 5.869-9.525c1.379-8.042 8.937-13.505 17.006-12.292a15 15 0 0 0 10.884-2.585"
            className="fill-[#F8F8F8] dark:fill-[#252525]"
          ></path>
        </motion.g>

        <motion.g
          variants={timelineContainerVariants}
          initial="initial"
          animate={containerControls}
          className="transform-border origin-center"
        >
          {/* center line */}
          <path
            strokeLinecap="round"
            strokeWidth="2.457"
            d="m217.429 81.691 5.204-32.34"
            className="stroke-[#989898] dark:stroke-[#D6D6D6]"
          ></path>

          <g>
            <mask
              id="mask2_197_321"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="190"
              y="43"
              width="30"
              height="44"
            >
              <rect
                x="196.709"
                y="43"
                width="23"
                height="40"
                transform="rotate(9.07478 196.709 43)"
                fill="#D9D9D9"
              />
            </mask>
            <g mask="url(#mask2_197_321)">
              <motion.line
                variants={timelineOneVariants}
                initial="initial"
                animate={controls}
                x1="202.907"
                y1="52.7907"
                x2="231.287"
                y2="57.3873"
                strokeOpacity="1"
                strokeWidth="6.55"
                strokeLinecap="round"
                className="stroke-[#989898] dark:stroke-[#D6D6D6]"
              />
              <motion.line
                variants={timelineTwoVariants}
                initial="initial"
                animate={controls}
                x1="238.626"
                y1="68.4911"
                x2="211.948"
                y2="64.21"
                strokeOpacity="1"
                strokeWidth="6.55"
                strokeLinecap="round"
                className="stroke-[#989898] dark:stroke-[#D6D6D6]"
              />
              <motion.line
                variants={timelineThreeVariants}
                initial="initial"
                animate={controls}
                x1="205.527"
                y1="73.1088"
                x2="229.023"
                y2="76.8985"
                strokeOpacity="1"
                strokeWidth="6.5"
                strokeLinecap="round"
                className="stroke-[#989898] dark:stroke-[#D6D6D6]"
              />
            </g>
          </g>

          <g>
            <mask
              id="mask1_197_321"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="220"
              y="46"
              width="30"
              height="45"
            >
              <rect
                x="226.76"
                y="46.957"
                width="23"
                height="40"
                transform="rotate(9.07478 226.76 46.957)"
                fill="#D9D9D9"
              />
            </mask>
            <g mask="url(#mask1_197_321)">
              <motion.line
                variants={timelineOneVariants}
                initial="initial"
                animate={controls}
                x1="202.907"
                y1="52.7907"
                x2="231.287"
                y2="57.3873"
                strokeOpacity="0.4"
                strokeWidth="6.55"
                strokeLinecap="round"
                className="stroke-[#989898] dark:stroke-[#D6D6D6]"
              />
              <motion.line
                variants={timelineTwoVariants}
                initial="initial"
                animate={controls}
                x1="238.626"
                y1="68.4911"
                x2="211.948"
                y2="64.21"
                strokeOpacity="0.4"
                strokeWidth="6.55"
                strokeLinecap="round"
                className="stroke-[#989898] dark:stroke-[#D6D6D6]"
              />
              <motion.line
                variants={timelineThreeVariants}
                initial="initial"
                animate={controls}
                x1="205.527"
                y1="73.1088"
                x2="229.023"
                y2="76.8985"
                strokeOpacity="0.4"
                strokeWidth="6.5"
                strokeLinecap="round"
                className="stroke-[#989898] dark:stroke-[#D6D6D6]"
              />
            </g>
          </g>
        </motion.g>
      </motion.g>
    </motion.g>
  );
}
