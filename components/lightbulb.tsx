import { motion, useAnimation, Variants } from "motion/react";
import { useEffect } from "react";
import { fadeScaleVariants, UNIVERSAL_DELAY } from "@/lib/animation-variants";
import { useHoverTimeout } from "@/lib/use-hover-timeout";

const REPEAT_DELAY = 10;

const wholeVariants: Variants = {
  initial: {
    transform: "translateY(0px) rotate(0deg)",
  },
  animate: {
    transform: [
      "translateY(0px) rotate(0deg)",
      "translateY(2px) rotate(2deg)",
      "translateY(-3px) rotate(-3deg)",
      "translateY(-2px) rotate(-2deg)",
    ],
    transition: {
      duration: 0.8,
      times: [0, 0.3, 0.7, 1],
      ease: "easeInOut",
    },
  },
};

const bulbVariants: Variants = {
  initial: {
    opacity: 1,
    fill: "var(--fill-color)",
  },
  animate: {
    opacity: [1, 0.2, 0.2, 1],
    fill: [
      "var(--fill-color)",
      "var(--fill-color)",
      "var(--fill-highlight)",
      "var(--fill-highlight)",
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
};

const bulbMaskVariants: Variants = {
  initial: {
    y: "0%",
    x: "0%",
    rotate: "0deg",
    opacity: 1,
  },
  animate: {
    y: ["0%", "0%", "20%", "20%", "-10%", "0%"],
    x: ["0%", "0%", "20%", "20%", "-10%", "0%"],
    rotate: ["0deg", "0deg", "20deg", "20deg", "-10deg", "0deg"],
    opacity: [1, 0, 0, 0, 1, 1],
    transition: {
      duration: 0.7,
      times: [0, 0.2, 0.3, 0.5, 0.8, 1],
    },
  },
  idle: {
    y: ["0%", "0%", "20%", "20%", "-10%", "0%"],
    x: ["0%", "0%", "20%", "20%", "-10%", "0%"],
    rotate: ["0deg", "0deg", "20deg", "20deg", "-10deg", "0deg"],
    opacity: [1, 0, 0, 0, 1, 1],
    transition: {
      duration: 0.7,
      times: [0, 0.2, 0.3, 0.5, 0.8, 1],
      delay: REPEAT_DELAY,
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: REPEAT_DELAY,
    },
  },
};

const rayVariants: Variants = {
  initial: { pathLength: 1, strokeOpacity: 0.5 },
  animate: (i: number) => ({
    pathLength: [1, 1, 0, 0, 1],
    strokeOpacity: [0.5, 0, 0, 0.5, 0.5],
    transition: {
      delay: 0.2 + i * 0.05,
      duration: 0.7,
      times: [0, 0, 0.2, 0.2, 0.5],
    },
  }),
  idle: (i: number) => ({
    pathLength: [1, 1, 0, 0, 1],
    strokeOpacity: [0.5, 0, 0, 0.5, 0.5],
    transition: {
      delay: REPEAT_DELAY + 0.2 + i * 0.05,
      duration: 0.7,
      times: [0, 0, 0.2, 0.2, 0.5],
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: REPEAT_DELAY,
    },
  }),
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
      delay: REPEAT_DELAY,
      duration: 0.7,
      times: [0, 0.1, 0.5, 0.6],
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: REPEAT_DELAY,
    },
  },
};

export function Lightbulb() {
  const controls = useAnimation();

  useEffect(() => {
    controls.start("idle");
  }, [controls]);

  const { handleMouseEnter, handleMouseLeave } = useHoverTimeout({
    delay: UNIVERSAL_DELAY,
    onHoverStart: async () => {
      await controls.start("initial", { duration: 0 });
      controls.start("animate");
    },
    onHoverEnd: async () => {
      await controls.start("initial");
      await controls.start("idle");
    },
  });

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
          transform: ["translateY(-2px)", "translateY(3px)"],
        }}
        transition={{
          duration: 3,
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
            transform: ["rotate(-8deg)", "rotate(8deg)"],
          }}
          transition={{
            duration: 5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="filter-[url(#filter5_i_359_1453)] dark:filter-[url(#filter5_i_368_1560)]"
        >
          <path
            d="M367.266 21.417c-2.316-9.36 10.658-14.171 15.564-5.87 2.973 5.03 10.083 5.68 13.821 1.188l4.123-4.955c8.221-9.88 24.263-3.102 22.91 9.68l-.678 6.41c-.615 5.811 4.807 10.455 10.487 9.08 9.371-2.268 14.965 10.389 6.64 15.252-5.132 2.998-5.591 10.24-.88 13.862l5.654 4.347c10.746 8.261 3.501 25.412-9.914 23.466l-7.058-1.023c-5.881-.853-10.753 4.524-9.325 10.293 2.316 9.359-10.658 14.171-15.564 5.871-2.974-5.031-10.083-5.681-13.822-1.189l-4.123 4.954c-8.221 9.88-24.263 3.102-22.91-9.679l.678-6.41c.615-5.812-4.807-10.456-10.487-9.08-9.371 2.267-14.965-10.39-6.639-15.253 5.131-2.998 5.59-10.239.879-13.861l-5.654-4.347c-10.746-8.262-3.5-25.412 9.915-23.467l7.057 1.024c5.882.853 10.753-4.524 9.326-10.293"
            className="fill-[#F8F8F8] dark:fill-[#252525]"
          ></path>
        </motion.g>

        <motion.g variants={wholeVariants} initial="initial" animate={controls}>
          <motion.g
            initial={{
              transform: "translateY(0px)",
            }}
            animate={{
              transform: ["translateY(-1.5px)", "translateY(2px)"],
            }}
            transition={{
              duration: 4.5,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <g>
              <defs>
                <mask id="bulb-mask">
                  <rect width="100%" height="100%" fill="white" />
                  <motion.g
                    variants={bulbMaskVariants}
                    initial="initial"
                    animate={controls}
                  >
                    <path
                      d="M398.773 55.476a1.843 1.843 0 0 0-2.181 2.97l.181.144a3.08 3.08 0 0 1 .974 3.108 1.842 1.842 0 1 0 3.565.932 6.76 6.76 0 0 0-2.539-7.154"
                      fill="black"
                    />
                  </motion.g>
                </mask>
              </defs>
              {/* stem */}
              <motion.path
                variants={stemVariants}
                initial="initial"
                animate={controls}
                d="M379.934 77.108c.307-.725 1.318-.824 1.845-.24a12.15 12.15 0 0 0 4.303 3.05 12.14 12.14 0 0 0 5.185.959c.787-.03 1.42.764 1.114 1.49l-.784 1.854-.009.024c-.924 2.187-4.46 2.783-7.896 1.332-3.436-1.452-5.473-4.403-4.551-6.59z"
                className="fill-[#989898] dark:fill-[#D6D6D6]"
              ></motion.path>
              {/* bulb */}
              {/* shine applied as mask to the bulb path (#bulb-mask) */}
              <motion.path
                variants={bulbVariants}
                initial="initial"
                animate={controls}
                d="M398.989 49.368c6.408 2.708 9.141 10.328 5.95 16.51a10 10 0 0 1-4.121 4.208l-.94.508a10.6 10.6 0 0 0-4.718 5.197l-.318.752a1.95 1.95 0 0 1-1.353 1.14 10.12 10.12 0 0 1-10.967-4.634 1.95 1.95 0 0 1-.126-1.765l.318-.752a10.6 10.6 0 0 0 .437-7.005l-.291-1.028a10 10 0 0 1 .144-5.888c2.208-6.597 9.576-9.95 15.985-7.242"
                mask="url(#bulb-mask)"
                className="[--fill-color:#989898] dark:[--fill-color:#D6D6D6] [--fill-highlight:#989898] dark:[--fill-highlight:#FFFFFF]"
              ></motion.path>
            </g>

            {/* light rays reworked as lines to animate pathLength */}
            <motion.g
              variants={raysOpacityVariants}
              initial="initial"
              animate={controls}
            >
              <motion.line
                variants={rayVariants}
                initial="initial"
                animate={controls}
                custom={0}
                x1="376.711"
                y1="53.2909"
                x2="376.62"
                y2="53.2495"
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
                x1="382.703"
                y1="45.4685"
                x2="382.04"
                y2="44.5912"
                strokeOpacity="0.5"
                strokeWidth="3.7"
                strokeLinecap="round"
                className="stroke-[#989898] dark:stroke-[#D6D6D6]"
              />
              <motion.line
                variants={rayVariants}
                initial="initial"
                animate={controls}
                custom={2}
                x1="391.866"
                y1="41.752"
                x2="391.536"
                y2="39.1226"
                strokeOpacity="0.5"
                strokeWidth="3.7"
                strokeLinecap="round"
                className="stroke-[#989898] dark:stroke-[#D6D6D6]"
              />
              <motion.line
                variants={rayVariants}
                initial="initial"
                animate={controls}
                custom={3}
                x1="401.616"
                y1="43.146"
                x2="403.502"
                y2="38.6842"
                strokeOpacity="0.5"
                strokeWidth="3.7"
                strokeLinecap="round"
                className="stroke-[#989898] dark:stroke-[#D6D6D6]"
              />
            </motion.g>
          </motion.g>
        </motion.g>
      </motion.g>
    </motion.g>
  );
}
