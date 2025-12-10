import { Transition } from "motion/react";

/**
 * Shared spring configurations for animations
 */
export const SPRING_CONFIGS = {
  /** Clock hand rotation spring */
  clockHand: {
    type: "spring",
    stiffness: 150,
    damping: 19,
    mass: 1.2,
  } as const,

  /** Drag bounce back spring */
  dragBounce: {
    stiffness: 600,
    damping: 20,
    mass: 1,
  } as const,

  /** Default global spring (used in MotionConfig) */
  default: {
    type: "spring",
    stiffness: 800,
    damping: 80,
    mass: 4,
  } as const,
} satisfies Record<string, Transition>;
