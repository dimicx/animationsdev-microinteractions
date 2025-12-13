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
 * Hook that provides animation helper functions for Motion variants.
 * Wraps the animate function from useAnimate() with utilities for applying
 * variants with default transitions and handling indexed elements.
 *
 * @param animate - The animate function from useAnimate() hook
 * @returns Object with animateVariant and animateIndexedVariants helper functions
 *
 * @example
 * ```tsx
 * const [scope, animate] = useAnimate();
 * const { animateVariant, animateIndexedVariants } = useAnimateVariants(animate);
 *
 * // Animate a single element with a variant
 * animateVariant('.element', { scale: 1.2, transition: { duration: 0.3 } });
 *
 * // Animate indexed elements (e.g., bells, rays)
 * animateIndexedVariants('.bell', (i) => ({ rotate: i * 10 }), 3);
 * ```
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
