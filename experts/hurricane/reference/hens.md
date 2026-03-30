### HENS (Hurricane Ensemble System)

**What it is:** NVIDIA's probabilistic tropical cyclone prediction framework built on Atlas. Generates 7,424-member ensembles for TC track, intensity, and wind radii forecasting. Designed to provide the tail-risk quantification that traditional 50-member ensembles (ECMWF ENS, GEFS) cannot. Runs on a single DGX H100 node in approximately 3 minutes for a 5-day forecast cycle.

**Key details:**
- Ensemble size: 7,424 members (93 initial conditions x 80 stochastic perturbations, configurable)
- Base model: ATLAS-CRPS estimator (3.3s/step on A100, 0.25deg global, 6-hourly steps)
- Forecast range: 15 days, though TC-specific guidance typically emphasized through 120h (5 days)
- Initialization: ERA5 or GFS analysis. No vortex initialization (bogussing) -- relies on analysis-state representation of TC structure
- TC tracker: Automated vortex-following algorithm extracts center position (lat/lon), MSLP, Vmax (10m wind), and R34/R50/R64 wind radii from each ensemble member
- Output products: Probabilistic track (strike probability maps, track density), intensity distributions (PDF of Vmax at each lead time), wind radii probabilities, exceedance curves

**2024 Atlantic season retrospective (arXiv/NVIDIA technical report):**
- 18 named storms evaluated. HENS ensemble-mean track error: competitive with NHC official through 120h. Specific numbers below.
- Track: ensemble-mean cross-track and along-track errors within +-10% of GFS and ECMWF deterministic through 72h. Advantage over GFS at 96-120h.
- Intensity: ensemble-mean Vmax shows negative bias of 8-15 kt for Cat 3+ storms. Bias increases for RI events.
- RI detection: the upper tail of the HENS intensity distribution (e.g., 90th percentile member) does capture some RI events that the ensemble mean misses. However, using the tail as an RI predictor has a high false alarm rate (~40%). Not yet competitive with SHIPS-RI for calibrated RI probability.
- Strike probability: 72h strike probability maps showed good calibration (reliability diagram slope ~1.0) for the 34-kt wind threshold. Less well-calibrated for 64-kt threshold due to intensity bias.

**NHC experimental integration (2025 season):**
- HENS added to ATCF a-deck as an experimental model. Not included in consensus models (TVCN/TVCE) as of 2025. Forecasters can view HENS alongside operational models.
- NHC feedback: track guidance competitive, intensity guidance "promising but needs improvement for major hurricanes," ensemble spread "potentially very useful for quantifying uncertainty in low-confidence scenarios."

**Configuration for different use cases:**
- Standard ensemble: 7,424 members for full probabilistic assessment
- Quick-look: 256 members (~25 seconds) for rapid situational awareness
- Sensitivity testing: fix initial conditions, vary stochastic perturbations (or vice versa) to diagnose source of forecast uncertainty

**Relationship to other entities:** Built on Atlas (inherits its strengths and limitations at 0.25deg). Complementary to HAFS (which has better intensity/structure at 2km but runs 1-2 members). HENS provides track probability that HAFS cannot, HAFS provides intensity and inner-core structure that HENS cannot. Ideal operational pairing: HENS for probabilistic track/strike probability, HAFS for intensity and structure guidance.

**Known issues / limitations:**
- 0.25deg resolution cannot resolve eye wall, secondary eyewall, wind radii structure below ~100 km scale
- No vortex initialization means initial intensity in weak analysis states can be 10-20 kt below observed
- Intensity bias for major hurricanes (Cat 3+) limits usefulness for intensity guidance
- Ensemble member independence: using ATLAS-CRPS with different random seeds produces diverse members, but members share identical physics biases (unlike multi-model ensembles)

**Headline verification scores (2024 Atlantic retrospective):**
- Ensemble-mean 48h track error: ~50 nmi (comparable to GFS: ~48 nmi, ECMWF: ~42 nmi)
- Ensemble-mean 120h track error: ~125 nmi (comparable to GFS: ~130 nmi)
- Ensemble-mean 48h intensity MAE: ~14 kt (GFS: ~12 kt, HAFS-A: ~10 kt)
- 72h strike probability reliability: slope 0.95-1.05 for R34 threshold

**Sources:**
- Atlas paper: arXiv:2601.18111
- HENS technical report: NVIDIA (2025 season retrospective, expected publication 2026)

As of: March 2026
