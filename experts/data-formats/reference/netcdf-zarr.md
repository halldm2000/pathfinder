### NetCDF4 and Zarr: Array Formats for Research and Cloud

**NetCDF4**

**What it is:** Self-describing array format built on HDF5, with enforced dimension/variable/attribute data model. The dominant format for climate and weather research data. CF Conventions (v1.11, Oct 2024) standardize metadata for interoperability.

**Key details:**
- Install: `pip install netCDF4` (note the capital C and D)
- Python API wraps the C netCDF4 library (libnetcdf). Requires HDF5 C library underneath.
- Dimensions are named and sized. Variables are typed arrays with named dimensions. Attributes are key-value metadata on variables or the dataset (global).
- Unlimited dimensions allow append operations. NetCDF4 supports multiple unlimited dimensions (NetCDF3 allows only one).

**Creating a NetCDF4 file:**
```python
import netCDF4 as nc
import numpy as np

ds = nc.Dataset("output.nc", "w", format="NETCDF4")

# Dimensions
ds.createDimension("time", None)  # unlimited
ds.createDimension("lat", 721)
ds.createDimension("lon", 1440)

# Variables with chunking and compression
time = ds.createVariable("time", "f8", ("time",))
time.units = "hours since 2026-01-01"
time.calendar = "standard"

temp = ds.createVariable(
    "temperature", "f4", ("time", "lat", "lon"),
    chunksizes=(1, 721, 1440),
    zlib=True, complevel=4,
    fill_value=-9999.0
)
temp.standard_name = "air_temperature"
temp.units = "K"
temp.coordinates = "time lat lon"

# Write data
temp[0, :, :] = np.random.randn(721, 1440) * 10 + 280
ds.close()
```

**CF Conventions essentials:**
- `standard_name`: from CF standard name table (cfconventions.org/Data/cf-standard-names/)
- `units`: UDUNITS-compatible string ("K", "m s-1", "kg m-2 s-1")
- `coordinates`: space-separated list of auxiliary coordinate variables
- `cell_methods`: describes how data represents cells ("time: mean", "area: sum")
- `grid_mapping`: links to a variable describing the CRS (for projected grids)
- `_FillValue` or `missing_value`: must match data type. Set at creation time for `_FillValue`.

**Common pitfalls:**
1. **Default chunking is terrible.** NetCDF4 auto-chunks if you don't specify. The defaults rarely match your access pattern. Always set `chunksizes` explicitly.
2. **Unlimited dim performance.** Unlimited dimensions are implemented as HDF5 extensible datasets. Each append may trigger a B-tree rebalance. For high-frequency appends, batch writes or use Zarr.
3. **String encoding.** NetCDF4 supports fixed-length (`S1`) and variable-length strings. Variable-length strings cannot be compressed with zlib. Use fixed-length when possible.
4. **_FillValue must be set at creation.** You cannot change `_FillValue` after `createVariable()`. Plan it before writing.
5. **Groups.** NetCDF4 supports HDF5-like groups (`ds.createGroup("forecast")`). CF Conventions v1.11 added group conventions but many tools still expect flat (single-group) files.

---

**Zarr**

**What it is:** Chunked, compressed, cloud-native array store designed for parallel access. Each chunk is stored as a separate file/object. No monolithic file -- a Zarr store is a directory tree or cloud object prefix. Native support for object stores (S3, GCS, Azure).

**Zarr v2 vs v3 (critical distinction as of March 2026):**

| Feature | Zarr v2 (zarr-python 2.x) | Zarr v3 (zarr-python 3.x) |
|---------|--------------------------|--------------------------|
| Metadata | `.zarray`, `.zattrs`, `.zgroup` (separate files) | `zarr.json` (single consolidated file) |
| Codecs | NumCodecs (blosc, zlib, etc.) | Codec pipeline (new API, same algorithms) |
| Store API | `MutableMapping` interface | `zarr.storage.Store` abstract class |
| Chunk key format | `0.0.0` (dot-separated) | `c/0/0/0` (slash-separated, configurable) |
| Status | Widely deployed, most existing data | Spec finalized, library released 2025, adoption growing |

Most production data and cloud archives (e.g., Pangeo, Google ARCO ERA5) are still Zarr v2 as of March 2026. zarr-python 3.x can read v2 stores.

**Creating a Zarr store (v2 API, most common):**
```python
import zarr
import numcodecs
import numpy as np

store = zarr.DirectoryStore("output.zarr")
root = zarr.group(store, overwrite=True)

compressor = numcodecs.Blosc(cname="zstd", clevel=3, shuffle=numcodecs.Blosc.BITSHUFFLE)

temp = root.create_dataset(
    "temperature",
    shape=(100, 721, 1440),
    chunks=(10, 721, 1440),
    dtype="float32",
    compressor=compressor,
    fill_value=np.nan
)
temp.attrs["standard_name"] = "air_temperature"
temp.attrs["units"] = "K"
```

**Writing via xarray (recommended for CF-compliant Zarr):**
```python
import xarray as xr

ds = xr.open_dataset("input.nc")
ds = ds.chunk({"time": 10, "lat": 721, "lon": 1440})
ds.to_zarr("output.zarr", mode="w", consolidated=True)

# Append along time dimension
ds_new.to_zarr("output.zarr", mode="a", append_dim="time")
```

**Chunking strategy (the most important design decision):**

| Access pattern | Recommended chunks | Rationale |
|---------------|-------------------|-----------|
| Time series at a point | (all_time, 1, 1) | Reads one chunk per location |
| Spatial map at one time | (1, all_lat, all_lon) | Reads one chunk per timestep |
| Regional subset, all times | (10, 100, 100) | Balanced -- moderate chunks for both dims |
| ML training (random patches) | (1, 128, 128) | Matches training patch size |

Target 1-10 MB per compressed chunk. Smaller chunks = more requests (overhead). Larger chunks = more wasted bytes on partial reads.

**Rechunking existing data:**
```python
import rechunker

target_chunks = {"time": 100, "lat": 721, "lon": 1440}
rechunked = rechunker.rechunk(
    source=xr.open_zarr("original.zarr"),
    target_chunks=target_chunks,
    target_store="rechunked.zarr",
    temp_store="temp.zarr",
    max_mem="2GB"
)
rechunked.execute()
```

**Kerchunk (virtual Zarr from existing files):**
```python
from kerchunk.hdf import SingleHdf5ToZarr
from kerchunk.combine import MultiZarrToZarr
import fsspec, ujson

# Step 1: Generate references for each file
references = []
for f in netcdf_files:
    h5chunks = SingleHdf5ToZarr(f)
    references.append(h5chunks.translate())

# Step 2: Combine into multi-file reference
mzz = MultiZarrToZarr(references, concat_dims=["time"])
combined = mzz.translate()

# Step 3: Save reference file
with open("combined_refs.json", "w") as f:
    ujson.dump(combined, f)

# Step 4: Open as virtual Zarr
mapper = fsspec.get_mapper("reference://", fo="combined_refs.json")
ds = xr.open_zarr(mapper, consolidated=False)
```

**VirtualiZarr (newer alternative to kerchunk, integrated with xarray):**
```python
import virtualizarr

vds = virtualizarr.open_virtual_dataset("file.nc")
vds.virtualize.to_zarr("virtual_store.zarr")
```

**Compression recommendations for weather/climate float32 data:**
- **Best ratio:** Blosc + zstd, clevel 3, bitshuffle. Typical 3-5x compression on ERA5-like data.
- **Fastest decode:** Blosc + lz4, clevel 1, bitshuffle. ~2x compression but decode is near-memcpy speed.
- **Compatibility:** zlib/gzip. Slower but readable by everything.
- **Delta filter:** Useful for slowly varying fields (e.g., geopotential). Apply delta encoding before compression.

**Known issues:**
1. **Zarr has no built-in schema enforcement.** Unlike NetCDF4 with CF, Zarr stores can have arbitrary metadata. Rely on xarray's CF-encoding when writing Zarr to maintain CF compliance.
2. **consolidated metadata.** Always write `consolidated=True` with xarray's `to_zarr()` to avoid N+1 metadata reads on cloud stores.
3. **Append race conditions.** Concurrent appends to the same Zarr store are not safe without coordination. Use Icechunk (Zarr + transactional storage) for concurrent write workloads.

**Sources:**
- Zarr spec: zarr-specs.readthedocs.io
- zarr-python: github.com/zarr-developers/zarr-python
- kerchunk: github.com/fsspec/kerchunk
- VirtualiZarr: github.com/zarr-developers/VirtualiZarr
- rechunker: github.com/pangeo-data/rechunker
- CF Conventions: cfconventions.org

As of: March 2026
