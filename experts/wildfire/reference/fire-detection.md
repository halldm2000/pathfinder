### Fire Detection Systems

**Overview:** Fire detection from space is the most mature component of the wildfire prediction chain. NASA's FIRMS has provided global near-real-time fire data since 2000 using MODIS, with VIIRS providing higher-resolution (375m) coverage since 2012. Geostationary satellites (GOES-16/18) add temporal continuity but at coarser resolution. Ground-based camera networks (ALERTWildfire) provide the fastest detection for fires within camera coverage.

## VIIRS Active Fire Detection

**Sensor:** Visible Infrared Imaging Radiometer Suite. Flies on Suomi-NPP (2011-present) and NOAA-20/21 (2017/2022-present).

**Active fire detection algorithm (VNP14IMG / VJ114IMG):**
- Uses I-band 4 (3.74 um, 375m resolution) as the primary fire-sensitive channel.
- Contextual algorithm: a potential fire pixel must be significantly hotter than its surrounding background pixels. Tests compare the brightness temperature of the candidate pixel against the mean and standard deviation of valid background pixels in a surrounding window.
- Absolute thresholds: brightness temperature > 360K (day) or > 320K (night) in I-band 4 triggers investigation regardless of background context.
- Confidence levels: low (potential false alarm), nominal (likely fire), high (very likely fire). Confidence is based on the magnitude of the brightness temperature anomaly relative to background.
- **Day vs. night:** Daytime detection is harder because solar-heated surfaces raise background temperatures, reducing the fire-background contrast. Nighttime detections are generally more reliable, especially for small/low-intensity fires.
- **Detection limits:** Minimum detectable fire size ~50 m2 for high-intensity fires (FRP > 1 MW) under ideal conditions (nadir view, nighttime, clear sky). At oblique viewing angles (edge of swath), the effective pixel size increases and detection sensitivity degrades.

**Fire Radiative Power (FRP):**
- Estimated from the excess radiance in the MIR channel above background. Relates to fire intensity and biomass combustion rate (~0.368 kg/MJ conversion factor, Wooster et al. 2005).
- FRP is a snapshot -- represents instantaneous fire power at the moment of overpass, not cumulative energy. Diurnal fire cycle means overpass timing matters enormously.
- Total Fire Radiative Energy (FRE) requires temporal integration, which only geostationary platforms can provide.

**FIRMS (Fire Information for Resource Management System):**
- Operated by NASA LANCE (Land, Atmosphere Near-real-time Capability for EOS).
- NRT data available ~3 hours after satellite overpass via web map, email alerts, and API.
- Standard science-quality product available within ~24 hours with improved geolocation and cloud masking.
- Provides: fire location (lat/lon), FRP (MW), confidence, scan/track pixel size, satellite, acquisition time.
- API and bulk download: firms.modaps.eosdis.nasa.gov

## MODIS Active Fire Detection

**Sensor:** Moderate Resolution Imaging Spectroradiometer on Terra (1999-present) and Aqua (2002-present).

**Active fire product (MOD14/MYD14, Collection 6.1):**
- 1 km resolution (vs. VIIRS 375m). Uses channels 21/22 (3.96 um) and 31 (11.03 um).
- Similar contextual algorithm to VIIRS but at coarser resolution. More false alarms from sub-pixel hot sources.
- **Long-term record value:** 2000-present continuous record enables fire trend analysis. VIIRS record starts 2012 -- too short for many climate analyses.
- Terra and Aqua have equatorial crossing times of ~10:30 AM/PM and ~1:30 PM/AM respectively, providing 4 observations per day at the equator (fewer at high latitudes).

## GOES Geostationary Fire Detection

**Platform:** GOES-16 (East, 75.2W) and GOES-18 (West, 137.2W). Advanced Baseline Imager (ABI).

**Fire/Hot Spot Characterization (FHS) algorithm:**
- Uses ABI channel 7 (3.9 um, 2 km resolution) as primary fire channel. Channel 14 (11.2 um) for background temperature estimation.
- Temporal sampling: full-disk every 10 minutes, CONUS every 5 minutes, mesoscale domain every 1 minute (two domains can be tasked).
- Detects: fire mask (fire/no-fire/cloud/no-data), fire area (sub-pixel estimation via Dozier method), fire temperature, FRP.
- **Sub-pixel fire characterization:** Uses bi-spectral method (Dozier 1981) to estimate fire temperature and fractional area within the 2 km pixel. A 100 m2 fire in a 4 km2 pixel is detectable but area/temperature estimates have large uncertainty.

**GOES advantages over polar orbiters:**
- Near-continuous monitoring: detect new fire starts within 5-15 minutes of ignition (if visible from space).
- Diurnal FRP cycle: track fire intensity through full 24-hour cycle, enabling FRE estimation.
- Fire growth rate: sequential images track perimeter expansion (though at 2 km resolution, only large fires show growth).

**GOES limitations:**
- 2 km resolution means fires <100 ha are often a single pixel or undetected.
- Higher false-positive rate: sun glint (especially near water bodies in late afternoon), hot desert surfaces, gas flares, volcanic hotspots, and even large dark-surfaced buildings.
- View angle effects: fires in mountainous terrain may be obscured by topographic shadowing.

## Ground-Based Camera Networks

**ALERTWildfire:**
- 1,050+ mountaintop cameras across 9 western US states (CA, OR, WA, NV, ID, CO, MT, AZ, UT as of 2025).
- PTZ (pan-tilt-zoom) cameras with 360-degree coverage. Most cameras have both visible and near-IR capability.
- AI smoke/fire detection algorithms (developed by UCSD/DL lab) scan imagery continuously. Alert dispatched to fire agencies when smoke or flame is detected.
- **Average detection time:** <10 minutes for visible smoke within camera line-of-sight.
- **Coverage limitation:** Cameras cover a radius of ~20-40 km in mountainous terrain, less in flat terrain with obstructions. Significant gaps remain in remote federal wilderness areas.
- Real-time public feeds: alertwildfire.org (also integrated into CAL FIRE and Nevada Division of Forestry dispatch).

**Other camera systems:**
- **HPWREN (High Performance Wireless Research and Education Network):** Southern California backbone, feeds into ALERTWildfire. Higher bandwidth links enable higher-resolution imagery.
- **Fire Lookout Network (USFS):** Legacy human-staffed lookout towers. ~450 still active across western US. Being supplemented/replaced by camera networks.

## RAWS (Remote Automated Weather Stations)

- 2,200+ stations across US, concentrated in fire-prone western lands.
- Hourly observations: temperature, relative humidity, wind speed/direction, precipitation, solar radiation.
- 10-hour fuel moisture sticks: physical wooden dowels weighed automatically to provide direct dead fuel moisture measurement.
- Data access: wrcc.dri.edu/raws/ (Western Regional Climate Center) and NIFC.
- Critical for: fire weather forecast verification, NFDRS calculations, fire behavior predictions (FARSITE/FlamMap weather input).

## Detection Latency Summary

| System | Spatial Resolution | Revisit / Temporal | NRT Latency | Best For |
|--------|-------------------|-------------------|-------------|----------|
| VIIRS (NPP/NOAA-20) | 375 m | 6-12 hours (polar orbit) | ~3 hours | Global fire mapping, moderate fires |
| MODIS (Terra/Aqua) | 1 km | 12 hours (polar orbit) | ~3 hours | Long-term trend analysis (2000+) |
| GOES-16/18 ABI | ~2 km | 1-10 minutes (geostationary) | <15 minutes | Fire starts, growth monitoring, diurnal cycle |
| ALERTWildfire cameras | Varies (~10m at 10km) | Continuous | <10 minutes | Fast initial detection, WUI fires |
| RAWS | Point observation | Hourly | Real-time | Fire weather, fuel moisture |

As of: March 2026
