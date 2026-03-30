### xarray Patterns for Multi-Format Geoscience Data

**What it is:** Python library for labeled, multi-dimensional arrays. Provides `DataArray` (single variable with coordinates) and `Dataset` (collection of aligned DataArrays). The standard interface for reading, processing, and writing weather/climate data across all major formats.

**Key details:**
- Install: `pip install xarray` (core) + backend engines as needed
- Backend engines: `netcdf4`, `scipy`, `h5netcdf`, `cfgrib`, `zarr`, `rasterio` (via rioxarray)
- Lazy loading via Dask: `chunks=` parameter returns Dask-backed arrays. Computation deferred until `.compute()` or `.values`.
- CF-aware: xarray understands CF time encoding, coordinate attributes, and standard_name.

**Reading any format:**
```python
import xarray as xr

# NetCDF4
ds = xr.open_dataset("data.nc")                           # engine auto-detected
ds = xr.open_dataset("data.nc", engine="netcdf4")         # explicit engine

# Zarr
ds = xr.open_zarr("data.zarr")                            # local
ds = xr.open_zarr("s3://bucket/data.zarr",                # cloud
                   storage_options={"anon": True})

# GRIB2
ds = xr.open_dataset("data.grib2", engine="cfgrib")
ds = xr.open_dataset("data.grib2", engine="cfgrib",
                      backend_kwargs={"filter_by_keys": {"shortName": "t", "typeOfLevel": "isobaricInhPa"}})

# Multiple files (along time dimension)
ds = xr.open_mfdataset("data_*.nc", combine="by_coords", parallel=True)

# GeoTIFF (requires rioxarray)
import rioxarray
da = rioxarray.open_rasterio("image.tif")
```

**Lazy loading with Dask (essential for large data):**
```python
# Lazy open -- no data loaded into memory
ds = xr.open_dataset("large_file.nc", chunks={"time": 10, "lat": 360, "lon": 720})

# Operations build a task graph, no computation yet
mean_temp = ds["temperature"].mean(dim="time")

# Compute triggers actual I/O and computation
result = mean_temp.compute()

# For multi-file datasets
ds = xr.open_mfdataset(
    "data_*.nc",
    chunks={"time": 10},
    combine="by_coords",
    parallel=True  # uses Dask to read files in parallel
)
```

**Chunk size guidelines for Dask:**
- Target 100 MB - 1 GB per chunk in memory (not on disk)
- Too small = excessive task graph overhead
- Too large = memory pressure
- Match chunk boundaries to the file's native chunks when possible
- `ds.chunk({"time": 10})` rechunks lazily (no I/O until compute)

**Writing to any format:**
```python
# To NetCDF4
ds.to_netcdf("output.nc", encoding={
    "temperature": {
        "zlib": True,
        "complevel": 4,
        "chunksizes": (1, 721, 1440),
        "dtype": "float32",
        "_FillValue": -9999.0
    }
})

# To Zarr
ds.to_zarr("output.zarr", mode="w", consolidated=True)

# To Zarr with specific encoding
encoding = {
    "temperature": {
        "chunks": (10, 721, 1440),
        "compressor": numcodecs.Blosc(cname="zstd", clevel=3, shuffle=numcodecs.Blosc.BITSHUFFLE)
    }
}
ds.to_zarr("output.zarr", mode="w", encoding=encoding, consolidated=True)

# Append to existing Zarr
ds_new.to_zarr("output.zarr", mode="a", append_dim="time")
```

**Common xarray patterns for weather/climate data:**

**Select by coordinate value (not index):**
```python
# Select a single level
ds.sel(level=500)

# Select a time range
ds.sel(time=slice("2026-01-01", "2026-01-31"))

# Nearest-neighbor lookup
ds.sel(lat=37.7749, lon=-122.4194, method="nearest")

# Select multiple levels
ds.sel(level=[500, 700, 850])
```

**Spatial subsetting:**
```python
# Geographic bounding box
ds.sel(lat=slice(60, 20), lon=slice(-130, -60))  # CONUS-ish
# Note: lat slice direction depends on whether lat is ascending or descending

# For descending lat (90 to -90, common in weather data):
ds.sel(lat=slice(60, 20))  # north to south

# For ascending lat (-90 to 90):
ds.sel(lat=slice(20, 60))  # south to north

# Check lat order first:
ds.lat.values[0]  # if > ds.lat.values[-1], it's descending
```

**Unit-aware time operations:**
```python
# xarray decodes CF time automatically
ds.time.values  # numpy datetime64 array

# Resample (temporal aggregation)
monthly = ds.resample(time="1ME").mean()
daily_max = ds.resample(time="1D").max()

# Group by (seasonal, monthly, etc.)
seasonal = ds.groupby("time.season").mean()
diurnal = ds.groupby("time.hour").mean()

# Time differences
ds.diff(dim="time")
```

**Regridding (common need when combining datasets):**
```python
import xesmf as xe  # pip install xesmf

# Create regridder
ds_out = xr.Dataset({"lat": (["lat"], np.arange(-90, 90, 0.25)),
                      "lon": (["lon"], np.arange(0, 360, 0.25))})
regridder = xe.Regridder(ds_in, ds_out, "bilinear")

# Apply
ds_regridded = regridder(ds_in)

# Regridder is reusable for same grid pair
ds_regridded2 = regridder(ds_in2)
```

**Format conversion pipeline (GRIB -> analysis-ready Zarr):**
```python
import xarray as xr
import numcodecs

# 1. Read GRIB
ds = xr.open_dataset(
    "gfs.grib2", engine="cfgrib",
    backend_kwargs={"filter_by_keys": {"typeOfLevel": "isobaricInhPa"}}
)

# 2. Fix coordinates if needed
ds = ds.rename({"latitude": "lat", "longitude": "lon"})
if ds.lon.values.max() > 180:
    ds = ds.assign_coords(lon=(ds.lon + 180) % 360 - 180).sortby("lon")

# 3. Set encoding for optimal Zarr storage
encoding = {}
for var in ds.data_vars:
    encoding[var] = {
        "chunks": (1, len(ds.lat), len(ds.lon)),
        "compressor": numcodecs.Blosc(cname="zstd", clevel=3,
                                       shuffle=numcodecs.Blosc.BITSHUFFLE),
        "dtype": "float32"
    }

# 4. Write to Zarr
ds.to_zarr("gfs_analysis.zarr", mode="w", encoding=encoding, consolidated=True)
```

**Debugging common xarray issues:**

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| `ValueError: conflicting sizes for dimension` | Merging datasets with different dim lengths | Check coordinate alignment, use `xr.align()` |
| `SerializationWarning: variable has data with NaN` | Missing `_FillValue` encoding | Set `encoding={"var": {"_FillValue": np.nan}}` |
| `MemoryError` on large datasets | Loaded entire dataset eagerly | Use `chunks=` parameter for lazy Dask loading |
| Time coordinate shows raw numbers | CF time decoding failed | Check `units` attribute, try `decode_times=False` then manual decode |
| GRIB: `multiple values for unique key` | cfgrib cannot form a hypercube | Use `filter_by_keys` or `open_datasets()` |
| Zarr: slow cloud reads | Too many small chunks or missing consolidated metadata | Increase chunk size, write `consolidated=True` |

**Performance tips:**
1. **Always specify chunks when opening large files.** Eager loading is the #1 performance mistake.
2. **Match xarray chunks to file chunks.** Misaligned chunks cause redundant I/O.
3. **Use `parallel=True` with `open_mfdataset`.** Reads files in parallel via Dask.
4. **Avoid `.values` until the final step.** It triggers full computation and loads to memory.
5. **Use `ds.load()` only on subsets.** After selecting the region/time you need.
6. **For repeated access patterns, persist intermediate results.** Write processed data to Zarr rather than re-reading raw files.

**Sources:**
- xarray: docs.xarray.dev
- Dask: docs.dask.org
- xesmf: xesmf.readthedocs.io
- rioxarray: corteva.github.io/rioxarray

As of: March 2026
