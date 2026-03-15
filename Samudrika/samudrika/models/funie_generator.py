"""
FUnIE-GAN style generator for underwater image enhancement.
Lightweight encoder-decoder CNN with skip connections and tanh output.
"""

import torch
import torch.nn as nn
from typing import List


class ConvBlock(nn.Module):
    """Conv -> BatchNorm -> LeakyReLU."""

    def __init__(self, in_c: int, out_c: int, stride: int = 1, kernel: int = 4):
        super().__init__()
        padding = kernel // 2
        self.conv = nn.Conv2d(in_c, out_c, kernel_size=kernel, stride=stride, padding=padding)
        self.bn = nn.BatchNorm2d(out_c)
        self.act = nn.LeakyReLU(0.2)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.act(self.bn(self.conv(x)))


class UpBlock(nn.Module):
    """Upsample -> Conv -> BatchNorm -> ReLU."""

    def __init__(self, in_c: int, out_c: int, kernel: int = 4):
        super().__init__()
        padding = kernel // 2
        self.up = nn.Upsample(scale_factor=2, mode="nearest")
        self.conv = nn.Conv2d(in_c, out_c, kernel_size=kernel, stride=1, padding=padding)
        self.bn = nn.BatchNorm2d(out_c)
        self.act = nn.ReLU(inplace=True)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.act(self.bn(self.conv(self.up(x))))


class FUnIEGenerator(nn.Module):
    """
    FUnIE-GAN generator: encoder-decoder with skip connections.
    Input: (B, 3, H, W) in [-1, 1]
    Output: (B, 3, H, W) in [-1, 1] via tanh
    """

    def __init__(
        self,
        in_channels: int = 3,
        out_channels: int = 3,
        base_channels: int = 64,
        max_channels: int = 512,
        num_down: int = 4,
    ):
        super().__init__()
        self.num_down = num_down
        # Encoder
        enc: List[nn.Module] = []
        c = in_channels
        for i in range(num_down):
            nc = min(base_channels * (2 ** i), max_channels)
            enc.append(ConvBlock(c, nc, stride=2))
            c = nc
        self.encoder = nn.Sequential(*enc)
        self.bottleneck = ConvBlock(c, c, stride=1)  # same res at bottleneck
        # Decoder with skip connections (we store encoder outputs)
        dec: List[nn.Module] = []
        for i in range(num_down):
            nc_skip = min(base_channels * (2 ** (num_down - 1 - i)), max_channels)
            nc_out = nc_skip if i < num_down - 1 else base_channels
            dec.append(UpBlock(c + nc_skip, nc_out))
            c = nc_out
        self.decoder = nn.Sequential(*dec)
        self.final = nn.Sequential(
            nn.Conv2d(base_channels, out_channels, kernel_size=3, padding=1),
            nn.Tanh(),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        skips: List[torch.Tensor] = []
        h = x
        for i, layer in enumerate(self.encoder):
            h = layer(h)
            skips.append(h)
        h = self.bottleneck(h)
        for i, layer in enumerate(self.decoder):
            # Concatenate skip from encoder (same spatial size after up)
            skip = skips[-(i + 1)]
            if h.shape[2:] != skip.shape[2:]:
                h = nn.functional.interpolate(h, size=skip.shape[2:], mode="nearest")
            h = torch.cat([h, skip], dim=1)
            h = layer(h)
        return self.final(h)
