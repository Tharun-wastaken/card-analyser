// Animated number that counts up to a target using an ease-out curve.
// Uses requestAnimationFrame, animating text content only (no layout thrash).
// Honors prefers-reduced-motion by jumping straight to the final value.
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { EASE_OUT_EXPO } from "../motion";

// Cubic-bezier y(t) with fixed endpoints P0=(0,0), P3=(1,1).
// Sampled directly on t -- exact enough for a display counter.
function bezierY(p1y, p2y) {
  return (t) => {
    const u = 1 - t;
    return 3 * u * u * t * p1y + 3 * u * t * t * p2y + t * t * t;
  };
}

const easeOut = bezierY(EASE_OUT_EXPO[1], EASE_OUT_EXPO[3]);

export default function CountUp({ value, decimals = 0, duration = 1 }) {
  const to = Number(value) || 0;
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? to : 0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    if (reduce) {
      setDisplay(to);
      return;
    }
    startRef.current = null;

    function frame(ts) {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(elapsed / (duration * 1000), 1);
      setDisplay(to * easeOut(t));
      if (t < 1) rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [to, duration, reduce]);

  return <span>{display.toFixed(decimals)}</span>;
}
