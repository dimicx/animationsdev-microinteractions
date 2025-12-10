import { SPRING_CONFIGS } from "@/lib/animation-configs";
import {
  createFloatingAnimation,
  createRotationAnimation,
  fadeScaleVariants,
  UNIVERSAL_DELAY,
} from "@/lib/animation-variants";
import { useHoverTimeout } from "@/lib/use-hover-timeout";
import { useMobileTap } from "@/lib/use-mobile-tap";
import {
  backgroundVariants,
  bellVariants,
  clockAndBellsVariants,
  clockVariants,
  idleBellsVariants,
} from "@/lib/variants/clock-variants";
import { motion, useAnimation } from "motion/react";
import { useCallback, useEffect, useRef } from "react";

const HOUR_HAND_ORIGIN = "543.876px 186.539px";
const MINUTE_HAND_ORIGIN = "543.876px 186.544px";
const INITIAL_HOUR_ROTATION = 120;

export function Clock({
  isMobile,
  isDraggingRef,
}: {
  isMobile: boolean;
  isDraggingRef?: React.RefObject<boolean>;
}) {
  const controls = useAnimation();
  const idleControls = useAnimation();
  const hourHandControls = useAnimation();
  const minuteHandControls = useAnimation();
  const backgroundControls = useAnimation();
  const scaleClickControls = useAnimation();
  const hasClicked = useRef(false);
  const hasClickedOnce = useRef(false);
  const {
    isReadyRef: isReadyForClickRef,
    markTapped,
    reset: resetMobileTap,
  } = useMobileTap({ isMobile });

  const startAnimations = useCallback(() => {
    controls.start("initial");
    idleControls.start("animate");
    hourHandControls.set({
      transform: `rotate(${INITIAL_HOUR_ROTATION}deg)`,
      transformOrigin: HOUR_HAND_ORIGIN,
      transformBox: "view-box",
    });
    minuteHandControls.set({
      transform: `rotate(0deg)`,
      transformOrigin: MINUTE_HAND_ORIGIN,
      transformBox: "view-box",
    });
  }, [idleControls, controls, hourHandControls, minuteHandControls]);

  useEffect(() => {
    startAnimations();
  }, [startAnimations]);

  const { handleMouseEnter, handleMouseLeave } = useHoverTimeout({
    delay: isMobile ? 0 : UNIVERSAL_DELAY,
    disabledRef: isDraggingRef,
    onHoverStart: async () => {
      await idleControls.start("initial", { duration: 0.05 });
      backgroundControls.start("animate");
      controls.start("animate");
    },
    onHoverEnd: async () => {
      hasClicked.current = false;
      resetMobileTap();
      hasClickedOnce.current = false;

      hourHandControls.start({
        transform: `rotate(${INITIAL_HOUR_ROTATION}deg)`,
        transformOrigin: HOUR_HAND_ORIGIN,
        transformBox: "view-box",
        transition: SPRING_CONFIGS.clockHand,
      });
      minuteHandControls.start({
        transform: `rotate(0deg)`,
        transformOrigin: MINUTE_HAND_ORIGIN,
        transformBox: "view-box",
        transition: SPRING_CONFIGS.clockHand,
      });

      if (hasClicked.current) return;
      backgroundControls.start("initial");
      scaleClickControls.start("initial");
      await controls.start("initial");
      idleControls.start("animate");
    },
  });

  const handleClockClick = useCallback(() => {
    // On mobile: first tap should only trigger hover, second tap triggers clock animation
    if (!isReadyForClickRef.current) {
      markTapped();
      return;
    }
    if (!hasClickedOnce.current) {
      hasClickedOnce.current = true;
      hasClicked.current = true;

      backgroundControls.start("click");
      scaleClickControls.start("click");
      controls.start("initial").then(() => {
        idleControls.start("animate");
      });

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

      hourHandControls.start({
        transform: `rotate(${hourWithSpins}deg)`,
        transformOrigin: HOUR_HAND_ORIGIN,
        transformBox: "view-box",
        transition: SPRING_CONFIGS.clockHand,
      });

      minuteHandControls.start({
        transform: `rotate(${minuteWithSpins}deg)`,
        transformOrigin: MINUTE_HAND_ORIGIN,
        transformBox: "view-box",
        transition: SPRING_CONFIGS.clockHand,
      });
    } else {
      backgroundControls.start("click");
      scaleClickControls.start("scale-click");
    }
  }, [
    controls,
    idleControls,
    hourHandControls,
    minuteHandControls,
    markTapped,
    isReadyForClickRef,
    backgroundControls,
    scaleClickControls,
  ]);

  return (
    <motion.g
      variants={fadeScaleVariants}
      className="origin-bottom-right!"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClockClick}
    >
      <motion.g
        {...createRotationAnimation({
          from: -1,
          to: 1,
          duration: 4,
        })}
      >
        <motion.g
          variants={backgroundVariants}
          initial="initial"
          animate={backgroundControls}
        >
          <motion.g
            {...createFloatingAnimation({
              from: -1.5,
              to: 1.5,
              duration: 3,
            })}
            className="filter-[url(#filter7_i_359_1453)] dark:filter-[url(#filter7_i_368_1560)]"
          >
            <path
              d="M553.22 118.392c42.396 5.809 72.84 39.157 68 74.487-1.536 11.213-6.442 21.277-13.78 29.607-6.142 6.973-8.217 17.405-2.728 24.902l1.828 2.496a6.7 6.7 0 0 1 1.082 2.304c1.428 5.683-4.672 10.293-9.749 7.368l-20.818-11.989a16.37 16.37 0 0 0-9.304-2.147l-2.455.17c-9.352 1.811-19.359 2.145-29.605.741-42.395-5.809-72.839-39.158-67.998-74.487s43.132-59.26 85.527-53.452"
              className="fill-[#F8F8F8] dark:fill-[#252525]"
            ></path>
          </motion.g>
        </motion.g>
      </motion.g>

      <motion.g
        variants={clockAndBellsVariants}
        initial="initial"
        animate={scaleClickControls}
        style={{
          transformOrigin: "543.879px 186.54px",
          transformBox: "view-box",
        }}
      >
        {/* clock */}
        <motion.g variants={clockVariants} initial="initial" animate={controls}>
          <circle
            cx="543.879"
            cy="186.54"
            r="22.93"
            className="fill-[#989898] dark:fill-[#D6D6D6]"
          />
          {/* minute hand */}
          <motion.g
            style={{
              transformBox: "view-box",
              transformOrigin: MINUTE_HAND_ORIGIN,
            }}
            animate={minuteHandControls}
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
            style={{
              transformBox: "view-box",
              transformOrigin: HOUR_HAND_ORIGIN,
              transform: `rotate(${INITIAL_HOUR_ROTATION}deg)`,
            }}
            animate={hourHandControls}
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
    </motion.g>
  );
}
