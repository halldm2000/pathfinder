# Worldscope + Earth-2 Integration Design

Design for integrating NVIDIA Earth-2 AI weather models into the Worldscope CesiumJS globe application.

Last updated: 2026-03-29

## Architecture Overview

Worldscope is a browser app; Earth-2 models require A100/H100-class GPUs and Python. The integration is a three-layer client-server architecture with a data format translation layer bridging scientific outputs (Zarr/NetCDF) to web map formats (raster tiles, JSON).

```
┌─────────────────────────────────────────────────────────┐
│  Worldscope (Browser)                                   │
│  CesiumJS globe + weather overlays + time slider        │
│  Consumes: TMS raster tiles, JSON point queries         │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼──────────────────────────────────┐
│  Tile / Data Service (CPU or GPU box)                   │
│  FastAPI + xarray + colormapping                        │
│  Reads: Zarr store    Serves: PNG tiles, JSON values    │
└──────────────────────┬──────────────────────────────────┘
                       │ Local filesystem or object store
┌──────────────────────▼──────────────────────────────────┐
│  Inference Service (DGX Spark or similar, ≥40GB VRAM)   │
│  Earth2Studio: model load → data source → run → Zarr   │
│  Triggered: cron (every 6h) or on-demand via REST       │
└─────────────────────────────────────────────────────────┘
```

## Layer 1: Inference Service

Runs Earth2Studio on GPU hardware. Produces forecast outputs in Zarr format.

**Core workflow:**
```python
from earth2studio.models.px import Atlas
from earth2studio.data import GFS
from earth2studio.io import ZarrBackend
from earth2studio.run import deterministic as run

model = Atlas.load_model(Atlas.load_default_package())
data = GFS()
io = ZarrBackend("forecasts/latest.zarr")
io = run(["2026-03-29T00:00:00"], nsteps=40, model=model, data=data, io=io)
```

**Trigger options:**
- **Scheduled (recommended start):** Cron job every 6 hours, aligned to GFS initialization cycles (00Z, 06Z, 12Z, 18Z). Each run produces a new forecast.
- **On-demand:** REST endpoint that accepts init time, model choice, and forecast length. More complex; defer to Phase 2.

**Earth2Studio API server:** The Lepton-based REST API server (early access Jan 2026) wraps inference behind REST endpoints with xarray-compatible data formats. This is the cleanest path if it meets stability requirements. Alternative: a thin FastAPI wrapper around the run functions.

**Hardware:** DGX Spark or equivalent with ≥40GB VRAM. Keeps inference off the development MacBook. Aligns with existing plans for running scheduled tasks on secondary machines.

## Layer 2: Tile / Data Service

The critical translation layer. Reads Earth2Studio's Zarr output and serves it in formats CesiumJS can consume.

**Endpoints:**

| Endpoint | Purpose | Format |
|----------|---------|--------|
| `GET /tiles/{variable}/{time}/{z}/{x}/{y}.png` | Raster map tiles | PNG with applied colormap |
| `GET /point/{variable}?lat=X&lon=Y&time=T` | Point value query | JSON `{value, unit, model, init_time}` |
| `GET /metadata` | Available forecasts/variables | JSON catalog |
| `GET /timeseries/{variable}?lat=X&lon=Y` | Full time series at a point | JSON array |

**Variables to serve (priority order):**

1. `t2m` — 2-meter temperature
2. `u10m`, `v10m` — 10-meter wind components (render as speed + direction)
3. `msl` — Mean sea level pressure
4. `tp` — Total precipitation (requires diagnostic run with PrecipitationAFNO)
5. `z500` — 500hPa geopotential height (synoptic analysis)
6. `t850` — 850hPa temperature (frontal analysis)

**Tile rendering pipeline:**
```
Zarr store → xarray.open_zarr()
           → select variable, time step, pressure level
           → resample to tile bounds (lat/lon → Web Mercator)
           → apply colormap (matplotlib/datashader)
           → encode as PNG
           → cache (filesystem or Redis)
```

**Colormap conventions:** Follow meteorological standards — temperature: blue-white-red diverging; wind speed: sequential (viridis or similar); precipitation: sequential (white-green-yellow-red); pressure: sequential with contour overlay.

**Caching:** Forecast data is immutable once produced. Cache tiles aggressively — invalidate only when a new forecast run completes.

**Technology:** FastAPI + xarray + matplotlib (or datashader for performance). Could also use `rio-tiler` or `titiler` if Zarr can be read via rasterio/GDAL, though xarray-native is more natural for Earth2Studio outputs.

## Layer 3: Worldscope Frontend

Extensions to the Worldscope CesiumJS application.

### Weather Imagery Provider

CesiumJS `UrlTemplateImageryProvider` pointed at the tile service:

```typescript
const weatherLayer = new Cesium.UrlTemplateImageryProvider({
  url: `${TILE_SERVICE_URL}/tiles/t2m/{time}/{z}/{x}/{y}.png`,
  minimumLevel: 0,
  maximumLevel: 8,  // weather data doesn't need street-level zoom
  credit: 'NVIDIA Earth-2 / Atlas'
});
viewer.imageryLayers.addImageryProvider(weatherLayer);
```

The `{time}` template parameter needs custom handling — either substituted client-side based on the time slider position, or handled by swapping imagery providers per time step.

### Time Slider

Weather forecasts have a time dimension (e.g., 40 steps × 6 hours = 10 days). The UI needs:

- A scrubber bar spanning the forecast period
- Play/pause animation through time steps
- Current time display (UTC and local)
- Integration with CesiumJS Clock/Timeline (which already supports time-dynamic data via CZML)

### Layer Controls

- Toggle weather variables on/off
- Opacity slider per layer
- Colormap legend (dynamically generated based on active variable and data range)
- Model selector (when multiple models are available)

### Point Query

Click on the globe → hit the point query endpoint → display a popup with:
- Forecast value at that location and time
- Mini time series chart (sparkline) for the forecast period
- Model and initialization time metadata

## Phased Rollout

### Phase 1 — Prove the Pipeline (MVP)

**Goal:** AI weather data visible on the Worldscope globe, end to end.

- Run a single Atlas deterministic forecast on DGX Spark → Zarr
- Stand up a minimal tile service (FastAPI + xarray) serving 2m temperature tiles
- Add one `UrlTemplateImageryProvider` in Worldscope
- Basic time slider (forward/back buttons, no animation)
- No authentication, no caching, single variable

**Success criteria:** Open Worldscope, see AI-generated temperature field on the globe, step through forecast times.

### Phase 2 — Make It Useful

**Goal:** A practical weather visualization tool.

- Add wind, MSLP, precipitation (precipitation requires `diagnostic()` with PrecipitationAFNO)
- Layer controls and opacity
- Point-click data queries with value display
- Animated time playback
- Tile caching for performance
- Scheduled auto-refresh: cron triggers new forecast every 6h on new GFS init
- Colormap legends

### Phase 3 — Leverage the Model Family

**Goal:** Exploit Earth-2's unique multi-model capabilities.

- **StormScope integration:** Convective-scale nowcasting (0-12h) as a high-resolution overlay when zoomed into CONUS. Natural fit with existing hurricane tracking extension.
- **CorrDiff downscaling:** When user zooms below the global model's native resolution, trigger CorrDiff to generate 2km downscaled fields for the visible region. Progressive detail — like map tiles, but for weather.
- **Ensemble visualization:** Run Atlas-CRPS or FCN3 with BredVector/BVMC ensembles. Visualize as:
  - Probability of exceedance maps (e.g., P(precip > 25mm))
  - Ensemble spread shading (confidence bands)
  - Spaghetti plots for tropical cyclone tracks
- **cBottle climate scenarios:** Toggle between SSP emission pathways to show projected climate states. Longer-term, less operational, but compelling for demos.
- **HealDA-initialized forecasts:** Once HealDA is publicly released (expected later 2026), run forecasts from ML-assimilated initial conditions rather than GFS — a fully AI pipeline from observations to forecast to visualization.

## Key Technical Decisions

| Decision | Recommendation | Rationale |
|----------|---------------|-----------|
| Tile format | Pre-rendered colormapped PNG | Simplest CesiumJS integration. WebGL data tiles (raw values + GPU colormapping) are more flexible but significantly harder. Defer to later. |
| Inference trigger | Cron every 6h | Matches GFS init cycle. On-demand adds auth, queuing, cost management. |
| First model | Atlas | Highest open-model skill as of Jan 2026. Fast inference (3.3s/step on A100). Probabilistic-capable for Phase 3. |
| Tile service framework | FastAPI + xarray | Native Zarr reading. Async-friendly. Lightweight. |
| Where to run inference | DGX Spark | Meets ≥40GB VRAM requirement. Keeps GPU work off development machine. |
| Tile projection | Web Mercator (EPSG:3857) | CesiumJS standard. Earth2Studio outputs in lat/lon (EPSG:4326) — reprojection needed at tile render time. |
| Data transfer | Shared filesystem or rsync | If tile service and inference service are on the same machine, Zarr is just a directory. If separate, rsync the Zarr store or use an object store (MinIO). |

## Open Questions

1. **Earth2Studio API server maturity.** It's early access (Jan 2026). Is it stable enough for scheduled production use, or should we wrap the Python API ourselves?
2. **Tile service vs. existing solutions.** Projects like `titiler` and `xpublish` serve geospatial data as tiles/OGC services. Worth evaluating whether they can read Earth2Studio Zarr outputs directly vs. building custom.
3. **Authentication.** Phase 1 can be localhost-only. For remote access (e.g., DGX Spark serving to MacBook), need auth. Simple API key or Tailscale/WireGuard tunnel.
4. **WebGL weather rendering.** Pre-rendered tiles are simple but inflexible (can't change colormaps client-side, limited interactivity). For wind, GPU particle advection in WebGL would be far more compelling. This is Phase 3+ scope but worth keeping in mind architecturally.
5. **Forecast data size.** A 10-day Atlas forecast at 0.25deg with 6 variables ≈ a few GB of Zarr. Tile cache will be larger (many zoom levels). Need to plan storage rotation.
