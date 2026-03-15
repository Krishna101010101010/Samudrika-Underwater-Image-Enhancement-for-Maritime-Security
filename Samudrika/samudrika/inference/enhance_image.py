"""
Inference script: load trained generator, process underwater image, save/display result.
Usage: python -m samudrika.inference.enhance_image input.jpg [--output out.jpg] [--show]
"""

import argparse
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import torch

from models import FUnIEGenerator
from utils import load_image, preprocess_for_model, tensor_to_numpy, save_image


def parse_args():
    p = argparse.ArgumentParser(description="Enhance underwater image with Samudrika")
    p.add_argument("input", type=str, help="Input image path")
    p.add_argument("--output", "-o", type=str, default="", help="Output path (default: input_enhanced.jpg)")
    p.add_argument("--checkpoint", "-c", type=str, default="checkpoints/samudrika_epoch_100.pt", help="Generator checkpoint")
    p.add_argument("--size", type=int, default=256, help="Model input size")
    p.add_argument("--show", action="store_true", help="Display before/after (requires matplotlib)")
    return p.parse_args()


def main():
    args = parse_args()
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    # Load model
    ckpt_path = Path(args.checkpoint)
    if not ckpt_path.exists():
        # Try relative to project root
        ckpt_path = ROOT.parent / args.checkpoint
    if not ckpt_path.exists():
        print(f"Checkpoint not found: {args.checkpoint}", file=sys.stderr)
        sys.exit(1)

    state = torch.load(ckpt_path, map_location="cpu")
    if "generator" in state:
        state = state["generator"]
    elif "state_dict" in state:
        state = state["state_dict"]

    generator = FUnIEGenerator(in_channels=3, out_channels=3, base_channels=64, max_channels=512, num_down=4)
    generator.load_state_dict(state, strict=True)
    generator.to(device)
    generator.eval()

    # Load and preprocess image
    inp_path = Path(args.input)
    if not inp_path.exists():
        print(f"Input not found: {inp_path}", file=sys.stderr)
        sys.exit(1)

    img = load_image(inp_path)
    x = preprocess_for_model(img, size=args.size, device=device)

    with torch.no_grad():
        out = generator(x)

    out_np = tensor_to_numpy(out, to_uint8=True)

    out_path = args.output or str(inp_path.parent / f"{inp_path.stem}_enhanced.jpg")
    save_image(out_np, out_path)
    print(f"Saved enhanced image to {out_path}")

    if args.show:
        try:
            import matplotlib.pyplot as plt
            fig, axes = plt.subplots(1, 2, figsize=(10, 5))
            axes[0].imshow(img)
            axes[0].set_title("Input")
            axes[0].axis("off")
            axes[1].imshow(out_np)
            axes[1].set_title("Enhanced")
            axes[1].axis("off")
            plt.tight_layout()
            plt.show()
        except Exception as e:
            print("Display failed:", e)


if __name__ == "__main__":
    main()
