# Compound Flooding: Surge, Precipitation, and River Interaction

Deep-dive reference for compound coastal flooding -- when multiple flood drivers coincide or interact to produce water levels exceeding any single driver alone. Covers interaction physics, joint probability methods, and case studies.

Last verified: March 2026.

## Compound Flooding Definition

Compound flooding occurs when two or more flood drivers (storm surge, astronomical tide, precipitation, river discharge, wave action, sea level rise) co-occur or sequentially interact, producing total water levels or inundation that single-mechanism analysis would underestimate. The defining characteristic is that the drivers are not statistically independent -- they share a common atmospheric forcing (e.g., a hurricane produces both surge and rainfall simultaneously).

**Why it matters:** Traditional coastal flood assessment often treats surge and rainfall independently. The NWS runs SLOSH for surge and NWM (National Water Model) for riverine flooding on separate systems with no coupling. This separation can underestimate flood extent by 30-50% in compound events.

## Interaction Physics

### Surge-Tide Interaction
- **Well-understood, routinely combined.** Surge superimposed on astronomical tide. Total water level = surge + tide + mean sea level.
- **Nonlinear interaction:** In shallow estuaries and tidal rivers, surge and tide do not simply add. Surge arriving at high tide encounters different depth and friction than surge arriving at low tide. Nonlinear shallow water effects can amplify or dampen the combination by 10-20%.
- **Sandy (2012) example:** Landfall near astronomical high tide added ~0.5 m to the total water level at The Battery, NYC. If landfall had been 6 hours earlier or later, peak water level would have been ~0.5 m lower.

### Surge-Rainfall Interaction
- **Poorly coupled in operational systems.** This is the critical gap.
- **Physical mechanism:** Storm surge creates a "dam" at the coast, impeding gravity-driven drainage of rainfall runoff. Rivers and bayous that normally drain to the coast cannot discharge when coastal water levels are elevated. Result: rainfall flooding is amplified inland, and surge flooding is amplified in estuaries receiving swollen rivers.
- **Backwater effect:** In tidal rivers (e.g., Houston Ship Channel, Delaware River), elevated coastal water levels propagate upstream as a backwater, raising river stages tens of kilometers inland beyond the direct surge zone.
- **Timing matters:** If peak rainfall precedes surge by 12-24 hours, rivers are already swollen when surge arrives, amplifying the compound effect. If surge arrives first, drainage capacity is reduced before rain arrives.

### Surge-Wave Interaction
- **Partially coupled in ADCIRC+SWAN and SCHISM+WWM.**
- **Wave setup:** Onshore-directed radiation stress from breaking waves raises mean water level by 0.3-1.5 m at the shoreline, depending on wave height and beach slope. This is a significant addition to stillwater surge.
- **Wave runup:** Individual waves ride up the beach above the mean water level. 2% exceedance runup can add 1-5 m of temporary elevation, driving damage to structures above the BFE.
- **FEMA methodology:** BFE in VE zones includes wave effects (typically 3 ft of wave crest above stillwater BFE). ADCIRC+SWAN provides the stillwater + wave setup; wave runup is computed separately using empirical methods (e.g., FEMA WHAFIS, TAW formula).

### River-Tide-Surge Triple Interaction
- **Most complex and least modeled.** Requires coupling a coastal hydrodynamic model (ADCIRC/SCHISM) with a hydrologic/hydraulic model (HEC-RAS, NWM) at the river-coast interface.
- **Physics:** In tidally influenced rivers, the daily tidal range modulates river stage. When surge is added, the effective tidal prism changes. When river discharge is elevated from rainfall, the interaction becomes nonlinear because increased freshwater flow changes the estuary's salinity structure and friction characteristics.
- **Delaware River example:** A nor'easter can simultaneously produce coastal surge at the mouth of Delaware Bay and heavy rainfall in the watershed. The surge propagates ~200 km upstream to Philadelphia, while river flood waves propagate downstream. They meet in the middle, amplifying flooding in the tidal river reach.

### Sea Level Rise + Extreme Events
- **First-order effect:** Higher baseline mean sea level means every surge event starts from a higher base. A 2 m surge on top of 0.5 m SLR produces the same water level as a 2.5 m surge today.
- **Second-order (nonlinear) effects:** In shallow estuaries, higher mean sea level changes tidal dynamics, potentially increasing tidal range and altering surge propagation. Some estuaries become more flood-prone due to resonance changes.
- **Practical implication:** The return period of current 100-year water levels decreases dramatically with SLR. NOAA projections show current 100-year water levels becoming 10-year events at many U.S. coastal stations by 2050-2070.

## Joint Probability Methods

### Joint Probability Method (JPM)
- **Standard approach for FEMA coastal flood studies.** Samples the joint probability space of TC parameters (track, intensity, size, speed, angle) and tidal phase. Runs ADCIRC+SWAN for each combination. Integrates over the joint probability distribution to produce annual exceedance probability curves at each mesh node.
- **Typical sample:** 150-600 synthetic storms x 3-5 tidal phases = 450-3000 ADCIRC runs per study.
- **Limitation:** Only considers TC forcing. Does not include rainfall as a joint variable.

### JPM with Optimal Sampling (JPM-OS)
- **Efficiency improvement.** Uses response surface approximation to reduce the number of required ADCIRC runs. Fits a regression surface to a smaller set of model runs and interpolates. Reduces computational cost by 50-80%.
- **Limitation:** Same TC-only forcing assumption as standard JPM.

### Copula-Based Methods
- **Emerging approach for compound flooding.** Copulas model the statistical dependence between surge and rainfall (or surge and river discharge) without assuming independence or a specific joint distribution.
- **Example:** Fit marginal distributions to surge and rainfall separately, then use a copula (e.g., Clayton, Gumbel, or Frank) to model their joint dependence structure. The copula captures the fact that extreme surge and extreme rainfall tend to co-occur during hurricanes.
- **Status:** Research tool. Used in published studies for Houston (Nithyanand et al.), Delaware River (Torres et al.), and New York (Wahl et al.). Not yet incorporated into FEMA regulatory methodology.

### Bayesian Networks
- **Flexible framework for modeling compound flood driver dependencies.** Can incorporate multiple drivers (surge, rainfall, tide, river, SLR) and their conditional dependencies in a single probabilistic model.
- **Status:** Research stage. Promising for decision support but requires extensive data and careful structure learning.

## Case Studies

### Hurricane Harvey (2017) -- Compound Flooding Archetype
- **Surge:** Moderate. ~3 m at Rockport, TX (landfall location). ~1 m along the Houston Ship Channel.
- **Rainfall:** Unprecedented. >1525 mm (60 inches) in 5 days over parts of Harris County. Wettest tropical cyclone in U.S. history.
- **Compound mechanism:** Coastal surge elevated Houston Ship Channel and Galveston Bay water levels by ~1 m, reducing drainage capacity of Buffalo Bayou, Brays Bayou, and other Houston waterways. Simultaneously, extreme rainfall overwhelmed drainage infrastructure. The backwater from coastal water levels extended ~50 km inland.
- **Single-mechanism failure:** Surge-only models would have predicted minor coastal flooding. Rainfall-only models (without elevated downstream boundary) would have underestimated inland flooding by 20-30%. Only a coupled analysis captures the actual flood extent.
- **Damage:** $125 billion (2017 USD), the costliest natural disaster in Texas history. 68 direct deaths, primarily from freshwater drowning, not surge.
- **Lesson:** Harvey demonstrated that compound flooding is not an academic concern but a first-order hazard. Catalyzed major research investment in coupled surge-rainfall modeling.

### Hurricane Sandy (2012) -- Timing Amplification
- **Surge:** ~2.7 m above MHHW at The Battery, NYC. Record water level for New York Harbor.
- **Timing:** Landfall occurred near astronomical high tide (spring tide). This added ~0.5 m to the peak water level. If the storm had arrived 6 hours earlier (low tide), peak water level would have been ~2.2 m above MHHW.
- **Compound aspect:** Sandy was also accompanied by heavy rainfall (100-200 mm over the New York metro area), contributing to urban flooding in low-lying areas where drainage was blocked by surge.
- **Extratropical structure:** Sandy had completed extratropical transition before landfall, producing an enormous wind field (R34 > 400 nmi) that SLOSH's parametric TC wind model poorly represented. This led to initial underestimation of surge extent.
- **Damage:** $65 billion (2012 USD). 72 direct deaths in the U.S.
- **Lesson:** Surge-tide timing can shift an event from damaging to catastrophic. Extratropical structure challenges parametric surge models.

### Hurricane Katrina (2005) -- Pure Surge Extreme
- **Surge:** 8.5 m (28 ft) at Pass Christian, MS. Maximum observed U.S. storm surge.
- **Driver:** Enormous storm size (R34 > 200 nmi) combined with Cat 3 intensity at MS landfall and wide, shallow Mississippi Sound bathymetry. Earlier Cat 5 intensity offshore generated large waves that contributed wave setup of ~1-2 m.
- **Compound aspect:** Katrina also produced significant rainfall (200-300 mm), but the pure surge was so dominant that compound effects were secondary at the coastline. In New Orleans, the compound effect mattered: surge overtopped/breached levees while rainfall accumulated behind them.
- **Lesson:** Catastrophic surge can overwhelm all other drivers. But even in surge-dominated events, compound effects matter behind protective infrastructure.

### 2016 Louisiana Floods -- Non-TC Compound Flooding
- **Not a hurricane.** A slow-moving mesoscale convective system produced 500-760 mm of rainfall over 48 hours in the Baton Rouge area (August 2016).
- **Compound mechanism:** Extreme rainfall coincided with elevated tides and onshore flow in rivers draining to the Gulf. Backwater from elevated river stages propagated upstream. 13 people killed, 146,000 homes damaged.
- **Lesson:** Compound flooding is not exclusively a hurricane problem. Non-TC events (atmospheric rivers, stalled fronts, intense convection) can produce catastrophic compound flooding, especially in low-lying coastal watersheds.

## Modeling Approaches for Compound Flooding

### Loosely Coupled Models
- Run hydrologic (HEC-RAS, NWM) and coastal (ADCIRC/SCHISM) models separately, exchange boundary conditions at river-coast interface.
- **Limitation:** One-way coupling misses feedback (e.g., surge affecting upstream river stages while river flow affects surge penetration).
- **Status:** Most common current approach for compound flood studies.

### Tightly Coupled Models
- Single model domain spanning ocean through estuary to upland watershed. SCHISM's 3D baroclinic capability and flexible mesh make it a candidate. ADCIRC can include river boundaries but lacks rainfall-runoff physics.
- **Coupling ADCIRC/SCHISM with NWM:** Active NOAA research. Goal: operational compound flood forecasting system that replaces separate surge and river flood forecasts.
- **Status:** Research demonstrations exist (e.g., coupled ADCIRC+NWM for Harvey). No operational deployment as of March 2026.

### AI/ML Surrogates for Compound Flooding
- Train ML models on coupled ADCIRC+rainfall simulations to produce rapid compound flood estimates.
- **Advantage:** Could enable real-time ensemble compound flood forecasting (too expensive with physics models alone).
- **Status:** Early research. Publications from Notre Dame, UT Austin, and NOAA GFDL. Not operational.

## Key Gaps (as of March 2026)

1. **No operational joint surge-rainfall forecast system.** NWS runs SLOSH and NWM independently.
2. **FEMA flood studies do not include rainfall.** BFEs reflect surge + waves + tide but not concurrent precipitation.
3. **Copula-based joint probability methods are research-only.** Not incorporated into regulatory standards.
4. **Compound flooding in non-TC events is understudied** relative to hurricane compound flooding.
5. **Climate change effects on compound flooding** (e.g., will future hurricanes produce more rain relative to surge?) remain poorly constrained.
