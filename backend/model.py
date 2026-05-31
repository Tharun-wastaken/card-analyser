"""Shared model definition for the playing-card classifier.

Lifted verbatim from dataset.ipynb so that the weights saved by train.py load
cleanly here at inference time. Keep this in sync with the notebook.
"""
import torch.nn as nn
import timm

# The training transform used only Resize(128, 128) + ToTensor() -- no ImageNet
# normalization. Inference MUST match exactly to avoid train/serve skew.
IMAGE_SIZE = 128
ENET_OUT_SIZE = 1280
NUM_CLASSES = 53


class SimpleCardClassifier(nn.Module):
    def __init__(self, num_classes: int = NUM_CLASSES):
        super().__init__()
        self.base_model = timm.create_model("efficientnet_b0", pretrained=True)
        self.features = nn.Sequential(*list(self.base_model.children())[:-1])
        self.classifier = nn.Linear(ENET_OUT_SIZE, num_classes)

    def forward(self, x):
        x = self.features(x)
        return self.classifier(x)
