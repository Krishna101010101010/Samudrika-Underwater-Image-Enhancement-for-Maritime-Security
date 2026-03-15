#!/usr/bin/env python3
"""
Entry point for training FUnIE-GAN. Run from project root:
  python train_funie.py [--data_root ./data/UIEB] [--epochs 100] ...
"""

import sys
from pathlib import Path

# Ensure project root is on path so "samudrika" package is found
ROOT = Path(__file__).resolve().parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from samudrika.training.train_funie import main

if __name__ == "__main__":
    main()
