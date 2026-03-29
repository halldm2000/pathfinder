### CorrDiff (Corrective Diffusion)

**What it is:** Generative diffusion model for statistical downscaling, transforming coarse global predictions (~25km) to high-resolution regional fields (~2km). Corrects the fundamental regression-to-mean problem where deterministic models produce blurred outputs for chaotic probabilistic systems. 1,000x faster and 3,000x less energy than traditional dynamical downscaling.

**Key details:**
- Input: 25km coarse fields (from global models like Atlas, FCN3, GFS, IFS)
- Output: 2km downscaled fields preserving realistic mesoscale structure
- Generative approach: produces an ensemble of physically plausible downscaled realizations, not a single blurred mean
- Published in Nature Communications Earth & Environment (2023, arXiv:2309.15214)
- Operational at The Weather Company (TWC) — first commercial deployment of a generative AI downscaling model
- TWC variant: VA3m-fine-tuned-4m, selected for GTC 2026 presentation
- Integrated with MRMS radar data for probabilistic precipitation (shifted gamma distributions)

**Performance and deployment:**
- CorrDiff NIM microservice: 500x faster than CPU-based NWP, 10,000x more energy-efficient. Released at SC24 (Nov 2024).
- 50x training speedup achieved on B200 GPUs (Dec 2025, DevTech optimization). Enables global-scale models and reduces barrier to entry for regional applications.
- 10x training speedup in TWC partnership
- Being tested with FCN3 as input to improve severe weather prediction

**How to use it:** Available as a NIM microservice for REST inference and in Earth2Studio for Python workflows. Typical pipeline: global model (Atlas/FCN3) → CorrDiff → 2km regional fields. Can also downscale from operational NWP (GFS, HRES).

**Relationship to other entities:** Downstream of global models (Atlas, FCN3, AIFS). Complementary to StormScope (CorrDiff downscales global forecasts; StormScope does observation-driven convective nowcasting). Uses PhysicsNeMo for training. Key use case for insurance/financial risk assessment alongside HENS.

**Known issues / limitations:**
- Requires a coarse global input — not a standalone forecast system
- Quality of downscaled output depends on quality of global input
- Regional training data needed for each deployment domain
- Current operational deployment is TWC (CONUS focus)

**Sources:**
- Paper: Nature Communications Earth & Environment (arXiv:2309.15214)
- NIM: Released SC24 (Nov 2024)

As of: March 2026
