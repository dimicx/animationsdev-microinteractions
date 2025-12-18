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
 * Helper type for defining variant objects with proper type inference.
 * Use this to wrap your variant definitions to get type safety without verbosity.
 *
 * @example
 * const myVariants = defineVariants({
 *   initial: { opacity: 0 },
 *   animate: { opacity: 1 },
 *   idle: (custom = false) => ({ opacity: [0, 1], transition: { repeatType: "loop" } })
 * });
 */
export const defineVariants = <T extends Record<string, Variant>>(
  variants: T
): T => variants;

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
 * animateVariants({
 *   selector: '[data-animate="hand"]',
 *   variant: handVariants.animate
 * });
 *
 * // Animate indexed elements (e.g., bells, rays) - simple count
 * animateVariants({
 *   selector: '[data-animate="ray"]',
 *   variant: rayVariants.animate,
 *   custom: 3  // Calls variant(0), variant(1), variant(2)
 * });
 *
 * // Animate indexed elements with additional params
 * animateVariants({
 *   selector: '[data-animate="ray"]',
 *   variant: rayVariants.idle,
 *   custom: { count: 3, initialDelay: true }  // Calls variant({ index: 0, initialDelay: true }), etc.
 * });
 *
 * // Pass custom parameter to variant function
 * animateVariants({
 *   selector: '[data-animate="bulb"]',
 *   variant: bulbVariants.idle,
 *   custom: true  // Non-indexed: calls variant(true)
 * });
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
   * @param params - Animation parameters
   * @param params.selector - Element selector (e.g., "[data-animate='ray']")
   * @param params.variant - The variant to animate
   * @param params.custom - Optional parameter with multiple patterns:
   *   - number: count for indexed variants (calls variant(0), variant(1), ...)
   *   - { count, ...params }: count + additional params for indexed variants (calls variant({ index: 0, ...params }), ...)
   *   - other: passes value directly to variant function
   * @returns Array of AnimationPlaybackControls
   */
  const animateVariants = useCallback(
    ({
      selector,
      variant,
      custom,
    }: {
      selector: string;
      variant: Variant;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      custom?: any;
    }): AnimationPlaybackControls[] => {
      // Early return if variant doesn't exist
      if (!variant) return [];

      // Check if this is an indexed variant pattern
      const isIndexedVariant =
        typeof custom === "number" ||
        (typeof custom === "object" && custom !== null && "count" in custom);

      // Handle indexed variants
      if (isIndexedVariant) {
        const count = typeof custom === "number" ? custom : custom.count;
        const additionalParams =
          typeof custom === "number"
            ? {}
            : Object.fromEntries(
                Object.entries(custom).filter(([key]) => key !== "count")
              );

        const animations: AnimationPlaybackControls[] = [];
        for (let i = 0; i < count; i++) {
          const data =
            typeof variant === "function"
              ? typeof custom === "number"
                ? (variant as (index: number) => TargetAndTransition)(i)
                : (
                    variant as (params: {
                      index: number;
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      [key: string]: any;
                    }) => TargetAndTransition
                  )({ index: i, ...additionalParams })
              : (variant as TargetAndTransition);
          const result = animateVariant(`${selector}[data-index='${i}']`, data);
          if (result) animations.push(result);
        }
        return animations;
      }

      // Handle standard variant
      let resolvedVariant: TargetAndTransition;
      if (typeof variant === "function") {
        // Call with custom parameter
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolvedVariant = (variant as (custom: any) => TargetAndTransition)(
          custom
        );
      } else {
        resolvedVariant = variant as TargetAndTransition;
      }
      const result = animateVariant(selector, resolvedVariant);
      return result ? [result] : [];
    },
    [animateVariant]
  );

  return { animateVariants };
}
