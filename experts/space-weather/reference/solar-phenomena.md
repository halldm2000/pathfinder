### Solar Phenomena: Flares, CMEs, Solar Wind, and Coronal Holes

**What this covers:** The four primary solar phenomena that drive space weather at Earth, their physical mechanisms, observational signatures, and prediction challenges. These are distinct phenomena that frequently co-occur but have independent impact pathways.

## Solar Flares

**Physical mechanism:** Sudden release of magnetic energy stored in the corona via magnetic reconnection. Energy released as electromagnetic radiation across the full spectrum -- radio, optical, UV, X-ray, gamma-ray. Total energy: 10^20 to 10^25 joules for major flares. Duration: minutes (impulsive phase) to hours (gradual phase).

**Classification (GOES X-ray flux, 1-8 angstrom):**
| Class | Peak Flux (W/m^2) | NOAA R-Scale | Frequency at Solar Max |
|-------|-------------------|--------------|----------------------|
| A | < 10^-7 | None | Background |
| B | 10^-7 to 10^-6 | None | Continuous |
| C | 10^-6 to 10^-5 | None | Multiple daily |
| M | 10^-5 to 10^-4 | R1 (M1) to R2 (M5) | Several per week |
| X | >= 10^-4 | R3 (X1) to R5 (X20+) | Several per month at max |

Within each class: linear scale. X10 = 10x X1. Largest recorded: X45 (estimated, November 2003 -- saturated GOES detectors, originally reported as X28).

**Prediction challenges:** Flare trigger mechanisms are not fully understood. Magnetic topology of active regions (shear, twist, free energy) provides probabilistic indicators but no deterministic trigger. Best ML models achieve TSS 0.5-0.7 for M-class within 24 hours -- better than climatology but far from reliable. X-class prediction is harder due to rarity.

## Coronal Mass Ejections (CMEs)

**Physical mechanism:** Eruption of magnetized plasma from the corona, often (but not always) associated with a flare. Driven by magnetic buoyancy and loss of equilibrium in coronal flux ropes. Mass: 10^12 to 10^13 kg. Speed: 250-3000+ km/s. Magnetic field carried within the CME (magnetic cloud) determines geoeffectiveness -- southward Bz couples to Earth's magnetosphere.

**Key observational properties:**
- Detected in white-light coronagraph imagery (SOHO/LASCO, STEREO). Halo CMEs appear as expanding ring around the occulting disk -- suggests Earth-directedness but can be backside events.
- CME speed measured from successive coronagraph frames. Fast CMEs (>1000 km/s) drive interplanetary shocks that accelerate SEPs.
- Magnetic field orientation within the CME is not measurable until it reaches L1 (~1 hour before Earth impact). This is the single biggest uncertainty in geomagnetic storm forecasting.

**Transit time estimation:**
- Empirical: 1-4 days depending on speed. Fast CMEs (2000+ km/s) can arrive in <18 hours (Carrington Event: 17.6 hours).
- Drag-based models: CME decelerates or accelerates toward ambient solar wind speed (~400 km/s). Typical MAE: 10-15 hours.
- ML-enhanced (CAT-PUMA, physics-informed approaches): MAE improved to ~8-10 hours. Still insufficient for precise timing of geomagnetic storm onset.

## Solar Wind

**Background conditions:** Continuous outflow of plasma from the corona. Slow wind (~300-400 km/s, dense, variable) from streamer belt regions. Fast wind (~600-800 km/s, tenuous, steady) from coronal holes. At Earth: density ~5 particles/cm^3, magnetic field ~5 nT (nominal).

**Stream interaction regions (SIRs/CIRs):** Where fast wind overtakes slow wind, compression forms. Corotating interaction regions (CIRs) recur every ~27 days with solar rotation. Can drive G1-G2 geomagnetic storms without CME involvement. Predictable days in advance from coronal hole observations.

**Monitoring:** DSCOVR and ACE at L1 provide continuous real-time solar wind speed, density, temperature, and magnetic field (Bx, By, Bz components). Southward Bz (negative in GSM coordinates) is the key geoeffectiveness parameter. L1 data provides ~30-60 minutes warning before Earth impact.

## Coronal Holes

**Physical mechanism:** Regions of open magnetic field lines extending into the heliosphere. Plasma escapes freely, creating fast solar wind streams. Appear dark in EUV and soft X-ray imagery because the low density reduces coronal emission.

**Observational identification:** Best seen in SDO/AIA 193 angstrom (Fe XII, ~1.5 MK) and 211 angstrom (Fe XIV, ~2 MK) channels. Also visible in GOES/SUVI and SOHO/EIT 195 angstrom. Near-equatorial coronal holes that face Earth produce geoeffective high-speed streams.

**Prediction value:** Coronal holes are the most predictable source of geomagnetic disturbance. Persistent holes recur every 27 days, giving multiple rotations of observational history. SWPC uses coronal hole area and location as primary inputs for 3-day geomagnetic forecasts during quiet periods (no CME activity).

As of: March 2026
