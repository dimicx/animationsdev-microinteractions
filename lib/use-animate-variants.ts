import { SPRING_CONFIGS } from "@/lib/animation-configs";
import { IndexedVariant } from "@/lib/helpers";
import {
  AnimationPlaybackControls,
  ElementOrSelector,
  TargetAndTransition,
  Transition,
  Variant,
} from "motion/react";
import { useCallback } from "react";

/**
 * Custom hook that provides animation helper functions.
 * Takes the animate function from useAnimate() as a parameter.
 */
export function useAnimateVariants(
  animate: (
    selector: ElementOrSelector,
    values: Variant,
    transition?: Transition
  ) => AnimationPlaybackControls
) {
  /**
   * Animates an element by extracting values and transition from a variant,
   * applying default spring config if no transition is specified.
   */
  const animateVariant = useCallback(
    (selector: ElementOrSelector, variant: TargetAndTransition) => {
      if (!variant) return;
      const { transition, ...values } = variant;
      return animate(selector, values, transition ?? SPRING_CONFIGS.default);
    },
    [animate]
  );

  /**
   * Animates indexed elements (e.g., bells, rays, bubbles) by looping through
   * and applying variants. Handles both function and object variants.
   */
  const animateIndexedVariants = useCallback(
    (
      selector: string,
      variant: TargetAndTransition | IndexedVariant,
      count: number
    ) => {
      const animations = [];
      for (let i = 0; i < count; i++) {
        const data = typeof variant === "function" ? variant(i) : variant;
        animations.push(animateVariant(`${selector}[data-index='${i}']`, data));
      }
      return animations;
    },
    [animateVariant]
  );

  return { animateVariant, animateIndexedVariants };
}
