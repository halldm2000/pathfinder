# Storm Surge Models: SLOSH, ADCIRC, SCHISM

Deep-dive reference for the three primary storm surge models used in U.S. coastal flood prediction. Covers architecture, physics, inputs, resolution, operational use, and limitations.

Last verified: March 2026.

## SLOSH (Sea, Lake, and Overland Surges from Hurricanes)

### Architecture
- **Governing equations:** Linearized 2D depth-averaged shallow water equations on a polar (telescoping) grid. Solves continuity and momentum with parameterized wind stress, pressure gradient, Coriolis, and bottom friction.
- **Grid system:** Polar grids centered on coastal features (bays, estuaries, headlands). Each operational basin has a custom grid. Grid cells range from ~100 m near the coast to ~5 km offshore. Not a global domain -- each basin is a separate computation.
- **Wind forcing:** Parametric hurricane wind model (symmetric vortex with asymmetry corrections for forward motion). Does not ingest gridded wind fields from NWP models. Driven by TC track parameters: position, maximum wind, radius of maximum wind, forward speed, heading.
- **Time integration:** Explicit finite difference. Time steps of ~seconds to maintain CFL stability.

### Inputs
- Track parameters: lat/lon, Vmax, RMW, forward speed, heading (from NHC forecast or ensemble perturbations)
- Basin-specific bathymetry/topography (pre-built into each basin grid)
- Tidal phase (optional -- can be superimposed in post-processing)

### Operational Products
- **P-Surge:** Probabilistic SLOSH. Runs ~2000+ synthetic tracks sampling NHC's track/intensity uncertainty envelope. Produces exceedance probability maps (e.g., "20% chance of surge exceeding 6 ft at this location"). Updated every advisory cycle during active storms.
- **MOMs (Maximum of Maximums):** Pre-computed worst-case surge for each Saffir-Simpson category at each coastal location. Used for evacuation planning. Not event-specific.
- **MEOWs (Maximum Envelopes of Water):** Intermediate product between MOMs and real-time forecasts. Maximum surge for all hypothetical storms of a given category, forward speed, and direction. Used for "what if" planning.

### Strengths
- Decades of operational validation and forecaster trust
- Extremely fast execution (seconds per run on modern hardware), enabling large ensembles
- Comprehensive basin library covering entire U.S. coastline plus territories
- P-Surge probabilistic framework directly addresses NHC forecast uncertainty

### Limitations
- No wave coupling (no wave setup or wave runup)
- No precipitation or riverine input -- cannot model compound flooding
- Parametric wind model cannot capture asymmetric wind fields, wind shear effects, or extratropical structures (Sandy's wind field was poorly represented)
- Linear physics miss important nonlinear effects in shallow water
- Grid resolution insufficient for neighborhood-scale inundation mapping
- No baroclinic effects (no temperature/salinity stratification)
- Not open source -- NWS proprietary code

## ADCIRC (Advanced Circulation Model)

### Architecture
- **Governing equations:** 2D (depth-averaged) or 3D shallow water equations solved on unstructured triangular finite element mesh. Uses the Generalized Wave Continuity Equation (GWCE) formulation to suppress spurious 2dx oscillations. Implicit time stepping for the wave equation, explicit for momentum.
- **Mesh:** Unstructured triangular elements. Single continuous mesh from deep ocean through the continental shelf to the floodplain. Mesh resolution varies from 50+ km in the deep ocean to 20-50 m in coastal channels, levees, and critical infrastructure areas.
- **Wave coupling:** Tightly coupled to SWAN (Simulated WAves Nearshore) via the ADCIRC+SWAN framework. SWAN computes wave spectra on the same unstructured mesh; radiation stress gradients from SWAN drive wave setup in ADCIRC. Coupling interval typically 600-1800 seconds.
- **Wind forcing:** Accepts gridded wind fields (e.g., from OWI -- Ocean Weather Inc. -- hindcast winds, or NWP model output). Also accepts parametric vortex models. Gridded winds are preferred for compound events and extratropical storms.
- **Wetting/drying:** Elemental wetting/drying algorithm allows water to advance over land and retreat. Essential for inundation mapping.

### Inputs
- Unstructured mesh (months of effort to build for a new region)
- Bathymetry/topography mapped to mesh nodes (from CoNED, lidar, GEBCO)
- Tidal boundary conditions (from global tidal models, e.g., TPXO, FES2014)
- Wind and pressure fields (gridded or parametric)
- River boundary conditions (discharge time series, if included)
- Manning's n roughness coefficients (spatially varying, derived from land use/land cover)

### Operational Use
- **FEMA coastal flood studies:** ADCIRC+SWAN is the standard model for computing BFEs and VE/AE zone boundaries in FEMA regulatory flood mapping. Used in Risk MAP studies for the Gulf Coast, Southeast, and Northeast U.S.
- **CERA (Coastal Emergency Risks Assessment):** Real-time ADCIRC+SWAN runs during hurricanes, displayed on a web portal. Operated by the LSU CERA team. Provides time-evolving surge and wave fields. Not an official NWS product but used by emergency managers.
- **USACE coastal studies:** Hurricane storm damage risk reduction studies, levee design, navigation channel analysis.
- **Academic research:** Widely used in hundreds of peer-reviewed studies. Largest user community of any coastal ocean model.

### Key Configurations
- **ADCIRC+SWAN:** Standard coupled configuration for hurricane surge + wave studies.
- **PADCIRC:** Parallel ADCIRC using MPI domain decomposition. Runs on HPC clusters. Typical run: 100-500 cores, 2-12 hours for a 5-day hurricane simulation on a high-resolution mesh.
- **ADCIRC v55 / v56:** Current versions. v55 added improved internal tide dissipation, subgrid corrections, and performance improvements.

### Strengths
- Unstructured mesh resolves complex coastlines, barrier islands, inlets, levees
- Wave coupling via SWAN captures wave setup and radiation stress
- Extensive validation library (Katrina, Sandy, Ike, Harvey, many others)
- Open source with large community
- Accepted by FEMA for regulatory mapping

### Limitations
- Computationally expensive (hours on HPC for a single scenario; ensemble requires O(100) runs)
- Mesh generation is labor-intensive and requires expert judgment
- No built-in rainfall-runoff capability -- compound flooding requires external coupling
- 2D mode (most common for surge) does not capture stratification effects
- Time stepping can require small dt for stability in very shallow areas

## SCHISM (Semi-implicit Cross-scale Hydroscience Integrated System Model)

### Architecture
- **Governing equations:** 3D Reynolds-averaged Navier-Stokes with hydrostatic or non-hydrostatic option. Solves on unstructured triangular/quadrilateral horizontal mesh with hybrid vertical coordinates (S-Z, LSC^2). Semi-implicit time integration using an Eulerian-Lagrangian method (ELM).
- **Mesh:** Unstructured mixed-element (triangles and quads). Vertical: flexible hybrid coordinates that combine terrain-following (sigma) near the surface/bottom with z-levels in the interior. Avoids pressure gradient errors in steep topography.
- **Wave coupling:** Coupled to WWM (Wind Wave Model) on the same unstructured grid. Similar role to SWAN in ADCIRC.
- **Semi-implicit numerics:** The key differentiator. Semi-implicit time stepping removes the CFL constraint on barotropic gravity waves, allowing time steps 10-100x larger than explicit models at the same resolution. Result: SCHISM often runs faster than ADCIRC for comparable mesh resolution.
- **3D baroclinic:** Full temperature-salinity dynamics. Can simulate estuarine circulation, density-driven flows, and freshwater-saltwater interaction -- important for compound flooding where river plumes interact with surge.

### Inputs
Similar to ADCIRC: unstructured mesh, bathymetry/topography, tidal boundaries, wind/pressure fields, river discharge. Additionally accepts temperature/salinity initial conditions and boundary conditions for baroclinic runs.

### Operational Use
- **STOFS (Surge and Tide Operational Forecast System):** NOAA OCS operational nowcast/forecast system. STOFS-2D-Atlantic and STOFS-3D-Atlantic use SCHISM to provide real-time water level forecasts along the U.S. East and Gulf Coasts. Runs daily on NOAA HPC.
- **Compound flood research:** Growing use in academic compound flooding studies, particularly where rainfall-runoff coupling is needed. SCHISM's 3D baroclinic capability handles freshwater-saltwater interaction that 2D models miss.
- **Global applications:** Used in Japan, Taiwan, Europe for typhoon and extratropical surge.

### Key Configurations
- **STOFS-2D-Atlantic:** Operational 2D barotropic configuration. 100+ m coastal resolution, tidal + surge forecasting.
- **STOFS-3D-Atlantic:** 3D baroclinic configuration. Includes temperature, salinity, river inputs. Experimental as of 2025-2026.

### Strengths
- Semi-implicit numerics enable large time steps (efficiency advantage)
- 3D baroclinic capability for estuarine and compound flooding
- Flexible mixed-element mesh
- Active development by NOAA for operational compound flooding
- Good cross-scale capability (ocean to estuary to floodplain)

### Limitations
- Smaller user community than ADCIRC
- Fewer published surge validation studies (though STOFS is expanding this)
- Less history as a FEMA regulatory model
- 3D runs are still computationally demanding (though less so than explicit-scheme alternatives)
- Mesh generation complexity similar to ADCIRC

## Model Selection Guide

| Application | Recommended Model | Why |
|---|---|---|
| Real-time NWS surge warnings | SLOSH / P-Surge | Speed, institutional integration, forecaster familiarity |
| FEMA regulatory flood mapping | ADCIRC+SWAN | FEMA acceptance, wave coupling, extensive validation |
| Compound flooding research | SCHISM | 3D baroclinic, semi-implicit efficiency, STOFS path |
| Evacuation planning (pre-computed) | SLOSH MOMs/MEOWs | Pre-computed lookup, no HPC needed |
| Real-time research guidance | ADCIRC+SWAN (CERA) | Community tool, high resolution, real-time display |
| Estuarine surge + salinity | SCHISM | 3D baroclinic handles stratification |
| Rapid ensemble generation | SLOSH (or future AI surrogates) | Speed per member |
| Coastal engineering design | ADCIRC+SWAN or SCHISM | High resolution, wave coupling, design-storm scenarios |
