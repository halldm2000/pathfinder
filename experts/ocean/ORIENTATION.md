# Ocean & ENSO Expert Orientation

Reference material for the ocean expert. Facts here correct what the model gets wrong, add what it doesn't know, and anchor fast-moving details with dates. Omits facts the model reliably knows (basic thermohaline circulation, Coriolis, geostrophy, etc.).

Last verified: March 2026. Claude's training data extends through early 2025.

## Field Map

Physical oceanography underpins subseasonal-to-seasonal (S2S) prediction and climate variability. ENSO remains the most predictable mode of interannual climate variability, with operational forecast models providing useful skill out to ~9 months -- but the spring predictability barrier (Feb-May initialization) limits practical lead times. The AMOC, long a theoretical concern for abrupt climate change, gained major observational infrastructure in the 2000s-2020s (RAPID, OSNAP, SAMOC), and recent studies suggest weakening trends but no imminent collapse signal as of March 2026. Arctic sea ice continues its long-term decline (13%/decade for September extent since 1979), while Antarctic sea ice surprised the community with record lows in 2023 and 2024 after decades of slight expansion. Ocean observation has been transformed by the Argo network (3,900+ active floats as of 2025), satellite altimetry (Jason-3, Sentinel-6 Michael Freilich), and advanced SST products. AI is entering ocean modeling: NVIDIA's DLESyM couples atmosphere-ocean for 1000+ year stable simulations, Allen AI's SamudrACE is the first coupled ocean-atmosphere AI climate emulator (Sep 2025), and Mercator Ocean is exploring neural network parameterizations. The field's central tension: ocean processes span days to millennia, demanding multi-scale approaches that neither observations alone nor models alone can fully resolve.

## ENSO (El Nino-Southern Oscillation)

The dominant mode of interannual climate variability. Coupled ocean-atmosphere interaction in the tropical Pacific.

### Nino Regions and Indices
- **Nino 3.4** (5N-5S, 170W-120W): The standard operational index. El Nino declared when 3-month running mean SST anomaly >= +0.5C for 5 consecutive overlapping seasons (NOAA CPC definition). La Nina: <= -0.5C.
- **Nino 3** (5N-5S, 150W-90W): More eastern Pacific, captures canonical Eastern Pacific (EP) El Nino.
- **Nino 4** (5N-5S, 160E-150W): Central Pacific, captures Central Pacific (CP, "Modoki") El Nino.
- **Nino 1+2** (0-10S, 90W-80W): Far eastern Pacific, coastal South America. Most volatile, earliest signal.
- **SOI (Southern Oscillation Index):** Standardized SLP difference Tahiti minus Darwin. Negative SOI = El Nino. Independent atmospheric verification of SST-based indices.
- **ONI (Oceanic Nino Index):** 3-month running mean of ERSSTv5 Nino 3.4 anomalies. NOAA CPC's official tracking index. Uses centered 30-year base period (currently 1991-2020).

### ENSO Flavors
- **Eastern Pacific (EP) El Nino:** Warming peaks in Nino 3/Nino 1+2. Canonical type. Strong thermocline feedback. Strongest teleconnections to North America.
- **Central Pacific (CP) El Nino / Modoki:** Warming peaks in Nino 4. Different teleconnection pattern (less reliable North American precipitation signal). Has become more frequent relative to EP in recent decades.
- **Distinction matters for:** Teleconnection patterns, marine ecosystem impacts, forecast model skill (models handle EP better than CP).

### Predictability and Forecasting
- **Spring predictability barrier:** Forecast skill drops sharply for predictions initialized in Feb-May and verified across boreal spring. Physical cause: tropical Pacific SST variance is at its annual minimum in spring, so signal-to-noise ratio is lowest.
- **Useful skill:** ~9 months lead for ENSO phase (warm/cold/neutral). Amplitude skill is lower. Models initialized in summer/fall have higher skill than those initialized in spring.
- **IRI/CPC ENSO forecast plume:** Ensemble of ~20 dynamical and statistical models. Publicly available, updated monthly. The most-watched operational ENSO forecast product.
- **Key dynamical models for ENSO:** CFSv2 (NOAA), SEAS5 (ECMWF), CanCM4 (Canada), ACCESS-S (Australia). All show similar spring barrier issues.

### Teleconnections
- **North America (winter):** El Nino: wet/warm southern US, dry Pacific NW, stronger subtropical jet. La Nina: dry southern US, wet Pacific NW, active tornado season. Teleconnection mediated by PNA pattern and subtropical jet modulation.
- **Global:** El Nino: drought in Australia/Indonesia/India (weakened Walker circulation), wet eastern Africa, altered South Asian monsoon. La Nina: opposite tendencies.
- **MJO interaction:** ENSO modulates MJO amplitude and propagation. Strong El Nino suppresses MJO activity over the Maritime Continent; La Nina enhances it. MJO in turn can trigger or terminate ENSO events via westerly wind bursts.

### Historical Reference Events
- **1997-98 El Nino:** Very strong EP type. Nino 3.4 peaked at +2.3C. Global impacts well-documented. The "climate event of the 20th century."
- **2015-16 El Nino:** Very strong, mixed EP/CP characteristics. Nino 3.4 peaked at +2.6C (strongest on record by ONI). Significant global temperature contribution.
- **2023-24 El Nino:** Moderate-to-strong. Nino 3.4 peaked ~+2.0C (Nov 2023). Transitioned to La Nina by late 2024.
- **2010-12 La Nina:** Prolonged "double-dip" event over three winters. Major drought in US Southern Plains, severe flooding in Australia and Pakistan.

## Ocean Circulation

### AMOC (Atlantic Meridional Overturning Circulation)
- **What it is:** Northward transport of warm surface water in the Atlantic, deep water formation in the Nordic/Labrador Seas, return flow at depth. ~17 Sv at 26.5N (RAPID array mean, 2004-present).
- **RAPID array:** Continuous monitoring at 26.5N since 2004. Showed ~2.6 Sv decline over 2004-2012, then partial recovery. Large interannual variability (~4 Sv) makes trend detection difficult.
- **OSNAP (Overturning in the Subpolar North Atlantic Program):** Operational since 2014. Measures overturning at ~57N. Shows most overturning variability driven by eastern subpolar gyre, not Labrador Sea deep convection (surprising result).
- **Collapse risk:** IPCC AR6: "medium confidence" that AMOC will weaken over 21st century, "low confidence" in abrupt collapse before 2100. Post-AR6 studies (Ditlevsen & Ditlevsen 2023, Nature Communications) suggested possible tipping point as early as 2025-2095, but this remains debated. As of March 2026, no observational evidence of imminent collapse.
- **Common misconception:** AMOC collapse would not cause a new ice age in Europe. Studies suggest 5-10C cooling over northern Europe over decades, not a glaciation.

### Major Gyre Systems
- Five subtropical gyres (North/South Atlantic, North/South Pacific, Indian). Western boundary currents (Gulf Stream, Kuroshio, Agulhas, Brazil, East Australian) carry warm water poleward. Eastern boundary currents (California, Canary, Benguela, Peru/Humboldt) carry cool water equatorward with associated upwelling.
- **Western boundary current intensification:** Observed acceleration of Gulf Stream, Kuroshio, and other western boundary currents linked to wind stress changes. Active research area as of 2025.

### Upwelling Systems
- **Major coastal upwelling zones:** California Current, Peru/Humboldt, Benguela, Canary, Somali. Biologically critical -- support ~20% of global fish catch from <1% of ocean area.
- **ENSO impact:** El Nino suppresses upwelling along South American coast (deepened thermocline), devastating Peru/Chile fisheries. This was the original "El Nino" phenomenon.

## Sea Ice

### Arctic
- **September minimum trend:** -13% per decade (relative to 1981-2010 mean) since 1979. Record low: 3.39 million km2, September 2012. 2023 and 2024 September minima were below climatology but not record-setting.
- **Volume vs extent:** PIOMAS estimates show Arctic sea ice volume has declined ~3x faster than extent (in percentage terms). Most remaining ice is thin first-year ice. Multi-year ice (>4 years) has declined by ~95% since the 1980s.
- **Ice-free Arctic projections:** IPCC AR6: ice-free September (<1 million km2) likely before 2050 under all scenarios. Some studies suggest by 2030s under high-emission pathways.
- **Arctic Oscillation (AO):** Annular mode of atmospheric variability. Positive AO: strong polar vortex, sea ice retained in Arctic basin. Negative AO: weaker vortex, ice export through Fram Strait increases. AO is not a trend driver but modulates interannual variability.

### Antarctic
- **Surprise of the 2020s:** After decades of slight positive trend (1979-2014), Antarctic sea ice extent collapsed to unprecedented lows. February 2023: record minimum (1.79 million km2), 2024 near-record again. The shift was abrupt and poorly predicted by any model.
- **Mechanism debate:** Leading hypotheses include Southern Ocean warming from below, ice-albedo feedback amplification, and changes in circumpolar winds. No consensus as of March 2026.
- **NSIDC (National Snow and Ice Data Center):** Primary US source for sea ice extent, concentration, and trends. Near-real-time data from passive microwave satellites (SSMIS, AMSR2). Sea Ice Index product widely used for monitoring.

## Key Datasets and Observation Systems

### Argo
- **What it is:** Global array of ~3,900 autonomous profiling floats. Each float descends to 2000m, drifts, profiles temperature and salinity while ascending, transmits via satellite, repeats every ~10 days.
- **Coverage:** Near-global below 60N/60S (limited under ice). ~400 profiles/day as of 2025.
- **Extensions:** Deep Argo (6000m profiles, ~200 floats deployed), BGC-Argo (biogeochemical sensors: O2, pH, nitrate, chlorophyll, backscatter, irradiance, ~500 floats).
- **Impact:** Transformed ocean heat content estimates. Pre-Argo (before 2005), subsurface ocean was severely under-sampled. Argo revealed that >90% of excess heat from greenhouse warming goes into the ocean.

### SST Products
- **OISST v2.1 (NOAA):** 0.25deg, daily, 1981-present. Blends AVHRR satellite + ships + buoys + Argo near-surface. Standard for Nino index calculations and climate monitoring. Near-real-time.
- **ERSSTv5 (NOAA):** 2deg, monthly, 1854-present. In-situ only (no satellite). Used for long-term climate records (ONI). Lower resolution but avoids satellite-era inhomogeneities.
- **HadISST (Met Office):** 1deg, monthly, 1870-present. Blended satellite + in-situ. Used in CMIP boundary conditions and many reanalyses.
- **ERA5 SST:** Not an independent SST product -- ERA5 prescribes SST from HadISST (pre-2007) and OSTIA (2007-present). Do not cite ERA5 SST as an independent observation.

### Satellite Altimetry
- **Missions:** TOPEX/Poseidon (1992-2005), Jason-1/2/3 (2001-present), Sentinel-6 Michael Freilich (2020-present), Sentinel-3A/B, SWOT (2022-present).
- **SWOT (Surface Water and Ocean Topography):** Launched Dec 2022. Ka-band interferometric altimetry. First mission to measure mesoscale and submesoscale ocean features (15-150km) globally. 21-day repeat cycle. Science data available since mid-2023.
- **Key products:** Sea level anomaly (SLA), absolute dynamic topography (ADT), geostrophic surface currents, global mean sea level rise (~3.4 mm/yr since 1993, accelerating to ~4.6 mm/yr in recent decade).

### OSCAR (Ocean Surface Current Analysis Real-time)
- NOAA satellite-derived surface currents. 1/3 deg, 5-day. Derived from satellite altimetry, scatterometer winds, and SST gradients. Global coverage 60N-60S. Available from 1993. Primary product for large-scale surface circulation monitoring.

### Ocean Reanalyses
- **GLORYS12 (Mercator Ocean):** 1/12 deg global, 1993-present. NEMO ocean model + 3D-Var data assimilation (Argo, altimetry, SST, sea ice). Widely used for ocean state estimation and ML training data. Available via Copernicus Marine Service.
- **ORAS5 (ECMWF):** 0.25 deg, 1958-present. Used to initialize SEAS5 seasonal forecasts. 5-member ensemble.
- **SODA (Simple Ocean Data Assimilation):** Multiple versions, widely used in research. ~0.25-0.5 deg.

## Ocean in NWP and Climate Models

### Ocean Components
- **MOM6 (GFDL):** Modular Ocean Model, version 6. Used in GFDL ESMs and UFS (Unified Forecast System). ALE vertical coordinate. Actively developed.
- **NEMO (Nucleus for European Modelling of the Ocean):** European community ocean model. Used by ECMWF (SEAS5/ORAS5), Met Office (GC5), Mercator Ocean. Versions 3.6 and 4.x widely deployed.
- **HYCOM (HYbrid Coordinate Ocean Model):** US Navy operational ocean model. Hybrid isopycnal/sigma/z-level coordinates. GOFS 3.1 at 1/12 deg global.
- **POP (Parallel Ocean Program):** NCAR. Used in CESM1/2. Being replaced by MOM6 in CESM3.

### Coupling in NWP
- Operational NWP centers are moving to ocean-coupled forecasting for medium-range and beyond. ECMWF has run coupled IFS since 2018 (NEMO at 0.25 deg). NOAA's UFS couples GFS with MOM6. Coupling matters most for >5-day forecasts and tropical regions where SST feedbacks are significant.

## AI Ocean Models

### DLESyM (Deep Learning Earth System Model)
- NVIDIA. Coupled atmosphere-ocean-sea-ice. 1000+ simulated years stable. First AI model to demonstrate long-term coupled stability. DLESyM-Distill: 4-week jump S2S prediction via synthetic data pretraining (arXiv:2512.22814, Dec 2025). Uses ERA5 atmospheric fields and ORAS5 ocean reanalysis for training.

### SamudrACE (Allen AI)
- First coupled ocean-atmosphere AI climate emulator. Sep 2025. Extension of ACE2 framework. Ocean component trained on GLORYS12 reanalysis. Demonstrates stable multi-year coupled climate simulations. Key test: whether AI can represent ENSO without explicit ocean dynamics.

### Mercator Ocean AI
- Exploring neural network parameterizations for NEMO (subgrid mixing, mesoscale eddy effects). Not a standalone AI model but AI-augmented physics. Part of Copernicus Marine Service evolution.

### AI for S2S
- Ocean state is the primary source of S2S predictability (alongside land surface and stratosphere). AI S2S efforts use SST persistence and ENSO teleconnections as key inputs. DLESyM-Distill targets this gap explicitly.

## S2S Connection to Ocean State

Subseasonal-to-seasonal (2 weeks to 2 months) prediction skill comes primarily from slowly varying boundary conditions:
1. **ENSO phase:** Dominates seasonal forecast skill in tropics and extratropics (via teleconnections).
2. **SST anomaly persistence:** Ocean thermal inertia provides memory. Coupled models that evolve SST outperform those with persisted SST.
3. **MJO:** Subseasonal tropical variability. ENSO modulates MJO, and MJO in turn can trigger ENSO transitions via westerly wind bursts.
4. **Sea ice:** Arctic sea ice anomalies affect atmospheric circulation on seasonal timescales (debated magnitude).
5. **Soil moisture:** Land surface feedback, not directly ocean, but coupled to SST-driven precipitation patterns.
