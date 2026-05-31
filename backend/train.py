"""Train SimpleCardClassifier and save weights + class mapping.

Mirrors the training loop in dataset.ipynb (EfficientNet-B0, 5 epochs, Adam 1e-3,
CrossEntropyLoss, Resize(128) + ToTensor). Produces:

    model/card_classifier.pth   - state_dict
    model/classes.json          - {"0": "ace of clubs", ...} idx -> label

Run from the project root:  python backend/train.py
"""
import json
from pathlib import Path

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
import torchvision.transforms as transforms
from torchvision.datasets import ImageFolder
from tqdm import tqdm

from model import SimpleCardClassifier, IMAGE_SIZE

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "datasetclassification"
OUT = ROOT / "model"
NUM_EPOCHS = 5
BATCH_SIZE = 32
LR = 1e-3


def main():
    OUT.mkdir(exist_ok=True)
    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    transform = transforms.Compose([
        transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
        transforms.ToTensor(),
    ])

    train_ds = ImageFolder(str(DATA / "train"), transform=transform)
    val_ds = ImageFolder(str(DATA / "valid"), transform=transform)
    train_loader = DataLoader(train_ds, batch_size=BATCH_SIZE, shuffle=True)
    val_loader = DataLoader(val_ds, batch_size=BATCH_SIZE, shuffle=False)

    num_classes = len(train_ds.classes)
    print(f"{len(train_ds)} train / {len(val_ds)} val images, {num_classes} classes")

    # idx -> class name, e.g. {"0": "ace of clubs"}
    idx_to_class = {idx: name for name, idx in train_ds.class_to_idx.items()}
    (OUT / "classes.json").write_text(
        json.dumps({str(k): v for k, v in idx_to_class.items()}, indent=2)
    )

    model = SimpleCardClassifier(num_classes=num_classes).to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=LR)

    best_val = float("inf")
    for epoch in range(NUM_EPOCHS):
        model.train()
        running = 0.0
        for images, labels in tqdm(train_loader, desc=f"Epoch {epoch+1} train"):
            images, labels = images.to(device), labels.to(device)
            optimizer.zero_grad()
            loss = criterion(model(images), labels)
            loss.backward()
            optimizer.step()
            running += loss.item() * images.size(0)
        train_loss = running / len(train_loader.dataset)

        model.eval()
        running = 0.0
        with torch.no_grad():
            for images, labels in tqdm(val_loader, desc=f"Epoch {epoch+1} val"):
                images, labels = images.to(device), labels.to(device)
                running += criterion(model(images), labels).item() * images.size(0)
        val_loss = running / len(val_loader.dataset)

        print(f"Epoch {epoch+1}/{NUM_EPOCHS}  train_loss={train_loss:.4f}  val_loss={val_loss:.4f}")

        if val_loss < best_val:
            best_val = val_loss
            torch.save(model.state_dict(), OUT / "card_classifier.pth")
            print(f"  saved checkpoint (val_loss={val_loss:.4f})")

    print(f"\nDone. Best val_loss={best_val:.4f}")
    print(f"Weights: {OUT / 'card_classifier.pth'}")
    print(f"Classes: {OUT / 'classes.json'}")


if __name__ == "__main__":
    main()
