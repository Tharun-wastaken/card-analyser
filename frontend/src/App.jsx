import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ClassifyView from "./components/ClassifyView";
import AccuracyView from "./components/AccuracyView";
import SpinningCard from "./components/SpinningCard";
import { Caption } from "./components/Swiss";
import { stagger, riseIn, EASE_OUT_EXPO } from "./motion";
import { health } from "./api";

const TABS = [
  { id: "classify", label: "Classify", index: "01" },
  { id: "accuracy", label: "Accuracy", index: "02" },
];

export default function App() {
  const [tab, setTab] = useState("classify");
  const [status, setStatus] = useState(null);

  useEffect(() => {
    health()
      .then(setStatus)
      .catch(() => setStatus({ status: "offline" }));
  }, []);

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-[1240px] flex-col px-5 sm:px-8">
      <Header status={status} tab={tab} setTab={setTab} />

      <main className="flex-1 pb-20 pt-10 sm:pt-16">
        <Hero />
        <div className="mt-16 sm:mt-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
            >
              {tab === "classify" ? <ClassifyView /> : <AccuracyView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Header({ status, tab, setTab }) {
  return (
    <header className="sticky top-0 z-40 -mx-5 border-b border-rule bg-ink-950/85 px-5 backdrop-blur-md sm:-mx-8 sm:px-8">
      <div className="flex h-16 items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center border border-crimson-700/60 bg-ink-900">
            <span className="font-mono text-xs font-bold text-crimson-400">A&#9830;</span>
          </div>
          <div className="leading-none">
            <div className="text-sm font-semibold tracking-tight text-chalk">Read the Table</div>
            <Caption className="mt-1 block">Card Vision System</Caption>
          </div>
        </div>

        <nav className="flex items-stretch self-stretch">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="group relative flex items-center gap-2 px-4 sm:px-6"
              >
                <span
                  className={`font-mono text-caption uppercase transition-colors ${
                    active ? "text-crimson-500" : "text-steel-600"
                  }`}
                >
                  {t.index}
                </span>
                <span
                  className={`text-sm transition-colors ${
                    active ? "text-chalk" : "text-steel-400 group-hover:text-steel-200"
                  }`}
                >
                  {t.label}
                </span>
                {active && (
                  <motion.span
                    layoutId="tab-underline"
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-crimson-500"
                    transition={{ type: "spring", stiffness: 320, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        <StatusReadout status={status} />
      </div>
    </header>
  );
}

function StatusReadout({ status }) {
  const ready = status?.status === "ready";
  return (
    <div className="hidden items-center gap-2 md:flex">
      <span
        className={`h-1.5 w-1.5 ${ready ? "bg-crimson-500" : "bg-steel-600"}`}
        style={ready ? { boxShadow: "0 0 8px rgba(200,50,60,0.7)" } : undefined}
      />
      <span className="font-mono text-caption uppercase text-steel-400">
        {ready ? `${status.device} · ${status.num_classes} cls` : "offline"}
      </span>
    </div>
  );
}

function Hero() {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
      <motion.div variants={stagger} initial="hidden" animate="show">
        <motion.div variants={riseIn} className="flex items-center gap-4">
          <Caption accent>ML-01</Caption>
          <span className="h-px w-16 bg-rule-strong" />
          <Caption>EfficientNet-B0 · Transfer-Learned</Caption>
        </motion.div>

        <motion.h1
          variants={riseIn}
          className="mt-6 max-w-[15ch] text-balance text-[clamp(2.75rem,6.5vw,5.25rem)] font-semibold leading-[0.92] tracking-[-0.035em] text-chalk"
        >
          Show it a card. It calls the{" "}
          <span className="text-crimson-500">suit and rank</span>.
        </motion.h1>

        <motion.p
          variants={riseIn}
          className="mt-7 max-w-[52ch] text-pretty text-base leading-relaxed text-steel-300"
        >
          A fine-tuned convolutional network reads a single playing card from a
          photo and returns its best guess with calibrated confidence, then
          proves itself against a held-out test set.
        </motion.p>

        <motion.dl variants={riseIn} className="mt-8 flex gap-10 font-mono text-sm">
          <Spec label="Classes" value="53" />
          <Spec label="Input" value="128²" />
          <Spec label="Top-k" value="5" />
        </motion.dl>
      </motion.div>

      {/* Signature: a card spinning on its corner, dealing a new face each turn. */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.2 }}
        className="hidden justify-center pr-6 lg:flex"
      >
        <SpinningCard />
      </motion.div>
    </div>
  );
}

function Spec({ label, value }) {
  return (
    <div>
      <dt className="text-caption uppercase text-steel-500">{label}</dt>
      <dd className="mt-1 tabular-nums text-chalk">{value}</dd>
    </div>
  );
}

function Footer() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-rule py-6">
      <Caption>EfficientNet-B0 · 53 Classes · Playing Cards Dataset</Caption>
      <Caption>Read the Table — Card Vision System</Caption>
    </footer>
  );
}
