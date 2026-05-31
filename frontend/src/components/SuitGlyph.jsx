// Hand-drawn SVG suit marks — no emojis, crisp at any size.
import { SUIT_COLOR } from "../api";

const PATHS = {
  hearts:
    "M50 88 C18 64 8 44 8 28 C8 14 18 6 30 6 C40 6 47 12 50 20 C53 12 60 6 70 6 C82 6 92 14 92 28 C92 44 82 64 50 88 Z",
  diamonds: "M50 4 L90 50 L50 96 L10 50 Z",
  spades:
    "M50 6 C50 6 14 36 14 58 C14 72 24 80 36 78 C40 77 44 75 47 72 C45 82 41 88 34 92 L66 92 C59 88 55 82 53 72 C56 75 60 77 64 78 C76 80 86 72 86 58 C86 36 50 6 50 6 Z",
  clubs:
    "M50 4 C40 4 32 12 32 22 C32 27 34 31 37 35 C30 31 21 32 16 39 C10 47 12 58 21 63 C28 67 37 65 42 59 C40 71 35 84 28 92 L72 92 C65 84 60 71 58 59 C63 65 72 67 79 63 C88 58 90 47 84 39 C79 32 70 31 63 35 C66 31 68 27 68 22 C68 12 60 4 50 4 Z",
};

export default function SuitGlyph({ suit, size = 24, className = "" }) {
  if (!suit || !PATHS[suit]) {
    // Joker / unknown — a minimalist star mark.
    return (
      <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
        <path
          d="M50 6 L61 38 L95 38 L67 58 L78 92 L50 72 L22 92 L33 58 L5 38 L39 38 Z"
          fill="#C8A14A"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
      <path d={PATHS[suit]} fill={SUIT_COLOR[suit]} />
    </svg>
  );
}
