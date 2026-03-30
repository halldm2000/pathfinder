# Coastal Data: DEMs, Bathymetry, Flood Maps, and Datums

Deep-dive reference for coastal elevation data, bathymetry, FEMA flood mapping, and vertical datum issues critical to coastal flood modeling and assessment.

Last verified: March 2026.

## Topographic DEMs for Coastal Flood Modeling

### CoNED (Coastal National Elevation Database)
- **Producer:** USGS, in collaboration with NOAA.
- **Coverage:** U.S. coastal zone -- Gulf of Mexico, Atlantic, Pacific, Great Lakes, Alaska, Hawaii, territories.
- **Resolution:** 1/3 arc-second (~10 m) for standard product. Higher-resolution (1/9 arc-second, ~3 m) topobathymetric DEMs available for priority areas.
- **Key feature:** Integrates topographic and bathymetric data into a seamless surface. Uses lidar for topography, multibeam/single-beam sonar for offshore bathymetry, and interpolation for the nearshore gap.
- **Vertical datum:** NAVD88 (orthometric) for topography. Bathymetric component may be referenced to MLLW or local chart datum; converted to NAVD88 in the integrated product.
- **Use in modeling:** Standard input for ADCIRC, SCHISM, and FEMA flood studies along U.S. coastlines. Mesh generation tools (SMS, OceanMesh2D) interpolate CoNED to model nodes.
- **Access:** USGS National Map (apps.nationalmap.gov), NOAA Digital Coast (coast.noaa.gov/digitalcoast/).
- **Limitations:** Resolution of 10 m is insufficient for resolving individual structures, narrow levees, or small channels. Lidar-derived bare earth misses some above-ground features (seawalls, raised roads) that affect flooding. Nearshore zone (0-3 m depth) is the weakest area -- too shallow for most bathymetric surveys, too deep for airborne lidar.

### Lidar-Derived DEMs (USGS 3DEP)
- **Program:** USGS 3D Elevation Program (3DEP). Goal: complete lidar coverage of CONUS by ~2023 (largely achieved for populated coastal areas as of 2026). Quality Level 2 (QL2) standard: ~2 pts/m^2, ~0.1 m vertical accuracy on hard surfaces.
- **Resolution:** Typically 1 m grid from QL2 lidar point clouds. Some areas have QL1 (8+ pts/m^2) or QL0 (higher).
- **Strengths:** Resolves individual buildings, levees, berms, seawalls, road grades. Essential for neighborhood-scale inundation mapping and levee-overtopping analysis.
- **Limitations:** Bare earth extraction removes vegetation canopy but also removes structures that impede/redirect flow (fences, walls). Lidar does not penetrate water -- no bathymetric information below water surface (except bathymetric lidar at specific wavelengths).
- **Topobathymetric lidar:** NOAA and USACE have collected topobathymetric lidar (using green wavelength that penetrates clear water to ~1.5 Secchi depths) in priority areas. Available via NOAA Digital Coast. Coverage is patchy.
- **Access:** USGS 3DEP via National Map, NOAA Digital Coast, OpenTopography (opentopography.org).

### SRTM (Shuttle Radar Topography Mission)
- **Resolution:** 1 arc-second (~30 m) globally, 3 arc-second (~90 m) for some regions.
- **Vertical accuracy:** ~5-10 m (absolute), ~4-5 m (relative). Not bare earth -- radar returns from canopy/buildings.
- **Use in coastal flooding:** Only for reconnaissance-level analysis in data-poor regions. Insufficient accuracy for flood modeling (1 m vertical error can shift a flood boundary by hundreds of meters on flat terrain).
- **Copernicus DEM:** Improved global DEM from TanDEM-X (DLR/Airbus). 30 m resolution, ~1-3 m vertical accuracy. Better than SRTM but still inadequate for detailed coastal flood studies.

### FABDEM (Forest And Buildings removed Copernicus DEM)
- **What:** Copernicus DEM with ML-based removal of forest canopy and building heights. Closer to bare earth than raw Copernicus DEM.
- **Resolution:** 30 m. Vertical accuracy improved in vegetated/urban areas but still ~1-2 m.
- **Use:** Best available global bare-earth-like DEM for regions without lidar. Published in Environmental Research Letters (Hawker et al., 2022). Useful for global flood modeling but not regulatory-quality.

## Bathymetric Data

### GEBCO (General Bathymetric Chart of the Oceans)
- **Coverage:** Global ocean.
- **Resolution:** GEBCO_2023 grid at 15 arc-second (~450 m).
- **Source data:** Compilation of ship soundings, satellite altimetry-derived gravity, and interpolation. Only ~25% of the ocean floor has been directly surveyed (Seabed 2030 initiative aims to change this).
- **Use in surge modeling:** Adequate for deep-ocean boundary conditions in ADCIRC/SCHISM. Too coarse for nearshore surge modeling where bathymetric gradients drive surge amplification.
- **Access:** gebco.net (free download).

### NOAA Coastal Relief Model
- **Coverage:** U.S. coastal waters, extending from coastline to ~200 m isobath.
- **Resolution:** 3 arc-second (~90 m). Integrates NOS hydrographic surveys, multibeam data, and interpolation.
- **Use:** Better than GEBCO for U.S. nearshore applications. Standard bathymetric input for U.S. coastal model meshes.
- **Access:** NOAA NCEI (ngdc.noaa.gov/mgg/coastal/).

### NOAA NOS Hydrographic Surveys
- **What:** Individual survey datasets (multibeam, single-beam, lidar bathymetry) collected by NOAA survey ships and contractors.
- **Resolution:** Varies by survey -- multibeam can be <1 m resolution.
- **Use:** Highest quality bathymetric data for specific areas. Used for updating nautical charts and as input to Coastal Relief Model and CoNED.
- **Datum:** Soundings referenced to MLLW (chart datum). Must be converted to NAVD88 for integration with topographic DEMs.
- **Access:** NOAA NCEI Bathymetric Data Viewer.

### Nearshore Gap Problem
The transition zone from ~0 to ~3 m depth is the weakest area in coastal elevation data:
- Too shallow for most survey vessels (keel depth limitations)
- Too deep or turbid for standard airborne lidar
- Wave action degrades survey quality
- This is precisely the zone where surge amplification, wave breaking, and inundation initiation occur
- **Topobathymetric lidar** partially addresses this in clear-water environments but coverage is limited
- **Airborne bathymetric lidar (e.g., JALBTCX, CZMIL):** Deployed by USACE and NOAA in priority areas. Green laser (~532 nm) penetrates 1-2 Secchi depths of clear water.

## FEMA Flood Mapping

### Flood Insurance Rate Maps (FIRMs)
- **Legal authority:** National Flood Insurance Program (NFIP), established 1968. FEMA administers.
- **Purpose:** Identify Special Flood Hazard Areas (SFHAs) where flood insurance is required for federally backed mortgages.
- **Format:** Digital Flood Insurance Rate Maps (DFIRMs). Geospatial data available via FEMA Map Service Center (msc.fema.gov) and National Flood Hazard Layer (NFHL).

### Flood Zone Designations
| Zone | Meaning | Key Characteristics |
|---|---|---|
| VE | Coastal high hazard (velocity zone) | Subject to storm surge with wave action (wave heights >= 3 ft). Most restrictive building standards. |
| AE | 1% annual chance flood zone | Subject to surge/riverine flooding. BFE established. Flood insurance required. |
| AH | 1% annual chance, shallow flooding | Ponding areas, 1-3 ft depth. BFE established. |
| AO | 1% annual chance, sheet flow | Shallow flooding on slopes, 1-3 ft depth. |
| X (shaded) | 0.2% annual chance flood zone | 500-year flood zone. Insurance not required but recommended. |
| X (unshaded) | Minimal flood hazard | Outside 500-year flood zone. |

### Coastal Flood Study Methodology
1. **Storm sampling:** Select synthetic hurricanes (or historical events) spanning the probability space of tracks, intensities, and sizes affecting the study area.
2. **Surge modeling:** Run ADCIRC+SWAN for each storm-tide combination. Typically 150-600 storms x 3-5 tidal phases.
3. **Statistical analysis:** Apply JPM-OS to compute stillwater elevation exceedance probabilities at each mesh node.
4. **Wave analysis:** Compute wave setup (from SWAN output) and wave runup (from empirical formulas: TAW, FEMA WHAFIS, or Boussinesq models) at transects perpendicular to the shoreline.
5. **BFE determination:** 1% annual chance stillwater elevation + wave effects = BFE. In VE zones, BFE includes wave crest elevation.
6. **Map production:** Delineate VE, AE, AH, X zones based on BFE and wave height criteria.

### Known Limitations of FIRMs
- **Age:** Median effective date of FIRMs varies by region. Many maps are 10-20 years old. Coastal development, erosion, and sea level rise have made some maps inaccurate.
- **No sea level rise:** FIRMs reflect current sea level conditions at the time of the study. Future SLR is not incorporated. A home mapped in X zone today may be in AE by 2050.
- **No compound flooding:** FEMA coastal studies model surge + waves + tide but not concurrent rainfall. Excludes the Harvey-type scenario.
- **No climate change in storm statistics:** The storm sample assumes stationary climate. If TC intensity increases with warming, future flood probabilities are underestimated.
- **Resolution limitations:** FIRM zone boundaries are mapped at scales where sub-lot precision is not guaranteed. Individual property flood risk may differ from zone-level designation.
- **Risk Rating 2.0:** FEMA's updated pricing methodology (rolled out 2021-2023) uses property-specific flood risk variables (elevation, distance to coast, flood frequency, claim history) rather than binary zone membership. This partially addresses FIRM limitations for insurance pricing but does not update the maps themselves.

## Vertical Datums -- The Critical Detail

### Common Datums in Coastal Work

| Datum | Full Name | Definition | Typical Use |
|---|---|---|---|
| NAVD88 | North American Vertical Datum of 1988 | Orthometric heights relative to a fixed geoid model | USGS DEMs, engineering, most FEMA BFEs |
| MSL | Mean Sea Level | Average water level over a 19-year tidal epoch | Tidal datum, sea level trend reference |
| MHHW | Mean Higher High Water | Average of daily higher high tides over a tidal epoch | "Above high tide" flood projections |
| MLLW | Mean Lower Low Water | Average of daily lower low tides over a tidal epoch | NOAA nautical charts, bathymetric soundings |
| MLW | Mean Low Water | Average of all low tides | Less common, some older charts |
| MHW | Mean High Water | Average of all high tides | Some regulatory references |
| LMSL | Local Mean Sea Level | MSL at a specific tide gauge | Station-specific trend analysis |
| ITRF/WGS84 | Ellipsoidal height | Height above reference ellipsoid | GPS measurements, satellite altimetry |

### Datum Differences and Pitfalls
- The difference between NAVD88 and MSL varies by location: ~0.1 m in the Mid-Atlantic, up to ~0.5 m in parts of Alaska and the Gulf Coast.
- MHHW is typically 0.3-0.8 m above MSL, depending on tidal range.
- **Classic error:** Comparing a surge height reported "above MHHW" (common in NHC storm surge warnings) with a BFE in NAVD88 (FEMA standard) without converting. The difference can be 0.3-1.0 m.
- **VDATUM (NOAA):** Transformation tool for converting between 36+ vertical datums (tidal, orthometric, ellipsoidal) at U.S. coastal locations. Essential for merging topo (NAVD88) and bathy (MLLW) data. Online tool: vdatum.noaa.gov.
- **Tidal epoch dependence:** Tidal datums (MSL, MHHW, MLLW) are computed over a specific 19-year epoch (current: 1983-2001 NTDE, being updated to 2001-2019 epoch). Sea level rise means that the current MSL is higher than the epoch MSL at most stations.

### Best Practices
1. **Always state the datum** when reporting water levels, flood elevations, or surge heights.
2. **Use VDATUM** for conversions. Do not use a single constant offset across large areas.
3. **Watch for epoch mismatches.** A BFE computed using the 1983-2001 MSL epoch is already biased low relative to current sea level.
4. **When merging topo + bathy data:** Ensure both are on the same datum before interpolation. The CoNED product handles this; custom meshes may not.
5. **For NHC surge products:** Storm surge inundation maps use "above ground level" (AGL). Storm surge watches/warnings reference MHHW. P-Surge can output NAVD88 or MHHW. Confirm which reference is being used.

## Data Access Summary

| Dataset | Resolution | Coverage | Access URL |
|---|---|---|---|
| CoNED Topobathy DEM | 10 m (1/3 arc-sec) | U.S. coast | apps.nationalmap.gov |
| USGS 3DEP Lidar | 1 m | Most of CONUS coast | apps.nationalmap.gov |
| NOAA Digital Coast | Various | U.S. coast | coast.noaa.gov/digitalcoast/ |
| GEBCO | 450 m (15 arc-sec) | Global ocean | gebco.net |
| NOAA Coastal Relief | 90 m (3 arc-sec) | U.S. coast waters | ngdc.noaa.gov/mgg/coastal/ |
| FEMA NFHL | Map scale | U.S. (where mapped) | msc.fema.gov |
| Copernicus DEM | 30 m | Global | spacedata.copernicus.eu |
| FABDEM | 30 m | Global | data.bris.ac.uk/data/dataset/25wfy0f9ukoge2gs7a5mqpq2j7 |
| NOAA VDATUM | Point-based | U.S. coast | vdatum.noaa.gov |
| NOAA Tide Gauges | Point-based | U.S. coast | tidesandcurrents.noaa.gov |
| OpenTopography | Various | Global | opentopography.org |
