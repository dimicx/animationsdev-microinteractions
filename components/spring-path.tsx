import {
  bounceEase,
  bounceAcceleratedX,
  getSquashStretchAtProgress,
} from "@/lib/bounce-physics";
import {
  motion,
  Variants,
  useMotionValue,
  useTransform,
  animate,
  useAnimation,
  AnimationPlaybackControls,
} from "motion/react";
import { useCallback, useEffect, useRef } from "react";
import { fadeScaleVariants, UNIVERSAL_DELAY } from "@/lib/animation-variants";
import { useHoverTimeout } from "@/lib/use-hover-timeout";

const BOUNCE_DURATION = 1.1;

// Ball positions - aligned with path touchpoints
const START_X = 212;
const START_Y = 188;
const END_X = 289.5;
const END_Y = 228;
const GROUND_Y = 240;

const pathVariants: Variants = {
  initial: {
    pathLength: 1,
    strokeOpacity: 1,
  },
  animate: {
    pathLength: [1, 0.01],
    strokeOpacity: [1, 1, 0],
    transition: {
      delay: 0.03,
      duration: BOUNCE_DURATION,
      ease: bounceAcceleratedX, // Path shrinks in sync with X movement
      strokeOpacity: {
        duration: BOUNCE_DURATION,
        ease: "easeOut",
        times: [0, 0.75, 0.76],
      },
    },
  },
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
      duration: BOUNCE_DURATION - 0.1,
      ease: "easeOut",
      times: [0, 0.1, 0.85, 0.87],
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
      "rotate(7deg) scale(1)",
    ],
    transition: {
      duration: 0.7,
      times: [0, 0.25, 0.6],
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
};

export function SpringPath({ isMobile }: { isMobile: boolean }) {
  const controls = useAnimation();
  const idleControls = useAnimation();
  const backgroundControls = useAnimation();

  const forwardCompleted = useRef(false);
  const animationRef = useRef<AnimationPlaybackControls | null>(null);
  const forwardCompleteTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  // Animation progress (0 to 1)
  const progress = useMotionValue(0);
  const ballOpacity = useMotionValue(1);

  // Transform progress to X position using accelerated X easing
  const cx = useTransform(progress, (p) => {
    const easedX = bounceAcceleratedX(p);
    return START_X + easedX * (END_X - START_X);
  });

  // Transform progress to Y position using bounce easing
  const cy = useTransform(progress, (p) => {
    const easedY = bounceEase(p);

    // Third ground hit (0.77) should be higher - ball doesn't fall as far
    const THIRD_HIT_Y = 234; // Higher than GROUND_Y (240)

    // After third ground hit (0.77), light bounce UP then settle to END_Y
    if (p > 0.77) {
      const settleT = (p - 0.77) / (1 - 0.77); // 0 to 1 during settle phase
      // Base transition from third hit to END_Y
      const baseY = THIRD_HIT_Y + (END_Y - THIRD_HIT_Y) * settleT;
      // Light bounce UP (peaks early, decays to 0)
      const bounceUp = Math.sin(settleT * Math.PI) * (1 - settleT * 0.3) * 5;
      return baseY - bounceUp;
    }

    // For second bounce (between 0.55 and 0.77), gradually raise the ground level
    if (p > 0.55) {
      const liftT = (p - 0.55) / (0.77 - 0.55); // 0 to 1 during second bounce
      const groundLevel = GROUND_Y + (THIRD_HIT_Y - GROUND_Y) * liftT;
      return START_Y + easedY * (groundLevel - START_Y);
    }

    // First two ground hits use full GROUND_Y
    return START_Y + easedY * (GROUND_Y - START_Y);
  });

  // Squash/stretch based on progress
  const ballScaleX = useTransform(progress, (p) => {
    if (p === 0) return 1;
    return getSquashStretchAtProgress(p, 0.2).scaleX;
  });

  const ballScaleY = useTransform(progress, (p) => {
    if (p === 0) return 1;
    return getSquashStretchAtProgress(p, 0.2).scaleY;
  });

  const startAnimations = useCallback(() => {
    controls.start("initial");
    idleControls.start("animate");
    controls.start("idle");
  }, [controls, idleControls]);

  useEffect(() => {
    startAnimations();
  }, [startAnimations]);

  const { handleMouseEnter, handleMouseLeave } = useHoverTimeout({
    delay: isMobile ? 0 : UNIVERSAL_DELAY,
    onHoverStart: () => {
      // Stop any existing animation
      animationRef.current?.stop();
      if (forwardCompleteTimeoutRef.current) {
        clearTimeout(forwardCompleteTimeoutRef.current);
      }

      idleControls.start("initial");
      backgroundControls.start("animate");
      controls.start("animate");
      forwardCompleted.current = false;

      // Reset progress
      progress.set(0);

      // Animate progress from 0 to 1 - the transforms handle the rest!
      const animation = animate(progress, 1, {
        duration: BOUNCE_DURATION,
        ease: "linear", // Linear because bounceEase handles the easing
      });

      animationRef.current = animation;

      // Set forwardCompleted 0.1 seconds before animation actually ends
      forwardCompleteTimeoutRef.current = setTimeout(() => {
        forwardCompleted.current = true;
      }, (BOUNCE_DURATION - 0.2) * 1000);
    },
    onHoverEnd: async () => {
      // Stop ongoing animation
      animationRef.current?.stop();
      if (forwardCompleteTimeoutRef.current) {
        clearTimeout(forwardCompleteTimeoutRef.current);
      }

      if (forwardCompleted.current) {
        // Forward animation completed, fade out and reset
        animate(ballOpacity, 0, {
          duration: 0.125,
          ease: "easeOut",
        }).then(() => {
          // Reset position instantly while invisible
          progress.set(0);
          forwardCompleted.current = false;
          // Fade back in
          animate(ballOpacity, 1, {
            delay: 0.2,
            duration: 0.125,
            ease: "easeOut",
          });
        });
      } else {
        // Forward animation not completed, return to start
        const currentProgress = progress.get();
        animate(progress, 0, {
          duration: currentProgress * 0.4,
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
      <motion.g onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <motion.g
          initial={{
            transform: "translateY(0%)",
          }}
          animate={{
            transform: ["translateY(-1px)", "translateY(2px)"],
          }}
          transition={{
            duration: 4,
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
    </motion.g>
  );
}
