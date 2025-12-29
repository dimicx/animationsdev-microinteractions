import {
  DARK_MODE_COLORS,
  DEFAULT_DARK_FILL,
  DEFAULT_LIGHT_FILL,
  LIGHT_MODE_COLORS,
  SPRING_CONFIGS,
} from "@/lib/animation-configs";
import {
  createFloatingAnimation,
  createRotationAnimation,
  UNIVERSAL_DELAY,
} from "@/lib/animation-variants";
import {
  bounceAcceleratedXFast,
  bounceEaseFast,
  getSquashStretchScaleXFast,
  getSquashStretchScaleYFast,
  settleSineFast,
} from "@/lib/bounce-physics";
import { useAnimateVariant } from "@/lib/hooks/use-animate-variant";
import { useHoverTimeout } from "@/lib/hooks/use-hover-timeout";
import {
  backgroundVariants,
  ballVariants,
  BOUNCE_DURATION,
  bubblesVariants,
  pathVariants,
  secondaryCircleVariants,
} from "@/lib/variants/bounce-variants";
import {
  AnimationPlaybackControls,
  motion,
  Transition,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useCallback, useEffect, useRef } from "react";

// Ball positions - aligned with path touchpoints
const START_X = 212;
const START_Y = 188;
const END_X = 290;
const END_Y = 228;
const GROUND_Y = 243;
const SECOND_GROUND_Y = 237; // Second bounce hits slightly higher because of the svg rotation
const THIRD_HIT_Y = 234; // Third bounce hits even higher

// Scale factors - control how much each element moves relative to drag
const MAIN_BUBBLE_SCALE = 0.07;
const MEDIUM_BUBBLE_SCALE = 0.12;
const SMALL_BUBBLE_SCALE = 0.15;

export function Bounce({
  isMobile,
  onDragStart,
  onDragEnd: onDragEndCallback,
  isDraggingRef,
}: {
  isMobile: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  isDraggingRef?: React.RefObject<boolean>;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [scope, animateVariant, animate] = useAnimateVariant();

  const forwardCompleted = useRef(false);
  const colorIndexRef = useRef<number | null>(null);
  const animationRef = useRef<AnimationPlaybackControls | null>(null);
  const runningAnimationsRef = useRef<AnimationPlaybackControls[]>([]);
  const forwardCompleteTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  // Stop all running animations to prevent stacking
  const stopAllAnimations = useCallback(() => {
    // Batch stop operations to minimize blocking
    const anims = runningAnimationsRef.current;
    runningAnimationsRef.current = [];

    // Stop animations efficiently - batch if many exist
    if (anims.length > 10 && typeof requestIdleCallback !== "undefined") {
      // Use idle callback for large batches to avoid blocking
      requestIdleCallback(() => {
        anims.forEach((anim) => anim.stop());
      });
    } else {
      // Synchronous stop for small batches (most common case)
      anims.forEach((anim) => anim.stop());
    }

    animationRef.current?.stop();
    animationRef.current = null;
    if (forwardCompleteTimeoutRef.current) {
      clearTimeout(forwardCompleteTimeoutRef.current);
      forwardCompleteTimeoutRef.current = null;
    }
  }, []);

  const animateSpringPathVariant = useCallback(
    (variant: "initial" | "animate" | "click") => {
      const variantMap = {
        "secondary-circle": secondaryCircleVariants,
        background: backgroundVariants,
        ball: ballVariants,
      };

      Object.entries(variantMap).forEach(([selector, variants]) => {
        const variantValue = variants[variant as keyof typeof variants];
        if (variantValue) {
          const anim = animateVariant(
            `[data-animate='${selector}']`,
            variantValue
          );
          if (anim) runningAnimationsRef.current.push(anim);
        }
      });

      // Bubbles (indexed - 2 elements)
      const bubblesV = bubblesVariants[variant as keyof typeof bubblesVariants];
      if (bubblesV) {
        Array.from({ length: 2 }, (_, i) => {
          const resolved =
            typeof bubblesV === "function" ? bubblesV(i) : bubblesV;
          const anim = animateVariant(
            `[data-animate='bubbles'][data-index='${i}']`,
            resolved
          );
          if (anim) runningAnimationsRef.current.push(anim);
        });
      }
    },
    [animateVariant]
  );

  const animatePathVariant = useCallback(
    (variant: keyof typeof pathVariants, overrideTransition?: Transition) => {
      let anim: AnimationPlaybackControls | undefined;
      if (overrideTransition) {
        const variantValue = pathVariants[variant];
        if ("transition" in variantValue) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { transition: _, ...values } = variantValue;
          anim = animate("[data-animate='path']", values, overrideTransition);
        } else {
          anim = animate(
            "[data-animate='path']",
            variantValue,
            overrideTransition
          );
        }
      } else {
        anim = animateVariant("[data-animate='path']", pathVariants[variant]);
      }
      if (anim) runningAnimationsRef.current.push(anim);
    },
    [animateVariant, animate]
  );

  // Animation progress (0 to 1)
  const progress = useMotionValue(0);
  const ballOpacity = useMotionValue(1);

  // Bubble position refs for calculating angles
  const mediumBubbleRef = useRef<SVGGElement>(null);
  const smallBubbleRef = useRef<SVGGElement>(null);

  // Create motion values for the spring-animated positions
  const mainDx = useMotionValue(0);
  const mainDy = useMotionValue(0);

  const smallDx = useMotionValue(0);
  const smallDy = useMotionValue(0);

  const mediumDx = useMotionValue(0);
  const mediumDy = useMotionValue(0);

  // Animate position back to 0 on drag end
  const handleDragEnd = () => {
    // Animate the bubble positions with spring config
    animate(mainDx, 0, SPRING_CONFIGS.dragBounce);
    animate(mainDy, 0, SPRING_CONFIGS.dragBounce);

    animate(smallDx, 0, SPRING_CONFIGS.dragBounce);
    animate(smallDy, 0, SPRING_CONFIGS.dragBounce);

    animate(mediumDx, 0, SPRING_CONFIGS.dragBounce);
    animate(mediumDy, 0, SPRING_CONFIGS.dragBounce);

    onDragEndCallback?.();
  };

  // Transform progress to X offset using accelerated X easing
  const translateX = useTransform(progress, (p) => {
    const easedX = bounceAcceleratedXFast(p);
    const currentX = START_X + easedX * (END_X - START_X);
    return currentX - START_X;
  });

  // Transform progress to Y offset using bounce easing
  const translateY = useTransform(progress, (p) => {
    // After third ground hit (0.77), light bounce UP then settle to END_Y
    let currentY: number;
    if (p > 0.77) {
      const settleT = (p - 0.77) / 0.23;
      const baseY = THIRD_HIT_Y + (END_Y - THIRD_HIT_Y) * settleT;
      currentY = baseY - settleSineFast(settleT) * (1 - settleT * 0.3) * 5;
    } else {
      const easedY = bounceEaseFast(p);

      // Interpolate ground level based on progress
      let groundLevel: number;
      if (p < 0.25) {
        groundLevel = GROUND_Y;
      } else if (p < 0.55) {
        const t = (p - 0.25) / 0.3;
        groundLevel = GROUND_Y + (SECOND_GROUND_Y - GROUND_Y) * t;
      } else {
        const t = (p - 0.55) / 0.22;
        groundLevel = SECOND_GROUND_Y + (THIRD_HIT_Y - SECOND_GROUND_Y) * t;
      }

      currentY = START_Y + easedY * (groundLevel - START_Y);
    }

    return currentY - START_Y;
  });

  // Ball squash/stretch based on progress
  const ballScaleX = useTransform(progress, (p) => {
    if (p === 0) return 1;
    return getSquashStretchScaleXFast(p);
  });

  const ballScaleY = useTransform(progress, (p) => {
    if (p === 0) return 1;
    return getSquashStretchScaleYFast(p);
  });

  // Combine all ball transforms into a single transform string for better performance
  const ballTransform = useMotionTemplate`translate(${translateX}px, ${translateY}px) scale(${ballScaleX}, ${ballScaleY})`;

  const startAnimations = useCallback(() => {
    if (shouldReduceMotion) return;
    animateSpringPathVariant("initial");
    animatePathVariant("initial");
    const anim = animateVariant("[data-animate='ball']", ballVariants.idle);
    if (anim) runningAnimationsRef.current.push(anim);
  }, [
    animateSpringPathVariant,
    animatePathVariant,
    animateVariant,
    shouldReduceMotion,
  ]);

  useEffect(() => {
    startAnimations();
    return stopAllAnimations;
  }, [startAnimations, stopAllAnimations]);

  const { handleMouseEnter, handleMouseLeave } = useHoverTimeout({
    delay: isMobile ? 0 : UNIVERSAL_DELAY,
    disabledRef: isDraggingRef,
    shouldReduceMotion,
    onHoverStart: () => {
      // Stop all existing animations to prevent stacking
      stopAllAnimations();

      // Ensure ball is visible when starting new animation
      ballOpacity.set(1);

      const anim = animateVariant(
        "[data-animate='ball']",
        ballVariants.initial
      );
      if (anim) runningAnimationsRef.current.push(anim);
      animateSpringPathVariant("animate");
      animatePathVariant("animate");
      forwardCompleted.current = false;

      // Reset progress
      progress.set(0);

      // Animate progress from 0 to 1 - the transforms handle the rest!
      animationRef.current = animate(progress, 1, {
        duration: BOUNCE_DURATION,
        ease: "linear", // Linear because bounceEase handles the easing
      });

      // Set forwardCompleted 0.1 seconds before animation actually ends
      forwardCompleteTimeoutRef.current = setTimeout(() => {
        forwardCompleted.current = true;
      }, (BOUNCE_DURATION - 0.2) * 1000);
    },
    onHoverEnd: () => {
      // Stop all existing animations to prevent stacking
      stopAllAnimations();

      const currentProgress = progress.get();
      if (forwardCompleted.current) {
        // Forward animation completed, fade out and reset
        const fadeOut = animate(ballOpacity, 0, {
          duration: 0.1,
          ease: "easeOut",
        });
        runningAnimationsRef.current.push(fadeOut);
        fadeOut.then(() => {
          // Reset position instantly while invisible
          progress.set(0);
          forwardCompleted.current = false;
          // Fade back in
          const fadeIn = animate(ballOpacity, 1, {
            delay: currentProgress * BOUNCE_DURATION * 0.4,
            duration: 0.125,
            ease: "easeOut",
          });
          runningAnimationsRef.current.push(fadeIn);
          animatePathVariant("initial", {
            duration: currentProgress * BOUNCE_DURATION * 0.5,
            ease: bounceAcceleratedXFast,
          });
        });
      } else {
        // Forward animation not completed, return to start
        const returnAnim = animate(progress, 0, {
          duration: currentProgress * BOUNCE_DURATION * 0.9,
          ease: bounceAcceleratedXFast,
        });
        runningAnimationsRef.current.push(returnAnim);
        animatePathVariant("initial", {
          duration: currentProgress * BOUNCE_DURATION * 0.9,
          ease: bounceAcceleratedXFast,
        });
      }

      animateSpringPathVariant("initial");
      const anim = animateVariant("[data-animate='ball']", ballVariants.idle);
      if (anim) runningAnimationsRef.current.push(anim);
    },
  });

  const handleClick = useCallback(() => {
    if (shouldReduceMotion) return;
    if (!forwardCompleted.current) return;
    const anim = animateVariant("[data-animate='ball']", ballVariants.initial);
    if (anim) runningAnimationsRef.current.push(anim);
    animateSpringPathVariant("click");

    const prevIndex = colorIndexRef.current;
    const prevLightColor =
      prevIndex !== null ? LIGHT_MODE_COLORS[prevIndex] : DEFAULT_LIGHT_FILL;
    const prevDarkColor =
      prevIndex !== null ? DARK_MODE_COLORS[prevIndex] : DEFAULT_DARK_FILL;

    colorIndexRef.current =
      prevIndex === null ? 0 : (prevIndex + 1) % LIGHT_MODE_COLORS.length;

    const newLightColor = LIGHT_MODE_COLORS[colorIndexRef.current];
    const newDarkColor = DARK_MODE_COLORS[colorIndexRef.current];

    animate(
      '[data-animate="ball-fill"]',
      {
        "--light-fill": [prevLightColor, newLightColor],
        "--dark-fill": [prevDarkColor, newDarkColor],
      },
      {
        duration: 0.1,
        ease: "easeOut",
      }
    );
  }, [animateSpringPathVariant, shouldReduceMotion, animate, animateVariant]);

  return (
    <motion.g ref={scope} className="origin-bottom-left!">
      {/* small bubbles - point towards pointer */}
      <g>
        {/* medium bubble */}
        <motion.g
          style={{ willChange: "transform" }}
          {...createFloatingAnimation({
            to: -1.5,
            duration: 3,
            shouldReduceMotion,
          })}
        >
          <motion.g
            ref={mediumBubbleRef}
            style={{
              x: mediumDx,
              y: mediumDy,
              transformOrigin: "201.927px 293.495px",
              willChange: "transform",
            }}
          >
            <motion.g
              data-animate="bubbles"
              data-index="0"
              initial={bubblesVariants.initial}
              style={{ willChange: "transform" }}
            >
              <circle
                cx="201.927"
                cy="293.495"
                r="9.417"
                className="fill-[#F8F8F8] dark:fill-[#252525] filter-[url(#filter1_i_359_1453)] dark:filter-[url(#filter1_ii_368_1560)] filter-animated"
              />
            </motion.g>
          </motion.g>
        </motion.g>

        {/* small bubble */}
        <motion.g
          style={{ willChange: "transform" }}
          {...createFloatingAnimation({
            to: -1,
            duration: 2.5,
            delay: 0.5,
            shouldReduceMotion,
          })}
        >
          <motion.g
            ref={smallBubbleRef}
            style={{
              x: smallDx,
              y: smallDy,
              transformOrigin: "184.926px 314.008px",
              willChange: "transform",
            }}
          >
            <motion.g
              data-animate="bubbles"
              data-index="1"
              initial={bubblesVariants.initial}
              style={{ willChange: "transform" }}
            >
              <circle
                cx="184.926"
                cy="314.008"
                r="4.913"
                className="fill-[#F8F8F8] dark:fill-[#252525] filter-[url(#filter2_i_359_1453)] dark:filter-[url(#filter2_ii_368_1560)] filter-animated"
              />
            </motion.g>
          </motion.g>
        </motion.g>

        {/* transparent hit area for dragging */}
        <motion.g
          drag={!shouldReduceMotion}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={1}
          dragTransition={{ bounceStiffness: 500, bounceDamping: 20 }}
          onDragStart={onDragStart}
          onDrag={(_, info) => {
            mainDx.set(info.offset.x * MAIN_BUBBLE_SCALE);
            mainDy.set(info.offset.y * MAIN_BUBBLE_SCALE);
            smallDx.set(info.offset.x * SMALL_BUBBLE_SCALE);
            smallDy.set(info.offset.y * SMALL_BUBBLE_SCALE);
            mediumDx.set(info.offset.x * MEDIUM_BUBBLE_SCALE);
            mediumDy.set(info.offset.y * MEDIUM_BUBBLE_SCALE);
          }}
          onDragEnd={handleDragEnd}
        >
          <circle cx="193" cy="303" r="30" fill="transparent" />
        </motion.g>
      </g>

      <motion.g
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{ willChange: "transform" }}
        {...createFloatingAnimation({
          to: 2,
          duration: 5,
          shouldReduceMotion,
        })}
      >
        <motion.g
          style={{ willChange: "transform" }}
          {...createRotationAnimation({
            to: 2,
            duration: 6,
            delay: 1,
            shouldReduceMotion,
          })}
        >
          <motion.g style={{ x: mainDx, y: mainDy, willChange: "transform" }}>
            <motion.g
              data-animate="background"
              initial={backgroundVariants.initial}
              style={{ willChange: "transform" }}
            >
              <g className="filter-[url(#filter0_i_359_1453)] dark:filter-[url(#filter0_ii_368_1560)] filter-animated">
                <path
                  d="M245.555 146.249c9.49-1.097 18.358 3.212 23.526 10.486 3.964-6.087 10.509-10.43 18.289-11.329 12.356-1.429 23.659 6.309 27.111 17.822 13.829-1.544 26.315 8.383 27.914 22.219a25.17 25.17 0 0 1-3.739 16.399 25.17 25.17 0 0 1 7.38 15.112c1.6 13.834-8.29 26.347-22.105 28-.733 11.998-9.972 22.111-22.329 23.54-7.78.899-15.142-1.835-20.39-6.857-3.372 8.261-11.023 14.481-20.513 15.578-8.436.975-16.381-2.322-21.672-8.176a25.19 25.19 0 0 1-16.205 8.564c-12.356 1.428-23.66-6.31-27.112-17.823-13.827 1.541-26.31-8.385-27.909-22.218a25.17 25.17 0 0 1 3.736-16.398 25.17 25.17 0 0 1-7.381-15.114c-1.6-13.834 8.29-26.347 22.104-28.001.733-11.998 9.974-22.111 22.331-23.539a25.2 25.2 0 0 1 17.73 4.639c3.816-6.907 10.799-11.929 19.234-12.904"
                  className="fill-[#F8F8F8] dark:fill-[#252525]"
                ></path>
              </g>

              <g className="stroke-[#989898] dark:stroke-[#D6D6D6]">
                <motion.path
                  data-animate="path"
                  initial={pathVariants.initial}
                  d="M288.5 224.5C288.5 224.5 285.5 210 277 212C268.5 214 272 236 271 236C270 236 267 201.5 253 201.5C236.611 201.5 242.5 239.5 241.5 239.5C240.892 239.5 240.5 227 233.5 210C230.132 201.821 225 198 225 198"
                  strokeLinecap="round"
                  strokeWidth="4.913"
                  opacity="0.4"
                  strokeDasharray="1px 1.1px"
                  strokeDashoffset="1.05px"
                  pathLength="1"
                  style={{ willChange: "stroke-dashoffset" }}
                />
              </g>
              <g>
                <g className="filter-[url(#filter3_i_359_1453)] dark:filter-[url(#filter3_i_368_1560)] filter-animated">
                  <circle
                    cx="289.63"
                    cy="228.535"
                    r="8.189"
                    transform="rotate(-6.595 289.63 228.535)"
                    className="fill-[#F8F8F8] dark:fill-[#252525]"
                  ></circle>
                </g>
                <motion.circle
                  data-animate="secondary-circle"
                  initial={secondaryCircleVariants.initial}
                  cx="289.63"
                  cy="228.535"
                  r="5.732"
                  strokeLinecap="round"
                  strokeWidth="4.913"
                  transform="rotate(-6.595 289.63 228.535)"
                  className="[--stroke-color:#989898] dark:[--stroke-color:#D6D6D6] [--stroke-highlight:#98989866] dark:[--stroke-highlight:#D6D6D666] [--bg-fill:#F8F8F8] dark:[--bg-fill:#252525]"
                  style={{ willChange: "stroke, opacity" }}
                ></motion.circle>
              </g>

              <motion.g
                data-animate="ball"
                initial={ballVariants.initial}
                style={{ willChange: "transform" }}
              >
                <motion.g
                  style={{
                    opacity: ballOpacity,
                    transform: ballTransform,
                    willChange: "transform, opacity",
                    transformBox: "fill-box",
                  }}
                >
                  <motion.circle
                    cx="212"
                    cy="188"
                    r="8.189"
                    data-animate="ball-fill"
                    className="[--light-fill:#989898] [--dark-fill:#D6D6D6] dark:fill-(--dark-fill) fill-(--light-fill)"
                  />
                </motion.g>
              </motion.g>
            </motion.g>
          </motion.g>
        </motion.g>
      </motion.g>
    </motion.g>
  );
}
