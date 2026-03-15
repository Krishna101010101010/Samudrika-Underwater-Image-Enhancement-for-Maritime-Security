"""
Image utilities for Samudrika: load, preprocess, postprocess, save.
"""

import numpy as np
import torch
from pathlib import Path
from typing import Union

try:
    from PIL import Image
except ImportError:
    Image = None


def load_image(path: Union[str, Path]) -> np.ndarray:
    """Load image from path as RGB numpy array (H, W, 3) in [0, 255]."""
    path = Path(path)
    if not path.exists():
        raise FileNotFoundError(f"Image not found: {path}")
    if Image is None:
        raise ImportError("PIL is required for load_image")
    img = Image.open(path).convert("RGB")
    return np.array(img)


def preprocess_for_model(img: np.ndarray, size: int = 256, device: torch.device = None) -> torch.Tensor:
    """
    Convert numpy image (H,W,3) [0,255] to tensor (1,C,H,W) normalized in [-1,1].
    """
    if Image is None:
        raise ImportError("PIL is required")
    pil = Image.fromarray(img.astype(np.uint8))
    from torchvision import transforms
    t = transforms.Compose([
        transforms.Resize((size, size)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5]),
    ])
    x = t(pil).unsqueeze(0)
    if device is not None:
        x = x.to(device)
    return x


def tensor_to_numpy(t: torch.Tensor, to_uint8: bool = True) -> np.ndarray:
    """
    Convert model output tensor (B,C,H,W) in [-1,1] to numpy (H,W,3) or (B,H,W,3).
    """
    x = t.detach().cpu().float()
    if x.dim() == 4:
        x = x[0]
    # C,H,W -> H,W,C
    x = x.permute(1, 2, 0).numpy()
    # [-1,1] -> [0,1]
    x = (x * 0.5 + 0.5).clip(0, 1)
    if to_uint8:
        x = (x * 255).astype(np.uint8)
    return x


def save_image(arr: np.ndarray, path: Union[str, Path]) -> None:
    """Save numpy image (H,W,3) to path."""
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    if arr.dtype != np.uint8:
        arr = (np.clip(arr, 0, 1) * 255).astype(np.uint8)
    if Image is None:
        raise ImportError("PIL is required for save_image")
    Image.fromarray(arr).save(path)
