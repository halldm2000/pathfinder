# Space Weather Expert: Sources

Sources for ingestion and ongoing monitoring. Organized by type and priority.

## Primary Sources (check weekly)
Last checked: never

### NVIDIA / HelioFM
- **Surya GitHub**: github.com/NASA-IMPACT/Surya (releases, new downstream tasks, model updates)
- **HelioFM project site**: heliofm.org (announcements, publications)
- **NVIDIA Earth-2 blog (HelioFM mentions)**: blogs.nvidia.com/blog/tag/earth-2/
- **Surya on Hugging Face**: huggingface.co (model cards, weights, fine-tuning updates)

### Operational Space Weather
- **SWPC alerts and forecasts**: swpc.noaa.gov/products (real-time conditions, watches, warnings, alerts)
- **SWPC Space Weather Outlook**: swpc.noaa.gov/products/27-day-outlook (27-day F10.7 and Ap forecast)
- **GOES X-ray flux**: swpc.noaa.gov/products/goes-x-ray-flux (flare monitoring)
- **DSCOVR real-time solar wind**: swpc.noaa.gov/products/real-time-solar-wind

### AI Space Weather Research
- **arXiv astro-ph.SR + cs.LG**: arxiv.org (search: "space weather machine learning", "solar flare prediction", "CME arrival time", "heliophysics AI", "solar foundation model")
- **NASA Heliophysics**: science.nasa.gov/heliophysics/ (mission updates, research highlights)
- **IBM Research blog**: research.ibm.com/blog (Surya/HelioFM updates, TerraTorch)

### Solar Cycle Monitoring
- **SWPC Solar Cycle Progression**: swpc.noaa.gov/products/solar-cycle-progression (monthly sunspot number, predicted vs observed)
- **SILSO (WDC-SILSO)**: sidc.be/silso/ (international sunspot number, official cycle tracking)

## Secondary Sources (check monthly)
Last checked: never

### Space Agencies
- **ESA Space Weather**: esa.int/Safety_Security/Space_Weather (SSA programme, Vigil mission updates)
- **NASA Goddard Space Weather Lab**: swrc.gsfc.nasa.gov (CME Arrival Time Scoreboard, research tools)
- **NOAA NCEI (Space Weather)**: ngdc.noaa.gov/stp/ (historical data, long-term records)

### Observational Missions
- **SDO mission status**: sdo.gsfc.nasa.gov (instrument health, data continuity)
- **SOHO status**: soho.nascom.nasa.gov (long-duration mission updates)
- **Parker Solar Probe**: parkersolarprobe.jhuapl.edu (perihelion results, solar wind discoveries)
- **Solar Orbiter**: esa.int/Science_Exploration/Space_Science/Solar_Orbiter (polar observations, coordination campaigns)

### Research Groups and Institutions
- **NCAR/HAO**: hao.ucar.edu (coronal modeling, solar cycle research)
- **SwRI Heliophysics**: swri.org (solar wind modeling, IBEX, IMAP)
- **Princeton Space Physics**: spacephysics.princeton.edu (Surya science team, magnetosphere research)
- **Stanford JSOC**: jsoc.stanford.edu (SDO data products, HMI/AIA processing pipeline)

### Conferences (major space weather venues)
- **AGU Fall Meeting** (December) -- space physics sessions, heliophysics division
- **COSPAR** (biennial) -- Committee on Space Research, space weather committee
- **ESWW (European Space Weather Week)** (November) -- primary European space weather conference
- **SHINE (Solar Heliospheric and INterplanetary Environment)** (June/July) -- focused US heliophysics workshop
- **SPD (Solar Physics Division, AAS)** (June) -- solar physics research presentations
- **Space Weather Workshop** (April/May, Boulder CO) -- SWPC-hosted, operational focus
- **AMS Annual Meeting** (January) -- space weather sessions, overlap with Earth-2 venue

### Journals
- Space Weather (AGU) -- primary journal for operational space weather
- The Astrophysical Journal (ApJ) -- solar physics research
- Solar Physics (Springer) -- dedicated solar research journal
- Journal of Geophysical Research: Space Physics (JGR) -- magnetosphere, ionosphere
- Advances in Space Research -- broad space science coverage

## Ingestion Notes

- SWPC products are the operational ground truth -- when SWPC issues a scale level or forecast, that's the authoritative source.
- Surya/HelioFM is in active development. New downstream task papers may appear without coordinated announcements. Monitor arXiv and the GitHub repo.
- Solar cycle tracking is slow-cadence but high-impact -- the cycle phase determines baseline activity levels for all forecasting.
- ESA's Vigil mission (formerly Lagrange) to L5 will be transformative for space weather forecasting when launched (~2031). Monitor for updates on timeline and instruments.
- Conference proceedings often contain results months before journal publication, especially from ESWW and the Space Weather Workshop.
