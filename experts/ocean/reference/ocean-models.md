# Ocean Models: Coupled Systems and AI Approaches

Deep reference for ocean modeling in NWP, climate, and emerging AI frameworks.

## Ocean General Circulation Models (OGCMs)

### MOM6 (Modular Ocean Model, Version 6)
- **Developer:** NOAA GFDL.
- **Architecture:** Arbitrary Lagrangian-Eulerian (ALE) vertical coordinate -- dynamically switches between z-star, isopycnal, and sigma as needed. Major advance over fixed-coordinate models.
- **Usage:** GFDL CM4/ESM4, UFS (Unified Forecast System for US operational NWP), OM4 (ocean-ice model). Being adopted by CESM3 (replacing POP).
- **Resolution:** Typical: 0.25 deg (eddy-permitting) to 1 deg (climate). OM4 has a 0.25 deg configuration with tripolar grid.
- **Key strengths:** Modern code (Fortran 2003+), ALE coordinates, strong community, FMS infrastructure, active development on GitHub.
- **Key limitations:** Computational cost at eddy-resolving resolution (<1/12 deg). Parameterized mesoscale eddies at 0.25-1 deg.

### NEMO (Nucleus for European Modelling of the Ocean)
- **Developer:** European consortium (CNRS, Met Office, CMCC, Mercator Ocean, others).
- **Architecture:** z-coordinate with partial steps (standard), s-coordinates available. XIOS I/O server for performance.
- **Usage:** ECMWF SEAS5/ORAS5 (coupled seasonal forecasting), Met Office GC5/UKESM, Mercator Ocean GLORYS12, CMIP6 models (HadGEM3, IPSL-CM6, CNRM-CM6).
- **Resolution:** 1/12 deg for GLORYS12 (eddy-resolving). 0.25 deg typical for coupled climate. 1 deg for CMIP.
- **Key strengths:** Huge user base, extensive validation, flexible configuration, strong European support.
- **Versions:** NEMO 3.6 (widely deployed in CMIP6 era). NEMO 4.0/4.2 current. NEMO 5.0 in development.

### HYCOM (HYbrid Coordinate Ocean Model)
- **Developer:** Naval Research Lab / HYCOM consortium.
- **Architecture:** Hybrid vertical coordinates -- isopycnal in the open ocean (efficient for stratified flow), z-level in mixed layer and shallow water, sigma near coast. Smooth transitions between regimes.
- **Usage:** US Navy GOFS 3.1 (Global Ocean Forecast System, 1/12 deg operational). NOAA RTOFS (Real-Time Ocean Forecast System). HAFS hurricane model ocean component.
- **Key strengths:** Isopycnal coordinates minimize spurious mixing in stratified deep ocean. Operational track record. 1/12 deg global running operationally.
- **Key limitations:** Complex coordinate transitions. Code base less modern than MOM6.

### POP (Parallel Ocean Program)
- **Developer:** NCAR / Los Alamos.
- **Architecture:** z-level with free surface. Dipole grid (avoids polar singularity).
- **Usage:** CESM1 and CESM2. Being replaced by MOM6 in CESM3.
- **Resolution:** 1 deg standard for CESM2 CMIP6. 0.1 deg high-resolution configuration exists.
- **Status:** Maintenance mode. New development focused on MOM6 transition.

## Coupling in Weather and Climate Models

### Why Ocean Coupling Matters
- **Medium-range (5-15d):** SST evolution affects tropical convection, MJO propagation, and boundary layer stability. Coupled models show improved tropical precipitation skill.
- **S2S (2 weeks - 2 months):** Ocean state is the primary predictability source. ENSO phase, SST persistence, and ocean memory dominate.
- **Seasonal (3-6 months):** Ocean initial conditions (especially equatorial Pacific subsurface) determine seasonal forecast skill.
- **Climate (decades+):** Ocean heat uptake, AMOC variability, and ocean carbon cycle are essential.

### Coupling Frequency
- **Hourly coupling:** Typical for NWP (IFS-NEMO at ECMWF, UFS GFS-MOM6). Resolves diurnal cycle of SST and air-sea fluxes.
- **Daily coupling:** Common in climate models. Misses diurnal SST variability (can be 1-3C in light-wind tropical regions).
- **No coupling (prescribed SST):** Atmosphere-only models (AMIP-style). Adequate for short-range weather but inappropriate for S2S+.

### Operational Coupled Systems (as of March 2026)

| Center | System | Atmosphere | Ocean | Coupling |
|--------|--------|-----------|-------|----------|
| ECMWF | IFS Cycle 49r1 | IFS (9km) | NEMO (0.25 deg) | Hourly |
| NOAA | UFS/GFSv17 | GFS (13km) | MOM6 (0.25 deg) | Hourly |
| ECMWF | SEAS5 | IFS (~36km) | NEMO (0.25 deg) | Hourly |
| NOAA | CFSv2 | GFS (~100km) | MOM4 (0.25 deg) | Hourly |
| Met Office | GC5 | UM (~10km) | NEMO (0.25 deg) | Hourly |
| US Navy | ESPC | NAVGEM | HYCOM (1/12 deg) | Hourly |

## AI Ocean Models

### DLESyM (NVIDIA)
- **Architecture:** Coupled atmosphere-ocean-sea-ice AI model. Atmosphere: spherical Fourier neural operator. Ocean: separate neural operator trained on ORAS5 reanalysis.
- **Key achievement:** 1000+ simulated years of stable coupled simulation. First AI model to demonstrate long-term coupled stability without drift or divergence.
- **DLESyM-Distill (Dec 2025):** S2S variant that makes 4-week forecast jumps. Trained on synthetic data from DLESyM, then fine-tuned on reanalysis. Targets the S2S prediction gap.
- **Ocean representation:** Predicts SST, sea ice concentration, and selected subsurface variables. Does not represent full 3D ocean circulation.
- **Significance:** Proves AI can maintain coupled ocean-atmosphere energy balance over long integrations -- a key concern for AI climate modeling.

### SamudrACE (Allen AI, Sep 2025)
- **Architecture:** Extension of ACE2 (Atmospheric Climate Emulator). Adds an ocean component trained on GLORYS12 reanalysis. Coupled through SST and surface fluxes.
- **Training:** Atmosphere on ERA5, ocean on GLORYS12. Fully differentiable coupling.
- **Key result:** Multi-year stable coupled simulations. Demonstrates emergent ENSO-like variability without explicit ENSO dynamics -- the coupled system produces tropical Pacific oscillations from learned physics.
- **Limitations:** Ocean component is relatively coarse. Does not resolve mesoscale eddies. Limited validation against observed ENSO properties (period, amplitude, teleconnections).

### Mercator Ocean AI Augmentation
- **Approach:** Neural network parameterizations embedded within NEMO. Targets subgrid-scale mixing and mesoscale eddy effects that are poorly parameterized in current schemes.
- **Status:** Research phase. Part of Copernicus Marine Service roadmap.
- **Philosophy:** Augment physics-based models rather than replace them. Preserves conservation properties and physical constraints while improving parameterized processes.

### Other AI Ocean Work
- **FourCastNet ocean variables:** The FourCastNet family (including FCN3) predicts some surface ocean variables (SST, surface currents) as part of the atmospheric state, but without ocean dynamics. This is atmospheric prediction of ocean skin temperature, not ocean modeling.
- **Graph neural networks for ocean:** Multiple research groups exploring GNNs on unstructured ocean meshes. Potential for variable-resolution ocean AI models.
- **Physics-informed neural networks (PINNs) for ocean:** Applied to localized problems (estuary dynamics, internal wave prediction) but not yet competitive for basin-scale ocean modeling.

## Resolution Regimes in Ocean Modeling

| Regime | Resolution | Eddies | Usage | Examples |
|--------|-----------|--------|-------|----------|
| Coarse | 1 deg (~100km) | Fully parameterized | CMIP, century-scale | CESM2, most ESMs |
| Eddy-permitting | 0.25 deg (~25km) | Partially resolved | Seasonal forecasting, operational | SEAS5, UFS, ORAS5 |
| Eddy-resolving | 1/12 deg (~8km) | Mostly resolved | Ocean reanalysis, navy ops | GLORYS12, GOFS 3.1 |
| Submesoscale | 1/48 deg (~2km) | Resolved + submesoscale | Research only | LLC4320 (NASA) |

### Why Resolution Matters
- Mesoscale eddies (50-200km) carry ~50% of poleward ocean heat transport. Parameterizing them introduces systematic biases.
- Western boundary current separation (e.g., Gulf Stream detachment from Cape Hatteras) improves dramatically at 1/12 deg vs 0.25 deg.
- ENSO simulation fidelity improves at eddy-permitting resolution because tropical instability waves (which affect equatorial SST) are partially resolved.
- Computational cost scales as ~resolution^3 (2D grid refinement + required shorter time step). Going from 1 deg to 1/12 deg is ~1700x more expensive.
