"""
UIQM (Underwater Image Quality Measure) - standard underwater quality metric.
Based on UICM (colorfulness), UISM (sharpness), UIConM (contrast).
"""

import numpy as np
from typing import Union


def _rgb_to_ycbcr(rgb: np.ndarray) -> np.ndarray:
    """Convert RGB (H,W,3) to YCbCr."""
    rgb = np.asarray(rgb, dtype=np.float64)
    if rgb.max() <= 1.0:
        rgb = rgb * 255.0
    y = 16 + (65.481 * rgb[..., 0] + 128.553 * rgb[..., 1] + 24.966 * rgb[..., 2]) / 255.0
    cb = 128 + (-37.797 * rgb[..., 0] - 74.203 * rgb[..., 1] + 112.0 * rgb[..., 2]) / 255.0
    cr = 128 + (112.0 * rgb[..., 0] - 93.786 * rgb[..., 1] - 18.214 * rgb[..., 2]) / 255.0
    return np.stack([y, cb, cr], axis=-1)


def _uicm(rgb: np.ndarray) -> float:
    """Underwater Image Colorfulness Measure."""
    ycbcr = _rgb_to_ycbcr(rgb)
    cb = ycbcr[..., 1].ravel()
    cr = ycbcr[..., 2].ravel()
    return float(-0.0268 * np.sqrt(np.mean(cb) ** 2 + np.mean(cr) ** 2) + 0.1586 * np.sqrt(np.var(cb) + np.var(cr)))


def _log_ame(img: np.ndarray, block_size: int = 8) -> float:
    """Log of AME (average of local contrast). Used in UISM."""
    h, w = img.shape[:2]
    if img.ndim == 3:
        img = np.mean(img, axis=2)
    img = np.asarray(img, dtype=np.float64)
    if img.max() <= 1.0:
        img = img * 255.0
    ame_vals = []
    for i in range(0, h - block_size, block_size):
        for j in range(0, w - block_size, block_size):
            blk = img[i : i + block_size, j : j + block_size]
            if np.std(blk) < 1e-6:
                continue
            imax = np.max(blk)
            imin = np.min(blk)
            ame_vals.append(np.log(imax - imin + 1e-6))
    if not ame_vals:
        return 0.0
    return float(np.mean(ame_vals))


def _uism(rgb: np.ndarray, block_size: int = 8) -> float:
    """Underwater Image Sharpness Measure (using log-AME on luminance)."""
    ycbcr = _rgb_to_ycbcr(rgb)
    y = ycbcr[..., 0]
    return _log_ame(y, block_size=block_size)


def _uiconm(rgb: np.ndarray, block_size: int = 8) -> float:
    """Underwater Image Contrast Measure."""
    if rgb.ndim == 3:
        gray = np.mean(rgb, axis=2)
    else:
        gray = rgb
    gray = np.asarray(gray, dtype=np.float64)
    if gray.max() <= 1.0:
        gray = gray * 255.0
    h, w = gray.shape
    contrasts = []
    for i in range(0, h - block_size, block_size):
        for j in range(0, w - block_size, block_size):
            blk = gray[i : i + block_size, j : j + block_size]
            contrasts.append(np.std(blk))
    if not contrasts:
        return 0.0
    return float(np.mean(contrasts))


def uiqm(
    img: np.ndarray,
    c1: float = 0.0282,
    c2: float = 0.2953,
    c3: float = 3.5753,
) -> float:
    """
    Underwater Image Quality Measure.
    UIQM = c1 * UICM + c2 * UISM + c3 * UIConM
    Higher is better (more colorful, sharper, more contrast).
    Args:
        img: (H,W,3) or (H,W), float [0,1] or uint8 [0,255].
    Returns:
        UIQM score (no fixed range; higher is better).
    """
    img = np.asarray(img)
    if img.ndim == 2:
        img = np.stack([img, img, img], axis=-1)
    if img.max() <= 1.0 and np.issubdtype(img.dtype, np.floating):
        img = (np.clip(img, 0, 1) * 255).astype(np.uint8)
    uicm_val = _uicm(img)
    uism_val = _uism(img)
    uiconm_val = _uiconm(img)
    return float(c1 * uicm_val + c2 * uism_val + c3 * uiconm_val)
