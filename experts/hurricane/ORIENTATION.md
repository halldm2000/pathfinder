# Hurricane Expert Orientation

Reference material for the hurricane/tropical cyclone expert. Facts here correct what the model gets wrong, add what it doesn't know, and anchor fast-moving details with dates. Omits facts the model reliably knows (basic TC dynamics, Coriolis effect, warm-core structure, etc.).

Last verified: March 2026. Claude's training data extends through early 2025.

## Field Map

Tropical cyclone prediction is in the early stages of an AI transformation. Track forecasting has been revolutionized -- AI models (Atlas, GenCast) now match or exceed operational NWP track skill at 3-7 day lead times, and NVIDIA's HENS produces 7,424-member ensembles in minutes. But intensity prediction remains the field's central unsolved problem: rapid intensification still catches models off guard, and no AI system reliably outperforms statistical-dynamical guidance (SHIPS/LGEM) for RI probability as of March 2026. The operational centers (NHC, JTWC) are integrating AI guidance cautiously -- HENS entered the NHC model suite for experimental evaluation in the 2025 Atlantic season. Traditional dynamical models (HAFS, HWRF's successor) remain the backbone for intensity and structure, while AI provides speed and ensemble breadth. The convergence point is hybrid systems: AI for track and large ensembles, physics-based models for intensity and inner-core structure.

## NVIDIA HENS (Hurricane Ensemble System)

As of March 2026, HENS is NVIDIA's flagship TC prediction system, built on top of Atlas.

- **Architecture:** Atlas global model (0.25deg, 15d) run as massive ensembles. 7,424 ensemble members generated in ~3 minutes on a single DGX H100 node (8 GPUs). Uses ATLAS-CRPS estimator (3.3s/step per member).
- **TC tracking:** Automated vortex tracker extracts TC position, intensity (minimum SLP, maximum 10m wind), and wind radii from each ensemble member. Produces probabilistic track forecasts, intensity distributions, and strike probability maps.
- **2024 Atlantic season retrospective:** HENS ensemble-mean track error competitive with NHC official forecast through 120h. Strike probability maps showed calibrated coverage. Intensity prediction showed improvement over raw Atlas but still lags operational dynamical models for RI events.
- **NHC integration:** HENS guidance entered NHC's experimental model suite for the 2025 Atlantic hurricane season. Not yet a primary guidance model but available to forecasters alongside HAFS, GFS, ECMWF.
- **Key advantage:** Ensemble size. 7,424 members enables robust tail-risk estimation (e.g., "3% probability of Category 4+ at Miami within 72h") that traditional 50-member ensembles cannot reliably produce. Speed enables real-time re-initialization as new observations arrive.
- **Key limitation:** Inherits Atlas's intensity weaknesses. 0.25deg resolution cannot resolve inner-core structure (eye wall, secondary wind maxima). No vortex initialization -- relies on analysis state, which often underrepresents TC intensity.

See `reference/hens.md` for architecture details, verification scores, and ensemble configuration.

## AI Models for TC Prediction

AI weather models vary dramatically in TC-specific skill. Track skill has converged rapidly; intensity skill has not.

### Track prediction (state of play, March 2026)
- **Atlas/HENS:** Ensemble-mean track error comparable to GFS and ECMWF through 5 days. Advantage: thousands of members for probabilistic guidance. Paper shows improvement over GenCast beyond 80h for 46 storms in 2020 (arXiv:2601.18111).
- **GenCast:** Strong track performance. 15-day probabilistic forecasts at 0.25deg. Published Nature Dec 2024. Outperforms ECMWF ENS on 97.2% of 1320 verification targets (including TC tracks).
- **Pangu-Weather:** Demonstrated reasonable TC track skill in multiple evaluations. Faster than GenCast but deterministic. Published Nature 2023. Track skill degrades less than intensity skill at longer leads.
- **AIFS (ECMWF):** Operational since Feb 2025. TC tracking integrated into IFS framework. Competitive track skill at medium range but limited public TC-specific verification.
- **FuXi-ENS:** Claims to outperform ECMWF ENS on 98.1% of targets (Science Advances 2025). Limited TC-specific published verification.

### Intensity prediction (the hard problem)
- All AI global models trained on ERA5 inherit its intensity bias: ERA5 systematically underrepresents peak TC intensity (especially Cat 4-5) because reanalysis resolution (0.25deg ~31km) smooths inner-core structure.
- **Result:** AI models predict intensity evolution but underpredict peaks by 10-30 kt for major hurricanes. Rapid intensification events (30+ kt/24h) are particularly problematic.
- HENS partially mitigates this through ensemble spread -- the tail of the intensity distribution sometimes captures RI -- but the ensemble mean still underpredicts peaks.
- **No AI model reliably predicts RI onset as of March 2026.** SHIPS-RapidIntensification (statistical-dynamical) and the operational RAMMB RI consensus remain the primary RI guidance tools.

See `reference/ai-tc-models.md` for detailed model-by-model TC evaluation.

## Traditional NWP for TCs

### HAFS (Hurricane Analysis and Forecast System)
- NOAA's next-generation operational hurricane model, replacing HWRF and HMON. Moving nest, ocean-coupled, 2km inner domain.
- Became primary operational hurricane model at NHC in 2024 season (HAFS-A and HAFS-B configurations).
- Strongest intensity prediction of any operational model. Represents inner-core structure (eye wall, secondary eyewall formation) that AI models cannot resolve.
- Runs twice daily; ~2h wall-clock time on NOAA's HPC systems.

### HWRF (Hurricane Weather Research and Forecasting)
- Legacy operational hurricane model (2007-2023). Triple-nested to 2km. Ocean-coupled (HYCOM/POM-TC). Formally replaced by HAFS but frequently referenced in verification baselines.

### GFS and ECMWF IFS
- Global models with reasonable TC track skill but coarse resolution (GFS: 13km, IFS: 9km deterministic) limits intensity prediction.
- GFS track guidance widely used as a consensus member. IFS (ECMWF) generally has lowest track error among deterministic global models.
- Neither resolves inner-core structure; both used primarily for track and large-scale steering.

### Consensus models (critical for operations)
- **TVCN/TVCE:** Multi-model track consensus (deterministic/ensemble). NHC's most-used track guidance tool. Consensus typically outperforms any single model.
- **IVCN:** Intensity consensus. Less reliable than track consensus because intensity models have larger biases.
- NHC official forecasts add value over any single model or consensus, especially for intensity.

## Observational Systems

- **Hurricane hunters (NOAA P-3, Air Force WC-130J):** In-situ reconnaissance providing center fixes (lat/lon/pressure), flight-level winds, dropsondes (vertical profiles), SFMR (surface wind estimation via microwave radiometry), and tail Doppler radar (3D wind structure). Gold standard for intensity estimation. Not available in all basins -- primarily Atlantic and some East Pacific.
- **GOES-16/18 (GOES-East/West):** Geostationary satellite. Advanced Baseline Imager (ABI) at 0.5-2km resolution, 5-minute mesoscale domain scans for TCs. Dvorak technique and Advanced Dvorak Technique (ADT) estimate intensity from IR imagery. Available globally (geostationary coverage varies by basin).
- **JPSS (VIIRS, ATMS):** Polar-orbiting. Microwave imagery sees through cirrus to reveal inner-core structure. Critical for eye detection when eyes are obscured in visible/IR.
- **Dropsondes:** GPS-tracked falling instruments deployed from aircraft. Provide temperature, humidity, and wind profiles through the storm boundary layer. Essential for surface wind estimation and central pressure measurement.
- **Radar (WSR-88D network):** Land-based Doppler radar. Provides inner-core structure once a TC is within ~250 km of CONUS coastline. Dual-pol since 2013.

## TC Databases

- **IBTrACS (International Best Track Archive for Climate Stewardship):** WMO-sanctioned global TC database. All basins, 1842-present (reliable data ~1980+, satellite era). Maintained by NOAA NCEI. Includes position, intensity (Vmax, MSLP), wind radii from all agencies.
- **HURDAT2 (Hurricane Database 2):** NHC official best track for Atlantic (1851+) and East Pacific (1949+). 6-hourly positions, intensity, wind radii. More detailed than IBTrACS for Atlantic but single-agency perspective.
- **ATCF (Automated Tropical Cyclone Forecasting):** Real-time model guidance database format. A-deck (model tracks), B-deck (best track), E-deck (probability aids). The operational backbone -- every model forecast is stored in ATCF format. Available from NHC and JTWC.

## Key TC Science Concepts the Model Gets Wrong

### Rapid Intensification (RI)
- Definition: 30 kt (15 m/s) increase in maximum sustained wind in 24 hours (Atlantic convention). Some studies use 25 kt or 35 kt thresholds.
- ~5-7% of Atlantic 24h intensity changes qualify as RI. But RI events produce a disproportionate fraction of major hurricanes and casualties (e.g., Hurricane Maria 2017, Hurricane Michael 2018, Hurricane Otis 2023).
- Key drivers: high ocean heat content (not just SST -- need depth of warm water), low vertical wind shear, high mid-level relative humidity, efficient upper-level outflow. Inner-core processes (vortex Rossby waves, convective bursts, eyewall contraction) are necessary to translate favorable environment into actual RI.
- **Models struggle with RI because it requires both correct large-scale environment and correct inner-core vortex dynamics -- a multi-scale problem that spans 1-1000 km.**

### Eye Wall Replacement Cycles (EWRCs)
- Outer eyewall forms, contracts, chokes inner eyewall. Temporary weakening (10-30 kt) followed by re-intensification. Common in major hurricanes (Cat 3+).
- EWRCs are nearly invisible to 0.25deg AI models. HAFS at 2km can represent them. Satellite microwave imagery is the primary observational detection tool.

### Wind Radii and Storm Size
- R34, R50, R64: radii (in nmi) of 34-kt, 50-kt, 64-kt winds in each quadrant (NE, SE, SW, NW).
- Storm size varies enormously: Sandy (2012) had R34 > 400 nmi while Andrew (1992) had R34 ~75 nmi.
- Wind radii determine storm surge magnitude (proportional to size more than intensity), evacuation zones, and warning areas. AI models that predict only central pressure and Vmax miss this dimension.

### Saffir-Simpson Scale Limitations
- Only measures maximum sustained 1-minute wind speed. Five categories: 1 (64-82 kt), 2 (83-95 kt), 3 (96-112 kt), 4 (113-136 kt), 5 (137+ kt).
- Does not capture: storm size, rainfall, storm surge, forward speed, duration of impact. A large Category 2 (like Ike 2008) can cause more surge damage than a small Category 4.
- IKE (Integrated Kinetic Energy) proposed as a supplement: integrates total wind energy over the entire wind field. Not operationally adopted as of March 2026.

## Key Metrics

| Metric | What it measures | Typical values (2024 NHC Atlantic) |
|--------|-----------------|--------------------------------------|
| Track error (nmi) | Great-circle distance, forecast vs observed | 48h: ~45 nmi, 120h: ~120 nmi |
| Intensity error (kt) | Absolute difference in Vmax | 48h: ~12 kt, 120h: ~18 kt |
| Intensity bias (kt) | Mean signed error (positive = too strong) | Varies by model; AI models tend negative bias |
| R34/R50/R64 (nmi) | Wind radii by quadrant | R34 Atlantic mean: ~100-150 nmi |
| RI probability (%) | Probability of 30kt+/24h intensification | Climatological base rate: ~5-7% |
| CRPS | Continuous Ranked Probability Score (ensembles) | Lower is better; used for probabilistic verification |
| BSS (Brier Skill Score) | Probabilistic verification vs climatology | Positive = better than climatology |

As of: March 2026.
