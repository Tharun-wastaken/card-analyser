import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import UploadZone from "./UploadZone";
import VerdictCard from "./VerdictCard";
import ConfidenceBars from "./ConfidenceBars";
import { SectionHeader, Caption, ActionButton } from "./Swiss";
import { predict } from "../api";

export default function ClassifyView() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setResult(null);
    setError(null);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function run() {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const data = await predict(file);
      setResult(data.predictions);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  }

  return (
    <div className="grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <section className="flex flex-col gap-5">
        <SectionHeader index="01" label="Input" right={file ? "1 file" : "—"} />
        <UploadZone onFile={setFile} preview={preview} disabled={loading} />
        <div className="flex gap-3">
          <ActionButton onClick={run} disabled={!file || loading} className="flex-1">
            {loading ? "Reading…" : "Identify Card"}
          </ActionButton>
          {file && (
            <ActionButton onClick={reset} disabled={loading} variant="secondary">
              Clear
            </ActionButton>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <SectionHeader index="02" label="Readout" right={result ? "top 5" : "idle"} />
        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingState key="loading" />
          ) : error ? (
            <ErrorState key="error" message={error} />
          ) : result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-7"
            >
              <VerdictCard top={result[0]} />
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <Caption>Ranked Candidates</Caption>
                  <Caption>Softmax</Caption>
                </div>
                <ConfidenceBars predictions={result} />
              </div>
            </motion.div>
          ) : (
            <EmptyState key="empty" />
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-[26rem] flex-col items-center justify-center border border-dashed border-rule bg-ink-900/40 p-10 text-center"
    >
      <div className="flex -space-x-5">
        {["border-crimson-700", "border-rule-strong", "border-crimson-700"].map((c, i) => (
          <div
            key={i}
            className={`h-24 w-16 border ${c} bg-ink-850`}
            style={{ transform: `rotate(${(i - 1) * 9}deg)` }}
          />
        ))}
      </div>
      <Caption className="mt-8 block max-w-xs leading-5 text-steel-400">
        Verdict and ranked candidates render here once a card is identified
      </Caption>
    </motion.div>
  );
}

function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-7"
    >
      <div className="border border-rule bg-ink-900">
        <div className="border-b border-rule p-7">
          <div className="skeleton h-2.5 w-24" />
          <div className="skeleton mt-4 h-10 w-3/4" />
        </div>
        <div className="p-7">
          <div className="skeleton h-2.5 w-20" />
          <div className="skeleton mt-3 h-14 w-40" />
          <div className="skeleton mt-5 h-2 w-full" />
        </div>
      </div>
      <div className="border-y border-rule">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border-b border-rule py-3 last:border-0">
            <div className="skeleton h-2.5 w-full" style={{ opacity: 1 - i * 0.14 }} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ErrorState({ message }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-[26rem] flex-col items-center justify-center border border-crimson-700/40 bg-crimson-700/[0.06] p-10 text-center"
    >
      <Caption accent>Read Failed</Caption>
      <p className="mt-3 max-w-sm text-sm text-steel-300">{message}</p>
      <Caption className="mt-5 block max-w-sm leading-5 text-steel-500">
        Ensure the backend is running on port 8000 and the model is trained
      </Caption>
    </motion.div>
  );
}
