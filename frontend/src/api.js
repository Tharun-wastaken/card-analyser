// Thin API client + display helpers for the card classifier.

export async function predict(file) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/predict", { method: "POST", body: form });
  if (!res.ok) {
    const detail = await safeDetail(res);
    throw new Error(detail || `Prediction failed (${res.status})`);
  }
  return res.json();
}

export async function evaluate() {
  const res = await fetch("/api/evaluate", { method: "POST" });
  if (!res.ok) {
    const detail = await safeDetail(res);
    throw new Error(detail || `Evaluation failed (${res.status})`);
  }
  return res.json();
}

export async function health() {
  const res = await fetch("/api/health");
  if (!res.ok) throw new Error(`Health check failed (${res.status})`);
  return res.json();
}

async function safeDetail(res) {
  try {
    const data = await res.json();
    return data.detail;
  } catch {
    return null;
  }
}

// "ace of clubs" -> "Ace of Clubs"
export function titleCase(label) {
  return label.replace(/\b\w/g, (c) => c.toUpperCase());
}

// Confidence tier drives copy + accent intensity (no rainbow palette).
export function tier(confidence) {
  if (confidence >= 0.8) return { key: "high", text: "High confidence" };
  if (confidence >= 0.5) return { key: "medium", text: "Moderate confidence" };
  return { key: "low", text: "Low confidence" };
}

export const SUIT_COLOR = {
  hearts: "#C8323C",
  diamonds: "#C8323C",
  clubs: "#E7E7EA",
  spades: "#E7E7EA",
};
