# Samudrika – Full Checklist

Use this file as a step-by-step guide. Tick each box when done (change `[ ]` to `[x]`).

---

## 1. Project structure

- [ ] Project root is `Samudrika` (or your working directory).
- [ ] Package `samudrika/` exists with:
  - [ ] `samudrika/dataset/uieb_loader.py`
  - [ ] `samudrika/models/funie_generator.py`
  - [ ] `samudrika/models/discriminator.py`
  - [ ] `samudrika/models/samudrika_model.py`
  - [ ] `samudrika/training/train_funie.py`
  - [ ] `samudrika/inference/enhance_image.py`
  - [ ] `samudrika/metrics/psnr.py`
  - [ ] `samudrika/metrics/ssim.py`
  - [ ] `samudrika/metrics/uiqm.py`
  - [ ] `samudrika/utils/image_utils.py`
  - [ ] `samudrika/utils/logger.py`
  - [ ] `samudrika/samudrika_pipeline.py`
- [ ] Root entry points exist:
  - [ ] `train_funie.py`
  - [ ] `enhance_image.py`
- [ ] `demo_colab.ipynb` exists at project root.
- [ ] `requirements.txt` and `README.md` exist.

---

## 2. Environment & dependencies

- [ ] Python 3.8+ available.
- [ ] Create and activate a virtual environment (optional but recommended):
  ```bash
  python -m venv venv
  source venv/bin/activate   # macOS/Linux
  # or: venv\Scripts\activate   # Windows
  ```
- [ ] Install dependencies from project root:
  ```bash
  pip install -r requirements.txt
  ```
- [ ] (Optional) For GPU: install PyTorch with CUDA, e.g.:
  ```bash
  pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
  ```
- [ ] Verify install:
  ```bash
  python -c "import torch; import samudrika; print('OK')"
  ```

---

## 3. Dataset (UIEB)

- [ ] Download or obtain the UIEB dataset.
- [ ] Place it so the project sees:
  - [ ] `data/UIEB/raw/` — distorted underwater images
  - [ ] `data/UIEB/reference/` — ground truth enhanced images
- [ ] Ensure filenames in `raw/` and `reference/` match for pairing (e.g. `001.jpg` in both).
- [ ] (Optional) Add `data/UIEB/train.txt` and `data/UIEB/val.txt` with one filename per line for train/val split.
- [ ] Quick test that loader works:
  ```bash
  python -c "
  from samudrika.dataset import get_uieb_dataloaders
  train_loader, val_loader = get_uieb_dataloaders('data/UIEB', batch_size=4, num_workers=0)
  raw, ref = next(iter(train_loader))
  print('Raw shape:', raw.shape, 'Ref shape:', ref.shape)
  "
  ```

---

## 4. Training

- [ ] From project root, run training (short run for a quick check):
  ```bash
  python train_funie.py --data_root ./data/UIEB --epochs 5 --batch_size 4 --save_dir ./checkpoints --save_every 2
  ```
- [ ] Confirm `checkpoints/` is created and `.pt` files are saved.
- [ ] (Optional) Full training:
  ```bash
  python train_funie.py --data_root ./data/UIEB --epochs 100 --batch_size 8 --save_dir ./checkpoints --save_every 10
  ```
- [ ] (Optional) Resume or fine-tune with pretrained weights:
  ```bash
  python train_funie.py --data_root ./data/UIEB --pretrained_gen ./checkpoints/samudrika_epoch_50.pt --pretrained_disc ./checkpoints/samudrika_epoch_50.pt --epochs 100
  ```
- [ ] (Optional) Use VGG perceptual loss:
  ```bash
  python train_funie.py --data_root ./data/UIEB --use_perceptual --lambda_perceptual 0.1
  ```

---

## 5. Inference

- [ ] Have at least one checkpoint, e.g. `checkpoints/samudrika_epoch_100.pt` (or your latest).
- [ ] Run inference on a single image:
  ```bash
  python enhance_image.py path/to/underwater.jpg --output enhanced.jpg --show
  ```
- [ ] (Optional) Specify checkpoint and size:
  ```bash
  python enhance_image.py input.jpg --checkpoint ./checkpoints/samudrika_epoch_100.pt --size 256 -o out.jpg
  ```
- [ ] Confirm `enhanced.jpg` (or your output path) is saved and looks reasonable.

---

## 6. Pipeline & metrics

- [ ] Run full pipeline from Python (e.g. in a script or notebook):
  ```python
  from samudrika import run_pipeline

  result = run_pipeline(
      "path/to/input.jpg",
      "checkpoints/samudrika_epoch_100.pt",
      output_path="out_enhanced.jpg",
      compute_metrics=True,
      reference_path="path/to/reference.jpg",  # optional; needed for PSNR/SSIM
      display=True,
  )
  print(result.get("metrics"))  # PSNR, SSIM, UIQM (if reference given, PSNR/SSIM included)
  ```
- [ ] Verify UIQM is computed on the enhanced image (no reference needed).
- [ ] If you have a reference image, verify PSNR and SSIM are in `result["metrics"]`.

---

## 7. Google Colab demo

- [ ] Upload the project to Colab (or clone from GitHub).
- [ ] Open `demo_colab.ipynb`.
- [ ] Run **Section 1**: Install dependencies (`pip install ...`).
- [ ] Run **Section 2**: Clone repo or ensure project is at `/content/Samudrika` (or your path).
- [ ] Run **Section 3**: Mount Google Drive (optional; for dataset/checkpoints on Drive).
- [ ] Run **Section 4**: Load UIEB — set `DATA_ROOT` to your UIEB path (e.g. `/content/drive/MyDrive/UIEB` or `/content/Samudrika/data/UIEB`).
- [ ] Run **Section 5**: (Optional) Train model — adjust `DATA_ROOT` and `--epochs` as needed.
- [ ] Run **Section 6**: Run inference — set `CHECKPOINT` and `TEST_IMAGE` as needed.
- [ ] Run **Section 7**: Display before/after results.
- [ ] Run **Section 8**: Compute and print PSNR, SSIM, UIQM.

---

## 8. Git & GitHub setup

- [ ] Initialize repo (if not already):
  ```bash
  cd "/Users/curiousity/Maritime Project/Samudrika"
  git init
  ```
- [ ] Add remote (use your repo URL):
  ```bash
  git remote add origin https://github.com/Krishna101010101010/Samudrika-Underwater-Image-Enhancement-for-Indian-Navy.git
  ```
- [ ] Stage and commit your code:
  ```bash
  git add -A
  git commit -m "Samudrika: Underwater Image Enhancement for Indian Navy"
  ```
- [ ] Push to GitHub (first time, or after fixing history):
  ```bash
  git push -u origin master:main
  ```
  If rejected because remote has existing commits, either:
  - **Merge first:**  
    `git pull origin main --allow-unrelated-histories --no-rebase`  
    then `git push -u origin master:main`
  - **Overwrite remote (only if you don’t need remote history):**  
    `git push -u origin master:main --force`

---

## 9. Single-contributor history (optional)

Use this only if you want the GitHub Contributors page to show only you (e.g. after pushing code that had old history from another repo).

- [ ] Create a new branch with no parent history:
  ```bash
  git checkout --orphan new-main
  git add -A
  git commit -m "Samudrika: Underwater Image Enhancement for Indian Navy"
  git branch -D master
  git branch -m master
  ```
- [ ] Force-push to replace remote history:
  ```bash
  git push -u origin master:main --force
  ```
- [ ] Add your commit email in GitHub: **Settings → Emails** → add and verify the email used in the commit (e.g. `krishna.2303604@icloud.com`).
- [ ] Wait 5–30 minutes (or up to 24 hours) for GitHub’s Contributors page to refresh.

---

## 10. Optional extras

- [ ] Add a `.gitignore` (e.g. ignore `__pycache__/`, `*.pyc`, `venv/`, `checkpoints/*.pt`, `data/`, `.ipynb_checkpoints/`).
- [ ] Remove unnecessary tracked files (e.g. `DATA` symlink, `apex` submodule) if they were committed by mistake.
- [ ] Document your training config (epochs, batch size, lr) in `README.md` or a `config/` note.
- [ ] Keep architecture lightweight for future edge deployment (current FUnIE-GAN setup is already lightweight).

---

## Quick reference – commands used in this guide

| Step              | Command / action |
|-------------------|------------------|
| Install deps      | `pip install -r requirements.txt` |
| Train (short)     | `python train_funie.py --data_root ./data/UIEB --epochs 5 --batch_size 4 --save_dir ./checkpoints` |
| Train (full)      | `python train_funie.py --data_root ./data/UIEB --epochs 100 --batch_size 8 --save_dir ./checkpoints` |
| Infer             | `python enhance_image.py input.jpg -o out.jpg --show` |
| Set remote        | `git remote add origin https://github.com/Krishna101010101010/Samudrika-Underwater-Image-Enhancement-for-Indian-Navy.git` |
| Push              | `git push -u origin master:main` |
| Push (force)      | `git push -u origin master:main --force` |
| Clean history     | `git checkout --orphan new-main` → commit → rename branch → force push |

---

*Samudrika – Underwater Image Enhancement for Indian Navy. Tick off each item as you complete it.*
