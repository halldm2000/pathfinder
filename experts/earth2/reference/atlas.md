### Atlas (Atmospheric Transformer in Latent Space)

**What it is:** Global probabilistic weather forecasting framework using a Diffusion Transformer (DiT) backbone operating in latent space with 16x compression (0.25deg to 1deg, 721x1440 to 181x360). Supports three probabilistic estimators within a single architecture: ATLAS-SI (Stochastic Interpolants), ATLAS-EDM (Diffusion Models), and ATLAS-CRPS (direct ensemble optimization). Released Jan 2026 as the flagship of the Earth-2 re-launch at AMS. Highest skill of any open model on standard benchmarks as of Jan 2026.

**Key details:**
- Predictor: 12 DiT blocks, 13 attention heads (256 dim/head), 2.4B parameters, global attention
- Decoder: 16 DiT blocks, 12 attention heads (208 dim/head), 1.8B parameters, local attention
- 75 input fields from ERA5 (7 surface + 5 variables x 13 pressure levels + SST + total precipitation)
- Training: 39 years of ERA5 (1980–2019), tested on 2020
- Forecast range: 15 days at 0.25deg, 6-hourly steps
- Speed: ATLAS-CRPS generates one forecast step in 3.3 seconds on a single A100. ATLAS-SI and ATLAS-EDM take ~90 seconds per step. Compare GenCast: 140 seconds per 12-hour step.
- Memory-efficient checkpoint sets planned for release (needed for sovereign deployments on DGX Spark)

**Three estimators compared:**
- **ATLAS-CRPS**: Fastest (3.3s/step). Directly optimizes the CRPS metric. Best for large ensemble generation where speed matters.
- **ATLAS-SI**: Uses stochastic interpolants for sampling. Higher quality per sample but slower (~90s/step).
- **ATLAS-EDM**: Diffusion-based sampling. Similar speed/quality trade-off as SI but uses EDM framework.

**Relationship to other entities:** Succeeds FourCastNet lineage (FCN1 → FCN2/SFNO → FCN3 → Atlas). Competes directly with GenCast and FuXi-ENS on probabilistic global forecasting. Uses ERA5 for training (like most global models). Inference can use GFS or HRES initial conditions. Available in Earth2Studio. Built on PhysicsNeMo.

**Known issues / limitations:**
- Like all AI weather models, systematically underpredicts extremes
- 0.25deg resolution cannot resolve convective-scale features; downstream models (CorrDiff, StormScope) handle regional detail
- Training on ERA5 inherits reanalysis biases and historical climate distribution

**Sources:**
- Paper: arXiv:2601.18111 (Kossaifi, Kovachki, Mardani et al.)
- Full PDF: https://d1qx31qr3h6wln.cloudfront.net/publications/atlas-paper.pdf

As of: March 2026
