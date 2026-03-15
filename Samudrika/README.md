# Samudrika – Underwater Image Enhancement

Research prototype for enhancing underwater images using a **FUnIE-GAN** backbone, trained and evaluated on the **UIEB** dataset. Designed for Google Colab and lightweight edge deployment.

## Features

- **FUnIE-GAN generator**: encoder-decoder CNN with skip connections, tanh output
- **Patch discriminator** for adversarial training
- **UIEB dataset** loader (paired raw + reference)
- **Metrics**: PSNR, SSIM, UIQM
- **Inference** and full pipeline with optional visualization

## Setup

```bash
# From project root (Samudrika)
pip install -r requirements.txt
# If using GPU (e.g. CUDA 11.8):
# pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

## Dataset (UIEB)

Place UIEB so that the project sees:

- `data/UIEB/raw/` – distorted underwater images  
- `data/UIEB/reference/` – ground truth enhanced images  

Filenames in `raw/` and `reference/` should match for pairing. Optional: `train.txt` / `val.txt` in the dataset root listing filenames for split.

## Training

```bash
python train_funie.py --data_root ./data/UIEB --epochs 100 --batch_size 8 --save_dir ./checkpoints
```

Optional: pretrained weights

```bash
python train_funie.py --pretrained_gen path/to/generator.pt --pretrained_disc path/to/discriminator.pt
```

## Inference

```bash
python enhance_image.py input.jpg --output enhanced.jpg --show
```

Checkpoint path (default `checkpoints/samudrika_epoch_100.pt`):

```bash
python enhance_image.py input.jpg --checkpoint ./checkpoints/samudrika_epoch_100.pt -o out.jpg
```

## Pipeline (programmatic)

```python
from samudrika import run_pipeline

result = run_pipeline(
    "input.jpg",
    "checkpoints/samudrika_epoch_100.pt",
    output_path="out.jpg",
    compute_metrics=True,
    reference_path="ref.jpg",  # optional, for PSNR/SSIM
    display=True,
)
print(result["metrics"])  # PSNR, SSIM, UIQM
```

## Colab

Open `demo_colab.ipynb` in Google Colab for:

1. Install deps and clone/mount  
2. Load UIEB and (optional) train  
3. Run inference and show before/after  
4. Compute PSNR, SSIM, UIQM  

## Project layout

```
samudrika/
├── dataset/uieb_loader.py
├── models/
│   ├── funie_generator.py
│   ├── discriminator.py
│   └── samudrika_model.py
├── training/train_funie.py
├── inference/enhance_image.py
├── metrics/psnr.py, ssim.py, uiqm.py
├── utils/image_utils.py, logger.py
├── samudrika_pipeline.py
└── ...
train_funie.py          # entry point: training
enhance_image.py        # entry point: inference
demo_colab.ipynb        # Colab demo
```

## License

Use for research and hackathon prototyping.
