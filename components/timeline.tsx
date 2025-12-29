import {
  createFloatingAnimation,
  createRotationAnimation,
  UNIVERSAL_DELAY,
} from "@/lib/animation-variants";
import { useAnimateVariant } from "@/lib/hooks/use-animate-variant";
import { useHoverTimeout } from "@/lib/hooks/use-hover-timeout";
import {
  scaleVariants,
  timelineContainerVariants,
  timelineOneVariants,
  timelineThreeVariants,
  timelineTwoVariants,
} from "@/lib/variants/timeline-variants";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useCallback, useEffect, useRef } from "react";

// SVG coordinate bounds for the mask area (accounting for rotation)
const MASK_MIN_X = 196; // Left edge of mask area
const MASK_MAX_X = 250; // Right edge of mask area
// Center line position adjusted for symmetric gap
const MASK_CENTER_X = 223.65;

export function Timeline({
  isMobile,
  isDraggingRef,
}: {
  isMobile: boolean;
  isDraggingRef?: React.RefObject<boolean>;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [scope, animateVariant] = useAnimateVariant();
  const hasEnteredMainAreaRef = useRef(false);
  const svgRef = useRef<SVGGElement>(null);
  const hasAnimationCompletedRef = useRef(false);

  const animateTimelineVariant = useCallback(
    (variant: "initial" | "animate" | "click" | "idle") => {
      const variantMap = {
        scale: scaleVariants,
        "timeline-container": timelineContainerVariants,
        "timeline-one": timelineOneVariants,
        "timeline-two": timelineTwoVariants,
        "timeline-three": timelineThreeVariants,
      };

      const animations = Object.entries(variantMap)
        .map(([selector, variants]) =>
          animateVariant(
            `[data-animate='${selector}']`,
            variants[variant as keyof typeof variants]
          )
        )
        .filter(Boolean);

      return Promise.all(animations);
    },
    [animateVariant]
  );

  const animateContainerVariant = useCallback(
    (variant: "initial" | "animate" | "click") => {
      animateVariant("[data-animate='scale']", scaleVariants[variant]);
      animateVariant(
        "[data-animate='timeline-container']",
        timelineContainerVariants[variant]
      );
    },
    [animateVariant]
  );

  // Gap between masks and center line (half on each side)
  const MASK_GAP = 3.5;
  // Offset to center cursor on line (half stroke width + gap)
  const CURSOR_OFFSET = 2.457 / 2 + 3;

  // Motion value for the mask split position (where left mask ends and right mask begins)
  const rawMaskX = useMotionValue(MASK_CENTER_X);
  const maskX = useSpring(rawMaskX, { stiffness: 500, damping: 40 });

  // Left mask: width from left edge (185) to cursor position minus gap
  const leftMaskWidth = useTransform(maskX, (x) =>
    Math.max(0, x - 185 - MASK_GAP)
  );
  // Right mask: starts at cursor plus gap, extends to right edge (265)
  const rightMaskX = useTransform(maskX, (x) => x + MASK_GAP);
  const rightMaskWidth = useTransform(maskX, (x) =>
    Math.max(0, 265 - x - MASK_GAP)
  );
  // Center line offset from default center position
  const centerLineX = useTransform(maskX, (x) => x - MASK_CENTER_X);
  const centerLineY = useTransform(maskX, (x) => (x - MASK_CENTER_X) * 0.02);

  // Convert mouse position to SVG coordinates
  const getMouseSVGPosition = useCallback((e: React.MouseEvent) => {
    const svg = svgRef.current?.ownerSVGElement;
    if (!svg) return MASK_CENTER_X;

    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;

    const ctm = svg.getScreenCTM();
    if (!ctm) return MASK_CENTER_X;

    const svgPoint = point.matrixTransform(ctm.inverse());
    return svgPoint.x;
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!hasAnimationCompletedRef.current) return;
      const svgX = getMouseSVGPosition(e);
      // Offset to center cursor on line, then clamp to mask bounds
      const offsetX = svgX + CURSOR_OFFSET;
      const clampedX = Math.max(MASK_MIN_X, Math.min(MASK_MAX_X, offsetX));
      rawMaskX.set(clampedX);
    },
    [getMouseSVGPosition, rawMaskX, CURSOR_OFFSET]
  );

  const handleMouseLeaveTimeline = useCallback(() => {
    // Reset to center when mouse leaves
    rawMaskX.set(MASK_CENTER_X);
  }, [rawMaskX]);

  const { handleMouseEnter, handleMouseLeave } = useHoverTimeout({
    delay: isMobile ? 0 : UNIVERSAL_DELAY,
    disabledRef: isDraggingRef,
    shouldReduceMotion,
    onHoverStart: async () => {
      hasEnteredMainAreaRef.current = true;
      animateContainerVariant("animate");
      animateTimelineVariant("initial");
      await animateTimelineVariant("animate");
      hasAnimationCompletedRef.current = true;
    },
    onHoverEnd: async () => {
      hasAnimationCompletedRef.current = false;
      animateContainerVariant("initial");
      await animateTimelineVariant("initial");
      animateTimelineVariant("idle");
    },
  });

  const handleClick = useCallback(async () => {
    if (shouldReduceMotion) return;
    if (!hasAnimationCompletedRef.current) return;
    animateTimelineVariant("click");
    animateContainerVariant("click");
  }, [animateTimelineVariant, animateContainerVariant, shouldReduceMotion]);

  const handleBufferEnter = useCallback(() => {
    if (hasEnteredMainAreaRef.current) return;
    animateTimelineVariant("initial");
  }, [animateTimelineVariant]);

  const handleBufferLeave = useCallback(() => {
    if (!hasEnteredMainAreaRef.current) return;
    hasEnteredMainAreaRef.current = false;
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return;
    animateTimelineVariant("idle");
    animateContainerVariant("initial");
  }, [animateTimelineVariant, animateContainerVariant, shouldReduceMotion]);

  return (
    <motion.g ref={scope} className="origin-bottom!">
      {/* buffer zone to reset timelines early */}
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

      <motion.g
        ref={svgRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => {
          handleMouseLeave();
          handleMouseLeaveTimeline();
        }}
        onMouseMove={!isMobile ? handleMouseMove : undefined}
        onClick={handleClick}
      >
        <motion.g
          style={{ willChange: "transform" }}
          {...createFloatingAnimation({
            to: 2.5,
            duration: 2.5,
            shouldReduceMotion,
          })}
        >
          <motion.g
            data-animate="scale"
            initial={scaleVariants.initial}
            style={{ willChange: "transform" }}
          >
            <motion.g
              style={{ willChange: "transform" }}
              {...createRotationAnimation({
                to: 360,
                duration: 90,
                shouldReduceMotion,
              })}
              className="filter-[url(#filter6_i_359_1453)] dark:filter-[url(#filter6_i_368_1560)] filter-animated"
            >
              <path
                d="M216.15 23.607c6.663-4.711 15.869-3.23 20.717 3.333a15 15 0 0 0 9.525 5.869c8.042 1.38 13.504 8.937 12.292 17.006a15 15 0 0 0 2.585 10.885c4.711 6.662 3.23 15.868-3.333 20.717a15 15 0 0 0-5.869 9.524c-1.38 8.042-8.937 13.505-17.006 12.292a15 15 0 0 0-10.885 2.585c-6.662 4.711-15.869 3.23-20.717-3.333a15 15 0 0 0-9.524-5.869c-8.042-1.38-13.505-8.937-12.292-17.006a15 15 0 0 0-2.585-10.885c-4.711-6.662-3.23-15.868 3.333-20.716a15 15 0 0 0 5.869-9.525c1.379-8.042 8.937-13.505 17.006-12.292a15 15 0 0 0 10.884-2.585"
                className="fill-[#F8F8F8] dark:fill-[#252525]"
              ></path>
            </motion.g>
          </motion.g>

          <motion.g
            data-animate="scale"
            initial={scaleVariants.initial}
            style={{ willChange: "transform" }}
          >
            {/* center line - isolated from container to prevent bounding box issues */}
            <motion.g
              data-animate="timeline-container"
              initial={timelineContainerVariants.initial}
              style={{ willChange: "transform" }}
            >
              <motion.path
                strokeLinecap="round"
                strokeWidth="2.457"
                d="m217.429 81.691 5.204-32.34"
                className="stroke-[#989898] dark:stroke-[#D6D6D6]"
                style={{
                  x: centerLineX,
                  y: centerLineY,
                  willChange: "transform",
                }}
              />
            </motion.g>
          </motion.g>

          <motion.g
            data-animate="timeline-container"
            initial={timelineContainerVariants.initial}
            className="transform-view origin-center"
            style={{ willChange: "transform" }}
          >
            <g>
              <mask
                id="mask2_197_321"
                style={{
                  maskType: "alpha",
                }}
                maskUnits="userSpaceOnUse"
                x="185"
                y="40"
                width="80"
                height="60"
              >
                <g
                  style={{
                    transform: "rotate(9deg)",
                    transformOrigin: "185px 40px",
                    transformBox: "view-box",
                  }}
                >
                  {/* Left mask - reveals full opacity lines from left to cursor position */}
                  <motion.rect
                    x={185}
                    y={40}
                    height={60}
                    fill="#D9D9D9"
                    style={{
                      width: leftMaskWidth,
                    }}
                  />
                </g>
              </mask>
              <g mask="url(#mask2_197_321)">
                <motion.line
                  data-animate="timeline-one"
                  initial={timelineOneVariants.initial}
                  x1="202.907"
                  y1="52.7907"
                  x2="231.287"
                  y2="57.3873"
                  strokeOpacity="1"
                  strokeWidth="6.55"
                  strokeLinecap="round"
                  className="stroke-[#989898] dark:stroke-[#D6D6D6]"
                  style={{ willChange: "transform, opacity" }}
                />
                <motion.line
                  data-animate="timeline-two"
                  initial={timelineTwoVariants.initial}
                  x1="238.626"
                  y1="68.4911"
                  x2="211.948"
                  y2="64.21"
                  strokeOpacity="1"
                  strokeWidth="6.55"
                  strokeLinecap="round"
                  className="stroke-[#989898] dark:stroke-[#D6D6D6]"
                  style={{ willChange: "transform, opacity" }}
                />
                <motion.line
                  data-animate="timeline-three"
                  initial={timelineThreeVariants.initial}
                  x1="205.527"
                  y1="73.1088"
                  x2="229.023"
                  y2="76.8985"
                  strokeOpacity="1"
                  strokeWidth="6.5"
                  strokeLinecap="round"
                  className="stroke-[#989898] dark:stroke-[#D6D6D6]"
                  style={{ willChange: "transform, opacity" }}
                />
              </g>
            </g>

            <g>
              <mask
                id="mask1_197_321"
                maskUnits="userSpaceOnUse"
                x="185"
                y="40"
                width="80"
                height="60"
                style={{
                  maskType: "alpha",
                }}
              >
                <g
                  style={{
                    transform: "rotate(9deg)",
                    transformOrigin: "185px 40px",
                    transformBox: "view-box",
                  }}
                >
                  {/* Right mask - reveals dimmed lines from cursor position to right */}
                  <motion.rect
                    y={40}
                    height={60}
                    fill="#D9D9D9"
                    style={{
                      x: rightMaskX,
                      width: rightMaskWidth,
                    }}
                  />
                </g>
              </mask>
              <g mask="url(#mask1_197_321)">
                <motion.line
                  data-animate="timeline-one"
                  initial={timelineOneVariants.initial}
                  x1="202.907"
                  y1="52.7907"
                  x2="231.287"
                  y2="57.3873"
                  strokeOpacity="0.4"
                  strokeWidth="6.55"
                  strokeLinecap="round"
                  className="stroke-[#989898] dark:stroke-[#D6D6D6]"
                  style={{ willChange: "transform, opacity" }}
                />
                <motion.line
                  data-animate="timeline-two"
                  initial={timelineTwoVariants.initial}
                  x1="238.626"
                  y1="68.4911"
                  x2="211.948"
                  y2="64.21"
                  strokeOpacity="0.4"
                  strokeWidth="6.55"
                  strokeLinecap="round"
                  className="stroke-[#989898] dark:stroke-[#D6D6D6]"
                  style={{ willChange: "transform, opacity" }}
                />
                <motion.line
                  data-animate="timeline-three"
                  initial={timelineThreeVariants.initial}
                  x1="205.527"
                  y1="73.1088"
                  x2="229.023"
                  y2="76.8985"
                  strokeOpacity="0.4"
                  strokeWidth="6.5"
                  strokeLinecap="round"
                  className="stroke-[#989898] dark:stroke-[#D6D6D6]"
                  style={{ willChange: "transform, opacity" }}
                />
              </g>
            </g>
          </motion.g>
        </motion.g>
      </motion.g>
    </motion.g>
  );
}
