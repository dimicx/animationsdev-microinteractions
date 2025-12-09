import {
  createFloatingAnimation,
  createRotationAnimation,
  fadeScaleVariants,
  UNIVERSAL_DELAY,
} from "@/lib/animation-variants";
import { useHoverTimeout } from "@/lib/use-hover-timeout";
import {
  backgroundVariants,
  bellVariants,
  clockVariants,
  idleBellsVariants,
} from "@/lib/variants/clock-variants";
import { motion, useAnimation } from "motion/react";
import { useCallback, useEffect } from "react";

export function Clock({ isMobile }: { isMobile: boolean }) {
  const controls = useAnimation();
  const idleControls = useAnimation();

  const startAnimations = useCallback(() => {
    controls.start("initial");
    idleControls.start("animate");
  }, [idleControls, controls]);

  useEffect(() => {
    startAnimations();
  }, [startAnimations]);

  const { handleMouseEnter, handleMouseLeave } = useHoverTimeout({
    delay: isMobile ? 0 : UNIVERSAL_DELAY,
    onHoverStart: async () => {
      await idleControls.start("initial", { duration: 0.05 });
      controls.start("animate");
    },
    onHoverEnd: async () => {
      await controls.start("initial");
      idleControls.start("animate");
    },
  });

  return (
    <motion.g
      variants={fadeScaleVariants}
      className="origin-bottom-right!"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.g
        {...createRotationAnimation({
          from: -1,
          to: 1,
          duration: 4,
        })}
      >
        <motion.g
          {...createFloatingAnimation({
            from: -1.5,
            to: 1.5,
            duration: 3,
          })}
          className="filter-[url(#filter7_i_359_1453)] dark:filter-[url(#filter7_i_368_1560)]"
        >
          <motion.g
            variants={backgroundVariants}
            initial="initial"
            animate={controls}
          >
            <path
              d="M553.22 118.392c42.396 5.809 72.84 39.157 68 74.487-1.536 11.213-6.442 21.277-13.78 29.607-6.142 6.973-8.217 17.405-2.728 24.902l1.828 2.496a6.7 6.7 0 0 1 1.082 2.304c1.428 5.683-4.672 10.293-9.749 7.368l-20.818-11.989a16.37 16.37 0 0 0-9.304-2.147l-2.455.17c-9.352 1.811-19.359 2.145-29.605.741-42.395-5.809-72.839-39.158-67.998-74.487s43.132-59.26 85.527-53.452"
              className="fill-[#F8F8F8] dark:fill-[#252525]"
            ></path>
          </motion.g>
        </motion.g>
      </motion.g>
      {/* clock */}
      <motion.g variants={clockVariants} initial="initial" animate={controls}>
        <circle
          cx="543.879"
          cy="186.54"
          r="22.93"
          className="fill-[#989898] dark:fill-[#D6D6D6]"
        />
        <g>
          {/* hour hand */}
          <line
            x1="543.879"
            y1="186.531"
            x2="549.787"
            y2="192.361"
            stroke="#252525"
            strokeWidth="4.9"
            strokeLinecap="round"
          />
          {/* minute hand */}
          <line
            x1="543.881"
            y1="186.533"
            x2="545.458"
            y2="175.238"
            stroke="#252525"
            strokeWidth="4.9"
            strokeLinecap="round"
          />
          {/* center dot */}
          <circle cx="543.88" cy="186.54" r="2.45" fill="#252525" />
        </g>
      </motion.g>

      {/* bells */}
      <motion.g
        variants={idleBellsVariants}
        initial="initial"
        animate={idleControls}
      >
        <motion.g
          variants={bellVariants}
          initial="initial"
          animate={controls}
          custom={0}
        >
          <path
            d="M553.071 151.434a3.848 3.848 0 0 1 2.478 6.222l-1.993 2.482a1.7 1.7 0 0 1-1.826.544 27 27 0 0 0-4.182-.912 27 27 0 0 0-4.275-.247 1.7 1.7 0 0 1-1.612-1.015l-1.252-2.926a3.847 3.847 0 0 1 4.059-5.326z"
            opacity="0.4"
            className="fill-[#989898] dark:fill-[#D6D6D6]"
          ></path>
        </motion.g>
        <motion.g
          variants={bellVariants}
          initial="initial"
          animate={controls}
          custom={1}
        >
          <path
            d="M570.169 166.997a3.771 3.771 0 0 1-2.773 6.044.16.16 0 0 1-.149-.081 27.3 27.3 0 0 0-4-5.269.16.16 0 0 1-.036-.164 3.77 3.77 0 0 1 6.567-1.045z"
            opacity="0.45"
            className="fill-[#989898] dark:fill-[#D6D6D6]"
          ></path>
        </motion.g>
      </motion.g>
    </motion.g>
  );
}
