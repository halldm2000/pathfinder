# Sea Level Rise: Scenarios, Projections, and Observations

Deep-dive reference for sea level rise science relevant to coastal flood assessment. Covers IPCC AR6 scenarios, regional projections, observation networks, and implications for flood frequency.

Last verified: March 2026.

## IPCC AR6 Global Projections (WG1, 2021)

### SSP Scenarios and Projected Rise
All values relative to 1995-2014 baseline (approximately +0.15 m above pre-industrial).

| Scenario | 2050 (m) | 2100 (m, likely range) | 2100 central (m) | 2150 (m, likely range) |
|---|---|---|---|---|
| SSP1-1.9 (very low) | 0.15-0.23 | 0.28-0.55 | 0.38 | 0.37-0.86 |
| SSP1-2.6 (low) | 0.17-0.26 | 0.32-0.62 | 0.44 | 0.46-0.99 |
| SSP2-4.5 (intermediate) | 0.19-0.29 | 0.44-0.76 | 0.56 | 0.66-1.33 |
| SSP3-7.0 (high) | 0.20-0.31 | 0.55-0.90 | 0.68 | 0.89-1.65 |
| SSP5-8.5 (very high) | 0.23-0.36 | 0.63-1.01 | 0.77 | 0.98-1.88 |

**Low-confidence high-end:** AR6 acknowledges that marine ice cliff instability (MICI) could push 2100 sea level rise above the likely ranges. Under SSP5-8.5 with ice sheet instability, 2 m by 2100 cannot be excluded. AR6 assigns low confidence to this outcome but does not dismiss it. Relevant for high-stakes infrastructure planning (nuclear plants, military bases).

### Components of Sea Level Rise
- **Thermal expansion:** ~40% of observed rise. Ocean absorbs >90% of excess heat. Committed even if emissions stop.
- **Glacier melt:** ~20%. Mountain glaciers worldwide (Alps, Andes, Himalayas, Alaska). Most will lose >50% of mass by 2100 under all scenarios.
- **Greenland Ice Sheet:** ~15%. Surface melt dominant. ~0.07 mm/yr contribution in 1990s, ~0.7 mm/yr by 2010s. AR6: 0.01-0.18 m by 2100 (SSP1-2.6) to 0.09-0.18 m (SSP5-8.5).
- **Antarctic Ice Sheet:** ~10%, but highest uncertainty. West Antarctic Ice Sheet (WAIS) is marine-based and potentially unstable. East Antarctic has started showing unexpected mass loss (Totten Glacier). The low-confidence high-end scenarios are dominated by Antarctic uncertainty.
- **Land water storage:** ~5%. Groundwater depletion adds water to the ocean; reservoir impoundment removes it. Net positive contribution.

### Key Timescale Insight
Sea level rise is committed: even under aggressive mitigation (SSP1-1.9), sea level continues rising for centuries due to ocean thermal inertia and ice sheet response lag. By 2300, even SSP1-2.6 produces 0.8-3.0 m. This means infrastructure built today will face higher sea levels regardless of future emissions.

## NOAA Interagency Sea Level Rise Scenarios (2022, updated from 2017)

NOAA's scenario framework for U.S. planning, aligned with IPCC but providing U.S.-specific regional projections:

| Scenario | Global Mean SLR by 2100 (m) | Approximate SSP alignment |
|---|---|---|
| Low | 0.3 | SSP1-2.6 |
| Intermediate-Low | 0.5 | SSP2-4.5 (lower end) |
| Intermediate | 1.0 | SSP5-8.5 (upper end) |
| Intermediate-High | 1.5 | Above SSP5-8.5 likely range |
| High | 2.0 | Low-confidence ice sheet instability |

NOAA provides localized projections at tide gauge stations nationwide. These incorporate GIA, ocean dynamics, and local vertical land motion. Available at: tidesandcurrents.noaa.gov/sltrends/.

## Regional Variation

### U.S. East Coast
- **Northeast (Maine to Virginia):** Rising faster than global mean due to GIA subsidence (land sinking post-glacial) and potential Gulf Stream slowdown effect. Rate: ~4-5 mm/yr at many stations. New York City tide gauge (The Battery): ~3.0 mm/yr long-term, accelerating.
- **Southeast (Carolinas to Florida):** Moderate subsidence, strong ocean dynamic component. Rate: ~3-5 mm/yr. Charleston, SC: ~3.3 mm/yr.
- **South Florida:** Porous limestone foundation means sea level rise causes saltwater intrusion into aquifers before surface flooding becomes the primary concern. Current rate: ~4 mm/yr at Key West.

### U.S. Gulf Coast
- **Highest relative rates in CONUS.** Combines global SLR with severe land subsidence from sediment compaction and fluid extraction.
- **Grand Isle, LA:** ~9.1 mm/yr relative rate. Louisiana loses ~one football field of wetland per hour.
- **Galveston, TX:** ~6.6 mm/yr relative rate. Houston-Galveston subsidence from groundwater extraction historically severe (up to 3 m cumulative in some areas), now partially mitigated by surface water switch.
- **Implication:** Gulf Coast experiences the equivalent of multiple decades of global SLR in a single decade due to subsidence amplification.

### U.S. West Coast
- **Tectonic uplift partially offsets SLR** in some locations (Oregon, Washington). San Francisco: ~2.0 mm/yr.
- **Pacific Decadal Oscillation (PDO) and ENSO** cause multi-year sea level fluctuations that can temporarily accelerate or mask the trend.

### Global Hotspots
- **Small Island Developing States (SIDS):** Existential threat. Tuvalu, Kiribati, Marshall Islands face inundation at <1 m SLR.
- **Southeast Asia:** Bangkok, Jakarta, Ho Chi Minh City -- extreme subsidence (10-25 mm/yr in some areas) combined with SLR. Jakarta's subsidence is so severe that Indonesia is relocating its capital.
- **Deltaic regions:** Nile Delta, Ganges-Brahmaputra, Mekong -- compaction, reduced sediment supply from upstream dams, and SLR combine.

## Observation Networks

### Satellite Altimetry
- **TOPEX/Poseidon (1992-2005) -> Jason series (2001-present) -> Sentinel-6 Michael Freilich (2020-present):** Continuous 30+ year record of global sea surface height.
- Measurement precision: ~3-4 cm for individual pass, ~1-2 mm/yr trend accuracy after corrections.
- Global coverage between 66 N and 66 S. Does not measure under ice or very near coastlines (land contamination of radar return).
- Reference: NASA Sea Level Portal (sealevel.nasa.gov).

### Tide Gauges
- **NOAA NWLON (National Water Level Observation Network):** ~200 active long-term tide gauge stations along U.S. coasts. Continuous water level measurement at 6-minute intervals. Some records >100 years (The Battery, NY since 1856; Key West since 1913).
- **GLOSS (Global Sea Level Observing System):** ~300 core stations worldwide, coordinated by IOC/UNESCO.
- **Advantages over satellites:** Longer records, measure relative sea level (includes land motion), coastal-specific. Essential for local planning.
- **Limitation:** Point measurements, spatial gaps, land motion must be separated from ocean signal for global analysis.

### GPS/GNSS at Tide Gauges
- Co-located GPS receivers measure vertical land motion at tide gauge sites, enabling separation of land subsidence from ocean-driven sea level change.
- SONEL (Système d'Observation du Niveau des Eaux Littorales) maintains the global database.

### GRACE / GRACE-FO
- **Gravity Recovery and Climate Experiment (2002-2017) and Follow-On (2018-present):** Measures ice sheet and glacier mass changes from orbit by detecting gravity field variations.
- Provides ice sheet mass balance that drives ~25% of current SLR. Essential for constraining Antarctic and Greenland contributions.

## Sea Level Rise and Flood Frequency

The most policy-relevant impact of SLR is the nonlinear increase in flood frequency:
- A flood level that currently has a 1% annual chance (100-year event) may become a 10% annual chance event (10-year) with just 0.3-0.5 m of SLR, because the surge rides on a higher baseline.
- **NOAA analysis (Sweet et al., 2022):** By 2050, moderate flooding (currently ~3 events/year at many U.S. coastal stations) is projected to occur 10-15x more frequently.
- **High-tide flooding ("sunny day flooding"):** Already increasing. U.S. stations saw a median of 3.7 days of high-tide flooding in 2022, up from 1.9 days/year in 2000. Projected to reach 45-85 days/year by 2050 in many locations.
- **Implication for design standards:** Infrastructure designed to the current 100-year flood level may experience that flood level every 10-30 years by mid-century, requiring either higher design standards or managed retreat.
