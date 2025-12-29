import { useAnimate } from "motion/react";
import { useCallback } from "react";
import { SPRING_CONFIGS } from "../animation-configs";

export function useAnimateVariant() {
  const [scope, animate] = useAnimate();

  const animateVariant = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (selector: string, variant: any) => {
      if (!variant) return;
      const { transition, ...values } = variant;
      return animate(selector, values, transition ?? SPRING_CONFIGS.default);
    },
    [animate]
  );

  return [scope, animateVariant, animate] as const;
}
