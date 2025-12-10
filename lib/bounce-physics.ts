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
  /** Final landing squash parameters */
  finalLanding: {
    center: 0.9,
    radius: 0.08,
  },
  /** Bounce decay factors for squash intensity */
  bounceDecay: {
    early: 1,
    mid: 0.7,
    late: 0.4,
    final: 0.2,
  },
} as const;

/**
 * Bounce easing with 2 main bounces matching the path's 3 ground touchpoints.
 * First bounce: 70% height, Second bounce: 50% height, then settle.
 */
export function bounceEase(x: number): number {
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
 * Approximate derivative of bounceEase to get velocity for squash/stretch.
 * Returns a value where:
 * - Positive = moving down (towards target)
 * - Negative = moving up (bouncing back)
 * - Near zero = at peak or settled
 */
export function bounceVelocity(x: number, delta: number = 0.01): number {
  const v1 = bounceEase(Math.max(0, x - delta));
  const v2 = bounceEase(Math.min(1, x + delta));
  return (v2 - v1) / (2 * delta);
}

// Bounce timing points (must match bounceEase) - 3 ground hits
const BOUNCE_POINTS = [
  BOUNCE_CONFIG.timing.firstHit,
  BOUNCE_CONFIG.timing.secondHit,
  BOUNCE_CONFIG.timing.thirdHit,
];

/**
 * Returns true if the ball is at or near a bounce point (ground contact).
 */
export function isAtBouncePoint(x: number, threshold: number = 0.03): boolean {
  return BOUNCE_POINTS.some((bp) => Math.abs(x - bp) < threshold);
}

/**
 * Custom X easing that accelerates on each bounce.
 * The ball moves faster right after each ground impact.
 * Matches 3 ground touchpoints in the path.
 */
export function bounceAcceleratedX(x: number): number {
  const [b1, b2, b3] = BOUNCE_POINTS;
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
 * Get squash/stretch values based on bounce progress.
 */
export function getSquashStretchAtProgress(
  progress: number,
  intensity: number = 0.25
): { scaleX: number; scaleY: number } {
  const velocity = bounceVelocity(progress);
  const atBounce = isAtBouncePoint(progress, 0.04);
  const { thirdHit } = BOUNCE_CONFIG.timing;
  const { center: finalLandingCenter, radius: finalLandingRadius } =
    BOUNCE_CONFIG.finalLanding;
  const { early, mid, late, final } = BOUNCE_CONFIG.bounceDecay;

  // Final settle phase - after the light bounce up comes back down
  // settleT goes from 0 to 1 during progress thirdHit to 1.0
  if (progress > thirdHit) {
    const settleT = (progress - thirdHit) / (1 - thirdHit);

    // Final squash when ball lands from the light bounce (around settleT 0.85-0.95)
    // The light bounce peaks at settleT ~0.5, comes down after
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

  if (atBounce && progress > 0.05 && progress < 0.97) {
    // Impact squash - stronger for earlier bounces
    let bounceDecay: number = early;
    if (progress > 0.85) bounceDecay = final;
    else if (progress > 0.65) bounceDecay = late;
    else if (progress > 0.4) bounceDecay = mid;

    return {
      scaleX: 1 + intensity * 1.5 * bounceDecay,
      scaleY: 1 - intensity * 0.6 * bounceDecay,
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
