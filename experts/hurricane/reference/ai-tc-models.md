### AI Weather Models: Tropical Cyclone Performance

**What this covers:** TC-specific evaluation of major AI weather models. AI models have rapidly closed the track skill gap with operational NWP but intensity prediction -- especially rapid intensification -- remains a persistent weakness across all architectures.

**The core problem:** All global AI weather models train on ERA5 reanalysis (0.25deg, ~31 km). At this resolution, TC inner-core structure is heavily smoothed. Peak wind speeds in ERA5 are systematically lower than observed best-track intensity: ERA5 Cat 5 hurricanes are typically represented as Cat 2-3. This ceiling propagates into learned forecasts.

**Model-by-model TC evaluation:**

**Atlas / HENS (NVIDIA)**
- Track: ensemble-mean competitive with GFS/ECMWF through 5 days. Paper reports improvement over GenCast beyond 80h lead time for 46 storms in 2020. The ensemble spread provides probabilistic track guidance unavailable from deterministic models.
- Intensity: negative bias of 8-15 kt for Cat 3+ storms. Ensemble tail sometimes captures RI but with high false alarm rate.
- Strength: massive ensemble size (7,424 members) enables tail-risk quantification. Speed enables rapid re-initialization.
- Weakness: no vortex initialization, 0.25deg resolution limit, no inner-core structure.
- Status: HENS in NHC experimental suite (2025 season).

**GenCast (DeepMind)**
- Track: strong. Published Nature Dec 2024. Outperforms ECMWF ENS on 97.2% of 1320 targets (includes but not limited to TC).
- Intensity: subject to same ERA5 resolution bias as Atlas. No published RI-specific evaluation.
- Strength: solid probabilistic calibration, well-validated on WeatherBench 2.
- Weakness: 140s per 12h step (much slower than ATLAS-CRPS), limited ensemble size in practice (50-100 members), closed weights.
- Status: research model, not operational.

**Pangu-Weather (Huawei)**
- Track: early demonstrator of AI TC track skill. Published Nature 2023. Reasonable track error at 3-5 day leads.
- Intensity: deterministic only. Significant underprediction of major hurricane intensity. Published evaluations show 15-25 kt negative bias for Cat 3+ storms.
- Strength: very fast inference (seconds per step).
- Weakness: deterministic (no ensemble uncertainty), intensity bias, no updates since initial publication.
- Status: research model.

**GraphCast (DeepMind)**
- Track: good skill at medium range (3-7 days). NOAA's AIGFS is a fine-tuned GraphCast operational since Dec 2025.
- Intensity: same ERA5 ceiling. AIGFS TC intensity evaluation shows improvement over raw GraphCast due to fine-tuning on GFS analysis, but still lags HAFS.
- Status: AIGFS operational at NOAA (Dec 2025). Open weights available.

**AIFS (ECMWF)**
- Track: operational since Feb 2025. Integrated into IFS framework. Track skill comparable to IFS deterministic.
- Intensity: limited public TC-specific verification. ECMWF focuses on global metrics rather than TC-specific evaluation.
- Strength: operational at the world's top NWP center, same initial conditions as IFS.
- Weakness: limited public TC benchmarks.
- Status: operational (deterministic Feb 2025, ensemble Jul 2025).

**FuXi (CMA/Fudan)**
- Track: FuXi-ENS claims outperformance on 98.1% of targets (Science Advances 2025). Limited TC-specific evaluation.
- Intensity: no published RI evaluation.
- FuXi Weather: first end-to-end ML system cycling DA + forecasting for a full year. Potential for improved TC initialization.
- Status: research/experimental.

**Cross-cutting findings (as of March 2026):**
1. **Track skill convergence:** AI models have reached approximate parity with NWP for TC track at 1-5 day leads. Differences between AI models are often within statistical uncertainty.
2. **Intensity gap persists:** No AI model reliably predicts RI. The ERA5 training ceiling is the fundamental bottleneck.
3. **Ensemble size is where AI wins:** HENS's 7,424 members vs ECMWF's 51. More members = better tail-risk estimation, tighter probability maps.
4. **No AI model does vortex initialization:** Traditional models (HAFS, HWRF) relocate and adjust the TC vortex in initial conditions. AI models use raw analysis fields. This hurts intensity forecasts most in the first 24-48h.
5. **Emerging direction:** training on higher-resolution data (HRRR 3km, IFS 9km) or adding downscaling steps (CorrDiff) to break the 0.25deg ceiling. Not yet validated for TC intensity.

**Known biases by basin (AI models generally):**
- Atlantic: best evaluated. Track biases: many AI models have slow bias for recurving storms at 4-5 day leads.
- East Pacific: less evaluation data. Track skill comparable to Atlantic.
- Western Pacific: AI models trained on ERA5 show larger intensity errors in WPac due to more frequent Cat 4-5 storms (where the ERA5 ceiling bites hardest).
- North Indian Ocean: least evaluated. Small sample sizes make skill assessment unreliable.

**Sources:**
- Atlas: arXiv:2601.18111
- GenCast: Nature, Dec 2024
- Pangu-Weather: Nature, 2023
- AIFS: ECMWF Newsletter 179 (2025)
- FuXi-ENS: Science Advances 2025
- NOAA AIGFS: noaa.gov press release Dec 2025

As of: March 2026
