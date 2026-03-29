### Earth2Studio

**What it is:** Open-source Python inference framework for AI weather/climate workflows. Largest collection of pre-trained AI weather/climate models (30+). Provides a unified API for running deterministic, ensemble, and diagnostic inference across all Earth-2 models and many third-party models. Apache 2.0 license.

**Key details:**
- Version: v0.13.0 (March 2026)
- Install: `pip install earth2studio` (or `pip install earth2studio[aifs] --no-build-isolation` for AIFS extras)
- Python: 3.11–3.13 (Python 3.10 dropped in v0.10.0). GPU compute >=8.9, >=40GB VRAM.
- Requires: `nvidia-physicsnemo>=2.0`
- GitHub: github.com/NVIDIA/earth2studio
- Docs: nvidia.github.io/earth2studio/
- Cache env vars: `EARTH2STUDIO_CACHE`, `EARTH2STUDIO_MODEL_CACHE`, `EARTH2STUDIO_DATA_CACHE`

**Core API pattern (load model → data source → IO backend → run function):**
```python
from earth2studio.models.px import FCN3
from earth2studio.data import GFS
from earth2studio.io import ZarrBackend
from earth2studio.run import deterministic as run

model = FCN3.load_model(FCN3.load_default_package())
data = GFS()
io = ZarrBackend("outputs/forecast.zarr")
io = run(["2025-01-01T00:00:00"], 10, model, data, io)
```

**Ensemble example:**
```python
from earth2studio.models.px import FCN3
from earth2studio.data import GFS
from earth2studio.io import ZarrBackend
from earth2studio.run import ensemble as run
from earth2studio.perturbation import SphericalGaussian

model = FCN3.load_model(FCN3.load_default_package())
data = GFS()
io = ZarrBackend("outputs/ensemble_forecast.zarr")
perturbation = SphericalGaussian(noise_amplitude=0.05)
io = run(["2025-01-01T00:00:00"], 10, 16, model, data, io, perturbation)
# nensemble=16 generates 16 ensemble members
```

**Three run functions:**
- `deterministic(time, nsteps, prognostic, data, io)` — single forecast trajectory
- `ensemble(time, nsteps, nensemble, prognostic, data, io, perturbation)` — multi-member ensemble. Requires a Perturbation object (SphericalGaussian, BredVector, LaggedEnsemble, etc.)
- `diagnostic(time, nsteps, prognostic, diagnostic, data, io)` — couples a prognostic model with a diagnostic model (precipitation, TC tracking, solar radiation, wind gusts)

**Prognostic models (`earth2studio.models.px`):** Atlas, FCN3, SFNO, GraphCastOperational, GraphCastSmall, Pangu (3h/6h/24h), Aurora, FuXi, AIFS, AIFS Ensemble, StormCast, DLESyM, ACE2ERA5, and others.

**Diagnostic models (`earth2studio.models.dx`):** PrecipitationAFNO, SolarRadiationAFNO1H, WindgustAFNO, TCTrackerVitart, CBottleInfill, CBottleSR, CorrDiff, CorrDiffTaiwan.

**Data sources:** GFS, GFS_FX, HRRR, HRRR_FX, ARCO (ERA5), CDS, IFS, IFS_FX, IFS_ENS_FX, AIFS_FX, AIFS_ENS_FX, NCAR_ERA5, WeatherBench2, MRMS, Planetary Computer, NOAA UFS observation sources, and more.

**IO backends:** ZarrBackend, AsyncZarrBackend, NetCDF4Backend, XarrayBackend, KVBackend.

**API server (early access Jan 2026):** Lepton-based REST API server for serving inference workflows as SaaS. xarray-compatible data formats.

**Breaking changes in v0.13.0:**
- ISD `tolerance` renamed to `time_tolerance`
- GraphCast latitude order changed to [90, -90] (was [-90, 90])
- Removed `device` parameter from cBottle SR `load_model`
- Requires `nvidia-physicsnemo>=2.0`

**Recent version history:**
- v0.12.0: Switched cfgrib → pygrib for GRIB reading
- v0.11.0: Split ECMWF IFS/AIFS into separate analysis/forecast classes
- v0.10.0: Dropped Python 3.10
- v0.7.0: Data sources refactored to async; WeatherBench2 migrated to Zarr 3.0

**Relationship to other entities:** Inference layer for all Earth-2 models. Depends on PhysicsNeMo (>=2.0) for model architectures. Replaces deprecated earth2mip. Used by DTN (AWS), insurance (AXA, JBA, LSEG), sovereign weather. PhysicsNeMo is for training; Earth2Studio is for inference.

**Known issues / limitations:**
- Requires >=40GB VRAM (A100/H100 class). Not suitable for consumer GPUs.
- Breaking changes between minor versions — always check release notes
- Data assimilation API (`earth2studio.models.da`) is beta, requires CuPy/cuDF
- earth2mip is INACTIVE — fully replaced by Earth2Studio

**Sources:**
- GitHub: github.com/NVIDIA/earth2studio
- Docs: nvidia.github.io/earth2studio/
- Examples: nvidia.github.io/earth2studio/examples/

As of: March 2026
