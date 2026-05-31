"""FastAPI inference server for the playing-card classifier.

Endpoints
    GET  /api/health     - model status + class count
    POST /api/predict    - multipart image -> top-5 predictions
    POST /api/evaluate   - run the test set, return accuracy + misclassifications

Run from the project root:  python backend/app.py
"""
import io
import json
from pathlib import Path

import torch
import torch.nn.functional as F
import torchvision.transforms as transforms
from torchvision.datasets import ImageFolder
from torch.utils.data import DataLoader
from PIL import Image

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from model import SimpleCardClassifier, IMAGE_SIZE

ROOT = Path(__file__).resolve().parent.parent
MODEL_DIR = ROOT / "model"
DATA = ROOT / "datasetclassification"
WEIGHTS = MODEL_DIR / "card_classifier.pth"
CLASSES = MODEL_DIR / "classes.json"

SUITS = {"clubs", "diamonds", "hearts", "spades"}

transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
])

app = FastAPI(title="Card Classifier API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- model state, loaded once at startup -----------------------------------
state = {"model": None, "idx_to_class": {}, "device": None}


def split_label(label: str):
    """'ace of clubs' -> ('ace', 'clubs'); 'joker' -> ('joker', None)."""
    parts = label.split()
    suit = parts[-1] if parts and parts[-1] in SUITS else None
    rank = parts[0] if parts else label
    return rank, suit


@app.on_event("startup")
def load_model():
    if not WEIGHTS.exists() or not CLASSES.exists():
        raise RuntimeError(
            f"Model not found. Run `python backend/train.py` first.\n"
            f"  expected: {WEIGHTS}\n            {CLASSES}"
        )
    idx_to_class = {int(k): v for k, v in json.loads(CLASSES.read_text()).items()}
    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    model = SimpleCardClassifier(num_classes=len(idx_to_class))
    model.load_state_dict(torch.load(WEIGHTS, map_location=device))
    model.to(device).eval()
    state.update(model=model, idx_to_class=idx_to_class, device=device)
    print(f"Loaded model on {device} with {len(idx_to_class)} classes")


@app.get("/api/health")
def health():
    return {
        "status": "ready" if state["model"] is not None else "no_model",
        "device": str(state["device"]),
        "num_classes": len(state["idx_to_class"]),
    }


@app.post("/api/predict")
async def predict(file: UploadFile = File(...)):
    if state["model"] is None:
        raise HTTPException(503, "Model not loaded")
    try:
        img = Image.open(io.BytesIO(await file.read())).convert("RGB")
    except Exception:
        raise HTTPException(400, "Could not read image")

    tensor = transform(img).unsqueeze(0).to(state["device"])
    with torch.no_grad():
        probs = F.softmax(state["model"](tensor), dim=1)[0]

    k = min(5, probs.numel())
    top_p, top_i = torch.topk(probs, k)
    predictions = []
    for p, i in zip(top_p.tolist(), top_i.tolist()):
        label = state["idx_to_class"][i]
        rank, suit = split_label(label)
        predictions.append(
            {"label": label, "rank": rank, "suit": suit, "confidence": p}
        )
    return {"predictions": predictions}


@app.post("/api/evaluate")
def evaluate():
    """Run the held-out test set and report accuracy + every miss."""
    if state["model"] is None:
        raise HTTPException(503, "Model not loaded")

    test_dir = DATA / "test"
    if not test_dir.exists():
        raise HTTPException(404, "Test set not found")

    ds = ImageFolder(str(test_dir), transform=transform)
    loader = DataLoader(ds, batch_size=32, shuffle=False)
    idx_to_class = {v: k for k, v in ds.class_to_idx.items()}

    n_classes = len(ds.classes)
    per_correct = [0] * n_classes
    per_total = [0] * n_classes
    misses = []
    correct = total = 0
    sample = 0

    with torch.no_grad():
        for images, labels in loader:
            images = images.to(state["device"])
            preds = state["model"](images).argmax(dim=1).cpu()
            for true, pred in zip(labels.tolist(), preds.tolist()):
                per_total[true] += 1
                total += 1
                if true == pred:
                    per_correct[true] += 1
                    correct += 1
                else:
                    misses.append({
                        "index": sample,
                        "actual": idx_to_class[true],
                        "predicted": idx_to_class[pred],
                    })
                sample += 1

    per_class = [
        {
            "label": idx_to_class[i],
            "correct": per_correct[i],
            "total": per_total[i],
            "accuracy": (per_correct[i] / per_total[i]) if per_total[i] else 0.0,
        }
        for i in range(n_classes)
    ]
    per_class.sort(key=lambda c: c["accuracy"])  # worst first

    return {
        "overall_accuracy": correct / total if total else 0.0,
        "correct": correct,
        "total": total,
        "per_class": per_class,
        "misclassifications": misses,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
