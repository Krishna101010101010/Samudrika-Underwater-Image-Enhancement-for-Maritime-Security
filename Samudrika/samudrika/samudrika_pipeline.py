"""
Samudrika pipeline: load image -> preprocess -> run generator -> postprocess -> metrics -> display.
"""

from pathlib import Path
from typing import Optional, Union

import numpy as np
import torch

from .models import FUnIEGenerator
from .utils import load_image, preprocess_for_model, tensor_to_numpy, save_image, get_logger
from .metrics import psnr, ssim, uiqm


def run_pipeline(
    input_path: Union[str, Path],
    checkpoint_path: Union[str, Path],
    output_path: Optional[Union[str, Path]] = None,
    size: int = 256,
    compute_metrics: bool = True,
    reference_path: Optional[Union[str, Path]] = None,
    display: bool = False,
) -> dict:
    """
    Full pipeline: load -> preprocess -> enhance -> postprocess -> optional metrics and display.
    Returns dict with keys: enhanced (numpy array), metrics (if computed), optional ref_metrics.
    """
    logger = get_logger("pipeline")
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    input_path = Path(input_path)
    checkpoint_path = Path(checkpoint_path)

    if not input_path.exists():
        raise FileNotFoundError(f"Input image not found: {input_path}")
    if not checkpoint_path.exists():
        raise FileNotFoundError(f"Checkpoint not found: {checkpoint_path}")

    # Load model
    state = torch.load(checkpoint_path, map_location="cpu")
    if "generator" in state:
        state = state["generator"]
    elif "state_dict" in state:
        state = state["state_dict"]
    generator = FUnIEGenerator(in_channels=3, out_channels=3, base_channels=64, max_channels=512, num_down=4)
    generator.load_state_dict(state, strict=True)
    generator.to(device)
    generator.eval()

    # 1. Load image
    img = load_image(input_path)
    # 2. Preprocess
    x = preprocess_for_model(img, size=size, device=device)
    # 3. Run generator
    with torch.no_grad():
        out_t = generator(x)
    # 4. Postprocess
    enhanced = tensor_to_numpy(out_t, to_uint8=True)

    result = {"enhanced": enhanced}

    if output_path is not None:
        output_path = Path(output_path)
        save_image(enhanced, output_path)
        logger.info("Saved enhanced image to %s", output_path)

    # 5. Compute metrics
    if compute_metrics:
        # No-reference: UIQM on enhanced
        uiqm_enh = uiqm(enhanced)
        result["uiqm"] = uiqm_enh
        result["metrics"] = {"uiqm": uiqm_enh}
        if reference_path and Path(reference_path).exists():
            ref_img = load_image(reference_path)
            # Resize ref to match enhanced if needed
            if ref_img.shape[:2] != enhanced.shape[:2]:
                from PIL import Image
                ref_img = np.array(Image.fromarray(ref_img).resize((enhanced.shape[1], enhanced.shape[0])))
            data_range = 255.0
            result["psnr"] = psnr(enhanced, ref_img, data_range=data_range)
            result["ssim"] = ssim(enhanced, ref_img, data_range=data_range, channel_axis=-1)
            result["metrics"]["psnr"] = result["psnr"]
            result["metrics"]["ssim"] = result["ssim"]
            result["metrics"]["uiqm"] = uiqm_enh
        logger.info("Metrics: %s", result["metrics"])

    # 6. Display
    if display:
        try:
            import matplotlib.pyplot as plt
            fig, axes = plt.subplots(1, 2, figsize=(10, 5))
            axes[0].imshow(img)
            axes[0].set_title("Input")
            axes[0].axis("off")
            axes[1].imshow(enhanced)
            axes[1].set_title("Enhanced")
            axes[1].axis("off")
            if result.get("metrics"):
                axes[1].set_title(f"Enhanced (UIQM={result['metrics'].get('uiqm', 0):.3f})")
            plt.tight_layout()
            plt.show()
        except Exception as e:
            logger.warning("Display failed: %s", e)

    return result
