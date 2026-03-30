### Smoke and Air Quality

**Overview:** Wildfire smoke forecasting chains four distinct steps, each with its own uncertainties: (1) fire emissions estimation (how much smoke a fire produces), (2) plume rise (how high the smoke goes), (3) atmospheric transport and dispersion (where the smoke travels), and (4) chemical transformation and surface concentration (what people breathe). HRRR-Smoke provides operational near-real-time forecasts over CONUS; the BlueSky Framework provides a more complete emissions-to-dispersion chain. The dominant uncertainty is almost always in the source term (emissions), not the transport.

## HRRR-Smoke

**What it is:** Operational smoke forecast model run by NOAA on the High-Resolution Rapid Refresh (HRRR) 3 km grid. Produces hourly smoke concentration forecasts over CONUS with 18-hour forecast horizon.

**Architecture:**
- Base model: HRRR (3 km, hourly cycling, convection-allowing). HRRR-Smoke adds smoke as a passive tracer in the WRF-ARW framework.
- Fire detection input: satellite hotspots from VIIRS (NRT) and GOES FHS. Updated each HRRR cycle.
- Emissions estimation: fire radiative power (FRP) from satellite detections is converted to PM2.5 emission rate using an empirical coefficient (Ce ~ 0.0076 kg/MJ, based on Vermote et al.). This is the single largest uncertainty source.
- Plume rise: 1D plume rise model (Freitas et al. 2007). Computes injection height based on fire heat flux, ambient temperature profile, and wind. Smoke is distributed between the surface and the injection height.
- Transport: advected by HRRR 3D wind fields with turbulent diffusion. No chemical transformation -- smoke is treated as a passive tracer with a fixed specific extinction coefficient.

**Products:**
- Near-surface smoke concentration (ug/m3 in lowest model level, ~8 m AGL)
- Vertically integrated smoke (smoke column loading)
- Smoke at various pressure levels (for aviation)
- Available from: rapidrefresh.noaa.gov, NOMADS (NOAA Operational Model Archive)

**Known limitations:**
- **Passive tracer assumption:** No secondary organic aerosol (SOA) formation, no ozone chemistry, no PM2.5 speciation. Real smoke ages chemically, producing additional PM2.5 and ozone downwind. HRRR-Smoke underestimates PM2.5 at distances >500 km from the fire.
- **Emissions uncertainty:** FRP-based emissions can be wrong by 2-5x due to: cloud obscuration of fire (emission underestimate), old/smoldering fires with low FRP but high emissions, sub-canopy fires invisible to satellite.
- **Plume rise errors:** Injection height wrong by 1-3 km in extreme events. Overestimating injection height puts smoke aloft (underpredicting surface concentration); underestimating keeps smoke near surface (overpredicting).
- **No prescribed fire emissions:** HRRR-Smoke uses only satellite-detected fires. Prescribed burns that are too small or cool for satellite detection are missed.
- **Diurnal cycle:** Fire emissions have a strong diurnal cycle (peak late afternoon). HRRR-Smoke captures this through cycling, but the 18h forecast horizon means late-day initializations miss next-day morning smoke.

**Verification:**
- Evaluated against EPA AirNow PM2.5 monitoring network. Correlation with observed PM2.5 is moderate (r ~ 0.5-0.7 during smoke events) because HRRR-Smoke reports "smoke concentration" not PM2.5 directly.
- Better at predicting smoke presence/absence than absolute concentration. Useful for "will there be smoke?" rather than "how much PM2.5?"

## BlueSky Framework

**What it is:** USFS smoke modeling framework that chains multiple specialized models for the full emissions-to-concentration workflow. More physically complete than HRRR-Smoke but slower and used primarily for planned/prescribed burns and retrospective wildfire analysis.

**Chain:**
1. **Fire information:** Location, area, fuel type from fire reports, satellite, or user input.
2. **Fuel consumption (CONSUME 3.0):** Estimates mass of fuel consumed (tons/acre) by combustion phase (flaming, smoldering, residual). Inputs: fuel loading by size class, fuel moisture (duff, 1000-hr, live). Distinguishes above-ground and ground-fuel consumption.
3. **Emissions (FEPS -- Fire Emission Production Simulator):** Converts fuel consumption to emissions (PM2.5, PM10, CO, CO2, CH4, NOx, VOCs) using emission factors (g pollutant per kg fuel consumed). Emission factors vary by combustion phase and fuel type.
4. **Plume rise (Briggs):** Classic Briggs (1975) plume rise equations. Computes injection height from buoyancy flux.
5. **Dispersion (HYSPLIT / VSMOKE):** HYSPLIT (NOAA Air Resources Laboratory) for regional transport. VSMOKE for local screening-level smoke impact from prescribed burns.
6. **Visualization and delivery:** AirFire platform (airfire.org) provides web-based smoke forecast products.

**Advantage over HRRR-Smoke:** Speciated emissions (PM2.5, PM10, CO, ozone precursors), explicit fuel consumption model, can handle prescribed burns with user-specified fire characteristics.

**Limitation:** Not real-time. Processing chain takes 30+ minutes. Not coupled to a live NWP model like HRRR -- uses archived or forecast meteorology as input.

## CMAQ (Community Multiscale Air Quality)

- EPA's primary air quality model. Full chemistry: gas-phase, aerosol, and aqueous-phase chemistry. Predicts O3, PM2.5 (speciated: sulfate, nitrate, organic carbon, elemental carbon, etc.), other criteria pollutants.
- Fire emissions from NEI (National Emissions Inventory) fire component or from satellite-based products.
- Grid spacing: typically 12 km (national) or 4 km (regional). Not as fine as HRRR-Smoke (3 km) but includes chemistry.
- **For wildfire smoke:** Captures SOA formation and ozone production from fire emissions. Better for long-range transport where chemical aging matters.
- **Operational forecasts:** NOAA's National Air Quality Forecasting Capability runs CMAQ daily for next-day O3 and PM2.5 forecasts. Fire emissions are the largest source of forecast error during smoke events.

## AQI (Air Quality Index)

**EPA AQI scale (current as of 2024 revision):**

| AQI Range | Category | PM2.5 (24h avg, ug/m3) | Health Guidance |
|-----------|----------|------------------------|-----------------|
| 0-50 | Good | 0.0-9.0 | No limitations |
| 51-100 | Moderate | 9.1-35.4 | Unusually sensitive people should limit prolonged outdoor exertion |
| 101-150 | Unhealthy for Sensitive Groups | 35.5-55.4 | People with heart/lung disease, older adults, children should limit prolonged outdoor exertion |
| 151-200 | Unhealthy | 55.5-125.4 | Everyone should limit prolonged outdoor exertion |
| 201-300 | Very Unhealthy | 125.5-225.4 | Everyone should avoid prolonged outdoor exertion |
| 301-500 | Hazardous | 225.5-325.4 | Everyone should avoid all outdoor exertion |

**Note:** AQI breakpoints were revised by EPA in February 2024, lowering the annual PM2.5 standard from 12 to 9 ug/m3. The 24-hour breakpoints above reflect the 2024 revision.

**NowCast algorithm:**
- EPA's method for reporting "current" AQI from hourly PM2.5 measurements without waiting for a full 24-hour average.
- Uses a weighted average of the most recent 12 hours of PM2.5 data. Weights are determined by the variability: when concentrations are changing rapidly (as during a smoke event), recent hours get more weight.
- **Advantage:** Captures rapid changes in smoke levels. A 24-hour average during a smoke event that starts at noon would not show "Unhealthy" until hours after people are already exposed.
- **Limitation:** More volatile than 24-hour average. Can fluctuate significantly hour to hour during variable smoke events.

## Fire Emissions Estimation

The source term is the dominant uncertainty in smoke forecasting. Methods:

**Satellite-based (used by HRRR-Smoke):**
- FRP to emission rate: E = Ce * FRP, where Ce is an empirical coefficient (~0.0076 kg PM2.5 per MJ for North American wildfires).
- Global Fire Emissions Database (GFED): monthly global emissions from satellite fire products. Research-grade, not real-time.
- Global Fire Assimilation System (GFAS, Copernicus): daily global fire emissions from MODIS FRP. Used as input to CAMS global air quality forecasts.

**Bottom-up (used by BlueSky):**
- Fuel consumption approach: total_emissions = fuel_loading * fraction_consumed * emission_factor.
- Requires: accurate fuel loading maps (LANDFIRE for US), fuel moisture to estimate consumption fraction, fuel-type-specific emission factors.
- Emission factors (g PM2.5 per kg fuel): flaming: ~10-15 g/kg, smoldering: ~15-30 g/kg. Smoldering produces more PM2.5 per unit fuel.

**Key uncertainty:**
- Both approaches have errors of 2-5x for individual fires. Satellite FRP misses smoldering and sub-canopy fires; bottom-up relies on fuel maps that may not reflect recent disturbance.
- Ensemble emissions approaches (running dispersion with multiple emission scenarios) are emerging but not yet operational.

## Prescribed Fire Smoke Management

- **Smoke management plans (SMPs):** Required by most state/federal agencies before burning. Include: acceptable burn conditions (wind, mixing height, transport wind), burn duration, expected emissions, population exposure assessment.
- **Screening models:** VSMOKE and SASEM provide simple downwind PM2.5 estimates for burn planning. Minutes to run, approximate but useful for go/no-go decisions.
- **Key regulatory threshold:** 24-hour PM2.5 must remain below 35 ug/m3 (NAAQS) at population centers. Prescribed burn managers plan ignition patterns, timing, and acreage to stay below this.

As of: March 2026
