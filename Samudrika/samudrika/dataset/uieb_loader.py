"""
UIEB (Underwater Image Enhancement Benchmark) dataset loader for Samudrika.
Supports paired distorted + ground truth images with torchvision transforms.
"""

import os
from pathlib import Path
from typing import Optional, Tuple

import torch
from torch.utils.data import Dataset
from torchvision import transforms
from PIL import Image


class UIEBDataset(Dataset):
    """
    UIEB dataset for underwater image enhancement.
    Expects directory structure:
        root/
            raw/      (or distorted/) - input underwater images
            reference/ (or ref/)       - ground truth enhanced images
    Pairs by matching filenames between raw and reference folders.
    """

    def __init__(
        self,
        root: str,
        raw_dir: str = "raw",
        ref_dir: str = "reference",
        size: int = 256,
        normalize_range: Tuple[float, float] = (-1.0, 1.0),
        split: Optional[str] = None,
    ):
        """
        Args:
            root: Root path to UIEB dataset.
            raw_dir: Subfolder name for distorted/raw images.
            ref_dir: Subfolder name for reference/ground truth images.
            size: Resize images to (size x size).
            normalize_range: Output tensor range (min, max), e.g. (-1, 1).
            split: Optional 'train' or 'val' to use predefined split files (train.txt/val.txt).
        """
        self.root = Path(root)
        self.raw_path = self.root / raw_dir
        self.ref_path = self.root / ref_dir
        self.size = size
        self.low, self.high = normalize_range

        # Build list of pairs (raw, ref) by matching filenames
        self.pairs: list[Tuple[Path, Path]] = []
        if not self.raw_path.exists():
            # Fallback: treat root as containing both raw and ref subdirs with alternate names
            for d in ["raw", "distorted", "input"]:
                p = self.root / d
                if p.exists():
                    self.raw_path = p
                    break
        if not self.ref_path.exists():
            for d in ["reference", "ref", "gt", "enhanced"]:
                p = self.root / d
                if p.exists():
                    self.ref_path = p
                    break

        if self.raw_path.exists() and self.ref_path.exists():
            raw_files = {f.name: f for f in self.raw_path.iterdir() if f.suffix.lower() in (".jpg", ".jpeg", ".png", ".bmp")}
            for name, raw_f in raw_files.items():
                ref_f = self.ref_path / name
                if not ref_f.exists():
                    ref_f = self.ref_path / (Path(name).stem + ".jpg")
                if not ref_f.exists():
                    ref_f = self.ref_path / (Path(name).stem + ".png")
                if ref_f.exists():
                    self.pairs.append((raw_f, ref_f))
        else:
            # Single folder: assume pairs like img_001.jpg / img_001_ref.jpg or similar
            for folder in [self.raw_path, self.root]:
                if not folder.exists():
                    continue
                for f in folder.iterdir():
                    if f.suffix.lower() not in (".jpg", ".jpeg", ".png", ".bmp"):
                        continue
                    stem = f.stem
                    if stem.endswith("_ref") or stem.endswith("_gt"):
                        continue
                    ref_candidates = [
                        folder / (stem + "_ref.jpg"),
                        folder / (stem + "_ref.png"),
                        folder / (stem + "_gt.jpg"),
                        folder / (stem + "_gt.png"),
                        self.ref_path / f.name if self.ref_path.exists() else None,
                    ]
                    for ref_f in ref_candidates:
                        if ref_f and ref_f.exists():
                            self.pairs.append((f, ref_f))
                            break

        # Optional split
        if split and self.pairs:
            split_file = self.root / f"{split}.txt"
            if split_file.exists():
                with open(split_file) as fp:
                    names = {line.strip() for line in fp if line.strip()}
                self.pairs = [(r, ref) for r, ref in self.pairs if r.stem in names or r.name in names]

        # Transform: resize, to tensor, normalize to [low, high]
        self.transform = transforms.Compose([
            transforms.Resize((size, size), interpolation=transforms.InterpolationMode.BILINEAR),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.5, 0.5, 0.5],
                std=[0.5, 0.5, 0.5],
            ),
        ])

    def __len__(self) -> int:
        return len(self.pairs)

    def __getitem__(self, idx: int) -> Tuple[torch.Tensor, torch.Tensor]:
        raw_path, ref_path = self.pairs[idx]
        raw_img = Image.open(raw_path).convert("RGB")
        ref_img = Image.open(ref_path).convert("RGB")
        raw_t = self.transform(raw_img)
        ref_t = self.transform(ref_img)
        return raw_t, ref_t


def get_uieb_dataloaders(
    root: str,
    batch_size: int = 8,
    num_workers: int = 0,
    size: int = 256,
    raw_dir: str = "raw",
    ref_dir: str = "reference",
):
    """
    Create train and optionally validation DataLoaders for UIEB.
    If train.txt/val.txt exist, use them; otherwise use full dataset as train.
    """
    train_ds = UIEBDataset(root, raw_dir=raw_dir, ref_dir=ref_dir, size=size, split="train")
    if len(train_ds) == 0:
        train_ds = UIEBDataset(root, raw_dir=raw_dir, ref_dir=ref_dir, size=size)
    val_ds = None
    val_loader = None
    try:
        val_ds = UIEBDataset(root, raw_dir=raw_dir, ref_dir=ref_dir, size=size, split="val")
        if len(val_ds) > 0:
            val_loader = torch.utils.data.DataLoader(
                val_ds,
                batch_size=batch_size,
                shuffle=False,
                num_workers=num_workers,
                pin_memory=True,
            )
    except Exception:
        pass
    train_loader = torch.utils.data.DataLoader(
        train_ds,
        batch_size=batch_size,
        shuffle=True,
        num_workers=num_workers,
        pin_memory=True,
        drop_last=True,
    )
    return train_loader, val_loader
