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
 * Custom hook that provides animation helper functions.
 * Takes the animate function from useAnimate() as a parameter.
 */
export function useAnimationHelpers(
  animate: (
    selector: ElementOrSelector,
    values: Variant,
    transition?: Transition
  ) => AnimationPlaybackControls
) {
  const extractVariant = useCallback((v: TargetAndTransition) => {
    if (!v) return { values: {}, transition: SPRING_CONFIGS.default };
    const { transition, ...values } = v as TargetAndTransition;
    return {
      values: values,
      transition: transition ?? SPRING_CONFIGS.default,
    };
  }, []);

  const scopedAnimate = useCallback(
    (selector: ElementOrSelector, values: Variant, transition?: Transition) => {
      return animate(selector, values, transition ?? SPRING_CONFIGS.default);
    },
    [animate]
  );

  return { extractVariant, scopedAnimate };
}
