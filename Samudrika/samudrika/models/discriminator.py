"""
Patch discriminator for FUnIE-GAN: convolutional layers with sigmoid output.
"""

import torch
import torch.nn as nn


class PatchDiscriminator(nn.Module):
    """
    Patch (Markovian) discriminator: convolutions with stride 2, no global pooling.
    Output: spatial map of real/fake scores (sigmoid per patch).
    """

    def __init__(
        self,
        in_channels: int = 3,
        base_channels: int = 64,
        num_layers: int = 4,
    ):
        super().__init__()
        layers = []
        c = in_channels
        for i in range(num_layers):
            nc = min(base_channels * (2 ** i), 512)
            stride = 2 if i < num_layers - 1 else 1
            layers.append(
                nn.Sequential(
                    nn.Conv2d(c, nc, kernel_size=4, stride=stride, padding=1),
                    nn.BatchNorm2d(nc) if i > 0 else nn.Identity(),
                    nn.LeakyReLU(0.2),
                )
            )
            c = nc
        self.model = nn.Sequential(*layers)
        self.final = nn.Conv2d(c, 1, kernel_size=4, stride=1, padding=1)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        h = self.model(x)
        return self.final(h)
