### FourCastNet 3 (FCN3)

**What it is:** Probabilistic global weather forecasting system combining local and global convolutions with domain parallelism scaling to 1,024 GPUs. Extends forecast range to 60 days (subseasonal timescales) at 0.25deg — far beyond the typical 10–15 day limit of most AI weather models. Uses a composite CRPS training objective and the Bred Vector/Multi-Checkpoint (BVMC) methodology for affordable generation of huge ensembles.

**Key details:**
- Architecture: Local + global convolutions (not transformer-based like Atlas). Domain parallelism enables scaling to 1,024 GPUs.
- Training objective: Composite CRPS (spatial + spectral). Retains realistic power spectra even at 60-day lead times, avoiding the spectral decay that plagues regression models.
- Forecast range: 60 days at 0.25deg, 6-hourly resolution, generated in under 4 minutes
- Speed: 60x faster than diffusion-based approaches (e.g., GenCast), 60x faster than IFS-ENS
- BVMC (Bred Vector/Multi-Checkpoint): Generates thousands of ensemble members affordably by combining bred-vector perturbations with multi-checkpoint sampling. Basis for the HENS framework (7,424-member ensembles).
- Under evaluation at NOAA EMC (J. Wang) and The Weather Company (Montgomery Flora)

**Subseasonal capability:**
- FCN3 is the only Earth-2 model targeting the 2–8 week (S2S) range
- 60-day forecasts enable subseasonal applications: energy demand, agricultural planning, insurance risk
- Composite CRPS training prevents the spectral collapse that makes most AI models useless beyond 2 weeks

**Ensemble generation (BVMC + HENS):**
- BVMC generates large ensembles by running inference from multiple checkpoints with bred-vector perturbations
- HENS framework uses SFNO/FCN3 to produce 7,424-member ensembles at 5 orders of magnitude lower cost than traditional ensembles
- Used by JBA (flood risk) and AXA (hurricane risk) for insurance applications

**Relationship to other entities:** Latest in the FourCastNet lineage (FCN1 → FCN2/SFNO → FCN3). Complementary to Atlas: Atlas has higher skill at medium range (1–15d), FCN3 extends to subseasonal (15–60d). Being tested as input to CorrDiff for severe weather applications. HENS framework built on FCN3/SFNO. Available in Earth2Studio.

**Known issues / limitations:**
- Subseasonal skill degrades with lead time (as with all forecast systems)
- Not transformer-based, so does not benefit from the same scaling laws as Atlas
- S2S range (2–8 weeks) is inherently low-predictability — even large ensembles have limited deterministic skill

**Sources:**
- Reference: Bonev et al. (2025), "A geometric approach to probabilistic machine-learning weather forecasting at scale"
- Released: Jan 2026

As of: March 2026
