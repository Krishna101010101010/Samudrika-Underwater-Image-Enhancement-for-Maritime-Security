"""
SSIM (Structural Similarity Index) for image quality.
Uses skimage when available.
"""

import numpy as np
from typing import Union

try:
    from skimage.metrics import structural_similarity as ssim_fn
    _HAS_SKIMAGE = True
except ImportError:
    _HAS_SKIMAGE = False


def ssim(
    img1: np.ndarray,
    img2: np.ndarray,
    data_range: Union[float, None] = None,
    channel_axis: Union[int, None] = -1,
) -> float:
    """
    Compute SSIM between two images.
    Args:
        img1, img2: (H,W) or (H,W,3), same shape.
        data_range: Max value (e.g. 1.0 or 255). If None, inferred.
        channel_axis: Axis for channels (e.g. -1 for (H,W,C)). None for grayscale.
    Returns:
        SSIM score in [0, 1] (higher is better).
    """
    if img1.shape != img2.shape:
        raise ValueError("Images must have the same shape.")
    if data_range is None:
        data_range = 255.0 if np.issubdtype(img1.dtype, np.integer) else 1.0
    if not _HAS_SKIMAGE:
        return _ssim_fallback(img1, img2, data_range)
    return float(
        ssim_fn(
            img1,
            img2,
            data_range=data_range,
            channel_axis=channel_axis if img1.ndim == 3 else None,
        )
    )


def _ssim_fallback(img1: np.ndarray, img2: np.ndarray, data_range: float) -> float:
    """Simple SSIM approximation if skimage not available."""
    c1 = 0.01 * data_range ** 2
    c2 = 0.03 * data_range ** 2
    mu1 = np.mean(img1)
    mu2 = np.mean(img2)
    s1 = np.var(img1)
    s2 = np.var(img2)
    s12 = np.mean((img1 - mu1) * (img2 - mu2))
    return float(((2 * mu1 * mu2 + c1) * (2 * s12 + c2)) / ((mu1 ** 2 + mu2 ** 2 + c1) * (s1 + s2 + c2)))
