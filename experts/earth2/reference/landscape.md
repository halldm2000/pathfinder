### AI Weather/Climate Model Landscape

**What this covers:** Major non-NVIDIA AI weather and climate models that users frequently ask about or compare against Earth-2 models. Each entry covers architecture, current status, and key capabilities as of March 2026.

---

**GenCast (Google DeepMind)**
- Probabilistic diffusion-based ensemble model. 15-day forecasts at 0.25deg.
- Trained on ERA5 reanalysis. Published Nature Dec 2024. Outperforms ECMWF ENS on 97.2% of 1,320 targets.
- Key innovation: diffusion-based ensemble generation (each sample is a plausible forecast trajectory)
- Inference speed: ~140 seconds per 12-hour step (compare Atlas-CRPS: 3.3s/step)
- Open weights available. Successor to GraphCast (deterministic → probabilistic).
- Limitation: slow inference relative to non-diffusion approaches

**Aurora (Microsoft Research)**
- 1.3B-parameter foundation model across weather, air quality, and ocean waves
- Published Nature May 2025. Open-sourced Nov 2025 (github.com/microsoft/aurora)
- Key innovation: single foundation model for multiple Earth system prediction tasks
- Trained on diverse data (weather, air quality, ocean) — demonstrates cross-domain transfer
- Built by Jayesh Gupta's team (Gupta now CEO of Silurian AI, building GFT)
- Limitation: foundation model breadth trades against specialized depth

**FuXi (CMA / Fudan University)**
- Family of models: FuXi Weather, FuXi-ENS, FuXi-S2S
- FuXi Weather: first end-to-end ML system cycling DA + forecasting for a full year (Nature Communications 2025)
- FuXi-ENS: outperforms ECMWF ENS on 98.1% of targets (Science Advances 2025)
- FuXi-S2S: extends to 42-day subseasonal forecasts
- Key innovation: end-to-end cycling (DA → forecast → DA) without physics-based components
- Limitation: primarily developed and evaluated over East Asia

**NeuralGCM (Google / Caltech)**
- Hybrid physics-ML: traditional dynamics solver + neural subgrid physics parameterizations
- 2025 Science Advances paper: direct training on satellite precipitation, 40% error reduction vs IPCC-class models over 40 years
- Key innovation: conserves physical quantities (mass, energy) via explicit dynamics solver. Addresses the conservation problem that pure ML models cannot solve.
- Integrated into DLESyM (NVIDIA) for coupled atmosphere-ocean climate simulation with 1000+ year stability
- Limitation: slower than pure ML approaches due to physics solver; less flexible architecture

**WeatherMesh (WindBorne Systems)**
- WM-2 (Jan 2025): surpasses HRES, GFS, and GraphCast on standard metrics
- WM-5c: first continuously updated global model (every 20 min). Uses proprietary balloon observation data from WindBorne's sounding network.
- Key innovation: proprietary data advantage (in-situ observations from their own global balloon fleet)
- Developing WeatherMesh-3, exploring Earth-2 integration
- Limitation: proprietary — not open-source, not independently reproducible

**NOAA AI Suite (Dec 2025)**
- AIGFS: fine-tuned GraphCast for NOAA operations
- AIGEFS: AI-based global ensemble forecasting system
- HGEFS: world's first hybrid physical-AI ensemble. Combines traditional physics ensembles with AI ensemble members.
- Uses 0.3% of GFS compute. HGEFS outperforms both pure-physics and pure-AI ensembles individually.
- Key innovation: hybrid approach validates that physics + AI > either alone
- First operational AI weather deployment by a US agency

**ACE2 / SamudrACE (Allen AI)**
- ACE2: 450M-parameter climate emulator. Runs 1,500 simulated years per day. Enforces conservation laws.
- SamudrACE (Sep 2025): first coupled ocean-atmosphere AI climate emulator
- HiRO-ACE (Dec 2025): 3km precipitation downscaling
- Key innovation: conservation-law enforcement + coupled ocean-atmosphere in a single AI model
- Competes with cBottle and DLESyM in AI climate modeling
- Limitation: lower resolution than cBottle's HPX1024 super-resolution

---

**Landscape summary:** The field has stratified into (1) global probabilistic (Atlas, GenCast, FuXi-ENS, AIFS), (2) hybrid physics-AI (NeuralGCM, HGEFS), (3) climate emulation (cBottle, ACE2, DLESyM), and (4) regional/downscaling (CorrDiff, StormScope). No single model dominates all categories. The trend is toward probabilistic/generative methods, operational deployment, and hybrid approaches.

As of: March 2026
