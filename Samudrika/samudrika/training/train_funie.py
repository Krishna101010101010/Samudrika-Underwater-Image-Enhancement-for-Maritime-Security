"""
Training script for FUnIE-GAN on UIEB.
Loads dataset, initializes generator + discriminator, optional pretrained weights,
trains for configurable epochs, logs losses, saves checkpoints.
"""

import argparse
import sys
from pathlib import Path

# Add project root for imports when run as script
ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import torch
import torch.optim as optim

from dataset import get_uieb_dataloaders
from models import FUnIEGenerator, PatchDiscriminator, SamudrikaModel
from utils import get_logger


def parse_args():
    p = argparse.ArgumentParser(description="Train FUnIE-GAN on UIEB (Samudrika)")
    p.add_argument("--data_root", type=str, default="./data/UIEB", help="UIEB dataset root")
    p.add_argument("--raw_dir", type=str, default="raw", help="Raw/distorted images subdir")
    p.add_argument("--ref_dir", type=str, default="reference", help="Reference images subdir")
    p.add_argument("--image_size", type=int, default=256)
    p.add_argument("--batch_size", type=int, default=8)
    p.add_argument("--epochs", type=int, default=100)
    p.add_argument("--lr", type=float, default=0.0002, help="Learning rate for Adam")
    p.add_argument("--num_workers", type=int, default=0, help="DataLoader workers (0 for Colab)")
    p.add_argument("--save_dir", type=str, default="./checkpoints", help="Checkpoint save directory")
    p.add_argument("--save_every", type=int, default=10, help="Save checkpoint every N epochs")
    p.add_argument("--pretrained_gen", type=str, default="", help="Path to pretrained generator weights")
    p.add_argument("--pretrained_disc", type=str, default="", help="Path to pretrained discriminator weights")
    p.add_argument("--lambda_adv", type=float, default=1.0)
    p.add_argument("--lambda_l1", type=float, default=100.0)
    p.add_argument("--lambda_perceptual", type=float, default=0.0)
    p.add_argument("--use_perceptual", action="store_true", help="Use VGG perceptual loss")
    return p.parse_args()


def main():
    args = parse_args()
    logger = get_logger("train")
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    logger.info("Device: %s", device)

    # Data
    train_loader, val_loader = get_uieb_dataloaders(
        args.data_root,
        batch_size=args.batch_size,
        num_workers=args.num_workers,
        size=args.image_size,
        raw_dir=args.raw_dir,
        ref_dir=args.ref_dir,
    )
    logger.info("Train batches: %d", len(train_loader))

    # Model
    generator = FUnIEGenerator(in_channels=3, out_channels=3, base_channels=64, max_channels=512, num_down=4)
    discriminator = PatchDiscriminator(in_channels=3, base_channels=64, num_layers=4)

    if args.pretrained_gen and Path(args.pretrained_gen).exists():
        state = torch.load(args.pretrained_gen, map_location="cpu")
        if "state_dict" in state:
            generator.load_state_dict(state["state_dict"], strict=False)
        else:
            generator.load_state_dict(state, strict=False)
        logger.info("Loaded pretrained generator from %s", args.pretrained_gen)
    if args.pretrained_disc and Path(args.pretrained_disc).exists():
        state = torch.load(args.pretrained_disc, map_location="cpu")
        if "state_dict" in state:
            discriminator.load_state_dict(state["state_dict"], strict=False)
        else:
            discriminator.load_state_dict(state, strict=False)
        logger.info("Loaded pretrained discriminator from %s", args.pretrained_disc)

    model = SamudrikaModel(
        lambda_adv=args.lambda_adv,
        lambda_l1=args.lambda_l1,
        lambda_perceptual=args.lambda_perceptual,
        use_perceptual=args.use_perceptual,
        generator=generator,
        discriminator=discriminator,
    )
    model.generator.to(device)
    model.discriminator.to(device)
    if model.use_perceptual and model.perceptual._vgg is not None:
        model.perceptual._vgg.to(device)

    opt_g = optim.Adam(model.generator.parameters(), lr=args.lr, betas=(0.5, 0.999))
    opt_d = optim.Adam(model.discriminator.parameters(), lr=args.lr, betas=(0.5, 0.999))

    save_dir = Path(args.save_dir)
    save_dir.mkdir(parents=True, exist_ok=True)

    global_step = 0
    for epoch in range(1, args.epochs + 1):
        model.generator.train()
        model.discriminator.train()
        epoch_loss_g = 0.0
        epoch_loss_d = 0.0
        n_batches = 0
        for distorted, reference in train_loader:
            distorted = distorted.to(device)
            reference = reference.to(device)

            # Generator step
            opt_g.zero_grad()
            enhanced, loss_dict = model(distorted, reference)
            loss_dict["loss_g"].backward()
            opt_g.step()

            # Discriminator step
            opt_d.zero_grad()
            loss_d_dict = model.compute_losses(distorted, enhanced.detach(), reference)
            loss_d_dict["loss_d"].backward()
            opt_d.step()

            epoch_loss_g += loss_dict["loss_g"].item()
            epoch_loss_d += loss_d_dict["loss_d"].item()
            n_batches += 1
            global_step += 1

            if global_step % 50 == 0:
                logger.info(
                    "epoch %d step %d | loss_g=%.4f loss_d=%.4f",
                    epoch, global_step, loss_dict["loss_g"].item(), loss_d_dict["loss_d"].item(),
                )

        avg_g = epoch_loss_g / max(n_batches, 1)
        avg_d = epoch_loss_d / max(n_batches, 1)
        logger.info("epoch %d | avg loss_g=%.4f avg loss_d=%.4f", epoch, avg_g, avg_d)

        if epoch % args.save_every == 0 or epoch == args.epochs:
            ckpt = {
                "epoch": epoch,
                "generator": model.generator.state_dict(),
                "discriminator": model.discriminator.state_dict(),
                "opt_g": opt_g.state_dict(),
                "opt_d": opt_d.state_dict(),
            }
            path = save_dir / f"samudrika_epoch_{epoch}.pt"
            torch.save(ckpt, path)
            logger.info("Saved %s", path)

    logger.info("Training finished.")


if __name__ == "__main__":
    main()
