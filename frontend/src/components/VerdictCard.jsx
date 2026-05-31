import { motion } from "framer-motion";
import SuitGlyph from "./SuitGlyph";
import CountUp from "./CountUp";
import { Caption } from "./Swiss";
import { titleCase, tier } from "../api";
import { EASE_OUT_EXPO } from "../motion";

// Primary readout: a Swiss spec panel for the model's top call.
export default function VerdictCard({ top }) {
  const t = tier(top.confidence);
  const tierColor = {
    high: "text-crimson-500",
    medium: "text-gold",
    low: "text-steel-400",
  }[t.key];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
      className="border border-rule bg-ink-900"
    >
      <div className="flex items-stretch justify-between border-b border-rule">
        <div className="flex flex-1 flex-col justify-between gap-6 p-6 sm:p-7">
          <Caption accent>Primary Read</Caption>
          <h2 className="text-4xl font-semibold leading-[0.95] tracking-[-0.02em] text-chalk sm:text-5xl">
            {titleCase(top.label)}
          </h2>
        </div>
        <div className="grid w-28 shrink-0 place-items-center border-l border-rule bg-ink-850 sm:w-32">
          <SuitGlyph suit={top.suit} size={56} />
        </div>
      </div>

      <div className="p-6 sm:p-7">
        <div className="flex items-end justify-between gap-4">
          <Caption>Confidence</Caption>
          <Caption className={tierColor}>{t.text}</Caption>
        </div>

        <div className="mt-3 flex items-baseline gap-1 font-mono tabular-nums">
          <span className="text-6xl font-bold text-crimson-500 sm:text-7xl">
            <CountUp value={top.confidence * 100} decimals={1} duration={0.9} />
          </span>
          <span className="text-2xl text-crimson-600">%</span>
        </div>

        {/* Precision bar with tick marks */}
        <div className="relative mt-5 h-2 w-full bg-ink-800">
          <div className="absolute inset-0 flex justify-between">
            {[...Array(11)].map((_, i) => (
              <span key={i} className="w-px bg-rule" />
            ))}
          </div>
          <motion.div
            className="relative h-full w-full origin-left bg-crimson-500"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: Math.max(top.confidence, 0.012) }}
            transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: 0.1 }}
          />
        </div>
        <div className="mt-2 flex justify-between font-mono text-caption text-steel-600">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>
    </motion.div>
  );
}
