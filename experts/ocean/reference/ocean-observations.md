# Ocean Observations: Argo, Altimetry, SST, and Currents

Deep reference for ocean observing systems and data products.

## Argo Network

### Design and Operations
- **Goal:** Sustained global sampling of temperature and salinity in the upper 2000m. Complement to satellite remote sensing (which sees only the surface).
- **Float lifecycle:** Deploy at surface -> descend to parking depth (1000m) -> drift 9 days -> descend to 2000m -> profile upward measuring T/S -> transmit data via Iridium -> repeat. Typical lifetime: 4-5 years (~200 profiles).
- **Coverage:** ~3,900 active floats (as of 2025). One float per 3x3 degree box target. Near-global 60N-60S. Under-sampled: marginal seas, ice-covered regions, boundary currents.
- **Data access:** argo.ucsd.edu (US), Coriolis (France), JAMSTEC (Japan). All data publicly available within 24h (real-time) or after delayed-mode QC (~12 months).

### Extensions
- **Deep Argo:** Profiles to 6000m. ~200 floats deployed as of 2025. Target: 1228 floats for global deep ocean coverage. Uses SBE61 CTD. Revealed significant deep ocean warming below 2000m.
- **BGC-Argo:** Biogeochemical sensors: dissolved O2, pH, nitrate, chlorophyll-a fluorescence, backscatter, downwelling irradiance. ~500 floats. Critical for carbon cycle monitoring. SOCCOM program (Southern Ocean) is the largest regional BGC-Argo effort.
- **Polar Argo:** Ice-capable floats that can profile under sea ice, store data, and transmit when ice-free. Operational in Southern Ocean and increasingly in Arctic.

### Key Contributions
- Ocean heat content: Argo showed the ocean absorbs >90% of excess heat from greenhouse warming. Upper 2000m warming rate: ~0.5-1.0 W/m2 absorbed (averaged over ocean surface).
- ENSO monitoring: Subsurface temperature profiles reveal warm water volume (recharge/discharge) state, a key ENSO precursor not visible from SST alone.
- Improved ocean reanalyses: GLORYS12, ORAS5, and SODA all assimilate Argo profiles, dramatically improving subsurface accuracy post-2005.

## Satellite Altimetry

### Heritage and Current Missions

| Mission | Period | Accuracy | Orbit | Notes |
|---------|--------|----------|-------|-------|
| TOPEX/Poseidon | 1992-2005 | ~3.3 cm | 66deg, 10-day | Reference mission, established record |
| Jason-1 | 2001-2013 | ~3.3 cm | 66deg, 10-day | Continuity with TOPEX |
| Jason-2 | 2008-2019 | ~3.4 cm | 66deg, 10-day | OSTM |
| Jason-3 | 2016-present | ~3.4 cm | 66deg, 10-day | Operational reference |
| Sentinel-6 MF | 2020-present | ~2.9 cm | 66deg, 10-day | Improved precision, SAR mode |
| Sentinel-3A/B | 2016/2018-present | ~3 cm | 98.7deg, 27-day | Polar orbiting, SAR mode |
| SWOT | 2022-present | <2 cm (target) | 77.6deg, 21-day | Wide-swath interferometry |

### SWOT (Surface Water and Ocean Topography)
- **Architecture:** Ka-band radar interferometer (KaRIn). Two 50km-wide swaths separated by 20km nadir gap. Total swath: ~120km.
- **Resolution:** ~2km posting for ocean topography (after filtering). First satellite to resolve submesoscale ocean dynamics (15-150km) globally.
- **Science data:** Fast-sampling phase (Apr-Jul 2023) provided 1-day repeat for calibration. Science orbit (21-day repeat) since Jul 2023.
- **Impact:** Revealing fine-scale ocean currents, fronts, and eddies invisible to nadir altimeters. Transforming understanding of oceanic kinetic energy at submesoscale.

### Key Altimetry Products
- **AVISO/CMEMS gridded maps:** Multi-mission merged SLA/ADT products (Copernicus Marine). Standard reference for sea level and geostrophic currents. 0.25 deg, daily.
- **Global mean sea level:** ~3.4 mm/yr (1993-present, altimetry era). Accelerating: ~4.6 mm/yr in the most recent decade. Uncertainty ~0.4 mm/yr.

## SST Products: Comparison

| Product | Resolution | Temporal | Period | Sources | Best For |
|---------|-----------|----------|--------|---------|----------|
| OISST v2.1 | 0.25 deg | Daily | 1981-present | AVHRR + in-situ | Operational monitoring, Nino indices |
| ERSSTv5 | 2 deg | Monthly | 1854-present | In-situ only | Long-term climate records, ONI |
| HadISST | 1 deg | Monthly | 1870-present | Satellite + in-situ | CMIP boundary conditions |
| OSTIA (UKMO) | 0.05 deg (~6km) | Daily | 2007-present | Multi-satellite + in-situ | High-res SST analysis, NWP |
| MUR (NASA JPL) | 0.01 deg (~1km) | Daily | 2002-present | Multi-satellite + in-situ | Fine-scale SST features |

### Critical Distinctions
- **OISST vs ERSSTv5 for ENSO:** ONI is computed from ERSSTv5 (in-situ only, avoids satellite inhomogeneity). OISST includes satellites and is higher resolution but has a shorter, satellite-dependent record. Use ERSSTv5 for official ENSO classification.
- **ERA5 SST is not independent:** ERA5 prescribes SST from HadISST (pre-2007) and OSTIA (2007+). Never cite ERA5 SST as an independent observation or compare it with the products it ingests.
- **Satellite SST = skin temperature (~10 um depth).** In-situ SST (buoys, ships) = bulk temperature (~1m depth). Skin is typically 0.1-0.3C cooler than bulk due to heat loss at the surface. Products apply corrections, but the distinction matters for diurnal cycle and air-sea flux calculations.

## OSCAR (Ocean Surface Current Analysis Real-time)

- **Provider:** NOAA AOML / ESR.
- **Method:** Diagnostic model combining satellite altimetry (geostrophic component), scatterometer winds (Ekman component), and SST gradients (thermal wind adjustment).
- **Resolution:** 1/3 deg, 5-day composites. Global 60N-60S.
- **Period:** 1993-present (continuous with altimetry era).
- **Access:** podaac.jpl.nasa.gov, coastwatch.pfeg.noaa.gov/erddap.
- **Strengths:** Near-global coverage, consistent processing, long record.
- **Limitations:** Diagnostic (not prognostic) -- cannot resolve ageostrophic currents at submesoscale. 5-day averaging smooths fast variability. No direct measurement below surface.

## TAO/TRITON Array (Tropical Pacific)
- **What it is:** Array of ~70 moored buoys across the tropical Pacific. Real-time surface and subsurface (up to 500m) temperature, salinity, winds, and currents.
- **Status as of 2025:** Array has degraded significantly since its peak (~90% operational in the 2000s). Current data return rate ~50-60%. NOAA PMEL working on refresh with next-generation moorings.
- **Relevance:** Historically critical for ENSO monitoring (real-time thermocline depth). Argo partially compensates for TAO degradation but does not provide real-time moored timeseries.

## Data Access Summary

| Product | Primary Access | Format |
|---------|---------------|--------|
| Argo profiles | argo.ucsd.edu, Coriolis | NetCDF |
| OISST v2.1 | NOAA NCEI, ERDDAP | NetCDF |
| ERSSTv5 | NOAA NCEI | NetCDF |
| OSCAR currents | PO.DAAC, ERDDAP | NetCDF |
| Altimetry (AVISO/CMEMS) | marine.copernicus.eu | NetCDF |
| SWOT | podaac.jpl.nasa.gov | NetCDF |
| GLORYS12 reanalysis | marine.copernicus.eu | NetCDF |
| NSIDC sea ice | nsidc.org | GeoTIFF, NetCDF |
