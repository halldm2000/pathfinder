### AIFS (Artificial Intelligence Forecasting System) & Anemoi

**What it is:** ECMWF's operational AI weather forecasting system — the world's first ML weather model deployed operationally at a tier-1 NWP center. Built on the Anemoi open-source framework, which has become the de facto standard for sovereign Met agencies worldwide. AIFS represents the most significant validation of AI weather prediction: ECMWF, the global gold standard for NWP, chose to deploy ML alongside its physics-based IFS.

**Key details:**
- Operational since Feb 2025 (deterministic), Jul 2025 (ensemble, 51 members)
- Architecture: Graph Neural Network (GNN) + transformer hybrid
- Resolution: ~28km (0.25deg)
- Uses same initial conditions as IFS (ECMWF's physics-based system)
- ~1,000x less energy than IFS for equivalent forecasts
- Open weights available on Hugging Face
- Speed: generates a 10-day forecast in minutes (vs. ~1 hour for IFS on supercomputer)

**Anemoi framework:**
- Open-source training and deployment framework for AI weather models
- GitHub: github.com/ecmwf (anemoi-inference, anemoi-training, anemoi-datasets)
- Adopted by 11+ national met services (including agencies in EU member states, NOAA, UK Met Office, Australia BoM)
- Won 2025 HPCwire award
- Forecast-in-a-box: packaged deployment for national met services to run their own AI forecasts
- NVIDIA actively supporting: DALI integration for GPU-accelerated data loading

**Why AIFS matters for the landscape:**
- Establishes the baseline: most AI weather model comparisons now benchmark against AIFS
- Proves operational viability: running 24/7 alongside IFS at ECMWF
- De-risks adoption: if ECMWF trusts it, other agencies follow
- Open weights + Anemoi framework = fastest path for national met services to deploy AI weather

**AI Weather Quest:**
- ECMWF-hosted competition for sub-seasonal AI prediction
- Provides standardized evaluation framework for emerging AI weather models
- Multiple rounds with increasing difficulty

**Relationship to other entities:** Primary benchmark competitor for Atlas and FCN3. Uses the same ERA5/IFS data ecosystem. Anemoi competes with Earth2Studio as an inference framework, though Anemoi focuses on training-to-deployment while Earth2Studio focuses on multi-model inference. NVIDIA collaborates with ECMWF (Niall Robinson ↔ Peter Dueben, Matt Chantry).

**Known issues / limitations:**
- GNN architecture is less scalable than transformer-based approaches (Atlas)
- 28km resolution — same limitation as other global models for convective-scale
- Ensemble limited to 51 members (traditional ENS size) — FCN3/HENS can generate thousands
- Open weights are for inference only — full training requires Anemoi + significant compute

**Sources:**
- ECMWF: ecmwf.int (AIFS operational pages)
- Anemoi: github.com/ecmwf
- Hugging Face: open weights

As of: March 2026
