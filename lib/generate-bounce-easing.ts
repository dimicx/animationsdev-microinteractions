import { getPathData } from "./get-path-data";

interface KeyPoint {
  index: number;
  distance: number;
  y: number;
  type: "start" | "peak" | "trough" | "end";
}

// Generate physics-based easing from path that simulates gravity
export function generateBounceEasing(pathString: string, samples = 100) {
  if (typeof document === "undefined") return null;

  const { path, length } = getPathData(pathString);
  if (!path) return null;

  const points: Array<{ distance: number; y: number }> = [];

  // Sample points along the path with higher resolution
  for (let i = 0; i <= samples; i++) {
    const distance = (i / samples) * length;
    const point = path.getPointAtLength(distance);
    points.push({ distance, y: point.y });
  }

  // Find significant peaks (local minima in Y - highest visual points) and troughs (local maxima in Y - lowest visual points)
  const keyPoints: KeyPoint[] = [
    { index: 0, distance: 0, y: points[0].y, type: "start" },
  ];

  // Use a window to find significant peaks/troughs (not just local)
  const significanceThreshold = 5; // minimum Y change to be considered significant

  for (let i = 2; i < points.length - 2; i++) {
    const prevY = points[i - 2].y;
    const currY = points[i].y;
    const nextY = points[i + 2].y;

    // Trough: ball at bottom (high Y value in SVG coordinates)
    if (
      currY > prevY &&
      currY > nextY &&
      Math.abs(currY - prevY) > significanceThreshold
    ) {
      keyPoints.push({
        index: i,
        distance: points[i].distance,
        y: currY,
        type: "trough",
      });
    }
    // Peak: ball at top (low Y value in SVG coordinates)
    else if (
      currY < prevY &&
      currY < nextY &&
      Math.abs(currY - prevY) > significanceThreshold
    ) {
      keyPoints.push({
        index: i,
        distance: points[i].distance,
        y: currY,
        type: "peak",
      });
    }
  }

  keyPoints.push({
    index: samples,
    distance: length,
    y: points[samples].y,
    type: "end",
  });

  // Build segments between key points
  const segments: Array<{
    startDist: number;
    endDist: number;
    goingDown: boolean; // in SVG coordinates (Y increases downward)
    segmentIndex: number;
  }> = [];

  for (let i = 0; i < keyPoints.length - 1; i++) {
    const start = keyPoints[i];
    const end = keyPoints[i + 1];
    segments.push({
      startDist: start.distance,
      endDist: end.distance,
      goingDown: end.y > start.y,
      segmentIndex: i,
    });
  }

  // Calculate time allocation for each segment based on physics
  // Falling takes less time than rising for the same distance (gravity assists vs opposes)
  // Later bounces should be faster (less height = less time)
  const segmentTimes: number[] = [];
  let totalTime = 0;

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const segLength = seg.endDist - seg.startDist;

    // Base time proportional to segment length
    let time = segLength / length;

    // Falls should be faster than rises (gravity accelerates the ball)
    if (seg.goingDown) {
      time *= 0.7; // Falls happen 30% faster
    }

    // Reduce time for later segments (energy decay simulation)
    // Higher value = more uniform timing across bounces
    const decayFactor = Math.pow(0.92, Math.floor(i / 2));
    time *= decayFactor;

    segmentTimes.push(time);
    totalTime += time;
  }

  // Normalize times to sum to 1
  const normalizedTimes = segmentTimes.map((t) => t / totalTime);

  // Build cumulative time boundaries
  const timeBoundaries: number[] = [0];
  for (let i = 0; i < normalizedTimes.length; i++) {
    timeBoundaries.push(timeBoundaries[i] + normalizedTimes[i]);
  }

  // Create easing function
  return (t: number) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;

    // Find which segment we're in based on time
    let segIndex = 0;
    for (let i = 0; i < timeBoundaries.length - 1; i++) {
      if (t >= timeBoundaries[i] && t < timeBoundaries[i + 1]) {
        segIndex = i;
        break;
      }
    }

    const seg = segments[segIndex];
    const segStartTime = timeBoundaries[segIndex];
    const segEndTime = timeBoundaries[segIndex + 1];
    const segDuration = segEndTime - segStartTime;

    // Progress within this segment (0-1)
    const localT = (t - segStartTime) / segDuration;

    // Apply physics-based easing
    let easedLocalT: number;

    if (seg.goingDown) {
      // Falling: linear - consistent gravity pull
      easedLocalT = localT;
    } else {
      // Rising: stronger ease-out - ball decelerates and hangs at peak
      easedLocalT = 1 - Math.pow(1 - localT, 4);
    }

    // Map back to path distance
    const segStartDist = seg.startDist;
    const segEndDist = seg.endDist;
    const currentDist =
      segStartDist + easedLocalT * (segEndDist - segStartDist);

    return currentDist / length;
  };
}
