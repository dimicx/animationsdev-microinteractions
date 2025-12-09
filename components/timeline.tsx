import {
  createFloatingAnimation,
  createRotationAnimation,
  fadeScaleVariants,
  UNIVERSAL_DELAY,
} from "@/lib/animation-variants";
import { useHoverTimeout } from "@/lib/use-hover-timeout";
import {
  backgroundVariants,
  timelineContainerVariants,
  timelineOneVariants,
  timelineThreeVariants,
  timelineTwoVariants,
} from "@/lib/variants/timeline-variants";
import { motion, useAnimation } from "motion/react";
import { useEffect, useRef } from "react";

export function Timeline({ isMobile }: { isMobile: boolean }) {
  const controls = useAnimation();
  const containerControls = useAnimation();
  const bufferLeaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasEnteredMainAreaRef = useRef(false);

  const { handleMouseEnter, handleMouseLeave } = useHoverTimeout({
    delay: isMobile ? 0 : UNIVERSAL_DELAY,
    onHoverStart: async () => {
      hasEnteredMainAreaRef.current = true;
      containerControls.start("animate");
      controls.start("animate");
    },
    onHoverEnd: async () => {
      containerControls.start("initial");
      await controls.start("initial");
      controls.start("idle");
    },
  });

  const handleBufferEnter = async () => {
    hasEnteredMainAreaRef.current = false;
    if (bufferLeaveTimeoutRef.current) {
      clearTimeout(bufferLeaveTimeoutRef.current);
      bufferLeaveTimeoutRef.current = null;
    }
    // Reset to initial when cursor enters buffer zone
    containerControls.start("initial");
    await controls.start("initial", {
      duration: 0.15,
      ease: "easeOut",
    });
  };

  const handleBufferLeave = () => {
    // Only trigger timeout if user never entered the main hover area
    if (!hasEnteredMainAreaRef.current) {
      bufferLeaveTimeoutRef.current = setTimeout(() => {
        controls.start("idle");
      }, 100);
    }
  };

  useEffect(() => {
    controls.start("idle");
    containerControls.start("initial");
    return () => {
      if (bufferLeaveTimeoutRef.current) {
        clearTimeout(bufferLeaveTimeoutRef.current);
      }
    };
  }, [controls, containerControls]);

  return (
    <motion.g variants={fadeScaleVariants} className="origin-bottom!">
      {/* Buffer zone to reset the timeline when cursor enters */}
      <rect
        x="150"
        y="-5"
        width="140"
        height="140"
        fill="transparent"
        pointerEvents="all"
        onMouseEnter={handleBufferEnter}
        onMouseLeave={handleBufferLeave}
      />

      <motion.g onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <motion.g
          {...createFloatingAnimation({
            from: -1,
            to: 2.5,
            duration: 2.5,
          })}
        >
          <motion.g
            {...createRotationAnimation({
              from: 0,
              to: 360,
              duration: 90,
            })}
            className="filter-[url(#filter6_i_359_1453)] dark:filter-[url(#filter6_i_368_1560)]"
          >
            <motion.g
              variants={backgroundVariants}
              initial="initial"
              animate={containerControls}
            >
              <path
                d="M216.15 23.607c6.663-4.711 15.869-3.23 20.717 3.333a15 15 0 0 0 9.525 5.869c8.042 1.38 13.504 8.937 12.292 17.006a15 15 0 0 0 2.585 10.885c4.711 6.662 3.23 15.868-3.333 20.717a15 15 0 0 0-5.869 9.524c-1.38 8.042-8.937 13.505-17.006 12.292a15 15 0 0 0-10.885 2.585c-6.662 4.711-15.869 3.23-20.717-3.333a15 15 0 0 0-9.524-5.869c-8.042-1.38-13.505-8.937-12.292-17.006a15 15 0 0 0-2.585-10.885c-4.711-6.662-3.23-15.868 3.333-20.716a15 15 0 0 0 5.869-9.525c1.379-8.042 8.937-13.505 17.006-12.292a15 15 0 0 0 10.884-2.585"
                className="fill-[#F8F8F8] dark:fill-[#252525]"
              ></path>
            </motion.g>
          </motion.g>

          <motion.g
            variants={timelineContainerVariants}
            initial="initial"
            animate={containerControls}
            className="transform-border origin-center"
          >
            {/* center line */}
            <path
              strokeLinecap="round"
              strokeWidth="2.457"
              d="m217.429 81.691 5.204-32.34"
              className="stroke-[#989898] dark:stroke-[#D6D6D6]"
            ></path>

            <g>
              <mask
                id="mask2_197_321"
                style={{ maskType: "alpha" }}
                maskUnits="userSpaceOnUse"
                x="190"
                y="43"
                width="30"
                height="44"
              >
                <rect
                  x="196.709"
                  y="43"
                  width="23"
                  height="40"
                  transform="rotate(9.07478 196.709 43)"
                  fill="#D9D9D9"
                />
              </mask>
              <g mask="url(#mask2_197_321)">
                <motion.line
                  variants={timelineOneVariants}
                  initial="initial"
                  animate={controls}
                  x1="202.907"
                  y1="52.7907"
                  x2="231.287"
                  y2="57.3873"
                  strokeOpacity="1"
                  strokeWidth="6.55"
                  strokeLinecap="round"
                  className="stroke-[#989898] dark:stroke-[#D6D6D6]"
                />
                <motion.line
                  variants={timelineTwoVariants}
                  initial="initial"
                  animate={controls}
                  x1="238.626"
                  y1="68.4911"
                  x2="211.948"
                  y2="64.21"
                  strokeOpacity="1"
                  strokeWidth="6.55"
                  strokeLinecap="round"
                  className="stroke-[#989898] dark:stroke-[#D6D6D6]"
                />
                <motion.line
                  variants={timelineThreeVariants}
                  initial="initial"
                  animate={controls}
                  x1="205.527"
                  y1="73.1088"
                  x2="229.023"
                  y2="76.8985"
                  strokeOpacity="1"
                  strokeWidth="6.5"
                  strokeLinecap="round"
                  className="stroke-[#989898] dark:stroke-[#D6D6D6]"
                />
              </g>
            </g>

            <g>
              <mask
                id="mask1_197_321"
                style={{ maskType: "alpha" }}
                maskUnits="userSpaceOnUse"
                x="220"
                y="46"
                width="30"
                height="45"
              >
                <rect
                  x="226.76"
                  y="46.957"
                  width="23"
                  height="40"
                  transform="rotate(9.07478 226.76 46.957)"
                  fill="#D9D9D9"
                />
              </mask>
              <g mask="url(#mask1_197_321)">
                <motion.line
                  variants={timelineOneVariants}
                  initial="initial"
                  animate={controls}
                  x1="202.907"
                  y1="52.7907"
                  x2="231.287"
                  y2="57.3873"
                  strokeOpacity="0.4"
                  strokeWidth="6.55"
                  strokeLinecap="round"
                  className="stroke-[#989898] dark:stroke-[#D6D6D6]"
                />
                <motion.line
                  variants={timelineTwoVariants}
                  initial="initial"
                  animate={controls}
                  x1="238.626"
                  y1="68.4911"
                  x2="211.948"
                  y2="64.21"
                  strokeOpacity="0.4"
                  strokeWidth="6.55"
                  strokeLinecap="round"
                  className="stroke-[#989898] dark:stroke-[#D6D6D6]"
                />
                <motion.line
                  variants={timelineThreeVariants}
                  initial="initial"
                  animate={controls}
                  x1="205.527"
                  y1="73.1088"
                  x2="229.023"
                  y2="76.8985"
                  strokeOpacity="0.4"
                  strokeWidth="6.5"
                  strokeLinecap="round"
                  className="stroke-[#989898] dark:stroke-[#D6D6D6]"
                />
              </g>
            </g>
          </motion.g>
        </motion.g>
      </motion.g>
    </motion.g>
  );
}
