import {
  createFloatingAnimation,
  createRotationAnimation,
  fadeScaleVariants,
  UNIVERSAL_DELAY,
} from "@/lib/animation-variants";
import { useHoverTimeout } from "@/lib/use-hover-timeout";
import {
  backgroundVariants,
  bulbMaskVariants,
  bulbVariants,
  raysOpacityVariants,
  rayVariants,
  stemVariants,
  wholeVariants,
} from "@/lib/variants/lightbulb-variants";
import { motion, useAnimation } from "motion/react";
import { useCallback, useEffect, useRef } from "react";

export function Lightbulb({
  isMobile,
  isDraggingRef,
}: {
  isMobile: boolean;
  isDraggingRef?: React.RefObject<boolean>;
}) {
  const controls = useAnimation();
  const hasAnimatedMobile = useRef(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const startAnimations = async () => {
      controls.start("initial");
      controls.start("idle");
    };
    startAnimations();
  }, [controls]);

  const { handleMouseEnter, handleMouseLeave } = useHoverTimeout({
    delay: isMobile ? 0 : UNIVERSAL_DELAY,
    disabledRef: isDraggingRef,
    onHoverStart: async () => {
      controls.start("animate");

      if (isMobile && !hasAnimatedMobile.current) {
        animationTimeoutRef.current = setTimeout(() => {
          hasAnimatedMobile.current = true;
        }, 200);
      }
    },
    onHoverEnd: async () => {
      if (isMobile && hasAnimatedMobile.current) {
        hasAnimatedMobile.current = false;
      }
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      await controls.start("initial");
      controls.start("idle");
    },
  });

  const onClick = useCallback(async () => {
    if (isMobile && !hasAnimatedMobile.current) return;
    controls.start("click");
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
  }, [controls, isMobile]);

  return (
    <motion.g
      variants={fadeScaleVariants}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="origin-bottom!"
    >
      <motion.g
        {...createFloatingAnimation({
          from: -1.5,
          to: 1,
          duration: 3,
        })}
      >
        <motion.g
          variants={backgroundVariants}
          initial="initial"
          animate={controls}
        >
          <motion.g
            {...createRotationAnimation({
              from: -5,
              to: 5,
              duration: 10,
            })}
            className="filter-[url(#filter5_i_359_1453)] dark:filter-[url(#filter5_i_368_1560)]"
          >
            <path
              d="M367.266 21.417c-2.316-9.36 10.658-14.171 15.564-5.87 2.973 5.03 10.083 5.68 13.821 1.188l4.123-4.955c8.221-9.88 24.263-3.102 22.91 9.68l-.678 6.41c-.615 5.811 4.807 10.455 10.487 9.08 9.371-2.268 14.965 10.389 6.64 15.252-5.132 2.998-5.591 10.24-.88 13.862l5.654 4.347c10.746 8.261 3.501 25.412-9.914 23.466l-7.058-1.023c-5.881-.853-10.753 4.524-9.325 10.293 2.316 9.359-10.658 14.171-15.564 5.871-2.974-5.031-10.083-5.681-13.822-1.189l-4.123 4.954c-8.221 9.88-24.263 3.102-22.91-9.679l.678-6.41c.615-5.812-4.807-10.456-10.487-9.08-9.371 2.267-14.965-10.39-6.639-15.253 5.131-2.998 5.59-10.239.879-13.861l-5.654-4.347c-10.746-8.262-3.5-25.412 9.915-23.467l7.057 1.024c5.882.853 10.753-4.524 9.326-10.293"
              className="fill-[#F8F8F8] dark:fill-[#252525]"
            ></path>
          </motion.g>
        </motion.g>

        <motion.g variants={wholeVariants} initial="initial" animate={controls}>
          <g>
            <defs>
              <mask id="bulb-mask">
                <rect width="100%" height="100%" fill="white" />
                <motion.g
                  variants={bulbMaskVariants}
                  initial="initial"
                  animate={controls}
                >
                  <path
                    d="M398.773 55.476a1.843 1.843 0 0 0-2.181 2.97l.181.144a3.08 3.08 0 0 1 .974 3.108 1.842 1.842 0 1 0 3.565.932 6.76 6.76 0 0 0-2.539-7.154"
                    fill="black"
                  />
                </motion.g>
              </mask>
            </defs>
            {/* stem */}
            <motion.path
              variants={stemVariants}
              initial="initial"
              animate={controls}
              d="M379.934 77.108c.307-.725 1.318-.824 1.845-.24a12.15 12.15 0 0 0 4.303 3.05 12.14 12.14 0 0 0 5.185.959c.787-.03 1.42.764 1.114 1.49l-.784 1.854-.009.024c-.924 2.187-4.46 2.783-7.896 1.332-3.436-1.452-5.473-4.403-4.551-6.59z"
              className="fill-[#989898] dark:fill-[#D6D6D6]"
            ></motion.path>
            {/* bulb */}
            {/* shine applied as mask to the bulb path (#bulb-mask) */}
            <motion.path
              variants={bulbVariants}
              initial="initial"
              animate={controls}
              d="M398.989 49.368c6.408 2.708 9.141 10.328 5.95 16.51a10 10 0 0 1-4.121 4.208l-.94.508a10.6 10.6 0 0 0-4.718 5.197l-.318.752a1.95 1.95 0 0 1-1.353 1.14 10.12 10.12 0 0 1-10.967-4.634 1.95 1.95 0 0 1-.126-1.765l.318-.752a10.6 10.6 0 0 0 .437-7.005l-.291-1.028a10 10 0 0 1 .144-5.888c2.208-6.597 9.576-9.95 15.985-7.242"
              mask="url(#bulb-mask)"
              className="fill-[#989898] dark:fill-[#D6D6D6]"
            ></motion.path>
          </g>

          {/* light rays reworked as lines to animate pathLength */}
          <motion.g
            variants={raysOpacityVariants}
            initial="initial"
            animate={controls}
          >
            <motion.line
              variants={rayVariants}
              initial="initial"
              animate={controls}
              x1="376.711"
              y1="53.2909"
              x2="376.62"
              y2="53.2495"
              strokeOpacity="0.5"
              strokeWidth="3.7"
              strokeLinecap="round"
              className="stroke-[#989898] dark:stroke-[#D6D6D6]"
            />
            <motion.line
              variants={rayVariants}
              initial="initial"
              animate={controls}
              x1="382.703"
              y1="45.4685"
              x2="382.04"
              y2="44.5912"
              strokeOpacity="0.5"
              strokeWidth="3.7"
              strokeLinecap="round"
              className="stroke-[#989898] dark:stroke-[#D6D6D6]"
            />
            <motion.line
              variants={rayVariants}
              initial="initial"
              animate={controls}
              x1="391.866"
              y1="41.752"
              x2="391.536"
              y2="39.1226"
              strokeOpacity="0.5"
              strokeWidth="3.7"
              strokeLinecap="round"
              className="stroke-[#989898] dark:stroke-[#D6D6D6]"
            />
            <motion.line
              variants={rayVariants}
              initial="initial"
              animate={controls}
              x1="401.616"
              y1="43.146"
              x2="403.502"
              y2="38.6842"
              strokeOpacity="0.5"
              strokeWidth="3.7"
              strokeLinecap="round"
              className="stroke-[#989898] dark:stroke-[#D6D6D6]"
            />
          </motion.g>
        </motion.g>
      </motion.g>
    </motion.g>
  );
}
