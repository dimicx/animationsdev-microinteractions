import { SPRING_CONFIGS } from "@/lib/animation-configs";
import {
  AnimationPlaybackControls,
  ElementOrSelector,
  TargetAndTransition,
  Transition,
  Variant,
} from "motion/react";
import { useCallback } from "react";

/**
 * Hook that provides a unified animation function for Motion variants.
 * Wraps the animate function from useAnimate() with utilities for applying
 * variants with default transitions and handling both standard and indexed elements.
 *
 * @param animate - The animate function from useAnimate() hook
 * @returns Object with animateVariants helper function
 *
 * @example
 * ```tsx
 * const [scope, animate] = useAnimate();
 * const { animateVariants } = useAnimateVariants(animate);
 *
 * // Animate a single element with a variant
 * animateVariants('[data-animate="hand"]', { scale: 1.2, transition: { duration: 0.3 } });
 *
 * // Animate indexed elements (e.g., bells, rays)
 * animateVariants('[data-animate="ray"]', (i) => ({ rotate: i * 10 }), 3);
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
   * Unified animation function that handles both standard and indexed variants.
   * @param selector - Element selector (e.g., "[data-animate='ray']")
   * @param variants - The variants record object
   * @param variantKey - The variant key to animate
   * @param count - Optional number of indexed elements. If undefined, treats as single element.
   * @returns Array of AnimationPlaybackControls
   */
  const animateVariants = useCallback(
    <T extends Record<string, TargetAndTransition | IndexedVariant>>(
      selector: string,
      variants: T,
      variantKey: string,
      count?: number
    ): AnimationPlaybackControls[] => {
      // Get the variant value from the record
      const variant = variantKey in variants ? variants[variantKey] : undefined;

      // Early return if variant doesn't exist
      if (!variant) return [];

      // Handle standard variant (count is undefined)
      if (count === undefined) {
        const result = animateVariant(selector, variant as TargetAndTransition);
        return result ? [result] : [];
      }

      // Handle indexed variants
      const animations: AnimationPlaybackControls[] = [];
      for (let i = 0; i < count; i++) {
        const data = typeof variant === "function" ? variant(i) : variant;
        const result = animateVariant(`${selector}[data-index='${i}']`, data);
        if (result) animations.push(result);
      }
      return animations;
    },
    [animateVariant]
  );

  return { animateVariants };
}

/**
 * Type for indexed variant functions (e.g., bells, rays, bubbles)
 */
export type IndexedVariant = (index: number) => TargetAndTransition;
