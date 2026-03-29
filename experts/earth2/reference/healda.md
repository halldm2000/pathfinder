### HealDA (HEALPix Data Assimilation)

**What it is:** Pure ML-based global data assimilation system that generates initial conditions for AI weather models directly from raw observations — in seconds on a GPU, replacing the hours-long supercomputer runs of traditional DA systems (4D-Var, EnKF). Uses a HEALPix 64 grid (~1deg, 49,152 gridpoints) with a 24-hour observation window. Critical enabler for sovereign forecasting: any agency with a GPU and observations can initialize an AI forecast pipeline.

**Key details:**
- Grid: HEALPix 64 (49,152 gridpoints, ~1 degree resolution)
- Observation window: 24 hours (-21h to +3h from analysis time)
- Architecture: 24 ViT transformers using DiT architecture (1k vector dimension), 330M parameters total. Deterministic regression (no diffusion noise injection).
- Training: 22 years of ERA5 (2000–2021), 2022 holdout. 8x H100 GPUs, batch size 8, bfloat16, 1,600 GPU-hours.
- Inference: 70 ms on single H100 (~20 GB VRAM). CPU preprocessing adds ~700 ms per analysis.

**Observation types ingested:**
- Microwave sounders: AMSU-A, AMSU-B, ATMS, MHS
- Conventional observations: humidity, temperature, pressure, wind (from aircraft, radiosonde, surface AWS)
- Satellite winds: ASCAT scatterometer, Atmospheric Motion Vectors (AMV)
- Radio occultation: GNSS-RO bending angle, derived temperature/humidity
- Novel observation encoder handles all sensor types through a unified interface

**Performance:**
- Forecasts initialized with HealDA approach ERA5 quality across multiple ML models
- 70 ms inference means near-real-time DA cycling is feasible (traditional systems take 1–6 hours)
- Paper title emphasizes "initial errors" — demonstrates that DA quality is the binding constraint on AI forecast skill

**Sovereign forecasting role:**
- Enables end-to-end AI weather pipelines without dependence on ECMWF, NCEP, or other centralized DA providers
- Any country with a GPU, an observation network, and HealDA can produce competitive initial conditions
- Pairs with Atlas/FCN3 for global forecasting and StormScope/StormCast for regional
- Combined HealDA → Atlas pipeline runs on a single GPU in seconds (vs. hours on supercomputer clusters)

**Relationship to other entities:** Complementary to SDA (SDA does regional DA at 3km/1km from sparse obs; HealDA does global DA at ~1deg from operational sensor networks). Different approach from ObsFormer (ObsFormer bypasses DA entirely, forecasting directly from observations). Feeds into Atlas, FCN3, and other global models.

**Known issues / limitations:**
- ~1deg resolution is coarser than operational DA systems (ECMWF 4D-Var runs at ~9km)
- Expected public release later in 2026 (pre-release as of March 2026)
- Deterministic approach — does not produce ensemble-of-analyses like EnKF
- Quality depends on observation network density (sparse networks produce lower-quality analyses)

**Sources:**
- Paper: arXiv:2601.17636 (Gupta, Subramaniam, Pritchard et al.)
- Status: Pre-release, expected public release later 2026

As of: March 2026
