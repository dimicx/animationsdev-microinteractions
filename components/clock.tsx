import { motion, useAnimation, Variants } from "motion/react";
import { useCallback, useEffect } from "react";
import { fadeScaleVariants, UNIVERSAL_DELAY } from "@/lib/animation-variants";
import { useHoverTimeout } from "@/lib/use-hover-timeout";

const clockVariants: Variants = {
  initial: {
    y: "0%",
    x: "0%",
  },
  animate: {
    y: ["0%", "3%", "-6%"],
    x: ["0%", "-3%", "3%", "-3%", "3%", "-3%", "0%"],
    transition: {
      y: {
        duration: 0.3,
        ease: "easeOut",
      },
      x: {
        duration: 0.3,
        repeat: Infinity,
        ease: "linear",
      },
    },
  },
};

const bellVariants: Variants = {
  initial: {
    y: "0%",
    x: "0%",
    rotate: "0deg",
  },
  animate: (i: number) => ({
    y: i === 0 ? ["0%", "10%", "-25%", "-70%"] : ["0%", "20%", "-50%", "-100%"],
    x:
      i === 0
        ? ["0%", "-20%", "16%", "-16%", "20%", "-16%", "0%"]
        : ["0%", "-30%", "24%", "-24%", "30%", "-24%", "0%"],
    rotate: i === 0 ? "0deg" : ["0deg", "-5deg"],
    transition: {
      y: {
        delay: i * 0.05,
        duration: 3,
        times: [0, 0.05, 0.1, 1],
        ease: "easeOut",
      },
      x: {
        delay: i * 0.05,
        duration: 0.3,
        repeat: Infinity,
        ease: "linear",
      },
      rotate: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  }),
};

const bellsVariants: Variants = {
  initial: {
    transform: "translateX(0%) translateY(0%) rotate(0deg)",
  },
  animate: {
    transform: [
      "translateX(0%) translateY(0%) rotate(0deg)",
      "translateX(-12%) translateY(-6%) rotate(-8deg)",
      "translateX(12%) translateY(6%) rotate(8deg)",
      "translateX(0%) translateY(0%) rotate(0deg)",
    ],
    transition: {
      duration: 1,
      ease: "easeOut",
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: 4,
      delay: 4,
    },
  },
};

export function Clock() {
  const controls = useAnimation();
  const idleControls = useAnimation();

  const startAnimations = useCallback(() => {
    controls.start("initial");
    idleControls.start("animate");
  }, [idleControls, controls]);

  useEffect(() => {
    startAnimations();
  }, [startAnimations]);

  const { handleMouseEnter, handleMouseLeave } = useHoverTimeout({
    delay: UNIVERSAL_DELAY,
    onHoverStart: async () => {
      await idleControls.start("initial", { duration: 0.05 });
      controls.start("animate");
    },
    onHoverEnd: async () => {
      await controls.start("initial");
      idleControls.start("animate");
    },
  });

  return (
    <motion.g
      variants={fadeScaleVariants}
      className="origin-bottom-right!"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.g
        initial={{
          transform: "rotate(0deg)",
        }}
        animate={{
          transform: ["rotate(-2deg)", "rotate(2deg)"],
        }}
        transition={{
          duration: 5,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <motion.g
          initial={{
            transform: "translateY(0px)",
          }}
          animate={{
            transform: ["translateY(-2px)", "translateY(2px)"],
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="filter-[url(#filter7_i_359_1453)] dark:filter-[url(#filter7_i_368_1560)]"
        >
          <path
            d="M553.22 118.392c42.396 5.809 72.84 39.157 68 74.487-1.536 11.213-6.442 21.277-13.78 29.607-6.142 6.973-8.217 17.405-2.728 24.902l1.828 2.496a6.7 6.7 0 0 1 1.082 2.304c1.428 5.683-4.672 10.293-9.749 7.368l-20.818-11.989a16.37 16.37 0 0 0-9.304-2.147l-2.455.17c-9.352 1.811-19.359 2.145-29.605.741-42.395-5.809-72.839-39.158-67.998-74.487s43.132-59.26 85.527-53.452"
            className="fill-[#F8F8F8] dark:fill-[#252525]"
          ></path>
        </motion.g>
      </motion.g>
      <motion.g
        initial={{
          transform: "translateY(0px)",
        }}
        animate={{
          transform: ["translateY(-1.5px)", "translateY(2px)"],
        }}
        transition={{
          duration: 4.5,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        {/* clock */}
        <motion.path
          variants={clockVariants}
          initial="initial"
          animate={controls}
          d="M546.994 163.826c12.546 1.719 21.324 13.284 19.605 25.83s-13.284 21.323-25.83 19.604-21.323-13.283-19.604-25.829 13.283-21.324 25.829-19.605m.984 30.222a2.456 2.456 0 0 0 3.454-3.494zm-2.207-21.297a2.457 2.457 0 0 0-2.768 2.1l-1.334 9.737a5.74 5.74 0 0 0 1.65 4.854l4.659 4.606 1.727-1.747 1.727-1.747-4.659-4.607a.82.82 0 0 1-.235-.692l1.334-9.736a2.457 2.457 0 0 0-2.101-2.768"
          className="fill-[#989898] dark:fill-[#D6D6D6]"
        ></motion.path>

        {/* bells */}
        <motion.g
          variants={bellsVariants}
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
