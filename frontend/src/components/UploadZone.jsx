import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { EASE_OUT_EXPO } from "../motion";
import { Caption } from "./Swiss";

export default function UploadZone({ onFile, preview, disabled }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  function handleFiles(files) {
    const file = files?.[0];
    if (file && file.type.startsWith("image/")) onFile(file);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (!disabled) handleFiles(e.dataTransfer.files);
      }}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`group relative aspect-[4/5] w-full cursor-pointer overflow-hidden border bg-ink-900 transition-colors
        ${dragging ? "border-crimson-500" : "border-rule hover:border-rule-strong"}
        ${disabled ? "pointer-events-none opacity-60" : ""}`}
    >
      {/* Crimson corner registration ticks — Swiss framing marks. */}
      <Corner pos="left-0 top-0" lines="border-l border-t" />
      <Corner pos="right-0 top-0" lines="border-r border-t" />
      <Corner pos="bottom-0 left-0" lines="border-b border-l" />
      <Corner pos="bottom-0 right-0" lines="border-b border-r" />

      {preview ? (
        <motion.img
          key={preview}
          src={preview}
          alt="Uploaded card"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
          className="absolute inset-0 h-full w-full object-contain p-8"
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-6 px-8 text-center">
          <div className="relative animate-float">
            <div className="h-20 w-14 border border-rule-strong bg-ink-850" />
            <div className="absolute -right-3 -top-2 h-20 w-14 rotate-[12deg] border border-crimson-700 bg-ink-850" />
          </div>
          <div>
            <p className="text-base font-medium text-chalk">Drop a card here</p>
            <Caption className="mt-2 block text-steel-400">
              Click to browse · JPG / PNG · single card
            </Caption>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute left-4 top-4">
        <Caption className={dragging ? "text-crimson-500" : "text-steel-600"}>
          {preview ? "Loaded" : dragging ? "Release" : "Empty"}
        </Caption>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}

function Corner({ pos, lines }) {
  return (
    <span
      className={`pointer-events-none absolute ${pos} ${lines} z-10 h-4 w-4 border-crimson-500/70`}
    />
  );
}
