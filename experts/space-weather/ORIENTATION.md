# Space Weather Expert Orientation

Reference material for the space weather expert. Facts here correct what the model gets wrong, add what it doesn't know, and anchor fast-moving details with dates. Omits facts the model reliably knows (basic plasma physics, Maxwell's equations, etc.).

Last verified: March 2026. Claude's training data extends through early 2025.

## Field Map

Space weather forecasting is transitioning from empirical and physics-based models to AI-augmented prediction, following the same trajectory terrestrial weather took in 2023-2025 but lagging by roughly two years. The field's central challenge: sparse observational coverage of the Sun-Earth system (one L1 monitor, limited solar farside coverage) combined with extreme event rarity makes both physics-based and data-driven prediction difficult. NOAA's Space Weather Prediction Center (SWPC) remains the operational authority for the US, issuing watches, warnings, and alerts on the NOAA G/S/R scales. NASA and ESA fund most research. The landmark AI development is Surya (also known as HelioFM), a multi-institutional solar foundation model led by NASA with NVIDIA and IBM support, trained on SDO data. Solar Cycle 25 reached its maximum period in late 2024 through early 2026, with activity remaining elevated. The May 2024 superstorm (G5, first since 2003) demonstrated that Carrington-class impacts remain a real operational concern.

## HelioFM / Surya (as of March 2026)

Surya is the operational name for the Heliophysics Foundation Model (HelioFM). Multi-institutional collaboration: NASA (lead, via NASA IMPACT at Marshall Space Flight Center), IBM Research, NVIDIA (compute via NAIRR), with science contributions from SwRI, Princeton, NCAR/HAO, and others.

- **Architecture:** 360M-parameter spatiotemporal transformer with spectral gating and long-short range attention. Pretrained on high-resolution solar image forecasting, then fine-tuned via autoregressive rollout tuning.
- **Training data:** 200+ TB from Solar Dynamics Observatory (SDO), spanning 9 years of continuous solar observation. Primarily AIA multi-wavelength EUV imagery.
- **Capabilities:** Full-disk solar forecasting up to 2 hours ahead. Flare prediction surpassing existing benchmarks by ~16%. Downstream tasks include CME detection, solar wind forecasting, irradiance prediction.
- **Availability:** Open weights on Hugging Face, code on GitHub (NASA-IMPACT/Surya), fine-tunable via IBM's TerraTorch library.
- **NVIDIA's role:** Compute infrastructure through the NSF NAIRR Pilot program. Training on NVIDIA GPUs. HelioFM listed in NVIDIA Earth-2 model family alongside terrestrial weather models.
- **Distinction from Earth-2 weather models:** Surya predicts *solar* activity (what the Sun does). Earth-2 models like Atlas predict *terrestrial* weather (what Earth's atmosphere does). They connect through geomagnetic coupling -- solar activity drives geomagnetic storms that perturb the ionosphere, which Earth-2 models don't yet capture.
- Paper: arXiv:2508.14112.

## Solar Phenomena Summary

**Solar flares** -- Electromagnetic radiation bursts classified by peak X-ray flux (GOES 1-8 angstrom). Classification: A < 10^-7, B < 10^-6, C < 10^-5, M < 10^-4, X >= 10^-4 W/m^2. Each class is 10x the previous. Within a class, linear scale (M5.0 is 5x M1.0). X-class has no upper bound (X28 recorded in 2003). Arrives at Earth in 8 minutes. Primary impact: radio blackouts (R-scale).

**Coronal mass ejections (CMEs)** -- Billion-ton plasma clouds launched from the corona at 250-3000+ km/s. Transit time to Earth: 15 hours (extreme) to 4+ days (slow). Only Earth-directed CMEs cause geomagnetic storms. Halo CMEs in SOHO/LASCO coronagraph images suggest Earth-directedness but can be backside events. Primary impact: geomagnetic storms (G-scale).

**Solar wind** -- Continuous plasma outflow, 300-800 km/s at Earth. Background condition modulated by coronal holes (high-speed streams, 600-800 km/s) and stream interaction regions. Measured in real-time at L1 by DSCOVR and ACE (~1 hour warning before Earth impact).

**Coronal holes** -- Open magnetic field regions, appear dark in EUV (SDO/AIA 193 angstrom). Source of high-speed solar wind streams. Recurrent every ~27 days (solar rotation). Can drive G1-G2 storms without CME involvement.

**Solar energetic particles (SEPs)** -- Protons and ions accelerated by flare reconnection or CME-driven shocks. Arrive in minutes to hours. Primary impact: radiation hazard for astronauts and avionics (S-scale).

## NOAA Space Weather Scales

| Scale | Measures | Levels | Threshold | Key Impacts |
|-------|----------|--------|-----------|-------------|
| **G** (Geomagnetic) | Kp index | G1-G5 | Kp 5/6/7/8/9 | Power grid GICs, satellite drag, GPS errors, aurora extent |
| **S** (Solar Radiation) | >10 MeV proton flux | S1-S5 | 10/100/1000/10000/100000 pfu | Aviation radiation, satellite electronics, EVA hazard |
| **R** (Radio Blackout) | X-ray flux class | R1-R5 | M1/M5/X1/X10/X20 | HF radio degradation/blackout, GPS accuracy loss |

## Solar Cycle 25 Status (as of March 2026)

- Cycle began December 2019.
- SWPC revised forecast (October 2023): peak sunspot number 137-173, significantly higher than original prediction of 115.
- Maximum period declared by NASA/NOAA in October 2024. Activity remained elevated through early 2026.
- Notable events: May 2024 G5 superstorm (strongest since October 2003, aurora visible to 25 deg latitude), November 2025 X5.16 flare from AR 4274 with super-fast CME at 1950 km/s triggering G4 watch.
- Expected decline toward minimum around 2030, but major events remain possible during the declining phase.

## Observational Systems (Summary)

**SDO (Solar Dynamics Observatory)** -- NASA, geosynchronous orbit since 2010. AIA: 10 UV/EUV channels (94-4500 angstrom), 12-second cadence, 4096x4096 pixels. HMI: photospheric magnetograms. EVE: EUV irradiance. Primary training data source for Surya.

**SOHO (Solar and Heliospheric Observatory)** -- ESA/NASA, L1 halo orbit since 1996. LASCO coronagraph: C2 (2-6 Rs) and C3 (4-30 Rs) for CME detection. EIT: EUV imaging (predecessor to AIA). MDI: magnetograms (predecessor to HMI). Still operational.

**ACE (Advanced Composition Explorer)** -- NASA, L1 since 1997. Real-time solar wind plasma and magnetic field. SWEPAM (solar wind), MAG (magnetic field), EPAM (energetic particles). Provides ~1 hour warning. Aging but functional.

**DSCOVR (Deep Space Climate Observatory)** -- NOAA, L1 since 2015. Replaced ACE as primary L1 solar wind monitor. Faraday Cup (solar wind) and magnetometer. Real-time data feeds SWPC forecasts.

**GOES (16/17/18)** -- NOAA, geostationary. X-ray sensors (XRS) for flare detection. Magnetometers for geomagnetic field. SUVI: solar EUV imager. SEISS: particle detectors. Operational backbone of SWPC alerts.

## AI in Space Weather (as of March 2026)

**Surya/HelioFM** -- See above. Flagship AI development. Full-disk solar forecasting from SDO data. Multi-institutional open model.

**ML flare prediction** -- Active research area since ~2017. Approaches include CNNs on magnetograms, LSTMs on time series, Vision Transformers on AIA imagery. Best models achieve TSS (True Skill Statistic) of ~0.5-0.7 for M-class flare prediction within 24 hours. Operational deployment limited -- SWPC still uses primarily human forecasters with model guidance.

**CME arrival time prediction** -- Machine learning models (CAT-PUMA, drag-based ML hybrids) reduce mean absolute error from ~12 hours (empirical) to ~8-10 hours. Physics-informed approaches outperform pure ML. NASA/GSFC maintains the CME Arrival Time Scoreboard for model comparison.

**AI for the May 2024 superstorm** -- A January 2025 paper (arXiv:2501.14684) demonstrated that existing AI models could have predicted all major aspects of the May 2024 event, including the flares, CME characteristics, and geomagnetic response. This is a landmark validation.

**Key difference from terrestrial AI weather:** Space weather has far less training data (rare extreme events), sparser observational networks (one L1 point vs thousands of weather stations), and longer cause-to-effect chains (Sun-to-Earth). These limit pure data-driven approaches more severely than in tropospheric weather. Physics-informed AI is essential, not optional.

## Forecasting: Operational vs Research

**SWPC (operational):** Issues 3-day forecasts, watches (1-3 day lead), warnings (hours), and alerts (imminent/occurring). Products: Kp forecast, proton flux forecast, solar flare probability, CME analysis. Human forecasters in 24/7 watch, using ensemble of physics models and empirical tools. Website: swpc.noaa.gov.

**Lead times by phenomenon:**
- Flares: minutes to none (light-speed arrival after detection). Probabilistic forecasts: 1-3 days.
- SEPs: minutes to hours after flare/CME onset.
- CMEs: 1-4 days transit, but arrival time uncertainty of ~10-15 hours.
- Geomagnetic storms from CMEs: ~1 hour before impact (L1 measurement).
- High-speed streams: days (recurrent, predictable from coronal hole observations).

**Verification challenge:** Events are rare (perhaps 1-3 major storms per year at solar maximum), making statistical skill assessment difficult. False alarm rates are high for flare and CME predictions. The field lacks a "WeatherBench 2" equivalent for standardized AI model intercomparison.

## Key Impacts (Summary)

| System | Mechanism | Severity Range | Historical Precedent |
|--------|-----------|---------------|---------------------|
| **Power grids** | GICs from geomagnetic storms | Transformer damage, cascading blackout | 1989 Quebec blackout (G5), Carrington 1859 |
| **Satellites** | Drag increase, charging, radiation damage | Orbit changes, electronics failure | 2022 Starlink loss (38 satellites, G1 storm) |
| **GPS/GNSS** | Ionospheric scintillation, signal degradation | Meter-level errors to complete loss | May 2024 G5: widespread GPS degradation |
| **Aviation** | Radiation exposure, HF radio loss, GPS degradation | Route changes, altitude restrictions | Polar route diversions during S2+ events |
| **Communications** | HF radio blackout, satellite comms disruption | Hours to days of degraded HF | R3+ events disable transoceanic HF |
| **Human spaceflight** | Radiation dose to crew | EVA restrictions, shelter-in-place | ISS crew sheltering during SEP events |
| **Carrington-class (G5+)** | All of the above simultaneously | $1-2 trillion damage, months-long power grid recovery | 1859 Carrington Event |
