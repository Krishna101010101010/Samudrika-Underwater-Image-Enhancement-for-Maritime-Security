"""
PSNR (Peak Signal-to-Noise Ratio) for image quality.
Uses skimage when available.
"""

import numpy as np
from typing import Union

try:
    from skimage.metrics import peak_signal_noise_ratio as skimage_psnr
    _HAS_SKIMAGE = True
except ImportError:
    _HAS_SKIMAGE = False


def psnr(
    img1: np.ndarray,
    img2: np.ndarray,
    data_range: Union[float, None] = None,
) -> float:
    """
    Compute PSNR between two images.
    Args:
        img1, img2: (H,W) or (H,W,3), same shape, float [0,1] or uint8 [0,255].
        data_range: Max value (e.g. 1.0 or 255). If None, inferred from dtype.
    Returns:
        PSNR in dB.
    """
    if img1.shape != img2.shape:
        raise ValueError("Images must have the same shape.")
    if data_range is None:
        data_range = 255.0 if np.issubdtype(img1.dtype, np.integer) else 1.0
    if _HAS_SKIMAGE:
        return float(skimage_psnr(img1, img2, data_range=data_range))
    mse = np.mean((img1.astype(np.float64) - img2.astype(np.float64)) ** 2)
    if mse <= 0:
        return float("inf")
    return float(10.0 * np.log10((data_range ** 2) / mse))
