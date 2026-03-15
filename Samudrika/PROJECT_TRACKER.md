# Samudrika: Project Documentation & Tracker

This document serves as the central hub for the **Samudrika** project. It contains the complete context, architectural understanding, actionable steps, goals, and checklists. Update this file regularly to track your progress.

---

## 🌊 1. Project Overview & Context
**Samudrika** is a research-oriented deep learning project focused on **Underwater Image Enhancement**, specifically built for applications like those of the Indian Navy. It aims to restore underwater images by correcting color distortions, improving contrast, and enhancing sharpness, making them suitable for further computer vision applications or human viewing. 

The project employs a generative adversarial architecture based on **FUnIE-GAN** (Fast Underwater Image Enhancement GAN) and is specifically configured to train and evaluate on the **UIEB** (Underwater Image Enhancement Benchmark) dataset. It is built using **PyTorch** and is designed to be lightweight enough for edge deployment.

---

## 🧠 2. Deep Dive Architecture 

### A. Generator (`samudrika/models/funie_generator.py`)
- **Encoder-Decoder CNN with Skip Connections** acting as a lightweight U-Net.
- **Encoder**: 4 convolutional blocks (Conv2d -> BatchNorm2d -> LeakyReLU) that halve spatial dimensions using a stride of 2.
- **Decoder**: Upsampling layer (`nearest` mode) followed by a convolutional block (Conv2d -> BatchNorm2d -> ReLU). Concatenates feature maps from the encoder via skip connections to retain structural details.
- **Output**: `Tanh` activation function, outputting enhanced images in `[-1, 1]`.

### B. Discriminator (`samudrika/models/discriminator.py`)
- **Patch Discriminator** (Markovian discriminator) evaluating local patches instead of assigning a single global score.
- Consists of 4 convolutional blocks with a stride of 2 and LeakyReLU activations.

### C. Model Wrapper & Loss (`samudrika/models/samudrika_model.py`)
- **Adversarial Loss**: Standard BCEWithLogitsLoss.
- **Reconstruction Loss**: L1 loss (Mean Absolute Error) to ensure pixel-level structural similarity.
- **Perceptual Loss (Optional)**: Uses a pre-trained **VGG16** network to explicitly enforce high-level feature similarity (textures, edges).

### D. Data Loader (`samudrika/dataset/uieb_loader.py`)
- Specifically tailored for the **UIEB** dataset. Matches distorted (`raw/`) with ground truth (`reference/`) images.
- Handles resizing ($256 \times 256$), conversion to tensor, and normalization (`[-1, 1]`).

### E. Metrics
- **PSNR**: Peak Signal-to-Noise Ratio (Standard paired).
- **SSIM**: Structural Similarity Index (Standard paired).
- **UIQM**: Underwater Image Quality Measure (No-reference metric compounding color, sharpness, and contrast).

---

## 🎯 3. Project Goals

- [ ] **Data Procurement**: Acquire and structure the complete UIEB dataset correctly in `./data/UIEB/`.
- [ ] **First Training Run**: Successfully complete a short training run (e.g., 5 epochs) to verify the pipeline.
- [ ] **Full Training**: Execute a deep training cycle (e.g., 100+ epochs) and save the optimal weights.
- [ ] **Validation & Metrics**: Generate enhanced images and record their PSNR, SSIM, and UIQM scores.
- [ ] **Deployment Preparation**: Test the inference script on an unseen underwater image and visually verify.
- [ ] **Documentation**: Maintain this tracker and the main `README.md`.

---

## ✅ 4. Execution Checklists

### Phase 1: Environment & Setup
- [ ] Ensure Python 3.8+ is installed.
- [ ] Setup Virtual Environment (`python -m venv venv`).
- [ ] Install dependencies (`pip install -r requirements.txt`).
- [ ] If using GPU: Install PyTorch with CUDA (`pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118`).
- [ ] Download UIEB dataset and place it in `data/UIEB/raw` and `data/UIEB/reference`.

### Phase 2: Pipeline Verification
- [ ] Test the Dataloader:
  ```bash
  python -c "from samudrika.dataset import get_uieb_dataloaders; get_uieb_dataloaders('data/UIEB', batch_size=4)"
  ```
- [ ] Test a short training sequence:
  ```bash
  python train_funie.py --data_root ./data/UIEB --epochs 5 --batch_size 4 --save_dir ./checkpoints --save_every 2
  ```

### Phase 3: Full Training & Testing
- [ ] Run the complete training:
  ```bash
  python train_funie.py --data_root ./data/UIEB --epochs 100 --batch_size 8 --save_dir ./checkpoints
  ```
- [ ] Run inference on a sample test image:
  ```bash
  python enhance_image.py path/to/underwater.jpg --checkpoint ./checkpoints/samudrika_epoch_100.pt -o output.jpg --show
  ```
- [ ] Analyze the generated `output.jpg` and review the terminal for UIQM scores.

### Phase 4: Version Control (Git)
- [ ] `git status` to verify tracked changes.
- [ ] `git add -A` and `git commit -m "Update training configuration and project tracker"`.
- [ ] `git push origin main`.

---

## 📝 5. Notes & Updates
*Add any daily updates, notes, bugs, or observations below:*

- **[Date]**: Project tracker initialized. Analyzed and documented the complete FUnIE-GAN and UIQM architecture.
- 
