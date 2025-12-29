import { interpolate } from "flubber";
import { MotionValue } from "motion";
import { useTransform } from "motion/react";

const getIndex = (_: string, index: number): number => index;

const interpolatorCache = new Map<string, (t: number) => string>();

export function useFlubber(
  progress: MotionValue<number>,
  paths: string[]
): MotionValue<string> {
  return useTransform(progress, paths.map(getIndex), paths, {
    mixer: (a, b) => {
      const key = `${a}-${b}`;
      if (!interpolatorCache.has(key)) {
        interpolatorCache.set(
          key,
          interpolate(a, b, { maxSegmentLength: 0.1 })
        );
      }
      return interpolatorCache.get(key)!;
    },
  });
}
