### Tropical Cyclone Science: Key Concepts

**What this covers:** TC science fundamentals that the model tends to oversimplify, plus active research frontiers relevant to AI prediction. Focuses on areas where precision matters and where AI models have known gaps.

**Rapid Intensification (RI) -- the defining challenge:**
- Standard definition (Atlantic): increase in maximum sustained wind >= 30 kt in 24 hours. Some studies use 25 kt or 35 kt thresholds; always specify which.
- Climatological frequency: ~5-7% of all 24h intensity changes in the Atlantic qualify as RI. But RI accounts for ~50% of the forecast intensity error at 24-48h and is the single biggest contributor to surprise major hurricanes.
- **Environmental prerequisites:** SST >= 26.5C (necessary but insufficient -- need warm water at depth, ocean heat content > 50 kJ/cm2), vertical wind shear < 10 kt (deep-layer, 200-850 hPa), relative humidity > 70% at mid-levels, favorable upper-level outflow pattern.
- **Inner-core triggers:** Even with a perfect environment, RI requires inner-core processes: convective bursts near the radius of maximum wind, vortex Rossby wave propagation, eyewall contraction, and symmetric organization of deep convection. These operate at 1-10 km scales -- invisible to 0.25deg models.
- **Why AI fails at RI:** The environmental predictors are well-represented in ERA5 (SST, shear, humidity). The inner-core triggers are not. AI models trained on ERA5 learn the environmental signal but miss the inner-core switch. Statistical methods (SHIPS-RI) use the same environmental predictors but are explicitly calibrated on observed RI events -- giving them better probabilistic skill.
- **Notable RI events:** Patricia 2015 (Cat 5 from tropical depression in 24h, most extreme RI observed), Michael 2018 (Cat 2 to Cat 5 in 24h near landfall), Otis 2023 (tropical storm to Cat 5 in 12h, essentially unforecast). Otis was a watershed -- no operational model or AI model predicted it.

**Tropical cyclogenesis:**
- Formation requires: warm SST (>= 26.5C), organized deep convection, low vertical shear, sufficient Coriolis (typically > 5 deg latitude), pre-existing vorticity (easterly wave, monsoon trough, ITCZ breakdown).
- **MJO (Madden-Julian Oscillation):** Modulates TC genesis on 30-60 day timescales. Active MJO phases enhance genesis; suppressed phases suppress it. NHC's 7-day tropical weather outlook explicitly references MJO phase.
- Genesis prediction remains difficult beyond 3-5 days. AI models have shown limited skill for genesis timing and location because the vorticity organization that triggers formation is a sub-grid process at 0.25deg.
- **Climate trend:** No significant trend in global TC frequency, but proportion of Category 4-5 storms has increased (~25-30% increase over 1979-2024, consistent across multiple studies). Latitude of peak intensity is shifting poleward in some basins (Nature 2014, confirmed by subsequent analyses).

**Eye wall replacement cycles (EWRCs):**
- Occur in major hurricanes (typically >= Cat 3). Outer wind maximum (secondary eyewall) forms at 40-80 km radius, contracts, and strangles the inner eyewall. Storm temporarily weakens (10-30 kt) during replacement, then may re-intensify once new eyewall is established.
- Duration: typically 12-36 hours. Detection primarily via microwave satellite imagery (85/89 GHz channels see through cirrus canopy) or airborne radar.
- Impact on forecasting: EWRCs cause "surprise" weakening and then re-intensification. Models that cannot resolve them (all AI models at 0.25deg) will forecast smooth intensification where reality oscillates. HAFS at 2km can sometimes represent EWRCs.
- Relevance to wind radii: during EWRC, the storm's wind field expands (outer eyewall is at larger radius). A hurricane may weaken in Vmax but increase in size and destructive potential.

**Storm surge physics (essentials):**
- Surge is primarily driven by: wind stress pushing water onshore (proportional to wind speed squared and fetch -- meaning storm SIZE matters as much as intensity), inverse barometric effect (central pressure -- typically 5-10% of total surge), coastal geometry (shallow continental shelves amplify surge, deep water adjacent to coast reduces it), forward speed of storm.
- Key insight for AI context: a model that accurately predicts track but underestimates storm size (wind radii) will underestimate surge. This is why R34/R50/R64 prediction matters operationally -- it drives surge forecasts.
- Operational surge models: SLOSH (Sea, Lake, and Overland Surges from Hurricanes), P-Surge (probabilistic, driven by NHC track/intensity ensemble), ADCIRC (high-resolution, used for FEMA flood maps). AI weather models do not directly predict surge -- they provide the forcing fields.

**Climate change and TCs (adjacent -- answer with caveats):**
- Consensus (IPCC AR6, 2021 + subsequent papers): global TC frequency may decrease slightly or remain unchanged, but the proportion of intense (Cat 4-5) storms is very likely to increase. Peak rainfall rates increase ~7%/C (Clausius-Clapeyron scaling). Rapid intensification events may become more frequent.
- Attribution: individual storm attribution is possible but nuanced. Tropical SSTs have warmed ~0.5-1C since pre-industrial. Studies on Harvey (2017 rainfall), Florence (2018), Ida (2021) attribute 10-30% of peak rainfall to anthropogenic warming.
- Relevance to AI: models trained on 1980-2020 ERA5 embed a non-stationary climate. As the climate warms, the training distribution becomes less representative of current/future conditions. This is the "training data climate bias" problem flagged in the Earth-2 orientation doc.

**Wind speed conventions (critical for cross-basin comparison):**
| Agency | Basin | Wind averaging period | Conversion (approx) |
|--------|-------|-----------------------|---------------------|
| NHC | Atlantic, East Pacific | 1-minute sustained | Reference |
| JTWC | Western Pacific, S. Pacific, Indian | 1-minute sustained | Same as NHC |
| JMA | Western Pacific | 10-minute sustained | x 1.14 = 1-min |
| BoM | Australia | 10-minute mean gusts | Context-dependent |
| IMD | North Indian Ocean | 3-minute sustained | x 1.08 = 1-min |

These differences mean a "Category 3" typhoon by JMA standards has lower 10-minute winds than a Cat 3 NHC hurricane. Always state the wind averaging convention when comparing across basins.

**Sources:**
- Kaplan & DeMaria (2003): SHIPS-RI baseline
- Cangialosi & Franklin (2024): NHC verification report
- Emanuel (2005): storm surge physics review
- Klotzbach et al. (2024): TC climate trends review
- IBTrACS documentation: ncei.noaa.gov/products/international-best-track-archive

As of: March 2026
