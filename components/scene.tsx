"use client";

import { Bounce } from "@/components/bounce";
import { Click } from "@/components/click";
import { Clock } from "@/components/clock";
import { Code } from "@/components/code";
import { Defs } from "@/components/defs";
import { Lightbulb } from "@/components/lightbulb";
import { Timeline } from "@/components/timeline";
import { SPRING_CONFIGS } from "@/lib/animation-configs";
import { useIsMobile } from "@/lib/hooks/use-is-mobile";
import { motion, MotionConfig } from "motion/react";
import { useRef } from "react";

export function Scene() {
  const isMobile = useIsMobile();
  const isDraggingRef = useRef(false);

  const handleDragStart = () => {
    isDraggingRef.current = true;
  };

  const handleDragEnd = () => {
    isDraggingRef.current = false;
  };

  return (
    <MotionConfig reducedMotion="user" transition={SPRING_CONFIGS.default}>
      <div className="-mb-4 mt-12 flex justify-center md:-mb-2 md:mt-8 select-none">
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="622"
          height="319"
          fill="none"
          viewBox="0 0 622 319"
          className="h-auto max-w-full overflow-visible!"
          role="img"
          aria-label="Interactive animation showcasing various microinteractions"
        >
          <Code isMobile={isMobile} isDraggingRef={isDraggingRef} />
          <Bounce
            isMobile={isMobile}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            isDraggingRef={isDraggingRef}
          />
          <Click isMobile={isMobile} isDraggingRef={isDraggingRef} />
          <Clock isMobile={isMobile} isDraggingRef={isDraggingRef} />
          <Timeline isMobile={isMobile} isDraggingRef={isDraggingRef} />
          <Lightbulb isMobile={isMobile} isDraggingRef={isDraggingRef} />
          <Defs />
        </motion.svg>
      </div>
    </MotionConfig>
  );
}
