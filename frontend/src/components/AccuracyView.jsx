import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { evaluate, titleCase } from "../api";
import SuitGlyph from "./SuitGlyph";
import CountUp from "./CountUp";
import { SectionHeader, Caption, ActionButton } from "./Swiss";
import { EASE_OUT_EXPO } from "../motion";

export default function AccuracyView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      setData(await evaluate());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <SectionHeader index="01" label="Evaluation" right={data ? "complete" : "ready"} />
        <div className="grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold leading-[1] tracking-[-0.02em] text-chalk sm:text-4xl">
              Put the model on trial
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-steel-300">
              Runs the held-out test set, 265 images across 53 classes, through
              the classifier and reports overall accuracy, the weakest classes,
              and every card it misread.
            </p>
            <div className="mt-7">
              <ActionButton onClick={run} disabled={loading}>
                {loading ? "Dealing…" : data ? "Run Again" : "Run Accuracy Test"}
              </ActionButton>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <ReadoutSkeleton key="l" />
            ) : data ? (
              <OverallReadout key="d" data={data} />
            ) : (
              <IdleReadout key="e" />
            )}
          </AnimatePresence>
        </div>
      </section>

      {error && (
        <div className="border border-crimson-700/40 bg-crimson-700/[0.06] p-5 text-sm text-steel-300">
          {error}
        </div>
      )}

      <AnimatePresence>
        {data && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
            className="grid gap-x-12 gap-y-10 lg:grid-cols-2"
          >
            <PerClass perClass={data.per_class} />
            <Misses misses={data.misclassifications} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OverallReadout({ data }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
      className="relative overflow-hidden border border-rule bg-ink-900 p-7"
    >
      {/* top accent strip */}
      <motion.div
        className="absolute inset-x-0 top-0 h-0.5 origin-left bg-crimson-500"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
      />
      {/* crimson glow pooled behind the headline number */}
      <div
        className="pointer-events-none absolute -left-10 top-6 h-44 w-44 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(200,50,60,0.18), transparent 70%)" }}
      />

      <div className="relative flex items-start justify-between">
        <Caption accent>Overall Accuracy</Caption>
        <Caption>Test Split</Caption>
      </div>

      <div className="relative mt-4 flex items-baseline gap-1 font-mono tabular-nums">
        <span className="text-7xl font-bold leading-none text-crimson-500 sm:text-8xl">
          <CountUp value={data.overall_accuracy * 100} decimals={1} duration={1.1} />
        </span>
        <span className="text-3xl text-crimson-600">%</span>
      </div>

      <div className="relative mt-6 h-2 w-full overflow-hidden bg-ink-800">
        <div className="absolute inset-0 flex justify-between">
          {[...Array(11)].map((_, i) => (
            <span key={i} className="w-px bg-rule" />
          ))}
        </div>
        <motion.div
          className="relative h-full w-full origin-left bg-crimson-500"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: data.overall_accuracy }}
          transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
        />
      </div>

      <dl className="relative mt-7 grid grid-cols-3 gap-px border border-rule bg-rule font-mono">
        <Stat label="Correct" value={data.correct} />
        <Stat label="Total" value={data.total} />
        <Stat label="Misreads" value={data.misclassifications.length} accent />
      </dl>
    </motion.div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="bg-ink-900 p-4">
      <dt className="text-caption uppercase text-steel-500">{label}</dt>
      <dd className={`mt-1.5 text-2xl tabular-nums ${accent ? "text-crimson-500" : "text-chalk"}`}>
        {value}
      </dd>
    </div>
  );
}

function IdleReadout() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-[16rem] items-center justify-center border border-dashed border-rule"
    >
      <Caption className="text-steel-600">Awaiting the deal</Caption>
    </motion.div>
  );
}

function ReadoutSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="border border-rule bg-ink-900 p-7"
    >
      <div className="skeleton h-2.5 w-32" />
      <div className="skeleton mt-4 h-16 w-48" />
      <div className="skeleton mt-6 h-2 w-full" />
      <div className="mt-7 grid grid-cols-3 gap-px">
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton h-16" />
        ))}
      </div>
    </motion.div>
  );
}

function PerClass({ perClass }) {
  const imperfect = perClass.filter((c) => c.accuracy < 1);
  const perfect = perClass.length - imperfect.length;
  return (
    <div className="flex flex-col gap-5">
      <SectionHeader index="02" label="Per-Class Accuracy" right={`${perfect}/53 perfect`} />
      {imperfect.length === 0 ? (
        <p className="border-y border-rule py-10 text-center text-sm text-steel-400">
          Every class scored 100% on the test set.
        </p>
      ) : (
        <ul className="divide-y divide-rule border-y border-rule">
          {imperfect.map((c, i) => (
            <motion.li
              key={c.label}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4, ease: EASE_OUT_EXPO }}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-2 py-3 transition-colors duration-200 hover:bg-ink-850/70"
            >
              <span className="font-mono text-caption tabular-nums text-steel-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <SuitGlyph suit={suitOf(c.label)} size={13} className="shrink-0" />
                  <span className="truncate text-sm text-steel-300">{titleCase(c.label)}</span>
                  <span className="font-mono text-caption text-steel-600">
                    {c.correct}/{c.total}
                  </span>
                </div>
                <div className="mt-1.5 h-1 w-full bg-ink-800">
                  <motion.div
                    className="h-full w-full origin-left bg-crimson-500"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: c.accuracy }}
                    transition={{ delay: i * 0.04 + 0.05, duration: 0.5, ease: EASE_OUT_EXPO }}
                  />
                </div>
              </div>
              <span className="w-12 text-right font-mono text-sm tabular-nums text-steel-400">
                {Math.round(c.accuracy * 100)}%
              </span>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Misses({ misses }) {
  return (
    <div className="flex flex-col gap-5">
      <SectionHeader index="03" label="Misreads" right={`${misses.length} total`} />
      {misses.length === 0 ? (
        <p className="border-y border-rule py-10 text-center text-sm text-steel-400">
          A clean sweep, no misreads.
        </p>
      ) : (
        <ul className="max-h-[24rem] divide-y divide-rule overflow-y-auto border-y border-rule">
          {misses.map((m, i) => (
            <li key={i} className="grid grid-cols-[auto_1fr_auto_1fr] items-center gap-3 px-2 py-3 transition-colors duration-200 hover:bg-ink-850/70">
              <span className="font-mono text-caption tabular-nums text-steel-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex items-center gap-2 truncate text-sm text-steel-300">
                <SuitGlyph suit={suitOf(m.actual)} size={13} />
                {titleCase(m.actual)}
              </span>
              <span className="font-mono text-crimson-500">&rarr;</span>
              <span className="flex items-center gap-2 truncate text-sm text-crimson-300">
                <SuitGlyph suit={suitOf(m.predicted)} size={13} />
                {titleCase(m.predicted)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function suitOf(label) {
  const last = label.split(" ").pop();
  return ["clubs", "diamonds", "hearts", "spades"].includes(last) ? last : null;
}
