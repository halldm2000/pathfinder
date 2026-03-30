### Space Weather Observational Systems

**What this covers:** The primary spacecraft and ground-based systems that observe the Sun and solar wind for space weather monitoring and research. Organized by mission with instrument details, data products, and access information.

## SDO (Solar Dynamics Observatory)

**Overview:** NASA mission, launched February 11, 2010. Geosynchronous orbit (inclined, dedicated ground station at White Sands, NM). Designed for continuous high-cadence, high-resolution solar observation. Generates ~1.5 TB of data per day -- the largest data volume of any NASA science mission. Primary training data source for Surya/HelioFM.

**AIA (Atmospheric Imaging Assembly):**
- Four dual-channel 20cm telescopes providing 10 wavelength channels.
- 4096x4096 pixel images (0.6 arcsec/pixel), 41 arcmin field of view (full disk + low corona).
- 12-second cadence for EUV channels; 24-second for UV channels.

| Channel (angstrom) | Primary Ion | Temperature (log K) | What it Shows |
|----------|-------------|-------------------|---------------|
| 94 | Fe XVIII | 6.8 (6.3 MK) | Flaring regions, hot corona |
| 131 | Fe VIII, XXI | 5.6, 7.0 | Transition region + flare plasma |
| 171 | Fe IX | 5.8 (0.6 MK) | Quiet corona, coronal loops |
| 193 | Fe XII, XXIV | 6.2, 7.3 | Corona, coronal holes, flares |
| 211 | Fe XIV | 6.3 (2 MK) | Active region corona |
| 304 | He II | 4.7 (50 kK) | Chromosphere, transition region |
| 335 | Fe XVI | 6.4 (2.5 MK) | Active region corona |
| 1600 | C IV + cont. | 5.0 | Upper photosphere, transition region |
| 1700 | Continuum | 3.7 | Photosphere, sunspot structure |
| 4500 | Continuum | 3.7 | Photosphere (white light) |

**HMI (Helioseismic and Magnetic Imager):**
- Full-disk photospheric magnetograms (line-of-sight and vector field).
- 4096x4096 pixels, 45-second cadence.
- Key data products: magnetograms, continuum intensity, Dopplergrams.
- Critical for flare prediction -- active region magnetic complexity is the primary predictor.

**EVE (EUV Variability Experiment):**
- Measures solar EUV irradiance (0.1-105 nm) with 10-second cadence.
- Tracks total solar output changes that affect Earth's thermosphere and ionosphere.

**Data access:** jsoc.stanford.edu (Joint Science Operations Center). SDO data is public and freely available. Helioviewer.org provides browser-based visualization.

## SOHO (Solar and Heliospheric Observatory)

**Overview:** ESA/NASA joint mission, launched December 2, 1995. L1 halo orbit. Originally a 2-year mission, still operational after 30 years (as of 2026). Provides the longest continuous space-based solar observation record.

**LASCO (Large Angle Spectrometric Coronagraph):**
- C2: Coronagraph, 2.0-6.0 solar radii. White-light. CME detection workhorse.
- C3: Coronagraph, 4.0-30 solar radii. Wide-field CME tracking.
- C1 (1.1-3.0 Rs): Failed in 1998.
- Primary operational tool for CME detection and initial speed/direction estimation.
- Halo CME identification: Full-halo (360 deg) or partial-halo (>120 deg) events flag potential Earth-directed CMEs.

**EIT (Extreme ultraviolet Imaging Telescope):**
- 4 wavelengths: 171, 195, 284, 304 angstrom. Lower cadence and resolution than SDO/AIA.
- Complementary to AIA for long-baseline studies (1996-present).

**Data access:** soho.nascom.nasa.gov. Real-time LASCO images critical for SWPC CME analysis.

## DSCOVR (Deep Space Climate Observatory)

**Overview:** NOAA mission with NASA technology, launched February 11, 2015. L1 Lissajous orbit, ~1.5 million km sunward of Earth. Replaced ACE as NOAA's primary operational solar wind monitor.

**Key instruments:**
- **Faraday Cup (FC):** Solar wind speed, density, temperature. 1-minute cadence.
- **Magnetometer (MAG):** Interplanetary magnetic field (Bx, By, Bz in GSM). 1-second cadence.
- **EPIC (Earth Polychromatic Imaging Camera):** Visible-light Earth imagery (not space weather but notable).

**Operational role:** Real-time L1 data feeds SWPC's Geospace Model (Geospace). Provides the critical ~30-60 minute warning before CME impact -- the Bz measurement that determines whether a CME will be geoeffective. When DSCOVR data gaps occur, ACE backfills.

**Data access:** swpc.noaa.gov/products/real-time-solar-wind (real-time). ngdc.noaa.gov/dscovr (archive).

## ACE (Advanced Composition Explorer)

**Overview:** NASA mission, launched August 25, 1997. L1 halo orbit. Designed for solar wind composition studies, became an operational space weather asset. Aging but still functional as DSCOVR backup.

**Key instruments for space weather:**
- **SWEPAM:** Solar wind speed, density, temperature.
- **MAG:** Magnetic field vectors.
- **EPAM:** Energetic particle fluxes (47 keV to 5 MeV ions, 38-315 keV electrons).
- **SIS:** High-energy particle composition (>10 MeV/nucleon).

**Data access:** swpc.noaa.gov/products/ace-real-time-solar-wind (real-time feed).

## GOES (Geostationary Operational Environmental Satellites)

**Overview:** NOAA operational constellation. Current operational satellites: GOES-16 (East), GOES-18 (West). GOES-19 launched June 2025, entering operational role. Geostationary orbit (35,786 km). Multi-purpose: weather imaging + space weather monitoring.

**Space weather instruments:**
- **XRS (X-Ray Sensor):** 0.05-0.4 nm and 0.1-0.8 nm channels. Primary sensor for flare detection and classification. 1-second cadence. The data that defines the A/B/C/M/X flare scale.
- **SUVI (Solar Ultraviolet Imager):** 6 EUV channels (94, 131, 171, 195, 284, 304 angstrom). Lower resolution than SDO/AIA but provides operational continuity.
- **SEISS (Space Environment In-Situ Suite):** Energetic particle detectors covering 30 keV to >500 MeV protons, electrons. Defines the S-scale.
- **MAG (Magnetometer):** Geosynchronous magnetic field. Detects magnetopause crossings during extreme storms (when the magnetopause is compressed inside GEO orbit).

**Operational role:** XRS and SEISS data directly trigger SWPC alerts and scale levels (R-scale from XRS, S-scale from SEISS). GOES data is the operational backbone -- if GOES goes down, SWPC loses real-time flare and particle monitoring.

**Data access:** swpc.noaa.gov/products (real-time). ngdc.noaa.gov/stp/satellite/goes/ (archive).

## Other Notable Systems

**STEREO (Solar Terrestrial Relations Observatory):** NASA, two spacecraft (only STEREO-A operational). Provides off-Sun-Earth-line perspective for CME 3D reconstruction. Critical for determining CME direction and speed more accurately than single-viewpoint LASCO.

**Parker Solar Probe:** NASA, closest-ever approach to the Sun (perihelion ~10 solar radii). In situ measurements of the inner heliosphere. Not operational space weather but transforming understanding of solar wind acceleration and coronal heating.

**Solar Orbiter:** ESA/NASA, inclined orbit providing first views of solar poles. Remote sensing + in situ. Commissioning complete, science operations ongoing.

**Ground-based:** GONG (Global Oscillation Network Group) -- six-station network for helioseismology and farside imaging. Magnetometer networks (INTERMAGNET) for ground magnetic field monitoring and GIC estimation.

As of: March 2026
