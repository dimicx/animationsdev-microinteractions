import { Transition } from "motion/react";

/**
 * Shared spring configurations for animations
 */
export const SPRING_CONFIGS = {
  clockHand: {
    type: "spring",
    stiffness: 250,
    damping: 25,
    mass: 1.2,
  } as const,
  dragBounce: {
    type: "spring",
    stiffness: 650,
    damping: 20,
    mass: 0.85,
  } as const,
  default: {
    type: "spring",
    stiffness: 800,
    damping: 80,
    mass: 4,
  } as const,
} satisfies Record<string, Transition>;

export const DEFAULT_LIGHT_FILL = "#989898";
export const DEFAULT_DARK_FILL = "#D6D6D6";
export const LIGHT_MODE_COLORS = [
  "#FFAA04",
  "#fec300",
  "#05DF72",
  "#00D5BE",
  "#00BCFF",
  "#C27AFF",
  "#FF637E",
  DEFAULT_LIGHT_FILL,
];
export const DARK_MODE_COLORS = [
  "#FFAA04",
  "#00fe00",
  "#00D492",
  "#00D3F3",
  "#7C86FF",
  "#ED6AFF",
  "#FF637E",
  DEFAULT_DARK_FILL,
];
