"""
Samudrika model wrapper: generator, discriminator, and combined losses.
Losses: adversarial, L1 reconstruction, optional perceptual (VGG).
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import Optional, Tuple

from .funie_generator import FUnIEGenerator
from .discriminator import PatchDiscriminator


class PerceptualLoss(nn.Module):
    """Optional VGG-based perceptual loss. Lightweight: use one layer if available."""

    def __init__(self, use_vgg: bool = False):
        super().__init__()
        self.use_vgg = use_vgg
        self._vgg = None
        if use_vgg:
            try:
                from torchvision.models import vgg16
                vgg = vgg16(weights=None)  # or weights="IMAGENET1K_V1")
                self._vgg = nn.Sequential(*list(vgg.features)[:16]).eval()
                for p in self._vgg.parameters():
                    p.requires_grad = False
            except Exception:
                self.use_vgg = False

    def forward(self, pred: torch.Tensor, target: torch.Tensor) -> torch.Tensor:
        if not self.use_vgg or self._vgg is None:
            return torch.tensor(0.0, device=pred.device, dtype=pred.dtype)
        self._vgg = self._vgg.to(pred.device)
        with torch.no_grad():
            f_pred = self._vgg(pred)
            f_target = self._vgg(target)
        return F.l1_loss(f_pred, f_target)


class SamudrikaModel(nn.Module):
    """
    Wrapper combining generator, discriminator, and loss computation.
    """

    def __init__(
        self,
        lambda_adv: float = 1.0,
        lambda_l1: float = 100.0,
        lambda_perceptual: float = 0.0,
        use_perceptual: bool = False,
        generator: Optional[FUnIEGenerator] = None,
        discriminator: Optional[PatchDiscriminator] = None,
    ):
        super().__init__()
        self.lambda_adv = lambda_adv
        self.lambda_l1 = lambda_l1
        self.lambda_perceptual = lambda_perceptual
        self.generator = generator or FUnIEGenerator()
        self.discriminator = discriminator or PatchDiscriminator()
        self.perceptual = PerceptualLoss(use_vgg=use_perceptual)
        self.use_perceptual = use_perceptual

    def forward(self, distorted: torch.Tensor, reference: torch.Tensor) -> Tuple[torch.Tensor, dict]:
        """
        Forward pass: generate enhanced image and compute losses (for training).
        Returns (enhanced, loss_dict).
        """
        enhanced = self.generator(distorted)
        loss_dict = self.compute_losses(distorted, enhanced, reference)
        return enhanced, loss_dict

    def compute_losses(
        self,
        distorted: torch.Tensor,
        enhanced: torch.Tensor,
        reference: torch.Tensor,
    ) -> dict:
        """Compute generator and discriminator losses."""
        # Adversarial (generator): D(enhanced) should be 1
        d_fake = self.discriminator(enhanced)
        real_label = torch.ones_like(d_fake, device=enhanced.device)
        loss_adv_g = F.binary_cross_entropy_with_logits(d_fake, real_label)

        # L1 reconstruction
        loss_l1 = F.l1_loss(enhanced, reference)

        # Perceptual (optional)
        loss_perceptual = self.perceptual(enhanced, reference) if self.use_perceptual else torch.tensor(0.0, device=enhanced.device)

        loss_g = (
            self.lambda_adv * loss_adv_g
            + self.lambda_l1 * loss_l1
            + self.lambda_perceptual * loss_perceptual
        )

        # Discriminator: D(real)=1, D(fake)=0
        d_real = self.discriminator(reference)
        d_fake_detach = self.discriminator(enhanced.detach())
        loss_d_real = F.binary_cross_entropy_with_logits(d_real, real_label)
        loss_d_fake = F.binary_cross_entropy_with_logits(d_fake_detach, torch.zeros_like(d_fake_detach, device=enhanced.device))
        loss_d = (loss_d_real + loss_d_fake) * 0.5

        return {
            "loss_g": loss_g,
            "loss_d": loss_d,
            "loss_adv_g": loss_adv_g.item(),
            "loss_l1": loss_l1.item(),
            "loss_d_real": loss_d_real.item(),
            "loss_d_fake": loss_d_fake.item(),
        }

    def enhance(self, distorted: torch.Tensor) -> torch.Tensor:
        """Inference: enhance image only."""
        return self.generator(distorted)
