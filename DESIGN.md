# Design System: Card Analyser

A `stitch-design-taste` system doc for the playing-card classifier interface.
This is the single source of truth for the visual language. Every screen should
read as one deliberate object — a low-lit card room rendered as software.

## 1. Visual Theme & Atmosphere

A dark, editorial, card-table interface — charcoal felt under a single warm
light, with one disciplined crimson accent doing all the talking. The mood is
confident and quiet, like a dealer who never rushes. Density is balanced
(4/10): generous negative space, never sparse, never a cockpit. Variance is
high (8/10): asymmetric splits, offset weight, no centered hero. Motion is
fluid (6/10): spring physics, staggered reveals, one perpetual float on the
empty-state cards — nothing cinematic or distracting.

## 2. Color Palette & Roles

- **Charcoal Canvas** (`#0A0A0B`) — Primary background. Never pure black.
- **Ink Surface** (`#141417` / `#1A1A1E`) — Cards, panels, raised plates.
- **Ink Line** (`#26262B`) — 1px borders, dividers, structural separation.
- **Chalk** (`#FAFAF7`) — Primary text, verdict headlines.
- **Steel** (`#8A8A92` / `#A6A6AE`) — Secondary text, metadata, captions.
- **Crimson** (`#C8323C`) — The single accent. Verdicts, primary CTAs, the
  top prediction, active nav, focus. Saturation < 80%, no neon, no glow.
- **Crimson Deep** (`#A82831` / `#841F26`) — Pressed states, secondary bar fills.
- **Antique Gold** (`#C8A14A`) — Reserved exclusively for the joker mark.

Confidence tiers use accent *intensity*, not a rainbow: crimson for the top
read, deep crimson for moderate, steel for the long tail. A muted amber chip
marks "moderate confidence" as the one functional status hue.

## 3. Typography Rules

- **Display:** `Geist` — track-tight, weight-driven hierarchy (600–700).
  Headlines scale via `clamp()`; size is never used to scream.
- **Body:** `Geist` — relaxed leading, ~65ch max, Steel for secondary copy.
- **Mono:** `JetBrains Mono` — every number: confidence %, accuracy, counts,
  device label. Tabular figures so digits never jump.
- **Banned:** Inter, generic system fonts for headings, all serifs (this is a
  software UI).

## 4. Component Stylings

- **Buttons:** Flat crimson fill for the single primary action; ghost/outline
  for secondary. Tactile `active:translate-y-px`. No outer glow, no custom cursor.
- **Cards/Plates:** Generously rounded (`2rem`). Diffused plate shadow tinted to
  the charcoal hue. Used only where elevation marks the verdict or a result group.
- **Upload Zone:** Large dashed-to-solid drop target; crimson inset ring on
  drag-over; floating mini-card motif as the empty affordance.
- **Inputs/Buttons:** Label/intent always visible; disabled states drop to Ink
  with Steel text. Focus ring in crimson.
- **Loaders:** Skeletal shimmer matched to the exact result layout — verdict
  block, then five descending bars. No circular spinners.
- **Empty States:** A small fanned three-card composition with a one-line cue,
  not a "no data" string.
- **Error States:** Inline, crimson-tinted panel with a plain recovery hint
  (start the backend / train the model).

## 5. Layout Principles

- Max-width container (`1180px`), centered, generous side padding.
- Asymmetric two-column split for both views — input left, verdict right;
  never a centered hero (variance > 4).
- CSS Grid for the splits; single-column collapse below `1024px`.
- Full-height shell uses `min-h-[100dvh]`, never `h-screen`.
- No overlapping elements — each block owns its spatial zone.
- The banned "3 equal cards in a row" feature grid never appears.

## 6. Motion & Interaction

- Spring physics everywhere (`stiffness ~90–120, damping ~18–22`); no linear easing.
- Staggered cascade on the top-5 bars and per-class list (waterfall reveal).
- Confidence ring and score dial animate `stroke-dashoffset` on mount.
- Nav pill uses shared-layout (`layoutId`) for a fluid slide between tabs.
- Perpetual micro-loop: the empty-state hero card floats gently.
- Animate only `transform`, `opacity`, and SVG stroke. Grain lives on a fixed
  pseudo-element at 4% opacity.

## 7. Anti-Patterns (Banned)

- No emojis — suits are hand-drawn SVG marks.
- No Inter, no serif fonts.
- No pure black (`#000000`).
- No neon or outer-glow shadows.
- No oversaturated or multi-hue accent system.
- No gradient text on large headers.
- No custom mouse cursors.
- No overlapping elements.
- No 3-column equal card row.
- No filler UI text ("scroll to explore", bouncing chevrons).
- No fake round metrics — accuracy is whatever the test set returns.
- No AI copy clichés ("elevate", "seamless", "unleash").
- No broken image links — all imagery is local SVG.
