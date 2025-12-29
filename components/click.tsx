"use client";

import {
  createFloatingAnimation,
  createRotationAnimation,
  UNIVERSAL_DELAY,
} from "@/lib/animation-variants";
import { useAnimateVariant } from "@/lib/hooks/use-animate-variant";
import { useFlubber } from "@/lib/hooks/use-flubber";
import { useHoverTimeout } from "@/lib/hooks/use-hover-timeout";
import { useMobileTap } from "@/lib/hooks/use-mobile-tap";
import {
  backgroundVariants,
  DURATION,
  handVariants,
  IDLE_DURATION,
  INITIAL_DELAY,
  lineVariants,
  REPEAT_DELAY,
} from "@/lib/variants/click-variants";
import {
  AnimationPlaybackControlsWithThen,
  easeOut,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { useCallback, useEffect, useRef } from "react";

const handPaths = [
  "M58.54 194.442c1.697.182 2.766-1.777 1.696-3.105l-10.972-13.618a3.686 3.686 0 0 1 5.739-4.624l3.344 4.15a3.97 3.97 0 0 0 4.212 1.319l8.106-2.383a9.826 9.826 0 0 1 11.536 4.985l2.764 5.452a7.94 7.94 0 0 1-2.1 9.775l-8.207 6.611a7.94 7.94 0 0 1-6.846 1.536l-12.624-3.048a3.7 3.7 0 0 1 1.264-7.275z",
  "M58.7137 193.515C60.4107 193.697 61.2271 192.681 60.1571 191.353L51.7546 180.852C51.1679 180.089 50.785 179.005 50.899 178.049C51.013 177.093 51.4967 176.22 52.2464 175.616C52.9962 175.011 53.9526 174.725 54.9111 174.817C55.8696 174.909 56.7098 175.461 57.331 176.197L58.2681 177.261C58.7609 177.873 59.4241 178.325 60.1739 178.56C60.9237 178.795 61.7263 178.802 62.4801 178.58L70.5861 176.197C72.7885 175.549 75.148 175.694 77.2552 176.604C79.3625 177.515 81.0844 179.134 82.1221 181.182L84.8861 186.634C85.7095 188.257 85.9502 190.114 85.5679 191.893C85.1856 193.673 84.2035 195.267 82.7861 196.409L74.5791 203.02C73.6319 203.783 72.522 204.319 71.335 204.585C70.148 204.851 68.9156 204.841 67.7331 204.556L55.4295 200.347C54.5168 200.126 53.7223 199.566 53.2072 198.781C52.6921 197.995 52.495 197.043 52.6558 196.118C52.8165 195.193 53.3232 194.363 54.073 193.798C54.8228 193.232 55.7596 192.973 56.6935 193.072L58.7137 193.515Z",
];

export function Click({
  isMobile,
  isDraggingRef,
}: {
  isMobile: boolean;
  isDraggingRef: React.RefObject<boolean>;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [scope, animateVariant, animate] = useAnimateVariant();
  const handPathProgress = useMotionValue(0);
  const handPath = useFlubber(handPathProgress, handPaths);
  const {
    isReadyRef: isReadyForClickRef,
    markTapped,
    reset: resetMobileTap,
  } = useMobileTap({ isMobile });
  const handPathAnimationRef = useRef<
    AnimationPlaybackControlsWithThen | undefined
  >(undefined);
  const hasAnimationCompletedRef = useRef(false);
  const isFirstIdleRef = useRef(true);

  // Consolidated animation orchestration
  const playAnimationState = useCallback(
    async (
      variant: "initial" | "hover" | "idle" | "click",
      pathConfig?: {
        keyframes: number[];
        times: number[];
        repeat?: boolean;
      }
    ) => {
      if (shouldReduceMotion) return;

      const initialDelay = variant === "idle" && isFirstIdleRef.current;

      // Stop any in-flight animations
      handPathAnimationRef.current?.stop();
      if (!pathConfig?.keyframes) {
        await animate(handPathProgress, 0);
      }

      const animations: (AnimationPlaybackControlsWithThen | undefined)[] = [];

      // Background
      const bgVariant =
        backgroundVariants[variant as keyof typeof backgroundVariants];
      if (bgVariant) {
        const resolved =
          typeof bgVariant === "function" ? bgVariant(initialDelay) : bgVariant;
        animations.push(
          animateVariant('[data-animate="background"]', resolved)
        );
      }

      // Hand (no idle variant)
      if (variant !== "idle") {
        const hVariant = handVariants[variant as keyof typeof handVariants];
        if (hVariant) {
          animations.push(animateVariant('[data-animate="hand"]', hVariant));
        }
      }

      // Rays (indexed)
      animations.push(
        ...Array.from({ length: 3 }, (_, i) => {
          const resolved =
            variant === "idle"
              ? lineVariants.idle({ index: i, initialDelay })
              : lineVariants[variant](i);
          return animateVariant(
            `[data-animate="ray"][data-index='${i}']`,
            resolved
          );
        })
      );

      // Animate path morphing if config provided
      if (pathConfig) {
        const pathAnimation = animate(handPathProgress, pathConfig.keyframes, {
          duration: pathConfig.repeat ? IDLE_DURATION : DURATION,
          times: pathConfig.times,
          ease: easeOut,
          ...(pathConfig.repeat && {
            repeat: Infinity,
            repeatType: "loop",
            repeatDelay: REPEAT_DELAY,
            delay: initialDelay ? INITIAL_DELAY : REPEAT_DELAY,
          }),
        });
        handPathAnimationRef.current = pathAnimation;
      }

      if (variant === "idle") {
        isFirstIdleRef.current = false;
      }

      return Promise.all(animations);
    },
    [animate, animateVariant, handPathProgress, shouldReduceMotion]
  );

  const startIdleAnimations = useCallback(async () => {
    await playAnimationState("idle", {
      keyframes: [0, 1, 0],
      times: [0.2, 0.5, 0.7],
      repeat: true,
    });
  }, [playAnimationState]);

  useEffect(() => {
    startIdleAnimations();

    return () => {
      handPathAnimationRef.current?.stop();
    };
  }, [startIdleAnimations]);

  const { handleMouseEnter, handleMouseLeave } = useHoverTimeout({
    delay: UNIVERSAL_DELAY,
    disabledRef: isDraggingRef,
    shouldReduceMotion,
    onHoverStart: async () => {
      await playAnimationState("hover", {
        keyframes: [0, 1, 0],
        times: [0.4, 0.6, 1],
      });
      hasAnimationCompletedRef.current = true;
    },
    onHoverEnd: async () => {
      resetMobileTap();
      hasAnimationCompletedRef.current = false;
      await playAnimationState("initial");
      startIdleAnimations();
    },
  });

  const onClick = useCallback(() => {
    if (shouldReduceMotion) return;
    if (!hasAnimationCompletedRef.current) return;
    if (!isReadyForClickRef.current) {
      markTapped();
      return;
    }
    playAnimationState("click", {
      keyframes: [0, 1, 0],
      times: [0.1, 0.33, 0.53],
    });
  }, [playAnimationState, isReadyForClickRef, markTapped, shouldReduceMotion]);

  return (
    <motion.g
      ref={scope}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <motion.g
        style={{ willChange: "transform" }}
        {...createFloatingAnimation({
          to: 1,
          duration: 3,
          delay: 0.5,
          shouldReduceMotion,
        })}
      >
        <motion.g
          data-animate="background"
          initial={backgroundVariants.initial}
          style={{ willChange: "transform" }}
        >
          <motion.g
            style={{ willChange: "transform" }}
            {...createRotationAnimation({
              to: 2,
              duration: 5,
              shouldReduceMotion,
            })}
            className="filter-[url(#filter4_i_359_1453)] dark:filter-[url(#filter4_i_368_1560)] filter-animated"
          >
            <path
              d="M14.904 133.163c4.089 9.715 8.508 20.268 10.663 25.567.817 2.007.064 4.171-1.78 5.308l-11.056 6.815a4.914 4.914 0 0 0-1.142 7.392l7.762 8.998a4.914 4.914 0 0 1 .01 6.407L1.339 214.677c-3.036 3.542.11 8.924 4.686 8.017l25.492-5.055a4.914 4.914 0 0 1 5.704 3.56l3.912 14.74c.895 3.376 4.929 4.765 7.714 2.657l11.864-8.979a4.91 4.91 0 0 1 5.978.037l14.675 11.394c2.88 2.237 7.106.668 7.829-2.905l3.374-16.668a4.914 4.914 0 0 1 6.233-3.73l16.687 5.028c4.467 1.346 8.12-3.709 5.439-7.528l-14.585-20.776a4.914 4.914 0 0 1 .897-6.614l16.079-13.25c2.857-2.355 2.183-6.903-1.235-8.328l-12.919-5.383a4.915 4.915 0 0 1-2.879-5.719l5.329-21.472c1.13-4.551-4.15-7.947-7.823-5.032L84.2 144.218c-2.559 2.031-6.35 1.045-7.596-1.975l-6.553-15.882c-1.48-3.585-6.337-4.123-8.565-.947l-9.606 13.693a4.913 4.913 0 0 1-6.477 1.434l-23.506-13.552c-4.082-2.353-8.82 1.832-6.993 6.174"
              className="fill-[#F8F8F8] dark:fill-[#252525]"
            />
          </motion.g>
        </motion.g>
        <motion.g
          data-animate="hand"
          initial={handVariants.initial}
          className="transform-border"
          style={{ willChange: "transform" }}
        >
          <motion.path
            d={handPath}
            className="fill-[#989898] dark:fill-[#D6D6D6]"
            style={{ willChange: "d" }}
          ></motion.path>
        </motion.g>
        <g>
          <motion.line
            data-animate="ray"
            data-index="2"
            initial={lineVariants.initial(2)}
            style={{ willChange: "transform, opacity" }}
            x1="62.8541"
            y1="162.459"
            x2="64.5595"
            y2="157.929"
            strokeOpacity="0.5"
            strokeWidth="3.7"
            strokeLinecap="round"
            strokeDasharray="1px 1.1px"
            strokeDashoffset="1.05px"
            pathLength="1"
            className="stroke-[#989898] dark:stroke-[#D6D6D6]"
          />
          <motion.line
            data-animate="ray"
            data-index="1"
            initial={lineVariants.initial(1)}
            style={{ willChange: "transform, opacity" }}
            x1="53.0553"
            y1="161.328"
            x2="52.3227"
            y2="156.544"
            strokeOpacity="0.5"
            strokeWidth="3.7"
            strokeLinecap="round"
            strokeDasharray="1px 1.1px"
            strokeDashoffset="1.05px"
            pathLength="1"
            className="stroke-[#989898] dark:stroke-[#D6D6D6]"
          />
          <motion.line
            data-animate="ray"
            data-index="0"
            initial={lineVariants.initial(0)}
            style={{ willChange: "transform, opacity" }}
            x1="44.047"
            y1="165.362"
            x2="41.0059"
            y2="161.592"
            strokeOpacity="0.5"
            strokeWidth="3.7"
            strokeLinecap="round"
            strokeDasharray="1px 1.1px"
            strokeDashoffset="1.05px"
            pathLength="1"
            className="stroke-[#989898] dark:stroke-[#D6D6D6]"
          />
        </g>
      </motion.g>
    </motion.g>
  );
}
