# Wildfire Expert Orientation

Reference material for the wildfire expert. Facts here correct what the model gets wrong, add what it doesn't know, and anchor fast-moving details with dates. Omits facts the model reliably knows (basic combustion chemistry, how wind works, etc.).

Last verified: March 2026. Claude's training data extends through early 2025.

## Field Map

Wildfire prediction sits at the intersection of atmospheric science, ecology, remote sensing, and increasingly AI/ML. The field has a distinctive split: fire detection from space is mature and operational (FIRMS provides global near-real-time hotspot data since 2000), but fire spread prediction remains stubbornly difficult. The dominant operational spread models (FARSITE, FlamMap) still rely on Rothermel's 1972 semi-empirical equations, which were fitted to dead-fuel wind tunnel experiments and systematically fail in crown fire, extreme wind events, and grasslands. Physics-based coupled fire-atmosphere models (WRF-SFIRE, FIRETEC) are more faithful but too expensive for real-time operations. AI/ML is attacking the problem from both ends: ML fire detection from satellite imagery (faster, more accurate hotspot detection) and ML fire spread prediction (data-driven alternatives to Rothermel). Smoke forecasting has improved significantly with HRRR-Smoke becoming operational at NOAA, but fire emissions estimation -- the source term -- remains the largest uncertainty in smoke prediction. Fire seasons are lengthening globally due to warming and drying trends; the fire-climate feedback loop (fires release carbon, warming increases fire risk) is an active area of Earth system research.

## Fire Detection Systems

### FIRMS / VIIRS
- **FIRMS (Fire Information for Resource Management System):** NASA system providing near-real-time global fire hotspot data. Primary data source for global fire monitoring since 2000.
- **VIIRS (Visible Infrared Imaging Radiometer Suite):** Primary sensor on Suomi-NPP (launched 2011) and NOAA-20 (2017). Active fire detection at 375m resolution (I-band). Uses contextual algorithm comparing potential fire pixel brightness temperature to surrounding background. Detection confidence reported as low/nominal/high.
- **MODIS (Aqua/Terra):** Legacy sensors, 1km fire detection. Still operational but being superseded by VIIRS for active fire mapping. MODIS Collection 6.1 active fire product remains widely used for long-term fire trend analysis (2000-present).
- **Latency:** VIIRS NRT (near-real-time) data available ~3 hours after satellite overpass. Standard product within 24 hours. Polar orbit means 6-12 hour revisit gaps at mid-latitudes.

### GOES Geostationary Fire Detection
- **GOES-16/18 ABI (Advanced Baseline Imager):** Fire detection at ~2 km resolution with 5-minute full-disk and 1-minute mesoscale domain scans. Near-continuous monitoring of Western Hemisphere.
- **Fire/Hot Spot Characterization (FHS):** Operational product estimating fire radiative power (FRP), fire area, and fire temperature from ABI channels 7 (3.9 um) and 14 (11.2 um).
- **Advantage over VIIRS:** Temporal continuity. Can track fire growth, detect new starts within minutes, and estimate diurnal fire cycle. Critical for fire management decision-making.
- **Limitation:** 2 km pixels mean many fires are sub-pixel. Higher false-positive rate than VIIRS (sun glint, hot surfaces, industrial sources). Not reliable for fire perimeter mapping.

### Ground-Based and Camera Networks
- **ALERTWildfire:** Network of 1,050+ mountaintop cameras across western US (CA, OR, WA, NV, ID, CO, MT). PTZ cameras with AI-based smoke detection. Average detection time <10 minutes for visible smoke. Jointly operated by University of Nevada, Reno; UC San Diego; University of Oregon.
- **HPWREN:** High Performance Wireless Research and Education Network. Camera network backbone in Southern California. Feeds into ALERTWildfire.
- **RAWS (Remote Automated Weather Stations):** 2,200+ stations across US providing hourly fire weather observations (temperature, RH, wind, fuel moisture sticks). Primary ground truth for fire weather forecasts and NFDRS calculations.

See `reference/fire-detection.md` for sensor details, detection algorithms, and data access.

## Fire Spread Models

### Rothermel Equations (1972)
- Semi-empirical model of fire spread rate in surface fuels. Inputs: fuel particle properties (surface-area-to-volume ratio, packing ratio, moisture, mineral content), wind speed, slope.
- Fitted to wind tunnel experiments with dead fuels (pine needles, excelsior). Spread rate is proportional to (reaction intensity x propagating flux ratio) / (heat sink).
- **Critical limitation:** Does not model crown fire, spotting, or fire-atmosphere feedback. Underpredicts spread in high-wind grassland fires by 2-5x. Systematically fails in plume-dominated fires where fire-generated winds dominate ambient wind.
- Basis for all US operational fire behavior models (BehavePlus, FARSITE, FlamMap, FlamMap/FSPro).

### FARSITE (Fire Area Simulator)
- 2D fire growth simulator using Rothermel for surface fire, Van Wagner for crown fire transition, and Albini for spotting. Propagates fire perimeter using Huygens wavelet principle. Requires: landscape file (fuel model, canopy cover, canopy height, crown base height, crown bulk density, elevation, slope, aspect), weather stream, wind files.
- **Operational use:** Incident management teams use FARSITE for fire progression forecasting (12-72 hour). Requires trained analyst. Not automated.
- **Known biases:** Inherits Rothermel limitations. Tends to underpredict in extreme conditions, overpredict in light wind/high moisture. No fire-atmosphere coupling.

### FlamMap
- Companion to FARSITE. Computes point-based fire behavior characteristics (flame length, rate of spread, crown fire activity) across a landscape for a single set of weather conditions. Used for fuel treatment analysis, risk assessment, and pre-fire planning.
- **FSPro (Fire Spread Probability):** Monte Carlo extension of FlamMap. Runs thousands of simulations with varying ignition points and weather to produce probabilistic fire spread maps. Used for large fire decision support.

### WRF-SFIRE (WRF-Fire)
- Coupled fire-atmosphere model. Embeds a surface fire spread model within the WRF mesoscale weather model. Fire generates heat and moisture fluxes that modify local winds, which in turn affect fire spread -- the critical feedback loop missing from FARSITE.
- Resolution: WRF atmosphere at ~100-500m, fire model at ~10-50m (subgrid refinement).
- **Advantage:** Captures fire-atmosphere coupling including fire-generated winds, plume dynamics, pyroconvection. Essential for understanding extreme fire behavior.
- **Limitation:** Computationally expensive. Not operational for real-time fire forecasting. Research tool at universities (University of Colorado Denver, others).

### Phoenix RapidFire (Australia)
- Australian operational fire spread model developed by University of Melbourne. Used by fire agencies across Australia. Simulates grassland and forest fire spread using McArthur and CSIRO models (different empirical basis than Rothermel). Includes ember transport and spotting.
- **Key difference from US models:** Uses Australian fuel classification system, designed for eucalyptus-dominated ecosystems, accounts for bark spotting distances (>20 km in extreme cases).

See `reference/spread-models.md` for model equations, input requirements, and verification.

## Fire Weather

### Canadian Forest Fire Weather Index (FWI) System
- Internationally adopted fire weather index system. Six components calculated from noon weather observations (temperature, RH, wind, 24h precipitation):
  - **FFMC (Fine Fuel Moisture Code):** Moisture content of surface litter (1-2 cm depth). Proxy for ignition potential. Scale 0-101, fire spread threshold ~85.
  - **DMC (Duff Moisture Code):** Moisture in decomposed organic layer (5-10 cm). Affects fire intensity and difficulty of control. Scale 0-infinity, drought indicator.
  - **DC (Drought Code):** Deep soil moisture (10-20 cm). Slow-responding drought indicator. Affects mop-up difficulty and holdover fires.
  - **ISI (Initial Spread Index):** Combines FFMC and wind speed. Proxy for expected rate of spread.
  - **BUI (Buildup Index):** Combines DMC and DC. Proxy for total fuel available for combustion.
  - **FWI (Fire Weather Index):** Combines ISI and BUI. Overall fire intensity metric.
- Used globally: Canada, EU (EFFIS), Australia, and increasingly tropical nations. The ERA5-based FWI reanalysis (Copernicus) provides global historical FWI from 1940-present.

### US National Fire Danger Rating System (NFDRS)
- US-specific system used by federal and state fire agencies. Components: Spread Component (SC), Energy Release Component (ERC), Burning Index (BI), Ignition Component (IC).
- Relies on RAWS station data. More complex fuel model inputs than FWI (20 fuel models, live/dead fuel moisture).
- **ERC (Energy Release Component):** Most-used NFDRS component for fire management decisions. Represents available energy per unit area at the fire front. Percentile rankings (e.g., "97th percentile ERC") drive staffing levels and pre-positioning.

### Red Flag Warnings
- Issued by NWS when a combination of low humidity, strong winds, dry fuels, and warm temperatures creates critical fire weather. Criteria vary by NWS office and region. Typical triggers: RH <15%, sustained wind >25 mph or gusts >35 mph, with dry fuels.
- **Haines Index (Lower Atmosphere Stability/Dryness Index):** Scale 2-6, measures stability and moisture in the lower atmosphere. Haines 5-6 indicates high potential for large fire growth from pyroconvection. Used operationally but known to be overly simplistic -- does not account for wind or fuel state.

See `reference/fire-weather.md` for FWI calculations, NFDRS details, and Red Flag criteria by region.

## Fuel Moisture

Dead fuel moisture is the single most important variable controlling fire behavior. Measured as percentage of dry weight.

- **Timelag classes (dead fuel):** 1-hour (<6mm diameter, responds in ~1 hour), 10-hour (6-25mm, responds in ~10 hours), 100-hour (25-75mm, responds in ~100 hours), 1000-hour (>75mm, responds in ~1000 hours). The 1h and 10h classes drive ignition and initial spread; 100h and 1000h drive sustained burning and large fire potential.
- **Live fuel moisture content (LFMC):** Water content of living vegetation. Ranges from ~300% in spring new growth to <50% in late-summer drought stress. LFMC below ~80% enables crown fire initiation in conifer forests. Measured by field sampling; satellite-derived LFMC products (using MODIS/VIIRS NDVI, Landsat) are improving but not yet reliable for fire management decisions.
- **10-hour fuel moisture sticks:** Physical wooden dowels deployed at RAWS stations. Weighed automatically to provide direct fuel moisture measurement. The ground truth for dead fuel moisture.

## Smoke and Air Quality

### HRRR-Smoke
- NOAA operational smoke forecasting model. Runs hourly on the 3-km HRRR grid over CONUS. Ingests satellite-detected fire hotspots (VIIRS, GOES) as emission sources. Simulates smoke as a passive tracer with simplified plume rise.
- **Operational since:** 2020 (experimental), fully operational 2022.
- **Products:** Near-surface smoke concentration (ug/m3), vertically integrated smoke, smoke at flight levels. 18-hour forecast cycle.
- **Limitation:** Treats smoke as passive tracer (no chemical aging). Fire emissions estimated from satellite FRP, which has significant uncertainty. Plume rise parameterization can inject smoke at wrong altitude, causing surface concentration errors. Does not produce PM2.5 directly -- concentration is "smoke tracer" mass, not calibrated to PM2.5.

### BlueSky Framework
- USFS smoke modeling framework. Chains: fire information (location, area, fuel) -> fuel consumption (CONSUME) -> emissions (FEPS) -> plume rise (Briggs) -> dispersion (HYSPLIT or other). More physically complete emissions chain than HRRR-Smoke.
- Used for prescribed fire smoke management and wildfire smoke forecasts. Operational via AirFire platform (USFS Pacific Wildland Fire Sciences Lab).

### AQI and PM2.5
- **AQI (Air Quality Index):** EPA scale 0-500. PM2.5 breakpoints: 0-12 ug/m3 (Good), 12.1-35.4 (Moderate), 35.5-55.4 (USG), 55.5-150.4 (Unhealthy), 150.5-250.4 (Very Unhealthy), 250.5+ (Hazardous). Based on 24-hour average.
- **NowCast:** EPA algorithm for reporting current AQI using weighted hourly PM2.5 measurements. More responsive than 24-hour average during rapidly changing smoke events.
- During major wildfire events, PM2.5 can exceed 500 ug/m3 (beyond AQI scale). The 2020 West Coast smoke event produced PM2.5 >600 ug/m3 in parts of Oregon and Washington.

See `reference/smoke-air-quality.md` for model details, emissions estimation, and AQI interpretation.

## AI/ML in Wildfire

### Satellite-Based Fire Detection
- ML classifiers (CNNs, U-Nets) trained on VIIRS/MODIS imagery improve detection accuracy over traditional contextual algorithms: fewer false positives from sun glint and industrial sources, better small-fire sensitivity. Active research at multiple groups (WIFIRE Lab at UC San Diego, NASA FIRMS team, European EFFIS).
- **WIFIRE (Wireless and Information for Fire Events):** NSF-funded project at UC San Diego. Real-time fire modeling integrating satellite, camera, weather, and terrain data. Includes ML fire perimeter estimation and short-term spread prediction.

### ML Fire Spread Prediction
- Data-driven alternatives to Rothermel: random forests, gradient boosting, and deep learning trained on historical fire perimeters (MTBS) and weather reanalysis (ERA5). Some models show improved skill over FARSITE, particularly in extreme conditions where Rothermel fails.
- Physics-informed neural networks (PINNs) for fire spread: encode conservation equations as loss constraints while learning from data. Active research area, not yet operational.
- **Key challenge:** Training data. Large fires with well-documented progression are rare. MTBS provides final fire perimeters but not hourly spread evolution. Satellite-derived fire progression (daily VIIRS active fire composites) provides some temporal resolution but at coarse scale.

### AI Smoke Forecasting
- ML post-processing of HRRR-Smoke and CMAQ to improve surface PM2.5 skill. Bias correction and downscaling approaches showing promise.
- Emulator models trained on BlueSky/HYSPLIT output to provide fast smoke dispersion forecasts without running the full physics chain.

## Historical Fire Data and Trends

- **MTBS (Monitoring Trends in Burn Severity):** Joint USGS/USFS program mapping fire perimeters and burn severity for all fires >1,000 acres (West) or >500 acres (East) since 1984. Uses Landsat imagery. Primary dataset for historical fire analysis in the US.
- **GeoMAC (now NIFC Open Data):** Real-time fire perimeters during active incidents. Transitioned to NIFC ArcGIS platform.
- **NIFC Statistics:** National Interagency Fire Center annual wildfire statistics. 2015-2024 average: ~7.5 million acres burned annually in the US, up from ~3.5 million in 1990s.
- **Fire season lengthening:** Western US fire season has extended by 2-3 months since 1970s (Westerling et al. 2006, updated by multiple studies). Driven by earlier snowmelt, increased VPD (vapor pressure deficit), and warming temperatures. Not a simple linear trend -- extreme fire years (2020, 2021) are becoming more frequent.
- **Global fire-climate feedback:** Fires release ~2 Gt CO2/year globally (comparable to deforestation). Boreal fires are increasing and releasing soil carbon. Fire-climate feedback is a growing term in Earth system models but poorly constrained.

## Key Metrics

| Metric | What it measures | Typical values |
|--------|-----------------|----------------|
| Rate of spread (chains/hr or m/min) | Fire front advance rate | Grass: 50-200 ch/hr; Timber: 5-30 ch/hr |
| Flame length (ft or m) | Vertical extent of flames | Surface: 1-4 ft; Crown: 30-100+ ft |
| Fire radiative power (MW) | Total radiative energy output | Single pixel VIIRS: 1-1000 MW |
| PM2.5 (ug/m3) | Fine particulate concentration | Background: 5-10; Smoke: 50-500+ |
| FWI (dimensionless) | Fire weather severity | Low: <5; Moderate: 5-12; High: 13-24; Very High: 25-35; Extreme: >35 |
| ERC (BTU/ft2) | Available energy at fire front | Low: <20; High: 60-80; Extreme: >80 |
| LFMC (% dry weight) | Live vegetation water content | Green: >120%; Stressed: 80-120%; Critical: <80% |
| Burn severity (dNBR) | Post-fire ecological impact | Low: <270; Moderate: 270-659; High: >660 |

As of: March 2026.
