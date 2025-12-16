import { MotionValue } from "motion";
import { useTransform } from "motion/react";
import { interpolate } from "flubber";
import { useMemo } from "react";

const getIndex = (_: string, index: number): number => index;

const interpolatorCache = new Map<string, (t: number) => string>();

export function useFlubber(
  progress: MotionValue<number>,
  paths: string[]
): MotionValue<string> {
  const mixer = useMemo(
    () => (a: string, b: string) => {
      const key = `${a}-${b}`;
      if (!interpolatorCache.has(key)) {
        interpolatorCache.set(
          key,
          interpolate(a, b, { maxSegmentLength: 0.1 })
        );
      }
      return interpolatorCache.get(key)!;
    },
    []
  );

  return useTransform(progress, paths.map(getIndex), paths, { mixer });
}
