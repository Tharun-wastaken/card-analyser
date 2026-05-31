import { motion } from "framer-motion";
import SuitGlyph from "./SuitGlyph";
import { titleCase } from "../api";
import { EASE_OUT_EXPO } from "../motion";

function fillColor(confidence, top) {
  if (top) return "#C8323C";
  if (confidence >= 0.5) return "#A82831";
  if (confidence >= 0.2) return "#46464E";
  return "#2A2A31";
}

// Ranked candidate table — indexed Swiss data rows.
export default function ConfidenceBars({ predictions }) {
  return (
    <ul className="divide-y divide-rule border-y border-rule">
      {predictions.map((p, i) => {
        const pct = (p.confidence * 100).toFixed(1);
        return (
          <motion.li
            key={p.label}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.4, ease: EASE_OUT_EXPO }}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-2 py-3 transition-colors duration-200 hover:bg-ink-850/70"
          >
            <span className="font-mono text-caption tabular-nums text-steel-600">
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <SuitGlyph suit={p.suit} size={14} className="shrink-0" />
                <span
                  className={`truncate text-sm ${
                    i === 0 ? "font-semibold text-chalk" : "text-steel-300"
                  }`}
                >
                  {titleCase(p.label)}
                </span>
              </div>
              <div className="mt-1.5 h-1 w-full bg-ink-800">
                <motion.div
                  className="h-full w-full origin-left"
                  style={{ backgroundColor: fillColor(p.confidence, i === 0) }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: Math.max(p.confidence, 0.012) }}
                  transition={{ delay: 0.05 * i + 0.05, duration: 0.55, ease: EASE_OUT_EXPO }}
                />
              </div>
            </div>

            <span className="w-14 text-right font-mono text-sm tabular-nums text-steel-400">
              {pct}%
            </span>
          </motion.li>
        );
      })}
    </ul>
  );
}
