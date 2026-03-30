### Fire Weather

**Overview:** Fire weather is the atmospheric dimension of the fuel-weather-topography triangle that governs fire behavior. Two fire danger rating systems dominate globally: the Canadian Forest Fire Weather Index (FWI) System (used internationally) and the US National Fire Danger Rating System (NFDRS). Both translate weather observations into fire danger indices. Red Flag Warnings and spot fire weather forecasts translate weather predictions into actionable fire management decisions.

## Canadian Forest Fire Weather Index (FWI) System

Developed by the Canadian Forest Service (Van Wagner 1987). The international standard for fire weather indexing. Used by: Canada (origin), EU (EFFIS), Australia (alongside McArthur FFDI), many tropical and Southern Hemisphere countries. The Copernicus Climate Data Store provides global ERA5-based FWI from 1940-present.

**Input:** Daily noon observations of temperature (C), relative humidity (%), 10m wind speed (km/h), and 24-hour accumulated precipitation (mm).

### Fuel Moisture Codes

**FFMC (Fine Fuel Moisture Code):**
- Tracks moisture content of surface litter and fine dead fuels (~1-2 cm depth, equivalent to 1h timelag fuels).
- Responds to temperature, RH, wind, and rain within hours. Resets quickly after rain.
- Scale: 0-101 (higher = drier). FFMC of 85 corresponds to ~17% fuel moisture content -- approximate threshold for sustained fire spread. FFMC > 92 indicates very easy ignition and rapid spread.
- **Computation:** Logarithmic drying/wetting with rain correction. Uses yesterday's FFMC as starting point (bookkeeping system).
- Physical analog: top layer of forest floor duff, pine needles, dead grass.

**DMC (Duff Moisture Code):**
- Tracks moisture in the upper compact duff layer (~5-10 cm depth, equivalent to 10h-100h fuels).
- Slower response than FFMC. Takes days to weeks to dry significantly after rain.
- Scale: 0 to open-ended (higher = drier). DMC > 30 indicates moderate fire potential; DMC > 60 indicates high availability of surface fuel.
- Governs fire intensity and difficulty of control. High DMC = deep-burning fire, hard to mop up.

**DC (Drought Code):**
- Tracks deep soil/duff moisture (10-20 cm+, equivalent to 1000h fuels).
- Slowest-responding component. Takes weeks to months to change significantly. Not affected by small rain events (<2.8 mm).
- Scale: 0 to open-ended (higher = drier). DC > 300 indicates severe drought conditions with potential for holdover fires (fires that persist through rain and re-emerge when drying resumes).
- Reflects seasonal and long-term dryness trend.

### Fire Behavior Indices

**ISI (Initial Spread Index):**
- Combines FFMC and wind speed. ISI = f(FFMC) * g(wind).
- Proxy for expected rate of spread, without fuel load consideration.
- Scale: 0 to open-ended. ISI > 10 indicates high spread potential. ISI > 25 is extreme.
- Wind function: exponential -- ISI increases rapidly with wind speed above moderate thresholds.

**BUI (Buildup Index):**
- Combines DMC and DC. BUI = h(DMC, DC).
- Proxy for total fuel available for combustion (both surface and deeper layers).
- Scale: 0 to open-ended. BUI > 60 is high; BUI > 100 is extreme.
- Reflects how much fuel will be consumed once ignited, affecting fire intensity and suppression difficulty.

**FWI (Fire Weather Index):**
- Combines ISI and BUI. FWI = k(ISI, BUI).
- Overall fire intensity metric. Represents expected fire behavior given current weather and fuel dryness.
- Scale: 0 to open-ended. Interpretation is region-dependent:
  - Boreal forest: FWI > 20 is high, > 30 is extreme.
  - Mediterranean shrubland: FWI > 30 is high, > 50 is extreme.
  - Tropical savanna: FWI > 40 is high, > 60 is extreme.
- **Critical note:** FWI thresholds must be interpreted locally. A FWI of 25 in British Columbia boreal forest is extreme; the same value in Portuguese maquis is moderate. The Copernicus EFFIS uses regionally calibrated thresholds.

### FWI System Diagram (information flow)

```
Temperature ─┬─> FFMC ─────> ISI ─┐
RH ───────────┤                     ├──> FWI
Wind ─────────┘                     │
Temperature ──┬─> DMC ──┐          │
RH ────────────┤         ├─> BUI ──┘
Rain ──────────┤         │
               └─> DC ──┘
```

## US National Fire Danger Rating System (NFDRS)

The US system for translating weather into fire danger. Used by all federal fire management agencies (USFS, BLM, NPS, BIA, FWS) and most state agencies. More complex than FWI, with more fuel model inputs.

**Input:** Hourly or daily weather observations from RAWS (temperature, RH, wind, precipitation, cloud cover, solar radiation), plus fuel model selection and greenup/curing state.

### Key Components

**SC (Spread Component):**
- Rate of spread estimate in ft/min for the selected NFDRS fuel model under current conditions.
- Based on Rothermel (1972) spread rate model applied to the fuel model's properties.
- Not directly comparable to FWI ISI because SC uses a specific fuel model while ISI is fuel-independent.

**ERC (Energy Release Component):**
- Available energy per unit area at the fire front (BTU/ft2).
- The most widely used NFDRS component for fire management decisions. Integrates fuel loading, moisture content across all timelag classes, and live fuel moisture.
- **Percentile ranking:** Agencies track ERC relative to historical distribution (typically 1979-present for the station). "97th percentile ERC" means conditions are drier/hotter than 97% of historical days. ERC > 90th percentile often triggers preparedness level increases, additional staffing, and activity restrictions.
- Responds to both weather and seasonal fuel moisture trends. Rises through summer as 100h and 1000h fuels dry.

**BI (Burning Index):**
- Composite of SC and ERC. Represents expected flame length (ft) x 10. A BI of 100 = 10 ft flame length under current conditions.
- Used for setting fire danger adjective classes (Low, Moderate, High, Very High, Extreme) on roadside fire danger signs.

**IC (Ignition Component):**
- Probability that a firebrand (ember or lightning) will ignite a fire and establish sustained spread. Based on 1h fuel moisture and temperature.
- Scale: 0-100 (probability percentage). IC > 60 indicates conditions where most ignition sources will start a fire.

### NFDRS vs. FWI

| Feature | NFDRS | FWI |
|---------|-------|-----|
| Fuel models | 20+ models (NFDRS-2016) | Fuel-independent |
| Input frequency | Hourly (or daily) | Daily noon |
| Live fuel moisture | Explicit (LFMC input) | Not explicit |
| Geographic calibration | Station-based percentiles | Regional thresholds |
| International adoption | US primarily | Global |
| Primary use | Preparedness, staffing | Alerting, research, climatology |
| Computational complexity | Higher (fuel model dependent) | Lower (weather-only input) |

## Red Flag Warnings

**What it is:** NWS warning issued when weather conditions create critical fire weather. Criteria vary by NWS forecast office and region.

**Typical criteria (vary by region):**
- Sustained wind >= 25 mph OR gusts >= 35 mph
- AND relative humidity <= 15%
- AND dry fuels (ERC above threshold or similar indicator)
- Duration: at least 3 hours of combined criteria
- Some offices add temperature thresholds (>= 80F) or lightning criteria.

**Regional variations:**
- **Pacific Northwest:** Wind thresholds lower in east-wind (foehn) events. East winds across the Cascades combine low RH and high wind uniquely. Criteria may trigger at RH <= 20% with sustained wind >= 20 mph during east wind events.
- **Southern California (Santa Ana/Sundowner):** Specific Red Flag criteria for Santa Ana wind events: offshore winds >25 mph with RH <15% and elevated ERC. Some offices issue Fire Weather Watches 24-72h ahead for major Santa Ana events.
- **Great Plains:** Lightning criteria included in spring/summer. Dry lightning with low rainfall (<0.10 inch) is a common trigger.
- **Southeast US:** Criteria focus on low RH, high wind, and recent rainfall deficit. Fuel conditions matter more than in the West because fuels rarely reach extreme dryness.
- **Alaska:** Criteria adapted for boreal fuels. Lightning without significant rain is the primary ignition concern.

**Fire Weather Watch:** Issued 12-72 hours ahead when Red Flag conditions are possible but not certain. Agencies begin pre-positioning resources.

## Haines Index (Lower Atmosphere Stability/Dryness Index)

- Scale: 2 (low) to 6 (high). Computed from temperature and dewpoint depression at 850/700 hPa (or 950/850 hPa for lower elevation variant).
- Stability component: temperature difference between two pressure levels (larger difference = less stable = easier plume development).
- Moisture component: dewpoint depression at the lower level (larger depression = drier = more fire-favorable).
- **Operational use:** Haines 5-6 indicates high potential for large fire growth driven by atmospheric instability and plume dynamics. Included in NWS fire weather forecasts.
- **Limitations:** Binary-like behavior (most of the western US in summer is Haines 5-6 almost every day). Does not account for wind, fuel state, or topography. The Continuous Haines Index (C-Haines) provides more discrimination but is less widely adopted.

## Hot-Dry-Windy Index (HDW)

- Newer index (Srock et al. 2018) designed to capture atmospheric potential for fire behavior better than Haines alone.
- Combines: VPD (vapor pressure deficit), wind speed, and their vertical integral through the surface-to-PBL-top layer.
- **Advantage:** Integrates wind and dryness simultaneously. Better discriminator than Haines for extreme fire behavior events.
- **Adoption:** Growing but not yet standard in NWS products. Used in research and by some fire weather programs.

## Spot Fire Weather Forecasts

- **What:** Localized fire weather forecasts produced by NWS for specific fire incidents or prescribed burns. Requested by fire managers via interagency process.
- **Content:** Point forecast for the fire location: temperature, RH, wind (surface and transport), mixing height, Haines Index, ventilation index, inversion height/strength, precipitation probability.
- **Issued:** On request, updated 1-2x daily during active incidents. Available via weather.gov or direct coordination with NWS fire weather meteorologists.
- **Mixing height and transport wind:** Critical for smoke forecasting. Mixing height defines the volume into which smoke disperses; transport wind determines where smoke travels. Low mixing height + light transport wind = worst-case smoke concentration at ground level.

As of: March 2026
