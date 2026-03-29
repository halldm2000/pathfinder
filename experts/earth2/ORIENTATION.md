# Earth-2 Expert Orientation

Reference material for the Earth-2 expert. Facts here correct what the model gets wrong, add what it doesn't know, and anchor fast-moving details with dates. Omits facts the model reliably knows (basic NWP concepts, well-known architectures, etc.).

Last verified: March 2026. Claude's training data extends through early 2025.

## Field Map

AI weather prediction transitioned from research to operations in 2025. ECMWF operationalized AIFS (Feb 2025, deterministic; Jul 2025, ensemble), the first ML weather model at a tier-1 NWP center. NOAA followed in Dec 2025 with AIGFS, AIGEFS, and HGEFS (world's first hybrid physical-AI ensemble). NVIDIA's Earth-2 platform re-launched at AMS in Jan 2026 as a fully open model family spanning data assimilation, global forecasting, regional nowcasting, downscaling, and climate projection. The field's central tension: AI models are fast and skillful on standard metrics but systematically underpredict extreme events, lack physical conservation laws, and exhibit training-data bias toward historical climate states. Hybrid physics-ML approaches (NeuralGCM, HGEFS) and improved probabilistic methods (GenCast, Atlas) are the most active response.

## Earth-2 Platform (as of March 2026)

Earth-2 is organized into five pillars: Data, Models, Libraries (Earth2Studio, PhysicsNeMo), Training Scripts (Recipes), and Blueprints. Philosophy is open-source and collaborative. "Sovereign forecasting" is the core narrative: enabling any country or agency to run end-to-end AI weather pipelines on their own infrastructure.

### Earth-2 Models

**Atlas (Atmospheric Transformer in Latent Space)**
- Global probabilistic forecasting. DiT backbone in latent space (16x compression). 2.4B parameter predictor, 1.8B decoder.
- Three estimators: ATLAS-SI (Stochastic Interpolants), ATLAS-EDM (Diffusion), ATLAS-CRPS (ensemble).
- 75 input fields from ERA5. 0.25deg, 15-day forecasts. ATLAS-CRPS: 3.3 seconds/step on single A100 (vs GenCast's 140s/12h step).
- Highest skill of any open model on standard benchmarks as of Jan 2026.
- Released Jan 2026. Paper: arXiv:2601.18111.

**FourCastNet 3 (FCN3)**
- Probabilistic global forecasting. Local + global convolutions, domain parallelism to 1024 GPUs.
- Composite CRPS training (spatial + spectral). 60-day forecasts at 0.25deg in under 4 minutes.
- Bred Vector/Multi-Checkpoint (BVMC) for huge ensembles (thousands of members).
- Under evaluation at NOAA EMC and The Weather Company.
- Released Jan 2026.

**StormScope**
- Convective-scale nowcasting. DiT with sparse 2D attention on 6km CONUS grid.
- Two modes: Nowcasting (0-2h, observation-only) and Nearcasting (0-12h, synoptic conditioning).
- Pre-trained on GOES-16 ABI (8 channels, 6yr) + MRMS radar. 195M parameters.
- First AI model to surpass HRRR at continental scale in the 1-2h critical window.
- Released Jan 2026. Paper: arXiv:2601.17268.

**StormCast**
- Km-scale regional generative modeling (convection-allowing model emulation via diffusion).
- Published in Science Advances (Jan 30, 2026). Being merged with StormScope into unified regional recipe.
- First non-weather use: University of Manchester air quality nowcast (Feb 2026).

**CorrDiff**
- Generative diffusion for downscaling (25km to 2km). 1000x faster, 3000x less energy than traditional methods.
- Published in Nature Communications Earth & Environment. Operational at The Weather Company.
- CorrDiff NIM: 500x faster than CPU NWP. 50x training speedup on B200 (Dec 2025).

**HealDA**
- Global ML data assimilation. HEALPix 64 grid (~1deg). 24h observation window.
- Ingests multiple sensor types: microwave sounders, conventional obs, satellite winds, radio occultation.
- 330M parameters. 70ms inference on single H100. Forecasts initialized with HealDA approach ERA5 quality.
- Paper: arXiv:2601.17636. Expected public release later 2026.

**SDA (Score-Based Data Assimilation)**
- Regional AI data assimilation (originally 3km HRRR, retraining at 1km). Enables personalized forecasting from user observations.
- Used by MITRE, Tomorrow.io.

**cBottle (Climate in a Bottle)**
- Generative foundation model for km-scale global atmosphere. Two-stage: HPX64 macroscale + 16x super-resolution to HPX1024.
- CMIP6 validation shows learning real climate signals (emission pathway divergence). Paper submitted to Nature Machine Intelligence (Mar 2026).

**Other active models:** DLESyM (coupled atmosphere-ocean, 1000+ year stability), DLESyM-Distill (4-week jump S2S via synthetic data pretraining, arXiv:2512.22814), ObsFormer (forecasting directly from sparse observations, bypassing DA entirely), ScreamCast (4km global storm-resolving emulation), ReGen (atmospheric state generation from sparse stations), HelioFM/Surya (solar foundation model, multi-org with NASA).

### Libraries and Tools

**Earth2Studio** (v0.13.0, March 2026)
- `pip install earth2studio`. Apache 2.0. Python 3.11-3.13. GPU compute >=8.9, >=40GB VRAM.
- 30+ pre-trained models. Three run functions: `deterministic()`, `ensemble()`, `diagnostic()`.
- Core pattern: load model -> create data source -> create IO backend -> call run function.
- 30+ data sources: GFS, HRRR, IFS, ERA5, ARCO, GOES, MRMS, CMIP6, Planetary Computer.
- Perturbation methods: SphericalGaussian, BredVector, LaggedEnsemble, etc.
- API server (Lepton-based) for REST inference (early access Jan 2026).
- **Breaking changes v0.13.0:** ISD `tolerance` renamed to `time_tolerance`. GraphCast latitude order changed to [90, -90]. Requires `nvidia-physicsnemo>=2.0`.
- earth2mip is INACTIVE. Replaced by Earth2Studio.

**PhysicsNeMo** (v2.0.0, March 2026)
- `pip install nvidia-physicsnemo`. Renamed from NVIDIA Modulus. `import physicsnemo` (not `import modulus`).
- CUDA backend via extras: `pip install "nvidia-physicsnemo[cu12,nn-extras]"` or `[cu13,nn-extras]`.
- Migration guide: github.com/NVIDIA/physicsnemo/blob/main/v2.0-MIGRATION-GUIDE.md.

**Other tools:** Torch Harmonics (spherical harmonic transforms), NIM microservices (CorrDiff, FourCastNet), HENS framework (7424-member ensembles).

## Landscape: Major External AI Weather/Climate Models

**ECMWF AIFS** -- Operational since Feb 2025 (deterministic) and Jul 2025 (ensemble, 51 members). GNN + transformer. 28km. Uses same initial conditions as IFS. ~1000x less energy than IFS. Open weights on Hugging Face. Anemoi framework (open-source) adopted by 11+ national met services.

**GenCast** (DeepMind) -- Probabilistic diffusion ensemble. 15-day at 0.25deg. Published Nature Dec 2024. Outperforms ECMWF ENS on 97.2% of 1320 targets.

**Aurora** (Microsoft) -- 1.3B-parameter foundation model across weather, air quality, ocean waves. Published Nature May 2025. Open-sourced Nov 2025 (github.com/microsoft/aurora).

**FuXi** (CMA/Fudan) -- FuXi Weather: first end-to-end ML system cycling DA+forecasting for a full year (Nature Communications 2025). FuXi-ENS outperforms ECMWF ENS on 98.1% of targets (Science Advances 2025). FuXi-S2S extends to 42-day.

**NeuralGCM** (Google/Caltech) -- Hybrid physics-ML. Traditional dynamics solver + neural subgrid physics. 2025 Science Advances paper: direct training on satellite precipitation, 40% error reduction vs IPCC-class models over 40 years.

**WeatherMesh** (WindBorne) -- WM-2 (Jan 2025): surpasses HRES/GFS/GraphCast. WM-5c: first continuously updated global model (every 20 min, proprietary balloon data).

**NOAA AI suite** (Dec 2025) -- AIGFS (fine-tuned GraphCast), AIGEFS (ensemble), HGEFS (hybrid physical-AI). Uses 0.3% of GFS compute. HGEFS outperforms both pure-physics and pure-AI individually.

**ACE2 / SamudrACE** (Allen AI) -- ACE2: 450M-param climate emulator, 1500 simulated years/day. SamudrACE: first coupled ocean-atmosphere AI climate emulator (Sep 2025). HiRO-ACE: 3km precipitation downscaling (Dec 2025).

## Known Limitations of AI Weather Models

These are consistently documented in 2025-2026 literature and must be stated when relevant:

1. **Extreme event underprediction.** Multiple papers confirm AI models systematically underpredict extremes across regions and seasons (arXiv, Aug 2025).
2. **Training data climate bias.** FourCastNet and Pangu produce winter temperature forecasts resembling conditions 15-20 years prior (Geophysical Research Letters, 2026).
3. **Out-of-distribution failure.** AI models struggle with events absent from training data, e.g., unprecedented tropical cyclones (PNAS, 2025).
4. **Conservation properties.** AI models do not inherently conserve mass, energy, or momentum. Hybrid approaches (NeuralGCM) partially address this.
5. **Metric gaming.** Standard metrics (RMSE, ACC) reward smoothness. AI models score well while underpredicting mesoscale variability and precipitation intensity.

## Resolution and Timescale Reference

| Scale | Spatial | Temporal | Examples |
|-------|---------|----------|----------|
| Global synoptic | ~25km (0.25deg) | 6h steps, 1-15d | Atlas, FCN3, GraphCast, AIFS |
| S2S | ~25km | 6h steps, 2-8wk | FCN3 (60d), FuXi-S2S, DLESyM-Distill |
| Mesoscale/regional | 2-6km | 1h steps, 0-48h | StormScope, StormCast, CorrDiff output |
| Convective/sub-km | <1km | Minutes | CorrDiff target, traditional LES |
| Climate | ~25-100km | 6h, decades+ | cBottle, DLESyM, ACE2, NeuralGCM |

## Key Data Sources

- **ERA5**: ECMWF reanalysis, 1940-present, 0.25deg, hourly. Standard training data for most AI weather models.
- **GFS**: NOAA operational analysis/forecast. Common inference-time initialization source.
- **HRES/IFS**: ECMWF operational. Higher quality than GFS for initialization.
- **HRRR**: NOAA 3km CONUS. Key for regional/convective-scale work.
- **MRMS**: Multi-Radar Multi-Sensor. US radar composite. Ground truth for precipitation.
- **GOES-16/17**: Geostationary satellite imagery. StormScope training data.
- **CMIP6**: Multi-model climate projections. cBottle training/validation.
- **WeatherBench 2** (Google): Standard benchmark for medium-range AI weather models.
