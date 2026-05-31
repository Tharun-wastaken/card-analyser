import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import SuitGlyph from "./SuitGlyph";
import { SUIT_COLOR } from "../api";

// Hero signature: a playing card balanced on its corner, spinning continuously.
// The spin is a pure CSS keyframe (GPU, no JS render loop). A decoupled interval
// swaps the card on the *hidden* face every half-turn, so each flip reveals a
// new card. Technique (preserve-3d + backface-visibility + rotateY face-swap)
// per 21st.dev flip-card, rebuilt in the Swiss/crimson style.

const SUITS = ["spades", "hearts", "clubs", "diamonds"];
const RANKS = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
const SPIN_SECONDS = 7;

function randomCard() {
  return {
    rank: RANKS[(Math.random() * RANKS.length) | 0],
    suit: SUITS[(Math.random() * SUITS.length) | 0],
  };
}

function CardFace({ card }) {
  const color = SUIT_COLOR[card.suit] || "#E7E7EA";
  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border border-rule-strong bg-gradient-to-br from-ink-850 to-ink-900 p-4 shadow-plate">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      <Corner rank={card.rank} suit={card.suit} color={color} />
      <div className="flex flex-1 items-center justify-center">
        <SuitGlyph suit={card.suit} size={88} />
      </div>
      <Corner rank={card.rank} suit={card.suit} color={color} flipped />
    </div>
  );
}

function Corner({ rank, suit, color, flipped = false }) {
  return (
    <div
      className={`flex w-min flex-col items-center leading-none ${
        flipped ? "rotate-180 self-end" : ""
      }`}
    >
      <span className="font-mono text-xl font-bold tabular-nums" style={{ color }}>
        {rank}
      </span>
      <SuitGlyph suit={suit} size={16} />
    </div>
  );
}

export default function SpinningCard() {
  const reduce = useReducedMotion();
  const [faces, setFaces] = useState(() => ({ front: randomCard(), back: randomCard() }));
  const tick = useRef(0);

  useEffect(() => {
    if (reduce) return;
    // Every half-turn, swap the face that is currently hidden so the next
    // reveal is always a fresh card.
    const half = (SPIN_SECONDS / 2) * 1000;
    const id = setInterval(() => {
      tick.current += 1;
      // After an odd number of half-turns the front is hidden; refresh it.
      const refreshFront = tick.current % 2 === 1;
      setFaces((f) =>
        refreshFront ? { ...f, front: randomCard() } : { ...f, back: randomCard() }
      );
    }, half);
    return () => clearInterval(id);
  }, [reduce]);

  if (reduce) {
    return (
      <div className="flex items-center justify-center [perspective:1400px]">
        <div className="h-[300px] w-[210px] rotate-[-12deg]">
          <CardFace card={faces.front} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center [perspective:1400px]">
      <div
        className="pointer-events-none absolute h-40 w-40 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(200,50,60,0.22), transparent 70%)" }}
      />

      {/* Corner tilt: the card leans on its bottom-left corner while it turns. */}
      <div className="rotate-[-16deg] [transform-style:preserve-3d]">
        <div
          className="card-spin relative h-[300px] w-[210px] [transform-style:preserve-3d]"
          style={{ transformOrigin: "50% 100%" }}
        >
          <div className="absolute inset-0 [backface-visibility:hidden]">
            <CardFace card={faces.front} />
          </div>
          <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
            <CardFace card={faces.back} />
          </div>
        </div>
      </div>
    </div>
  );
}
