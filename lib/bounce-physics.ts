/**
 * Configuration constants for bounce physics.
 * Centralizes all magic numbers for easier tuning.
 */
const BOUNCE_CONFIG = {
  /** Timing points for ground hits (progress values 0-1) */
  timing: {
    firstHit: 0.25,
    secondHit: 0.55,
    thirdHit: 0.77,
  },
  /** Bounce heights as fraction of original height */
  heights: {
    first: 0.7,
    second: 0.5,
  },
  /** X-progress values at each timing point */
  xProgress: {
    atFirstHit: 0.38,
    atSecondHit: 0.75,
  },
} as const;

/**
 * Bounce easing with 2 main bounces matching the path's 3 ground touchpoints.
 * First bounce: 70% height, Second bounce: 50% height, then settle.
 */
function bounceEase(x: number): number {
  // Bounce timing points - 3 ground hits matching the path
  const b1 = BOUNCE_CONFIG.timing.firstHit;
  const b2 = BOUNCE_CONFIG.timing.secondHit;
  const b3 = BOUNCE_CONFIG.timing.thirdHit;

  // Bounce heights (how high the ball goes after each bounce, as fraction of original)
  const h1 = BOUNCE_CONFIG.heights.first;
  const h2 = BOUNCE_CONFIG.heights.second;

  if (x < b1) {
    // Initial fall - ease in (accelerate due to gravity)
    const t = x / b1;
    return t * t; // Quadratic ease-in
  } else if (x < b2) {
    // First bounce up and down
    const t = (x - b1) / (b2 - b1);
    const parabola = 4 * t * (1 - t); // Parabola peaking at 0.5
    return 1 - h1 * parabola;
  } else if (x < b3) {
    // Second bounce
    const t = (x - b2) / (b3 - b2);
    const parabola = 4 * t * (1 - t);
    return 1 - h2 * parabola;
  } else {
    // Settle at final position (small vertical wobble handled separately)
    return 1;
  }
}

/**
 * Custom X easing that accelerates on each bounce.
 * The ball moves faster right after each ground impact.
 * Matches 3 ground touchpoints in the path.
 */
function bounceAcceleratedX(x: number): number {
  const { firstHit: b1, secondHit: b2, thirdHit: b3 } = BOUNCE_CONFIG.timing;
  const { atFirstHit, atSecondHit } = BOUNCE_CONFIG.xProgress;

  // Progress jumps at each bounce, then eases between
  if (x < b1) {
    // First fall: curves right then back left to match path curve
    const t = x / b1;
    const baseProgress = t * t * atFirstHit; // Reach 38% by first ground hit
    // Rightward bulge mid-fall, returns to path at ground hit
    const curveBulge = Math.sin(t * Math.PI) * 0.07;
    return baseProgress + curveBulge;
  } else if (x < b2) {
    // First bounce to second ground hit
    const t = (x - b1) / (b2 - b1);
    // Custom curve: slow during rise (peak stays left), fast during fall
    let eased;
    if (t < 0.5) {
      eased = 2 * t * t; // ease-in for rise
    } else {
      const t2 = (t - 0.5) * 2;
      eased = 0.5 + (1 - Math.pow(1 - t2, 2)) * 0.5; // ease-out for fall
    }
    return atFirstHit + eased * (atSecondHit - atFirstHit); // 38% to 75%
  } else if (x < b3) {
    // Second bounce to third ground hit (final position) - shortest jump
    const t = (x - b2) / (b3 - b2);
    // Subtle curve adjustment to shift peak slightly left
    let eased;
    if (t < 0.45) {
      // Slightly slower rise to peak
      const t1 = t / 0.45;
      eased = 1 - Math.pow(1 - t1, 1.8);
      eased *= 0.42; // Progress to 42% by t=0.45
    } else {
      // Slightly faster descent from peak
      const t2 = (t - 0.45) / 0.55;
      eased = 0.42 + Math.pow(t2, 1.3) * 0.58;
    }
    return atSecondHit + eased * (1 - atSecondHit); // 75% to 100%
  } else {
    // At final position (settle phase - no more X movement)
    return 1;
  }
}

/**
 * Performance-optimized easing functions using pre-computed lookup tables.
 * These avoid expensive Math operations (Math.pow, Math.sin) during animation frames.
 */

// Pre-compute lookup tables (200 points for smooth interpolation)
const LOOKUP_TABLE_SIZE = 200;

const BOUNCE_EASE_LUT = Array.from({ length: LOOKUP_TABLE_SIZE + 1 }, (_, i) =>
  bounceEase(i / LOOKUP_TABLE_SIZE)
);

const BOUNCE_ACCELERATED_X_LUT = Array.from(
  { length: LOOKUP_TABLE_SIZE + 1 },
  (_, i) => bounceAcceleratedX(i / LOOKUP_TABLE_SIZE)
);

/**
 * Pre-computed lookup table for sin(t * PI) used in settle phase.
 * This avoids expensive Math.sin calls during animation frames.
 */
const SETTLE_SINE_LUT = Array.from({ length: LOOKUP_TABLE_SIZE + 1 }, (_, i) =>
  Math.sin((i / LOOKUP_TABLE_SIZE) * Math.PI)
);

/**
 * Bounce easing with 2 main bounces (optimized version).
 * Uses pre-computed lookup table with linear interpolation.
 * ~10-20x faster than calculating the easing function directly.
 */
export function bounceEaseFast(t: number): number {
  const idx = t * LOOKUP_TABLE_SIZE;
  const lower = Math.floor(idx);
  const upper = Math.min(Math.ceil(idx), LOOKUP_TABLE_SIZE);
  const frac = idx - lower;
  return BOUNCE_EASE_LUT[lower] * (1 - frac) + BOUNCE_EASE_LUT[upper] * frac;
}

/**
 * X-axis bounce acceleration easing (optimized version).
 * Uses pre-computed lookup table with linear interpolation.
 * ~10-20x faster than calculating the easing function directly.
 */
export function bounceAcceleratedXFast(t: number): number {
  const idx = t * LOOKUP_TABLE_SIZE;
  const lower = Math.floor(idx);
  const upper = Math.min(Math.ceil(idx), LOOKUP_TABLE_SIZE);
  const frac = idx - lower;
  return (
    BOUNCE_ACCELERATED_X_LUT[lower] * (1 - frac) +
    BOUNCE_ACCELERATED_X_LUT[upper] * frac
  );
}

/**
 * Optimized sine function for settle phase animation.
 * Uses pre-computed lookup table with linear interpolation.
 * Replaces Math.sin(settleT * Math.PI) to avoid expensive Math operations during animation frames.
 */
export function settleSineFast(t: number): number {
  const idx = t * LOOKUP_TABLE_SIZE;
  const lower = Math.floor(idx);
  const upper = Math.min(Math.ceil(idx), LOOKUP_TABLE_SIZE);
  const frac = idx - lower;
  return SETTLE_SINE_LUT[lower] * (1 - frac) + SETTLE_SINE_LUT[upper] * frac;
}

/**
 * Helper to check if progress is near a bounce point.
 */
function isAtBouncePoint(progress: number, threshold: number): boolean {
  const { firstHit, secondHit, thirdHit } = BOUNCE_CONFIG.timing;
  return (
    Math.abs(progress - firstHit) < threshold ||
    Math.abs(progress - secondHit) < threshold ||
    Math.abs(progress - thirdHit) < threshold
  );
}

/**
 * Calculate approximate velocity at a given progress point.
 * Velocity is the rate of change of the bounce easing function.
 */
function bounceVelocity(progress: number): number {
  const delta = 0.001;
  const p1 = Math.max(0, progress - delta);
  const p2 = Math.min(1, progress + delta);
  const y1 = bounceEase(p1);
  const y2 = bounceEase(p2);
  return (y2 - y1) / (p2 - p1);
}

/**
 * Calculate squash and stretch values based on progress.
 * Ball squashes (wider, shorter) at ground impact and stretches (taller, narrower) when airborne.
 * Based on velocity for more dynamic and realistic physics.
 *
 * @param progress - Animation progress (0 to 1)
 * @param intensity - How much squash/stretch to apply (0-1, default 0.25)
 * @returns Object with scaleX and scaleY values
 */
function getSquashStretchAtProgress(
  progress: number,
  intensity: number = 0.25
): { scaleX: number; scaleY: number } {
  const velocity = bounceVelocity(progress);
  const atBounce = isAtBouncePoint(progress, 0.04);
  const { thirdHit } = BOUNCE_CONFIG.timing;

  // Final landing configuration
  const finalLandingCenter = 0.85;
  const finalLandingRadius = 0.08;

  // Bounce decay factors
  const bounceDecay = {
    early: 1.0,
    mid: 0.7,
    late: 0.5,
    final: 0.3,
  };

  // Final settle phase - after third hit
  if (progress > thirdHit) {
    const settleT = (progress - thirdHit) / (1 - thirdHit);

    // Final squash when ball lands from the light bounce
    const distFromLanding = Math.abs(settleT - finalLandingCenter);

    if (distFromLanding < finalLandingRadius) {
      // Squash intensity peaks at center, fades at edges
      const squashFactor = 1 - distFromLanding / finalLandingRadius;
      const finalSquashIntensity = intensity * 0.4 * squashFactor;

      return {
        scaleX: 1 + finalSquashIntensity * 1.2,
        scaleY: 1 - finalSquashIntensity * 0.5,
      };
    }

    // After the final squash, return to normal scale
    if (settleT > finalLandingCenter + finalLandingRadius) {
      return { scaleX: 1, scaleY: 1 };
    }
  }

  // Impact squash at bounce points - stronger for earlier bounces
  if (atBounce && progress > 0.05 && progress < 0.97) {
    let decay: number = bounceDecay.early;
    if (progress > 0.85) decay = bounceDecay.final;
    else if (progress > 0.65) decay = bounceDecay.late;
    else if (progress > 0.4) decay = bounceDecay.mid;

    return {
      scaleX: 1 + intensity * 1.5 * decay,
      scaleY: 1 - intensity * 0.6 * decay,
    };
  }

  // In motion - stretch based on velocity
  const absVel = Math.abs(velocity);
  const stretch = Math.min(absVel * intensity * 0.4, intensity * 0.8);

  // Stretch vertically when moving fast (falling or rising)
  return {
    scaleX: 1 - stretch * 0.3,
    scaleY: 1 + stretch * 0.6,
  };
}

// Pre-compute squash/stretch lookup tables with default intensity 0.25
const SQUASH_STRETCH_LUT_X = Array.from(
  { length: LOOKUP_TABLE_SIZE + 1 },
  (_, i) => getSquashStretchAtProgress(i / LOOKUP_TABLE_SIZE, 0.225).scaleX
);

const SQUASH_STRETCH_LUT_Y = Array.from(
  { length: LOOKUP_TABLE_SIZE + 1 },
  (_, i) => getSquashStretchAtProgress(i / LOOKUP_TABLE_SIZE, 0.225).scaleY
);

/**
 * Optimized squash/stretch scale X calculation.
 * Uses pre-computed lookup table with linear interpolation.
 */
export function getSquashStretchScaleXFast(t: number): number {
  const idx = t * LOOKUP_TABLE_SIZE;
  const lower = Math.floor(idx);
  const upper = Math.min(Math.ceil(idx), LOOKUP_TABLE_SIZE);
  const frac = idx - lower;
  return (
    SQUASH_STRETCH_LUT_X[lower] * (1 - frac) +
    SQUASH_STRETCH_LUT_X[upper] * frac
  );
}

/**
 * Optimized squash/stretch scale Y calculation.
 * Uses pre-computed lookup table with linear interpolation.
 */
export function getSquashStretchScaleYFast(t: number): number {
  const idx = t * LOOKUP_TABLE_SIZE;
  const lower = Math.floor(idx);
  const upper = Math.min(Math.ceil(idx), LOOKUP_TABLE_SIZE);
  const frac = idx - lower;
  return (
    SQUASH_STRETCH_LUT_Y[lower] * (1 - frac) +
    SQUASH_STRETCH_LUT_Y[upper] * frac
  );
}
