"use client";

import { Clock } from "@/components/clock";
import { Code } from "@/components/code";
import { Defs } from "@/components/defs";
import { Hand } from "@/components/hand";
import { Lightbulb } from "@/components/lightbulb";
import { SpringPath } from "@/components/spring-path";
import { Timeline } from "@/components/timeline";
import useIsMobile from "@/lib/use-is-mobile";
import { motion, MotionConfig } from "motion/react";
import { useRef } from "react";

export function Scene() {
  const { isMobile } = useIsMobile();
  const isDraggingRef = useRef(false);

  const handleDragStart = () => {
    isDraggingRef.current = true;
  };

  const handleDragEnd = () => {
    isDraggingRef.current = false;
  };

  return (
    <MotionConfig
      transition={{
        type: "spring",
        stiffness: 800,
        damping: 80,
        mass: 4,
      }}
    >
      <div className="-mb-4 mt-12 flex justify-center md:-mb-2 md:mt-8">
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="622"
          height="319"
          fill="none"
          viewBox="0 0 622 319"
          className="h-auto max-w-full overflow-visible!"
          variants={{
            animate: {
              transition: { staggerChildren: 0.05, delayChildren: 0.125 },
            },
          }}
          initial={"initial"}
          animate={"animate"}
          role="img"
          aria-label="Interactive animation showcasing various microinteractions"
        >
          <Code isMobile={isMobile} isDraggingRef={isDraggingRef} />
          <SpringPath
            isMobile={isMobile}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            isDraggingRef={isDraggingRef}
          />
          <Hand isMobile={isMobile} isDraggingRef={isDraggingRef} />
          <Clock isMobile={isMobile} isDraggingRef={isDraggingRef} />
          <Timeline isMobile={isMobile} isDraggingRef={isDraggingRef} />
          <Lightbulb isMobile={isMobile} isDraggingRef={isDraggingRef} />
          <Defs />
        </motion.svg>
      </div>
    </MotionConfig>
  );
}
