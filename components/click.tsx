"use client";

import {
  createFloatingAnimation,
  createRotationAnimation,
  fadeScaleVariants,
  UNIVERSAL_DELAY,
} from "@/lib/animation-variants";
import { useAnimateVariant } from "@/lib/hooks/use-animate-variant";
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
  useTransform,
} from "motion/react";
import { useCallback, useEffect, useRef } from "react";

const handPaths = [
  "M58.5431 194.442C60.2401 194.624 61.3091 192.665 60.2391 191.337L49.2671 177.719C48.6804 176.955 48.4158 175.993 48.5299 175.037C48.6439 174.08 49.1275 173.207 49.8773 172.603C50.6271 171.999 51.5835 171.712 52.542 171.804C53.5004 171.896 54.3849 172.359 55.0061 173.095L58.3501 177.245C58.8429 177.857 59.5061 178.309 60.2559 178.544C61.0057 178.779 61.8083 178.786 62.5621 178.564L70.6681 176.181C72.8705 175.533 75.23 175.678 77.3372 176.588C79.4444 177.499 81.1663 179.118 82.2041 181.166L84.9681 186.618C85.7915 188.241 86.0321 190.098 85.6498 191.877C85.2675 193.657 84.2855 195.251 82.8681 196.393L74.6611 203.004C73.7139 203.767 72.604 204.303 71.417 204.569C70.23 204.835 68.9976 204.825 67.8151 204.54L55.1911 201.492C54.2783 201.271 53.4839 200.711 52.9688 199.925C52.4537 199.14 52.2566 198.188 52.4174 197.263C52.5781 196.337 53.0848 195.508 53.8346 194.942C54.5844 194.377 55.5212 194.117 56.4551 194.217L58.5431 194.442Z",
  "M58.6512 193.739C60.3482 193.921 61.1646 192.905 60.0946 191.577L51.6921 181.076C51.1054 180.313 50.7225 179.229 50.8365 178.273C50.9505 177.317 51.4342 176.443 52.1839 175.839C52.9337 175.235 53.8901 174.948 54.8486 175.04C55.8071 175.132 56.6473 175.685 57.2685 176.421L58.2056 177.485C58.6984 178.097 59.3616 178.549 60.1114 178.783C60.8612 179.018 61.6638 179.025 62.4176 178.804L70.5236 176.421C72.726 175.773 75.0855 175.917 77.1927 176.828C79.3 177.738 81.0219 179.358 82.0596 181.406L84.8236 186.858C85.647 188.481 85.8877 190.338 85.5054 192.117C85.1231 193.897 84.141 195.491 82.7236 196.633L74.5166 203.244C73.5694 204.007 72.4595 204.542 71.2725 204.809C70.0855 205.075 68.8531 205.065 67.6706 204.78L55.367 200.571C54.4543 200.35 53.6598 199.79 53.1447 199.004C52.6296 198.219 52.4325 197.267 52.5933 196.342C52.754 195.416 53.2607 194.587 54.0105 194.021C54.7603 193.456 55.6971 193.196 56.631 193.296L58.6512 193.739Z",
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
  const handPath = useTransform(handPathProgress, [0, 1], handPaths);
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
        handPathProgress.set(0);
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
      variants={fadeScaleVariants}
      className="origin-bottom!"
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
