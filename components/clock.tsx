import { SPRING_CONFIGS } from "@/lib/animation-configs";
import {
  createFloatingAnimation,
  createRotationAnimation,
  UNIVERSAL_DELAY,
} from "@/lib/animation-variants";
import { useAnimateVariant } from "@/lib/hooks/use-animate-variant";
import { useHoverTimeout } from "@/lib/hooks/use-hover-timeout";
import { useMobileTap } from "@/lib/hooks/use-mobile-tap";
import {
  backgroundVariants,
  bellsVariants,
  bellVariants,
  clockAndBellsVariants,
  clockVariants,
} from "@/lib/variants/clock-variants";
import { motion, Transition, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef } from "react";

const CLOCK_CENTER = "543.427px 186.901px";
const INITIAL_HOUR_ROTATION = 120;

export function Clock({
  isMobile,
  isDraggingRef,
}: {
  isMobile: boolean;
  isDraggingRef?: React.RefObject<boolean>;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [scope, animateVariant, animate] = useAnimateVariant();
  const hasClickedRef = useRef(false);
  const {
    isReadyRef: isReadyForClickRef,
    markTapped,
    reset: resetMobileTap,
  } = useMobileTap({ isMobile });
  const isFirstIdleRef = useRef(true);

  const animateClockVariant = useCallback(
    (variant: "initial" | "animate") => {
      const animations = [
        animateVariant("[data-animate='clock']", clockVariants[variant]),
        ...Array.from({ length: 2 }, (_, i) =>
          animateVariant(
            `[data-animate="bell"][data-index='${i}']`,
            typeof bellVariants[variant] === "function"
              ? bellVariants[variant](i)
              : bellVariants[variant]
          )
        ),
      ].filter(Boolean);

      return Promise.all(animations);
    },
    [animateVariant]
  );

  const animateBellsVariant = useCallback(
    (variant: keyof typeof bellsVariants) => {
      const initialDelay = variant === "idle" && isFirstIdleRef.current;

      const bellsVariant = bellsVariants[variant];
      const resolved =
        typeof bellsVariant === "function"
          ? bellsVariant(initialDelay)
          : bellsVariant;

      if (variant === "idle") {
        isFirstIdleRef.current = false;
      }
      return animateVariant("[data-animate='bells']", resolved);
    },
    [animateVariant]
  );

  const animateHourHand = useCallback(
    (rotation: number, transition: Transition = SPRING_CONFIGS.clockHand) => {
      return animate(
        "[data-animate='hour-hand']",
        {
          transform: `rotate(${rotation}deg)`,
        },
        transition
      );
    },
    [animate]
  );

  const animateMinuteHand = useCallback(
    (rotation: number, transition: Transition = SPRING_CONFIGS.clockHand) => {
      return animate(
        "[data-animate='minute-hand']",
        {
          transform: `rotate(${rotation}deg)`,
        },
        transition
      );
    },
    [animate]
  );

  const startAnimations = useCallback(() => {
    animate(
      "[data-animate='clock-and-bells']",
      {
        transform: "rotate(0deg) scale(1)",
      },
      { duration: 0 }
    );
    animateHourHand(INITIAL_HOUR_ROTATION, { duration: 0 });
    if (shouldReduceMotion) return;
    animateBellsVariant("idle");
    animateMinuteHand(0, { duration: 0 });
  }, [
    animateBellsVariant,
    animate,
    animateHourHand,
    animateMinuteHand,
    shouldReduceMotion,
  ]);

  useEffect(() => {
    startAnimations();
  }, [startAnimations]);

  const { handleMouseEnter, handleMouseLeave } = useHoverTimeout({
    delay: isMobile ? 0 : UNIVERSAL_DELAY,
    disabledRef: isDraggingRef,
    shouldReduceMotion,
    onHoverStart: () => {
      animateBellsVariant("initial");
      animateVariant("[data-animate='background']", backgroundVariants.animate);
      animateClockVariant("animate");
    },
    onHoverEnd: () => {
      hasClickedRef.current = false;
      resetMobileTap();

      animateHourHand(INITIAL_HOUR_ROTATION);
      animateMinuteHand(0);

      animateVariant("[data-animate='background']", backgroundVariants.initial);
      animateVariant(
        "[data-animate='clock-and-bells']",
        clockAndBellsVariants.initial
      );
      animateClockVariant("initial");
      animateBellsVariant("idle");
    },
  });

  const handleClockClick = useCallback(() => {
    if (shouldReduceMotion) return;
    if (!isReadyForClickRef.current) {
      markTapped();
      return;
    }

    if (!hasClickedRef.current) {
      hasClickedRef.current = true;

      animateVariant("[data-animate='background']", backgroundVariants.click);
      animateVariant(
        "[data-animate='clock-and-bells']",
        clockAndBellsVariants.click
      );
      animateClockVariant("initial");
      animateBellsVariant("idle");

      const now = new Date();
      const hours = now.getHours() % 12;
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      // Calculate rotations (0 degrees is at 12 o'clock position)
      // Hour hand: moves 30 degrees per hour (360/12) plus 0.5 degrees per minute
      const newHourRotation = hours * 30 + minutes * 0.5;

      // Minute hand: moves 6 degrees per minute (360/60)
      const newMinuteRotation = minutes * 6 + seconds * 0.1;

      const hourSpins = 1;
      const minuteSpins = 2;
      const hourWithSpins = 360 * hourSpins + newHourRotation;
      const minuteWithSpins = 360 * minuteSpins + newMinuteRotation;

      animateHourHand(hourWithSpins);
      animateMinuteHand(minuteWithSpins);
    } else {
      animateVariant(
        "[data-animate='background']",
        backgroundVariants["scale-click"]
      );
      animateVariant(
        "[data-animate='clock-and-bells']",
        clockAndBellsVariants["scale-click"]
      );
    }
  }, [
    animateClockVariant,
    animateBellsVariant,
    animateHourHand,
    animateMinuteHand,
    markTapped,
    isReadyForClickRef,
    animateVariant,
    shouldReduceMotion,
  ]);

  return (
    <motion.g
      ref={scope}
      className="origin-bottom-right!"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClockClick}
    >
      <motion.g
        style={{ willChange: "transform" }}
        {...createFloatingAnimation({
          to: 1.5,
          duration: 3,
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
              to: 1,
              duration: 4,
              shouldReduceMotion,
            })}
            className="filter-[url(#filter7_i_359_1453)] dark:filter-[url(#filter7_i_368_1560)] filter-animated"
          >
            <path
              d="M553.22 118.392c42.396 5.809 72.84 39.157 68 74.487-1.536 11.213-6.442 21.277-13.78 29.607-6.142 6.973-8.217 17.405-2.728 24.902l1.828 2.496a6.7 6.7 0 0 1 1.082 2.304c1.428 5.683-4.672 10.293-9.749 7.368l-20.818-11.989a16.37 16.37 0 0 0-9.304-2.147l-2.455.17c-9.352 1.811-19.359 2.145-29.605.741-42.395-5.809-72.839-39.158-67.998-74.487s43.132-59.26 85.527-53.452"
              className="fill-[#F8F8F8] dark:fill-[#252525]"
            ></path>
          </motion.g>
        </motion.g>

        <motion.g
          data-animate="clock-and-bells"
          initial={clockAndBellsVariants.initial}
          style={{ willChange: "transform" }}
        >
          {/* clock */}
          <motion.g
            data-animate="clock"
            initial={clockVariants.initial}
            style={{ willChange: "transform" }}
          >
            <circle
              cx="543.879"
              cy="186.54"
              r="22.93"
              className="fill-[#989898] dark:fill-[#D6D6D6]"
            />
            {/* minute hand */}
            <motion.g
              data-animate="minute-hand"
              initial={{
                transform: `rotate(0deg)`,
                transformOrigin: "0% 100%",
                transformBox: "fill-box",
              }}
              style={{ willChange: "transform" }}
            >
              <line
                x1="543.876"
                y1="186.584"
                x2="545.623"
                y2="175.314"
                strokeWidth="4.9"
                strokeLinecap="round"
                className="stroke-[#F8F8F8] dark:stroke-[#252525]"
              />
            </motion.g>
            {/* hour hand */}
            <motion.g
              data-animate="hour-hand"
              initial={{
                transform: `rotate(${INITIAL_HOUR_ROTATION}deg)`,
                transformOrigin: "0% 100%",
                transformBox: "fill-box",
              }}
              style={{ willChange: "transform" }}
            >
              <line
                x1="543.876"
                y1="186.578"
                x2="545.147"
                y2="178.376"
                strokeWidth="4.9"
                strokeLinecap="round"
                className="stroke-[#F8F8F8] dark:stroke-[#252525]"
              />
            </motion.g>
          </motion.g>

          {/* bells */}
          <motion.g
            data-animate="bells"
            initial={bellsVariants.initial}
            style={{
              transformOrigin: CLOCK_CENTER,
              transformBox: "fill-box",
              willChange: "transform",
            }}
          >
            <motion.g
              data-animate="bell"
              data-index="0"
              style={{ willChange: "transform" }}
            >
              <path
                d="M553.071 151.434a3.848 3.848 0 0 1 2.478 6.222l-1.993 2.482a1.7 1.7 0 0 1-1.826.544 27 27 0 0 0-4.182-.912 27 27 0 0 0-4.275-.247 1.7 1.7 0 0 1-1.612-1.015l-1.252-2.926a3.847 3.847 0 0 1 4.059-5.326z"
                opacity="0.4"
                className="fill-[#989898] dark:fill-[#D6D6D6]"
              ></path>
            </motion.g>
            <motion.g
              data-animate="bell"
              data-index="1"
              style={{ willChange: "transform" }}
            >
              <path
                d="M570.169 166.997a3.771 3.771 0 0 1-2.773 6.044.16.16 0 0 1-.149-.081 27.3 27.3 0 0 0-4-5.269.16.16 0 0 1-.036-.164 3.77 3.77 0 0 1 6.567-1.045z"
                opacity="0.45"
                className="fill-[#989898] dark:fill-[#D6D6D6]"
              ></path>
            </motion.g>
          </motion.g>
        </motion.g>
      </motion.g>
    </motion.g>
  );
}
