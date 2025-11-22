import { Clock } from "@/components/clock";
import { Code } from "@/components/code";
import { Defs } from "@/components/defs";
import { Hand } from "@/components/hand";
import { Lightbulb } from "@/components/lightbulb";
import { SpringPath } from "@/components/spring-path";
import { Timeline } from "@/components/timeline";

export function Scene() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="622"
      height="319"
      fill="none"
      viewBox="0 0 622 319"
      className="h-auto"
    >
      <g clipPath="url(#clip0_368_1560)">
        <Code />
        <SpringPath />
        <Hand />
        <Clock />
        <Timeline />
        <Lightbulb />
      </g>
      <Defs />
    </svg>
  );
}
