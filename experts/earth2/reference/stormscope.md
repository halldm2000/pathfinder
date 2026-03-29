### StormScope

**What it is:** Convective-scale nowcasting model using a Diffusion Transformer (DiT) with sparse 2D neighbourhood attention on a 6km CONUS grid. First AI model to surpass physics-based forecasting (HRRR) at continental scale in the critical 1–2 hour window. Operates in two modes for different forecast horizons.

**Key details:**
- Grid: 512x896 (CONUS at 6km), patched to 4x4 (128x224 patches) with 768-dim latent vectors
- Architecture: 16 Transformer blocks, 195M parameters, sparse 2D neighbourhood attention
- Two modes:
  - **Nowcasting** (0–2h): Observation-only driven. Uses recent satellite + radar as sole input.
  - **Nearcasting** (0–12h): Adds synoptic-scale conditioning from ERA5/GFS for longer-range guidance.
- Training data: GOES-16 ABI satellite (8 channels, 6 years 2018–2023) + MRMS radar (1 channel, 4 years 2020–2023), remapped to 6km at 10-minute intervals
- Training: 48 hours on 32 H100 GPUs (~6M iterations), ~70GB memory
- Inference: ~33 seconds for 100 sampling steps on single H100 (5GB memory). Full 0–12h nearcasting in 7 minutes.

**Performance vs HRRR:**
- Outperforms HRRR nearly 100% of the time in the 1–2 hour critical window
- HRRR is the operational convective-allowing model (3km, hourly updates) — the gold standard for short-range severe weather in the US
- StormScope generates multi-spectral satellite imagery and radar composites as output, enabling direct visual interpretation

**How to use it:** Available in Earth2Studio with a dedicated inference example for multi-spectral satellite and radar prediction over CONUS.

**Relationship to other entities:** Being merged with StormCast into a unified "regional generative modeling" recipe for GTC 2026. Complements CorrDiff (CorrDiff downscales global forecasts to 2km; StormScope does direct convective nowcasting from observations). Under evaluation at NOAA EMC. Pitched to NOAA as "digital twin observation simulator."

**Known issues / limitations:**
- CONUS-only (6km grid covers continental US). Needs retraining for other regions.
- Observation-only mode (0–2h) degrades beyond 2 hours without synoptic conditioning
- 6km resolution cannot resolve individual convective cells (<1km)
- Dependent on GOES-16 ABI and MRMS data availability

**Sources:**
- Paper: arXiv:2601.17268 (Pathak, Abbas, Harrington et al.)
- Released: Jan 2026

As of: March 2026
