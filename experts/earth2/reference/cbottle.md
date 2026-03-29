### cBottle (Climate in a Bottle)

**What it is:** Generative foundation model for km-scale global atmospheric simulation. Two-stage architecture: (1) multi-modal macroscale generator at HEALPix 64 (~100km, 50k pixels/channel) producing either ICON or ERA5 modality, and (2) patch-based 16x super-resolution from HPX64 to HPX1024 (12.5M pixels/channel) using 2D multi-diffusion on HEALPix patches. Direct diffusion at HPX1024 would require >2,000 GB GPU memory, so the local patch-based approach is essential.

**Key details:**
- Two-stage generation:
  1. **Macroscale generator** (HPX64, ~100km): Generates coarse global atmospheric states. Multi-modal — can produce either ICON-style or ERA5-style fields.
  2. **Super-resolution** (HPX64 → HPX1024, ~6km): Patch-based 16x upsampling with coherent global generation via multi-diffusion on HEALPix patches.
- Generative (not autoregressive): produces atmospheric snapshots, not forecast rollouts. Coarse resolution generator (cBottle-video) enables rollouts for drought/heatwave applications.
- User-guided extreme event generation: can steer generation toward hurricanes, heatwaves, etc.
- FastGen library accelerates diffusion sampling

**CMIP6 validation (Feb 2026):**
- Major milestone: cBottle trained on CMIP6 multi-model data learns real climate signals — actual divergence between emission pathways (SSP scenarios), not just weather patterns
- This distinguishes cBottle from weather models: it captures climate-scale forcing responses
- Applications: CMIP6 channel filling, debiasing outdated climate projections, lightweight probability estimation

**Applications:**
- Financial climate risk analytics (S&P Global evaluating)
- Insurance: extreme event catalogs for reinsurance
- Climate projection gap-filling: generating variables not available in all CMIP6 models
- Debiasing: correcting known biases in older climate projections

**Relationship to other entities:** Climate-scale complement to Atlas/FCN3 (weather timescale). Different from DLESyM (coupled atmosphere-ocean autoregressive climate model) — cBottle is generative/snapshot, DLESyM is autoregressive/rollout. Competes with ACE2 (Allen AI) in the AI climate emulator space. Uses PhysicsNeMo.

**Known issues / limitations:**
- Generative snapshots, not continuous forecasts (coarse rollout mode is newer and less validated)
- Paper submitted to Nature Machine Intelligence (Mar 2026) — under review, not yet peer-reviewed
- Super-resolution stage requires careful patch boundary handling for global coherence
- Climate validation is inherently difficult — multi-decade signals are hard to verify on short observational records

**Sources:**
- Paper: Submitted to Nature Machine Intelligence (Mar 2026)
- First announced: Jun 2025
- CMIP6 validation: Feb 2026

As of: March 2026
