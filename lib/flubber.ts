import { MotionValue } from "motion";
import { useTransform } from "motion/react";
import { interpolate } from "flubber";

const getIndex = (_: string, index: number): number => index;

export function useFlubber(
  progress: MotionValue<number>,
  paths: string[]
): MotionValue<string> {
  return useTransform(progress, paths.map(getIndex), paths, {
    mixer: (a, b) => interpolate(a, b, { maxSegmentLength: 0.1 }),
  });
}
