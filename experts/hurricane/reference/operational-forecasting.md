### Operational Tropical Cyclone Forecasting

**What this covers:** The NHC and JTWC operational workflow, consensus model methodology, verification practices, and the warning process. Understanding how forecasters actually use model guidance is essential context for evaluating where AI fits.

**NHC (National Hurricane Center) forecast process:**
1. **Data collection:** Every 6 hours (00, 06, 12, 18 UTC synoptic times). Ingest satellite imagery (GOES-16/18 IR/VIS/MW), reconnaissance (when available, typically within 48h of landfall or for intensifying systems), surface observations, radar, and all model guidance.
2. **Analysis:** Determine current position (center fix), intensity (Vmax, MSLP), motion, and structure (wind radii R34/R50/R64 by quadrant). Satellite-based intensity uses Dvorak technique / Advanced Dvorak Technique (ADT). Reconnaissance data takes precedence when available.
3. **Model evaluation:** Review all dynamical and statistical models. Forecasters examine 15-30+ models including GFS, ECMWF IFS, HAFS-A, HAFS-B, HENS (experimental 2025+), AIFS, consensus models (TVCN, TVCE), and statistical aids (SHIPS, LGEM, SHIPS-RI).
4. **Consensus construction:** TVCN (track consensus, ~6-8 models) is the single most influential track guidance. Forecasters typically start with the consensus, then adjust based on pattern recognition and model biases.
5. **Forecast issuance:** Official forecast issued at 5 AM / 11 AM / 5 PM / 11 PM ET for Atlantic storms. Includes position, intensity, motion, wind radii out to 120h (5 days). Tropical Weather Outlook extends to 7 days for genesis probability.

**Consensus models -- why they work:**
- **TVCN (Track Variable Consensus):** Average of ~6-8 selected dynamical models (GFS, ECMWF, UKMO, HAFS-A, HAFS-B, etc.). Consistently outperforms any individual model because independent model errors partially cancel.
- **TVCE (Track Variable Consensus, Ensemble-based):** Uses ensemble means rather than deterministic models. Sometimes outperforms TVCN at longer leads.
- **IVCN (Intensity Variable Consensus):** Intensity analog of TVCN. Less reliable than track consensus because intensity models share common biases (especially for RI).
- **Key question for AI integration:** Should HENS be added to TVCN? Depends on whether its errors are sufficiently independent from existing members. Initial 2025 evaluation suggests HENS adds skill at 96-120h but introduces redundancy at shorter leads (correlated with GFS-based models).

**JTWC (Joint Typhoon Warning Center) -- key differences from NHC:**
- Covers Western Pacific, South Pacific, Indian Ocean. Based in Pearl Harbor, HI.
- Uses 1-minute sustained winds (same as NHC), but JMA uses 10-minute winds. Conversion factor: approximately 1-min = 1.14 x 10-min (not exact, varies with storm structure).
- Limited reconnaissance (no routine hurricane hunters in WPac). Relies more heavily on satellite intensity estimation (Dvorak, ADT, SATCON).
- Uses similar consensus model approach but different model availability (no HAFS).

**Statistical-dynamical intensity aids (still critical for RI):**
- **SHIPS (Statistical Hurricane Intensity Prediction Scheme):** Multiple linear regression using environmental predictors (SST, shear, upper divergence, ocean heat content, etc.) and persistence. Baseline intensity guidance since 1990s.
- **LGEM (Logistic Growth Equation Model):** Intensity prediction based on maximum potential intensity (MPI) and environmental factors. Often paired with SHIPS.
- **SHIPS-RapidIntensification:** Probability of RI (30 kt/24h). Uses discriminant analysis on SHIPS predictors. As of March 2026, still the primary calibrated RI probability aid at NHC.
- **RAMMB RI Consensus:** Combines multiple RI predictors (SHIPS-RI, satellite-based signals). Available at rammb.cira.colostate.edu.
- **Why these persist alongside AI:** Calibrated on observed RI events. AI models produce intensity forecasts but not calibrated RI probabilities with the reliability that SHIPS-RI provides.

**Verification (NHC official performance, 2024 Atlantic season):**
- 48h track error: ~45 nmi (continuing long-term downward trend, was ~100 nmi in 2005)
- 120h track error: ~120 nmi
- 48h intensity error: ~12 kt (trend is roughly flat; intensity skill improves much more slowly than track)
- 120h intensity error: ~18 kt
- NHC official forecasts add skill over any single model, especially for intensity. The forecaster's value-add is largest for non-routine scenarios: RI, interaction with land, extratropical transition.
- Track forecast cone: encompasses the observed track ~60-70% of the time (by design, calibrated to ~2/3 of historical errors). Users frequently misinterpret the cone as only representing possible storm paths, not as a confidence interval on track.

**Warning process:**
- Tropical Storm Watch: issued 48h before expected onset of tropical storm conditions (34+ kt sustained winds).
- Tropical Storm Warning: 36h before expected onset.
- Hurricane Watch: 48h before expected onset of hurricane conditions (64+ kt).
- Hurricane Warning: 36h before expected onset.
- Storm Surge Watch/Warning: separately issued for life-threatening storm surge. Uses SLOSH and P-Surge models for inundation estimates.
- Watches/warnings trigger emergency management response. Forecast accuracy directly determines whether evacuations are timely or premature.

**Where AI guidance fits in the current workflow (as of 2025-2026):**
- AI models (HENS, AIFS, AIGFS) appear alongside traditional models on ATCF plots that forecasters review.
- No AI model is yet in the consensus (TVCN/IVCN) for NHC. ECMWF has integrated AIFS into their own operational suite, but NHC treats AIFS as one model among many.
- AI models are most valued for: (1) additional track guidance at 4-5 day leads, (2) probabilistic information from large ensembles (HENS), (3) speed for rapid re-initialization.
- AI models are least trusted for: (1) intensity, especially RI, (2) inner-core structure, (3) near-landfall details.

**Sources:**
- NHC Forecast Verification: nhc.noaa.gov/verification
- NHC model guidance: nhc.noaa.gov/modelsummary.shtml
- ATCF documentation: nrlmry.navy.mil/atcf_web

As of: March 2026
