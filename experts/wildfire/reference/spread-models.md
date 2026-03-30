### Fire Spread Models

**Overview:** Fire spread prediction is the most challenging component of the wildfire prediction chain. The field is dominated by the Rothermel (1972) semi-empirical model, which underpins all US operational tools (FARSITE, FlamMap, BehavePlus). Physics-based coupled fire-atmosphere models (WRF-SFIRE, FIRETEC) are more faithful but computationally prohibitive for real-time operations. Australian models (McArthur, CSIRO, Phoenix) use different empirical bases suited to eucalyptus fuels. AI/ML approaches are emerging but not yet operational.

## Rothermel Spread Rate Model (1972)

**Core equation:**

R = (I_R * xi * (1 + phi_W + phi_S)) / (rho_b * epsilon * Q_ig)

Where:
- R = rate of spread (ft/min)
- I_R = reaction intensity (BTU/ft2/min) -- heat released per unit area per unit time at the fire front
- xi = propagating flux ratio -- fraction of reaction intensity transferred ahead of the fire
- phi_W = wind factor (dimensionless multiplier for wind effect on spread)
- phi_S = slope factor (dimensionless multiplier for slope effect on spread)
- rho_b = bulk density of fuel bed (lb/ft3)
- epsilon = effective heating number -- fraction of fuel that must be heated to ignition
- Q_ig = heat of pre-ignition (BTU/lb) -- energy to raise fuel from ambient to ignition temperature

**Key dependencies:**
- Reaction intensity (I_R) depends on: fuel loading (tons/acre), surface-area-to-volume ratio (1/ft), fuel moisture content, mineral content, moisture of extinction. Computed via equations with 13+ empirically-derived coefficients.
- Wind factor (phi_W) increases spread rate as a power function of midflame wind speed. The exponent depends on fuel bed packing ratio. Critical limitation: the power law overpredicts at very high wind speeds (>25 mph midflame).
- Slope factor (phi_S) increases spread rate proportional to tan(slope)^2 for uphill spread. No explicit mechanism for downslope spread reduction.

**Standard Fuel Models:**
- **13 Fuel Models (Anderson 1982):** Original set. Grouped by fuel type: grass (1-3), shrub (4-7), timber litter (8-10), slash (11-13). Simple but coarse.
- **40 Fuel Models (Scott & Burgan 2005):** Expanded set addressing limitations of the 13-model system. Includes dynamic fuel models where herbaceous fuel transfers between live and dead categories based on moisture. Standard input for FARSITE/FlamMap since ~2010.
- **Custom fuel models:** Users can specify fuel parameters directly. Required for non-US vegetation types not well represented by standard models.

**Known systematic biases:**
- **Grassland fires:** Underpredicts by 2-5x in mature grass with wind >20 mph. The Australian McArthur grassland model performs better in these conditions.
- **Crown fire:** Rothermel does not model crown fire. Separate models (Van Wagner 1977, Cruz et al. 2005) predict crown fire initiation and spread as add-ons.
- **Extreme conditions:** Plume-dominated fires (where fire-generated convection dominates ambient wind) violate Rothermel's assumptions entirely. Spread rates in blow-up fires can exceed Rothermel predictions by 10x or more.
- **Backing fire:** The model was not designed for backing (downwind) fire spread. BehavePlus applies an empirical backing-spread formula, but it is poorly validated.

## FARSITE (Fire Area Simulator)

**What it is:** 2D fire growth simulator that propagates a fire perimeter across a landscape over time. Standard tool for wildfire incident management in the US. Developed by Mark Finney (USFS Fire Sciences Lab, Missoula).

**How it works:**
1. Elliptical fire spread: at each point on the fire perimeter, computes an elliptical spread pattern (Huygens wavelet principle) based on local wind, slope, and fuel conditions.
2. Surface fire: Rothermel model for rate of spread and flame length at each perimeter vertex.
3. Crown fire: Van Wagner (1977) criteria for crown fire initiation (surface fireline intensity exceeds critical threshold based on canopy base height and foliar moisture). Crown fire spread rate from Cruz et al. (2005).
4. Spotting: Albini (1979) maximum spotting distance model. Firebrands lofted by convective column, carried by wind, land ahead of the fire front. Short-range spotting (<1 km) from torching trees. Long-range spotting depends on fire intensity and wind.
5. Time step: typically 15-60 minutes. Shorter time steps for fast-moving fires.

**Required inputs:**
- Landscape file (LCP format): fuel model, canopy cover (%), canopy height (m), crown base height (m), crown bulk density (kg/m3), elevation, slope, aspect. Typically derived from LANDFIRE (30m resolution for CONUS).
- Weather stream: hourly or sub-hourly temperature, RH, precipitation, cloud cover.
- Wind files: gridded or point wind speed and direction. Can use WindNinja (mass-conserving diagnostic wind model) for terrain-adjusted winds.

**Operational use:**
- Fire behavior analysts (FBANs) on incident management teams (IMTs) run FARSITE for 12-72 hour fire growth projections.
- Used for evacuation planning, resource allocation, and tactical fire line placement.
- Requires trained analyst -- not push-button. Analyst adjusts fuels, weather, and timing based on local knowledge.
- **Run time:** Minutes to an hour depending on fire size and landscape complexity. Far faster than physics-based models.

## FlamMap

**What it is:** Companion to FARSITE. Computes fire behavior characteristics (flame length, rate of spread, crown fire activity, fire type) at every point across a landscape for a single set of weather/fuel moisture conditions. Unlike FARSITE, it does not simulate fire growth over time -- it produces a spatial map of potential fire behavior.

**Key outputs:**
- Rate of spread map (ch/hr or m/min at each pixel)
- Flame length map (ft or m at each pixel)
- Crown fire activity map (surface / passive crown / active crown / conditional crown at each pixel)
- Fire type classification

**FSPro (Fire Spread Probability):**
- Monte Carlo extension. Runs thousands of FARSITE-like simulations with random ignition locations and weather draws from historical or forecast distributions.
- Produces: probability-of-burning maps (e.g., "30% probability of fire reaching this point within 14 days").
- Used by Predictive Services for large fire resource allocation decisions. Time horizon typically 7-14 days.
- Weather variability drawn from historical RAWS observations for the same station/season, or from ensemble NWP forecasts.

## WRF-SFIRE (WRF-Fire)

**What it is:** Coupled fire-atmosphere model embedding a surface fire spread model within the WRF (Weather Research and Forecasting) mesoscale atmospheric model. The key advance over FARSITE: the fire generates heat and moisture fluxes that feed back into the atmosphere, modifying local winds, which then affect fire spread. This two-way coupling is essential for simulating extreme fire behavior.

**Architecture:**
- Atmosphere: WRF (compressible, non-hydrostatic, Euler equations on Arakawa-C grid). Typical resolution 100-500 m.
- Fire: level-set method on a refined subgrid (typically 10-50 m). Spread rate computed by Rothermel model (or optionally other empirical models) using local wind interpolated from the WRF grid.
- Coupling: fire heat and moisture fluxes are computed from fuel consumption and injected into the lowest atmospheric levels. WRF responds with modified wind, temperature, and turbulence fields. Coupling time step: every atmosphere time step (typically 0.5-2 seconds).
- Fuel consumption: simplified model based on fuel loading and residence time.

**What it captures that FARSITE cannot:**
- Fire-generated winds (indrafts, convective column)
- Pyroconvection (fire-induced cumulus, pyroCb)
- Wind field modification by fire plume (leeward acceleration, channeling effects)
- Fire whirls and vortex dynamics (at sufficient resolution)
- Terrain-fire-atmosphere interaction

**Limitations:**
- Computational cost: a 24-hour simulation of a 50 km x 50 km domain at 100m/10m resolution takes hours to days on HPC clusters. Not feasible for real-time operational forecasting.
- Still uses Rothermel for the fire spread component, inheriting its empirical limitations.
- Fuel consumption model is simplified compared to CONSUME or FOFEM.
- Validation is challenging: few fires have simultaneous high-resolution fire progression and weather observations.

**Development:** Open-source (openwfm.org). Active development at University of Colorado Denver (Jan Mandel group), with contributions from NCAR and others.

## Phoenix RapidFire (Australia)

**What it is:** Australian operational fire spread model. Developed by University of Melbourne. Used by Country Fire Authority (CFA, Victoria), Fire Rescue Victoria, and other Australian state fire agencies.

**Key features:**
- Uses McArthur Forest Fire Danger Meter Mark 5 for forest fires, CSIRO grassland model (Cheney et al. 1998) for grassland fires. Different empirical basis than Rothermel -- calibrated to Australian eucalyptus forest and native grassland field experiments.
- Ember transport model: critical for Australian fires. Bark spotting from eucalyptus can carry firebrands >20 km ahead of the fire front. Phoenix models ember density and transport based on bark type, fire intensity, and wind.
- Convective plume model: simplified plume rise and entrainment for firebrand lofting height.
- House loss model: estimates structure loss probability based on fire intensity at the structure location, construction type, and vegetation proximity.

**Operational use in Australia:**
- Run in real-time during fire events for impact prediction and evacuation planning.
- Pre-computed in scenario mode for fire risk assessment and land-use planning.
- Integrated with Bureau of Meteorology weather forecasts.

## Prometheus (Canada)

- Canadian fire growth model using the Canadian Forest Fire Behavior Prediction (FBP) System. FBP is based on the Canadian FWI System fuel types (C-1 through C-7, D-1, M-1 through M-4, O-1, S-1 through S-3) rather than US Anderson/Scott-Burgan models.
- Elliptical fire growth using Huygens wavelet (same mathematical framework as FARSITE).
- Used by Canadian provincial fire agencies. Less well known internationally than FARSITE but well-validated for boreal forest fuels.

## AI/ML Fire Spread Approaches

**Current state (March 2026):** Research-grade, not operational. Multiple groups are training ML models on historical fire perimeter data (MTBS) combined with weather reanalysis (ERA5) and terrain/fuel data (LANDFIRE). Key challenges:

- **Training data scarcity:** MTBS provides final perimeters but not hourly progression. Daily VIIRS composites give some temporal resolution but at 375m. High-quality fire progression datasets (e.g., NIFC's daily fire perimeters from IR flights) exist for only ~100-200 large fires per year.
- **Promising approaches:** Convolutional neural networks (CNNs) predicting next-day fire perimeter from current perimeter + weather + terrain + fuel. Graph neural networks for fire spread on irregular meshes. Physics-informed neural networks encoding mass/energy conservation.
- **WIFIRE Firemap:** Real-time fire perimeter estimation using VIIRS, GOES, and camera data fused with ML. Short-term (1-6 hour) spread prediction under development.
- **Key advantage over Rothermel-based models:** ML models can learn from extreme fire behavior events without being limited by Rothermel's wind tunnel calibration. Early results show improved skill in high-wind and crown fire conditions.
- **Key limitation:** Generalization. ML models trained on California fires may not transfer to boreal or tropical fires without retraining.

As of: March 2026
