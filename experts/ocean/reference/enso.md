# ENSO: Dynamics, Indices, Teleconnections, and Prediction

Deep reference for ENSO-related questions beyond what the orientation doc covers.

## ENSO Dynamics

### Bjerknes Feedback (positive, amplifying)
The fundamental mechanism. Warm SST anomaly in central/eastern Pacific -> reduced east-west SST gradient -> weakened Walker circulation -> weakened trade winds -> reduced equatorial upwelling and eastward thermocline tilt relaxation -> further warming. The loop amplifies initial perturbations into full El Nino events. La Nina: reverse polarity (cold SST -> stronger trades -> more upwelling -> further cooling).

### Delayed Oscillator and Recharge-Discharge
- **Delayed oscillator (Suarez & Schopf 1988):** Equatorial Kelvin waves propagate east (warming), reflect as Rossby waves, propagate west, reflect off western boundary as upwelling Kelvin waves that terminate the event. ~12-18 month delay provides the oscillation timescale.
- **Recharge-discharge (Jin 1997):** ENSO cycle driven by buildup (recharge) and depletion (discharge) of equatorial warm water volume (WWV). Recharged state (above-normal WWV) precedes El Nino; discharged state precedes La Nina. WWV measured by Argo/TAO as 20C isotherm depth.
- **Both frameworks are useful:** Delayed oscillator explains wave dynamics; recharge-discharge explains the role of warm water volume as a precursor. Modern understanding integrates both.

### Westerly Wind Bursts (WWBs)
- Episodic westerly wind events in the western Pacific, often linked to MJO convective pulses.
- Can trigger downwelling Kelvin waves that initiate or amplify El Nino.
- Stochastic nature of WWBs is a key source of ENSO forecast uncertainty. Some El Nino events fail to develop because expected WWBs do not materialize.
- The 2014 "El Nino that wasn't" is a canonical example: recharged warm water volume but insufficient WWB forcing.

## Nino Indices: Detailed Specifications

| Index | Region | Coordinates | Primary Use |
|-------|--------|-------------|-------------|
| Nino 1+2 | Far eastern Pacific | 0-10S, 90W-80W | Coastal Peru impacts, early signal |
| Nino 3 | Eastern Pacific | 5N-5S, 150W-90W | Canonical EP El Nino |
| Nino 3.4 | Central-eastern Pacific | 5N-5S, 170W-120W | Standard operational index (ONI) |
| Nino 4 | Central Pacific | 5N-5S, 160E-150W | CP/Modoki El Nino |
| TNI (Trans-Nino Index) | Nino 1+2 minus Nino 4 | -- | EP vs CP discrimination |
| SOI | SLP Tahiti - Darwin | -- | Atmospheric verification |
| EMI (El Nino Modoki Index) | Central Pacific SST pattern | -- | CP El Nino identification |

### ONI Thresholds (NOAA CPC operational definition)
- El Nino: ONI >= +0.5C for 5 consecutive overlapping 3-month seasons
- La Nina: ONI <= -0.5C for 5 consecutive overlapping 3-month seasons
- Neutral: -0.5C < ONI < +0.5C
- Weak: |ONI| 0.5-0.9C, Moderate: 1.0-1.4C, Strong: 1.5-1.9C, Very Strong: >= 2.0C
- Base period: centered 30-year (currently 1991-2020, updated every 5 years)

## Teleconnection Detail

### Pacific-North American (PNA) Pattern
- El Nino -> anomalous tropical convection -> enhanced Rossby wave train: positive height anomaly over tropical Pacific, negative over North Pacific (deepened Aleutian Low), positive over western Canada, negative over southeastern US.
- PNA-positive pattern: stronger subtropical jet across southern US (wet conditions in California, Gulf states), suppressed storm track in Pacific NW.
- PNA response is strongest in DJF, weakest in JJA. Teleconnection takes ~2-4 weeks to establish after ENSO SST anomaly is in place.

### Tropical Teleconnections
- **Walker circulation shift:** El Nino moves ascending branch from Maritime Continent to central Pacific. Subsidence over Indonesia/Australia -> drought. Enhanced convection over central Pacific -> more precipitation.
- **Indian Ocean response:** El Nino often triggers Indian Ocean Dipole (IOD) positive phase, reinforcing drought in Indonesia/Australia and enhancing East African rainfall. IOD-ENSO interaction is an active research area.
- **South Asian monsoon:** El Nino weakens Indian monsoon (reduced rainfall) in ~60% of events. Relationship has weakened since 1980s, possibly due to Indian Ocean warming trend.

### Asymmetry
- El Nino teleconnections are stronger and more spatially consistent than La Nina teleconnections. La Nina impacts are more variable and harder to predict.
- Strong El Ninos (>2.0C) produce clearer teleconnections than moderate events. Moderate events can be dominated by internal atmospheric variability.

## Prediction Skill

### IRI/CPC ENSO Forecast Plume
- Ensemble of ~20 models (dynamical + statistical). Updated monthly. Shows individual model forecasts and multi-model mean.
- Multi-model mean generally outperforms any single model for ENSO prediction.
- Publicly available: iri.columbia.edu/our-expertise/climate/forecasts/enso/current/

### Skill by Lead Time (approximate, Nino 3.4 phase)
- 0-3 months: High skill (correlation >0.9 for most models)
- 3-6 months: Good skill (correlation ~0.7-0.9)
- 6-9 months: Moderate skill (correlation ~0.5-0.7), strong season dependence
- 9-12 months: Low-to-marginal skill (correlation ~0.3-0.5), spring barrier dominates

### Spring Predictability Barrier
- Physical cause: annual cycle of tropical Pacific SST variance reaches minimum in MAM. Signal-to-noise ratio is lowest, so initial condition errors grow fastest.
- Practical impact: forecasts initialized in JFM and verified through JJA-SON have substantially lower skill than forecasts initialized in JJA and verified through DJF-MAM.
- Implication: do not trust ENSO phase forecasts at 6+ month lead when initialized in boreal spring.

### Machine Learning for ENSO
- Ham et al. (2019, Nature) demonstrated CNN-based ENSO prediction with skill exceeding dynamical models at leads of 12-18 months. Result generated excitement but has not been consistently replicated with out-of-sample testing.
- Multiple ML approaches since (graph neural networks, transformers, physics-informed neural networks). Skill improvements are real but modest relative to best dynamical models when rigorously evaluated.
- Key challenge: limited training data (~70 years of reliable observations, ~150 years with proxy records). Transfer learning from reanalysis and climate model output is an active approach.
