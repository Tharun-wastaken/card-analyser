// Shared Swiss/International-style primitives: wide-tracked mono captions,
// numbered section headers with a hairline rule, and the premium action button —
// the typographic spine that gives every panel the same structure.
import { motion } from "framer-motion";
import { EASE_OUT_EXPO } from "../motion";

export function Caption({ children, className = "", accent = false }) {
  return (
    <span
      className={`font-mono text-caption uppercase ${
        accent ? "text-crimson-500" : "text-steel-500"
      } ${className}`}
    >
      {children}
    </span>
  );
}

// A ruled, indexed section heading: "01  INPUT ——————————  right"
export function SectionHeader({ index, label, right = null }) {
  return (
    <div className="flex items-center gap-4 border-t border-rule pt-3">
      <span className="font-mono text-caption uppercase text-crimson-500">{index}</span>
      <span className="font-mono text-caption uppercase text-steel-300">{label}</span>
      <span className="h-px flex-1 bg-rule" />
      {right && <span className="font-mono text-caption uppercase text-steel-500">{right}</span>}
    </div>
  );
}

// Premium action button. Primary = filled crimson with a tinted glow + sweeping
// sheen on hover; secondary = hairline ghost. Spring press + lift give it weight.
export function ActionButton({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  className = "",
}) {
  const base =
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden px-7 py-3.5 font-mono text-caption uppercase transition-colors duration-200";

  const variants = {
    primary:
      "bg-crimson-500 text-chalk hover:bg-crimson-600 disabled:bg-ink-800 disabled:text-steel-600",
    secondary:
      "border border-rule text-steel-300 hover:border-rule-strong hover:text-chalk disabled:opacity-50",
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { y: 0, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 26 }}
      className={`${base} ${variants[variant]} ${
        disabled ? "cursor-not-allowed" : ""
      } ${className}`}
      style={
        variant === "primary" && !disabled
          ? { boxShadow: "0 10px 30px -12px rgba(200,50,60,0.55)" }
          : undefined
      }
    >
      {/* sweeping sheen on hover (primary only) */}
      {variant === "primary" && !disabled && (
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
      )}
      <span className="relative">{children}</span>
    </motion.button>
  );
}
