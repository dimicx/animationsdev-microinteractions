import { SPRING_CONFIGS } from "@/lib/animation-configs";
import {
  createFloatingAnimation,
  createRotationAnimation,
  fadeScaleVariants,
  UNIVERSAL_DELAY,
} from "@/lib/animation-variants";
import {
  bounceAcceleratedX,
  bounceEase,
  getSquashStretchAtProgress,
} from "@/lib/bounce-physics";
import { useAnimateVariants } from "@/lib/use-animate-variants";
import { useHoverTimeout } from "@/lib/use-hover-timeout";
import {
  backgroundVariants,
  ballVariants,
  BOUNCE_DURATION,
  bubblesAppearVariants,
  bubblesVariants,
  pathVariants,
  secondaryCircleVariants,
} from "@/lib/variants/spring-path-variants";
import {
  AnimationPlaybackControls,
  motion,
  Transition,
  useAnimate,
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

// Scale factors - control how much each element moves relative to drag
const MAIN_BUBBLE_SCALE = 0.07;
const MEDIUM_BUBBLE_SCALE = 0.12;
const SMALL_BUBBLE_SCALE = 0.15;

export function SpringPath({
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
  const [scope, animate] = useAnimate();
  const { animateVariants } = useAnimateVariants(animate);

  const forwardCompleted = useRef(false);
  const animationRef = useRef<AnimationPlaybackControls | null>(null);
  const forwardCompleteTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const animateSpringPathVariant = useCallback(
    (variant: "initial" | "animate" | "click") => {
      const animationConfigs = [
        { selector: "bubbles", variants: bubblesVariants, count: 2 },
        { selector: "secondary-circle", variants: secondaryCircleVariants },
        { selector: "background", variants: backgroundVariants },
      ];

      const animations = animationConfigs.flatMap((config) =>
        animateVariants(
          `[data-animate='${config.selector}']`,
          config.variants,
          variant,
          config.count
        )
      );

      return Promise.all(animations);
    },
    [animateVariants]
  );

  const animateBallVariant = useCallback(
    (variant: keyof typeof ballVariants) => {
      animateVariants("[data-animate='ball']", ballVariants, variant);
    },
    [animateVariants]
  );

  const animatePathVariant = useCallback(
    (variant: keyof typeof pathVariants, overrideTransition?: Transition) => {
      if (overrideTransition) {
        const { ...values } = pathVariants[variant];
        animate("[data-animate='path']", values, overrideTransition);
      } else {
        animateVariants("[data-animate='path']", pathVariants, variant);
      }
    },
    [animateVariants, animate]
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
    if (p >= 0.55) {
      const liftT = (p - 0.55) / (0.77 - 0.55); // 0 to 1 during second bounce
      const groundLevel =
        SECOND_GROUND_Y + (THIRD_HIT_Y - SECOND_GROUND_Y) * liftT;
      return START_Y + easedY * (groundLevel - START_Y);
    }

    // First bounce (between 0.25 and 0.55), transition from first to second ground level
    if (p >= 0.25) {
      const t = (p - 0.25) / (0.55 - 0.25);
      const groundLevel = GROUND_Y + (SECOND_GROUND_Y - GROUND_Y) * t;
      return START_Y + easedY * (groundLevel - START_Y);
    }

    // First drop uses GROUND_Y
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
    if (shouldReduceMotion) return;
    animateSpringPathVariant("initial");
    animatePathVariant("initial");
    animateBallVariant("idle");
  }, [
    animateSpringPathVariant,
    animatePathVariant,
    animateBallVariant,
    shouldReduceMotion,
  ]);

  useEffect(() => {
    startAnimations();

    return () => {
      animationRef.current?.stop();
      if (forwardCompleteTimeoutRef.current) {
        clearTimeout(forwardCompleteTimeoutRef.current);
      }
    };
  }, [startAnimations]);

  const { handleMouseEnter, handleMouseLeave } = useHoverTimeout({
    delay: isMobile ? 0 : UNIVERSAL_DELAY,
    disabledRef: isDraggingRef,
    shouldReduceMotion,
    onHoverStart: () => {
      // Stop any existing animation
      animationRef.current?.stop();
      if (forwardCompleteTimeoutRef.current) {
        clearTimeout(forwardCompleteTimeoutRef.current);
      }

      animateBallVariant("initial");
      animateSpringPathVariant("animate");
      animatePathVariant("animate");
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
    onHoverEnd: () => {
      // Stop ongoing animation
      animationRef.current?.stop();
      if (forwardCompleteTimeoutRef.current) {
        clearTimeout(forwardCompleteTimeoutRef.current);
      }
      const currentProgress = progress.get();
      if (forwardCompleted.current) {
        // Forward animation completed, fade out and reset
        animate(ballOpacity, 0, {
          duration: 0.1,
          ease: "easeOut",
        }).then(() => {
          // Reset position instantly while invisible
          progress.set(0);
          forwardCompleted.current = false;
          // Fade back in
          animate(ballOpacity, 1, {
            delay: currentProgress * BOUNCE_DURATION * 0.4,
            duration: 0.125,
            ease: "easeOut",
          });
          animatePathVariant("initial", {
            pathLength: {
              duration: currentProgress * BOUNCE_DURATION * 0.5,
              ease: bounceAcceleratedX,
            },
            strokeOpacity: {
              duration: 0,
            },
          });
        });
      } else {
        // Forward animation not completed, return to start
        animate(progress, 0, {
          duration: currentProgress * BOUNCE_DURATION * 0.9,
          ease: bounceAcceleratedX,
        });
        animatePathVariant("initial", {
          pathLength: {
            duration: currentProgress * BOUNCE_DURATION * 0.9,
            ease: bounceAcceleratedX,
          },
          strokeOpacity: {
            duration: 0,
          },
        });
      }

      animateSpringPathVariant("initial");
      animateBallVariant("idle");
    },
  });

  const handleClick = useCallback(() => {
    if (shouldReduceMotion) return;
    if (!forwardCompleted.current) return;
    animateSpringPathVariant("click");
  }, [animateSpringPathVariant, shouldReduceMotion]);

  return (
    <motion.g
      ref={scope}
      variants={fadeScaleVariants}
      className="origin-bottom-left!"
    >
      {/* small bubbles - point towards pointer */}
      <motion.g
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.225,
            },
          },
        }}
        initial="hidden"
        animate="visible"
      >
        {/* Medium bubble with scaled movement and rotation */}
        <motion.g
          ref={mediumBubbleRef}
          style={{
            x: mediumDx,
            y: mediumDy,
            transformOrigin: "201.927px 293.495px",
          }}
        >
          <motion.g variants={bubblesAppearVariants}>
            <motion.g
              data-animate="bubbles"
              data-index="0"
              initial={bubblesVariants.initial(0)}
            >
              <circle
                cx="201.927"
                cy="293.495"
                r="9.417"
                className="fill-[#F8F8F8] dark:fill-[#252525] filter-[url(#filter1_i_359_1453)] dark:filter-[url(#filter1_ii_368_1560)]"
              />
            </motion.g>
          </motion.g>
        </motion.g>

        {/* Small bubble with scaled movement and rotation */}
        <motion.g
          ref={smallBubbleRef}
          style={{
            x: smallDx,
            y: smallDy,
            transformOrigin: "184.926px 314.008px",
          }}
        >
          <motion.g variants={bubblesAppearVariants}>
            <motion.g
              data-animate="bubbles"
              data-index="1"
              initial={bubblesVariants.initial(1)}
            >
              <circle
                cx="184.926"
                cy="314.008"
                r="4.913"
                className="fill-[#F8F8F8] dark:fill-[#252525] filter-[url(#filter2_i_359_1453)] dark:filter-[url(#filter2_ii_368_1560)]"
              />
            </motion.g>
          </motion.g>
        </motion.g>

        {/* Transparent drag group */}
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
          {/* Transparent hit area for dragging */}
          <circle cx="193" cy="303" r="30" fill="transparent" />
        </motion.g>
      </motion.g>

      <motion.g
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        {...createFloatingAnimation({
          from: -1,
          to: 2,
          duration: 5,
          shouldReduceMotion,
        })}
      >
        {/* main bubble */}
        <motion.g style={{ x: mainDx, y: mainDy }}>
          <motion.g
            data-animate="background"
            initial={backgroundVariants.initial}
          >
            <motion.g
              {...createRotationAnimation({
                from: -1,
                to: 2,
                duration: 6,
                delay: 1,
                shouldReduceMotion,
              })}
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
                data-animate="path"
                initial={pathVariants.initial}
                d="M288.5 224.5C288.5 224.5 285.5 210 277 212C268.5 214 272 236 271 236C270 236 267 201.5 253 201.5C236.611 201.5 242.5 239.5 241.5 239.5C240.892 239.5 240.5 227 233.5 210C230.132 201.821 225 198 225 198"
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
                data-animate="secondary-circle"
                initial={secondaryCircleVariants.initial}
                cx="289.63"
                cy="228.535"
                r="5.732"
                strokeLinecap="round"
                strokeWidth="4.913"
                transform="rotate(-6.595 289.63 228.535)"
                className="[--stroke-color:#989898] dark:[--stroke-color:#D6D6D6] [--stroke-highlight:#98989866] dark:[--stroke-highlight:#D6D6D666] [--bg-fill:#F8F8F8] dark:[--bg-fill:#252525]"
              ></motion.circle>
            </g>

            <motion.g data-animate="ball" initial={ballVariants.initial}>
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
      </motion.g>
    </motion.g>
  );
}
