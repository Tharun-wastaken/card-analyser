# Read the Table

Drop a photo of a playing card. The model names the suit and rank.

EfficientNet-B0 fine-tuned on 53 classes (52 cards + joker), served by FastAPI, tested in a React frontend. Upload an image, get top-5 predictions with confidence scores. Switch to the Accuracy tab to run the full 265-image test set and see every misread.

## Stack

```
backend/
  model.py        — SimpleCardClassifier definition (EfficientNet-B0 + Linear 1280→53)
  train.py        — training loop, saves model/card_classifier.pth + classes.json
  app.py          — FastAPI server: /api/predict, /api/evaluate, /api/health
  requirements.txt

frontend/         — React + Vite + Tailwind CSS + Framer Motion
  src/
    components/   — SpinningCard, VerdictCard, ConfidenceBars, AccuracyView, ...
    motion.js     — shared easing tokens
    api.js        — fetch wrappers

model/            — generated weights (gitignored)
datasetclassification/
  train/  valid/  test/   — 53 class folders each
```

## Setup

**1. Train** (runs on GPU if available, ~5 min)

```bash
python backend/train.py
```

Writes `model/card_classifier.pth` and `model/classes.json`. You only do this once.

**2. Backend** (port 8000)

```bash
pip install -r backend/requirements.txt
python backend/app.py
```

**3. Frontend** (port 5173)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. Vite proxies `/api/*` to the backend, no extra config needed.

## Model

| | |
|---|---|
| Architecture | EfficientNet-B0 (pretrained) + Linear(1280 → 53) |
| Input | 128×128 RGB, ToTensor() only — no ImageNet normalization |
| Classes | 53 (ace through king × 4 suits + joker) |
| Training | 5 epochs, Adam lr=1e-3, CrossEntropyLoss |
| Test accuracy | 94.7% (251/265) |

Inference uses the same transform as training (`Resize(128, 128)` + `ToTensor()`, no normalization). Changing one without the other breaks accuracy.

## API

```
GET  /api/health      → { status, device, num_classes }
POST /api/predict     → multipart image → top-5 { label, rank, suit, confidence }
POST /api/evaluate    → runs test split → { overall_accuracy, per_class, misclassifications }
```

## Dataset

[Cards Image Dataset](https://www.kaggle.com/datasets/gpiosenka/cards-image-datasetclassification) — 7,624 train / 265 valid / 265 test images across 53 classes.
