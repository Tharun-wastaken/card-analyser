// Shared motion language.
//
// Exponential ease-out for entrances (fast arrival, soft settle, no bounce);
// springs stay reserved for direct interaction feedback. Every consumer renders
// inside <MotionConfig reducedMotion="user"> (see main.jsx), so transform-based
// motion is automatically neutralized when the OS asks for less.

export const EASE_OUT_QUART = [0.22, 1, 0.36, 1];
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

// Parent that releases its children in sequence — a waterfall, not a flash.
export const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

// The single entrance gesture children inherit: rise and resolve.
export const riseIn = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_OUT_EXPO },
  },
};
