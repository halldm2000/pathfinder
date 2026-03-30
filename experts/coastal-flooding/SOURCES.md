# Coastal Flooding Expert: Sources

Sources for ingestion and ongoing monitoring. Organized by type and priority.

## Primary Sources (check weekly)
Last checked: never

### Surge Models and Operational Forecasting
- **NHC Storm Surge Unit**: nhc.noaa.gov/surge/ (real-time surge products, P-Surge guidance, MOMs updates)
- **NWS Storm Surge Watches/Warnings**: weather.gov (operational surge warnings during events)
- **CERA (Coastal Emergency Risks Assessment)**: cera.coastalrisk.live (real-time ADCIRC guidance during hurricanes)
- **ADCIRC community**: adcirc.org (releases, validation studies, workshops, new mesh developments)
- **SCHISM community**: schism-dev.github.io/schism/ (releases, STOFS updates, documentation)
- **NOAA STOFS**: tidesandcurrents.noaa.gov/stofs/ (Surge and Tide Operational Forecast System updates)

### Sea Level Rise
- **NASA Sea Level Portal**: sealevel.nasa.gov (satellite altimetry trends, regional analysis, Sentinel-6 data)
- **NOAA Sea Level Trends**: tidesandcurrents.noaa.gov/sltrends/ (tide gauge analysis, regional projections)
- **IPCC updates**: ipcc.ch (assessment report updates, special reports -- stable until AR7 but watch for errata/updates)

### AI/ML in Coastal Flooding
- **arXiv**: arxiv.org (search: "storm surge machine learning", "coastal flooding deep learning", "ADCIRC surrogate", "compound flooding AI")
- **NHERI DesignSafe**: designsafe-ci.org (surge model simulation datasets, community data)

## Secondary Sources (check monthly)
Last checked: never

### FEMA Flood Mapping
- **FEMA Map Service Center**: msc.fema.gov (new FIRM releases, Letters of Map Change, study status)
- **FEMA Risk MAP**: fema.gov/flood-maps/tools-resources/risk-map (coastal flood study updates, Risk Rating 2.0 news)
- **ASFPM (Association of State Floodplain Managers)**: floods.org (policy updates, technical guidance, annual conference)

### Coastal Elevation Data
- **USGS 3DEP**: usgs.gov/3d-elevation-program (new lidar acquisitions, CoNED updates)
- **NOAA Digital Coast**: coast.noaa.gov/digitalcoast/ (new data releases, tools, training)
- **GEBCO Seabed 2030**: seabed2030.org (global bathymetry compilation progress)
- **OpenTopography**: opentopography.org (community lidar data releases)

### Compound Flooding Research
- **NOAA Coastal Services Center**: coast.noaa.gov (compound flood tools, new methodologies)
- **USACE Coastal Engineering Research**: erdc.usace.army.mil (coastal engineering guidance, CHETN publications)
- **GFDL Coastal Research**: gfdl.noaa.gov (coupled modeling, climate-flood interaction studies)

### Historical Data and Observations
- **NOAA Tides and Currents**: tidesandcurrents.noaa.gov (observed water levels, datum updates)
- **NOAA NCEI Storm Events Database**: ncei.noaa.gov/pub/data/swdi/stormevents/ (historical coastal flood events)
- **USGS Flood Event Viewer**: water.usgs.gov/floods/ (high-water marks, peak stages from events)

### Conferences
- **AMS Annual Meeting** (January) -- coastal meteorology, storm surge sessions
- **AGU Fall Meeting** (December) -- coastal flooding, sea level rise sessions
- **ASFPM Annual Conference** (June) -- floodplain management, FEMA updates
- **Coastal Sediments** (biennial) -- coastal processes, morphodynamics
- **ADCIRC Users Group Meeting** (annual) -- model development, applications
- **SCHISM Workshop** (annual) -- model updates, compound flooding applications
- **IAHR World Congress** (biennial) -- hydraulic engineering, flood modeling

### Key Journals
- Natural Hazards and Earth System Sciences (NHESS) -- flood risk assessment, compound flooding
- Coastal Engineering (Elsevier) -- surge modeling, wave-surge interaction, nearshore processes
- Journal of Waterway, Port, Coastal, and Ocean Engineering (ASCE) -- coastal infrastructure, design
- Earth's Future (AGU) -- sea level rise projections, climate-flood interaction
- Ocean Modelling (Elsevier) -- ADCIRC/SCHISM development, coastal model intercomparison
- Journal of Geophysical Research: Oceans -- surge physics, sea level observations
- Nature Climate Change -- high-impact sea level rise and flood risk papers

## Ingestion Notes

- ADCIRC and SCHISM release cycles are slow (~annual), but individual studies using these models appear frequently and may contain new validation data relevant to this expert's claims.
- FEMA flood map updates are irregular and location-specific. Only check when asked about a particular community or when ASFPM reports major programmatic changes.
- Sea level observations update continuously but trends are stable year to year. Annual rate updates from NASA/NOAA are sufficient.
- AI/ML surge surrogate papers are accelerating in frequency. Any claim of operational-quality ML surge prediction should be evaluated critically against the validation standards in reference/surge-models.md.
- Compound flooding is the fastest-moving subfield. New coupled modeling papers (ADCIRC+NWM, SCHISM+hydrology) appear monthly. Watch for NOAA announcements about operational compound flood forecast systems.
- During hurricane season (June-November), active storm surge forecasts and CERA products are operationally relevant and should be checked if users ask about ongoing events.
