#!/usr/bin/env python3
"""
Entry point for inference. Run from project root:
  python enhance_image.py input.jpg [--output out.jpg] [--show]
"""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from samudrika.inference.enhance_image import main

if __name__ == "__main__":
    main()
