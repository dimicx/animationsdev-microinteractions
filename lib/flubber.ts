import { MotionValue } from "motion";
import { useTransform } from "motion/react";
import { interpolate } from "flubber";

export const getIndex = (_: string, index: number) => index;

export function useFlubber(progress: MotionValue<number>, paths: string[]) {
  return useTransform(progress, paths.map(getIndex), paths, {
    mixer: (a, b) => interpolate(a, b, { maxSegmentLength: 0.1 }),
  });
}
