import { getPathData } from "@/lib/get-path-data";
import { generateBounceEasing } from "@/lib/generate-bounce-easing";
import {
  motion,
  Variants,
  useMotionValue,
  useTransform,
  animate,
  useAnimation,
} from "motion/react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { fadeScaleVariants, UNIVERSAL_DELAY } from "@/lib/animation-variants";
import { useHoverTimeout } from "@/lib/use-hover-timeout";

const BOUNCE_DURATION = 0.9;

const pathVariants: Variants = {
  initial: {
    pathLength: 1,
  },
  animate: ({ bounceEasing }: { bounceEasing: (t: number) => number }) => ({
    pathLength: [1, bounceEasing(0.01)],
    transition: {
      duration: BOUNCE_DURATION,
      ease: bounceEasing,
    },
  }),
};

const secondaryCircleVariants: Variants = {
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
      duration: BOUNCE_DURATION,
      ease: "easeOut",
      times: [0, 0.1, 0.99, 1],
    },
  },
};

const backgroundVariants: Variants = {
  initial: {
    transform: "rotate(0deg) scale(1)",
  },
  animate: {
    transform: [
      "rotate(0deg) scale(1)",
      "rotate(8deg) scale(0.99)",
      "rotate(6deg) scale(1)",
      "rotate(7deg) scale(1)",
    ],
    transition: {
      duration: 0.7,
      times: [0, 0.25, 0.6, 1],
      ease: "easeInOut",
    },
  },
};

const idleVariants: Variants = {
  initial: {
    transform: "translateY(0%) translateX(0%)",
  },
  animate: {
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

const bubblesVariants: Variants = {
  initial: {
    transform: "translateY(0%) translateX(0%)",
  },
  animate: (i: number) => ({
    transform:
      i === 0
        ? ["translateY(0%) translateX(0%)", "translateY(-25%) translateX(-20%)"]
        : ["translateY(0%) translateX(0%)", "translateY(-60%) translateX(20%)"],
    transition: {
      duration: 0.25,
      ease: "easeInOut",
    },
  }),
  idle: (i: number) => ({
    transform: ["translateY(0px)", "translateY(-2px)", "translateY(3px)"],
    transition: {
      delay: 0.4 + i * 0.6,
      duration: 3,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse",
    },
  }),
};

const forwardPathString =
  "M212.5 190.5C212.5 190.5 227.9 196 233.5 210C239.1 224 241.5 240 241.5 240C241.5 240 235.542 204.103 251 201.5C266.86 198.83 271 237.5 271 237.5C271 237.5 268.08 209.741 278.5 211.5C286.136 212.789 289.5 228 289.5 228";

export function SpringPath() {
  const controls = useAnimation();
  const idleControls = useAnimation();
  const backgroundControls = useAnimation();

  const forwardCompleted = useRef(false);
  const progress = useMotionValue(0);
  const ballOpacity = useMotionValue(1);
  const settleOffset = useMotionValue(0);
  const forwardPathData = useMemo(() => getPathData(forwardPathString), []);

  // Generate physics-based easing from the bounce path
  const bounceEasing = useMemo(
    () => generateBounceEasing(forwardPathString),
    []
  );

  // Transform progress to cx and cy
  const cx = useTransform(progress, (p) => {
    if (!forwardPathData.path || p === 0) return 212.157;
    const point = forwardPathData.path.getPointAtLength(p);
    return point.x;
  });

  const cyBase = useTransform(progress, (p) => {
    if (!forwardPathData.path || p === 0) return 190.615;
    const point = forwardPathData.path.getPointAtLength(p);
    return point.y;
  });

  // Combine base cy with settle offset for micro-bounce effect at the end
  const cy = useTransform([cyBase, settleOffset], ([base, offset]) => {
    return (base as number) + (offset as number);
  });

  // Helper function to calculate squash/stretch scale based on velocity
  const getVelocityScale = useCallback(
    (p: number, isXAxis: boolean): number => {
      if (!forwardPathData.path || p === 0) return 1;

      // Sample Y velocity by comparing neighboring points
      const delta = 2;
      const point1 = forwardPathData.path.getPointAtLength(
        Math.max(0, p - delta)
      );
      const point2 = forwardPathData.path.getPointAtLength(
        Math.min(forwardPathData.length, p + delta)
      );
      const velocityY = point2.y - point1.y;

      const squashAmount = Math.min(Math.abs(velocityY) / 50, 0.2);

      // X-axis: squash horizontally when moving down, stretch when moving up
      // Y-axis: opposite (stretch vertically when moving down, squash when moving up)
      const calculatedScale = isXAxis
        ? velocityY > 0
          ? 1 + squashAmount
          : 1 - squashAmount
        : velocityY > 0
        ? 1 - squashAmount
        : 1 + squashAmount;

      // Fade to scale 1 in the last 1% of the path
      const threshold = forwardPathData.length * 0.99;
      if (p >= threshold) {
        const fadeOut =
          1 - (p - threshold) / (forwardPathData.length - threshold);
        return calculatedScale * fadeOut + 1 * (1 - fadeOut);
      }

      return calculatedScale;
    },
    [forwardPathData.path, forwardPathData.length]
  );

  const ballScaleX = useTransform(progress, (p) => getVelocityScale(p, true));
  const ballScaleY = useTransform(progress, (p) => getVelocityScale(p, false));

  const startAnimations = useCallback(() => {
    controls.start("initial");
    idleControls.start("animate");
    controls.start("idle");
  }, [controls, idleControls]);

  useEffect(() => {
    startAnimations();
  }, [startAnimations]);

  const { handleMouseEnter, handleMouseLeave } = useHoverTimeout({
    delay: UNIVERSAL_DELAY,
    onHoverStart: () => {
      idleControls.start("initial");
      backgroundControls.start("animate");
      controls.start("animate");
      forwardCompleted.current = false;
      progress.set(0);
      settleOffset.set(0);
      animate(progress, forwardPathData.length, {
        duration: BOUNCE_DURATION,
        ease: bounceEasing || "linear",
      }).then(() => {
        forwardCompleted.current = true;
        // Add settling micro-bounces at final position
        animate(settleOffset, [0, -4, 0, -1.5, 0], {
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1], // ease-out-quint for natural deceleration
        });
      });
    },
    onHoverEnd: async () => {
      const currentProgress = progress.get();

      if (forwardCompleted.current) {
        // Forward animation completed, fade out and reset to initial position
        animate(ballOpacity, 0, {
          duration: 0.125,
          ease: "easeOut",
        }).then(() => {
          // Reset position instantly while invisible
          progress.set(0);
          settleOffset.set(0);
          forwardCompleted.current = false;
          // Fade back in
          animate(ballOpacity, 1, {
            delay: 0.2,
            duration: 0.125,
            ease: "easeOut",
          });
        });
      } else {
        // Forward animation not completed, reverse on same path
        settleOffset.set(0);
        animate(progress, 0, {
          duration: (currentProgress / forwardPathData.length) * 0.5,
          ease: "easeOut",
        });
      }

      backgroundControls.start("initial");
      await controls.start("initial", {
        duration: 0.35,
        ease: "easeOut",
      });
      idleControls.start("animate");
      controls.start("idle");
    },
  });

  return (
    <motion.g variants={fadeScaleVariants} className="origin-bottom-left!">
      <motion.g
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
          variants={backgroundVariants}
          initial="initial"
          animate={backgroundControls}
        >
          <motion.g
            initial={{
              transform: "rotate(0deg)",
            }}
            animate={{
              transform: ["rotate(-1deg)", "rotate(3deg)"],
            }}
            transition={{
              delay: 1,
              duration: 5,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="filter-[url(#filter0_i_359_1453)] dark:filter-[url(#filter0_ii_368_1560)]"
          >
            <path
              d="M245.555 146.249c9.49-1.097 18.358 3.212 23.526 10.486 3.964-6.087 10.509-10.43 18.289-11.329 12.356-1.429 23.659 6.309 27.111 17.822 13.829-1.544 26.315 8.383 27.914 22.219a25.17 25.17 0 0 1-3.739 16.399 25.17 25.17 0 0 1 7.38 15.112c1.6 13.834-8.29 26.347-22.105 28-.733 11.998-9.972 22.111-22.329 23.54-7.78.899-15.142-1.835-20.39-6.857-3.372 8.261-11.023 14.481-20.513 15.578-8.436.975-16.381-2.322-21.672-8.176a25.19 25.19 0 0 1-16.205 8.564c-12.356 1.428-23.66-6.31-27.112-17.823-13.827 1.541-26.31-8.385-27.909-22.218a25.17 25.17 0 0 1 3.736-16.398 25.17 25.17 0 0 1-7.381-15.114c-1.6-13.834 8.29-26.347 22.104-28.001.733-11.998 9.974-22.111 22.331-23.539a25.2 25.2 0 0 1 17.73 4.639c3.816-6.907 10.799-11.929 19.234-12.904"
              className="fill-[#F8F8F8] dark:fill-[#252525]"
            ></path>
          </motion.g>

          <g
            className="stroke-[#989898] dark:stroke-[#D6D6D6]"
            strokeLinecap="round"
            strokeWidth="4.913"
            opacity="0.4"
          >
            <motion.path
              variants={pathVariants}
              initial="initial"
              animate={controls}
              custom={{ bounceEasing }}
              d="M288.5 223.5C288.5 223.5 286.5 211.5 278.5 211.5C270.5 211.5 272 236 271 236C270 236 267 201.5 253 201.5C236.611 201.5 242.5 239.5 241.5 239.5C240.892 239.5 240.5 227 233.5 210C230.132 201.821 225 198 225 198"
            />
          </g>
          <g>
            <g className="filter-[url(#filter3_i_359_1453)] dark:filter-[url(#filter3_i_368_1560)]">
              <circle
                cx="289.63"
                cy="228.535"
                r="8.189"
                transform="rotate(-6.595 289.63 228.535)"
                className="fill-[#F8F8F8] dark:fill-[#252525]"
              ></circle>
            </g>
            <motion.circle
              variants={secondaryCircleVariants}
              initial="initial"
              animate={controls}
              cx="289.63"
              cy="228.535"
              r="5.732"
              strokeLinecap="round"
              strokeWidth="4.913"
              transform="rotate(-6.595 289.63 228.535)"
              className="[--stroke-color:#989898] dark:[--stroke-color:#D6D6D6] [--stroke-highlight:#98989866] dark:[--stroke-highlight:#D6D6D666] [--bg-fill:#F8F8F8] dark:[--bg-fill:#252525]"
            ></motion.circle>
          </g>

          <motion.g
            variants={idleVariants}
            initial="initial"
            animate={idleControls}
          >
            <motion.circle
              cx={cx}
              cy={cy}
              r="8.189"
              style={{
                opacity: ballOpacity,
                scaleX: ballScaleX,
                scaleY: ballScaleY,
              }}
              className="fill-[#989898] dark:fill-[#D6D6D6]"
            />
          </motion.g>
        </motion.g>
      </motion.g>

      <motion.g
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.35,
            },
          },
        }}
        initial="hidden"
        animate="visible"
      >
        <motion.g
          variants={{
            hidden: {
              transform: "translateX(40px) translateY(-60px) scale(0)",
              opacity: 0,
            },
            visible: {
              transform: "translateX(0px) translateY(0px) scale(1)",
              opacity: 1,
            },
          }}
        >
          <motion.g
            variants={bubblesVariants}
            initial="initial"
            animate={controls}
            custom={0}
            className="filter-[url(#filter1_i_359_1453)] dark:filter-[url(#filter1_ii_368_1560)]"
          >
            <circle
              cx="201.927"
              cy="293.495"
              r="9.417"
              transform="rotate(-6.595 201.927 293.495)"
              className="fill-[#F8F8F8] dark:fill-[#252525]"
            ></circle>
          </motion.g>
        </motion.g>
        <motion.g
          variants={{
            hidden: {
              transform: "translateX(40px) translateY(-60px) scale(0)",
              opacity: 0,
            },
            visible: {
              transform: "translateX(0px) translateY(0px) scale(1)",
              opacity: 1,
            },
          }}
        >
          <motion.g
            variants={bubblesVariants}
            initial="initial"
            animate={controls}
            custom={1}
            className="filter-[url(#filter2_i_359_1453)] dark:filter-[url(#filter2_ii_368_1560)]"
          >
            <circle
              cx="184.926"
              cy="314.008"
              r="4.913"
              transform="rotate(-6.595 184.926 314.008)"
              className="fill-[#F8F8F8] dark:fill-[#252525]"
            ></circle>
          </motion.g>
        </motion.g>
      </motion.g>
    </motion.g>
  );
}
