# Data Formats Expert Orientation

Reference material for the data formats expert. Facts here correct common misconceptions, anchor version-specific details, and map the format ecosystem. Omits facts the model reliably knows (what an array is, basic file I/O, etc.).

Last verified: March 2026. Claude's training data extends through early 2025.

## Field Map

Geoscience data lives in a handful of formats, each designed for a specific era and access pattern. GRIB (WMO, 1985/2003) dominates operational weather. NetCDF (Unidata, 1989/2003) dominates research. Zarr (2018) is the cloud-native challenger, gaining rapid adoption for analysis-ready data. HDF5 (1998) underlies NetCDF4 and serves NASA/satellite missions. GeoTIFF/COG serves raster imagery and GIS. BUFR encodes point observations. Arrow/Parquet is emerging for tabular geospatial (geoparquet). The unifying interface is xarray, which reads all of them through backend engines. The central tension: legacy formats (GRIB, NetCDF3) are ubiquitous but cloud-hostile; cloud-native formats (Zarr, COG, Parquet) offer random access but require migration effort and new tooling.

## GRIB / GRIB2

- **What it is:** WMO binary format for gridded meteorological data. GRIB1 (1985) and GRIB2 (2003). Self-describing via parameter tables but not self-documenting -- you need the tables to interpret the data. The lingua franca of operational NWP centers (ECMWF, NCEP, DWD, JMA).
- **Key libraries:** eccodes (ECMWF C library + Python bindings), cfgrib (xarray backend for GRIB via eccodes). cfgrib reads only; eccodes reads and writes. pygrib is an older alternative, still used but less maintained.
- **Parameter identification:** Variables identified by `discipline`, `parameterCategory`, `parameterNumber` (WMO standard) or `shortName`/`paramId` (eccodes convenience). The same physical variable can have different shortNames across table versions and centers. Always cross-reference with paramId for unambiguous identification. Table 4.2 is the master variable list.
- **Common gotchas:** Messages are independent -- no shared dimension concept. Multi-level/multi-time GRIB files are bags of messages that cfgrib must reassemble into hypercubes. Non-standard local sections break generic readers. GRIB1 does not support lossless compression for all grid types.
- **Earth2Studio note:** v0.12.0 switched from cfgrib to pygrib for GRIB reading. If using Earth2Studio, GRIB reading is handled internally.
- **As of:** March 2026.

## NetCDF (Network Common Data Form)

- **What it is:** Self-describing array format with built-in dimension/coordinate metadata. NetCDF3 (classic) is flat, 32-bit offset-limited, no compression. NetCDF4 (2008) uses HDF5 as storage layer, adds groups, compression, chunking, unlimited dimensions, and 64-bit addressing.
- **Key libraries:** netCDF4-python (`netCDF4`), xarray (via `scipy` engine for NetCDF3, `netcdf4` engine for NetCDF4, `h5netcdf` for HDF5-based reading).
- **CF Conventions (v1.11, Oct 2024):** Community standard for metadata: `standard_name`, `units`, `coordinates`, `cell_methods`, `grid_mapping`. CF compliance makes data interoperable across tools. Use `cf-checker` or `compliance-checker` to validate.
- **Unlimited dimensions:** NetCDF4 supports multiple unlimited dimensions (NetCDF3 allows only one). Used for append-along-time. Performance cost: unlimited dims prevent certain HDF5 optimizations. For append-heavy workloads, consider Zarr instead.
- **Chunking in NetCDF4:** Controlled via `createVariable(..., chunksizes=(t,y,x))`. Default chunking is often suboptimal -- always set explicitly. Chunk shape determines I/O pattern: time-chunked for time series, space-chunked for spatial analysis.
- **Compression:** `zlib` is default (level 4 is good tradeoff). NetCDF4 also supports `szip`. No native zstd/lz4/blosc support -- for those, use Zarr or h5py with HDF5 plugins.
- **As of:** March 2026.

## Zarr

- **What it is:** Chunked, compressed, cloud-native array store. Each chunk is an independent object (file or cloud blob). Designed for parallel, partial reads over HTTP/S3/GCS. No monolithic file -- a Zarr store is a directory tree (or object prefix).
- **Zarr v2 vs v3:** zarr-python 2.x uses `.zarray`, `.zattrs`, `.zgroup` metadata files and NumCodecs. zarr-python 3.x (released 2025) uses `zarr.json` consolidated metadata, a new codec pipeline, and a different store API. v3 is not backward-compatible in code but can read v2 stores with a compatibility layer. Most production data is still v2 format as of March 2026.
- **Chunking strategy:** The single most important design decision. Rule of thumb: 1-10 MB per chunk after compression. Chunk shape must match primary access pattern. Time-series workload: chunk (many_times, 1, 1). Spatial-slice workload: chunk (1, all_lat, all_lon). Mixed: chunk (10, 100, 100). Rechunking existing data: use `rechunker` library.
- **Compression:** Blosc (wraps zstd, lz4, blosclz) is fastest. zstd gives best ratio. For float32 weather data, blosc+zstd with bitshuffle filter typically achieves 3-5x compression with negligible decode overhead. Codec chains (delta + zstd, bitshuffle + zstd) are possible in v3.
- **Kerchunk:** Creates a virtual Zarr store from existing NetCDF4/HDF5/GRIB files without copying data. Generates a JSON/Parquet reference file mapping Zarr chunks to byte ranges in original files. Enables cloud-native access to legacy archives. VirtualiZarr is the newer alternative (integrated with xarray).
- **Cloud access:** Via fsspec (`s3fs` for AWS, `gcsfs` for GCS, `adlfs` for Azure). `xr.open_zarr("s3://bucket/store.zarr", storage_options={"anon": True})`.
- **As of:** March 2026.

## HDF5 (Hierarchical Data Format 5)

- **What it is:** General-purpose hierarchical binary container. Groups (like directories), datasets (n-dimensional arrays), and attributes. Supports chunking, compression (gzip, szip, lzo + plugin filters), parallel I/O (MPI-IO). NetCDF4 is a constrained profile of HDF5.
- **Key library:** h5py. Provides NumPy-like slicing on HDF5 datasets with lazy loading.
- **Relationship to NetCDF4:** Every valid NetCDF4 file is a valid HDF5 file, but not vice versa. h5py can read NetCDF4 files but ignores CF convention metadata. Writing NetCDF4-compatible files with h5py is possible but error-prone -- use netCDF4-python instead.
- **NASA/satellite data:** MODIS, VIIRS, ICESat-2, GPM all distribute as HDF5 (often HDF-EOS5). These files use groups extensively and may require specific group paths to access data.
- **As of:** March 2026.

## BUFR (Binary Universal Form for the Representation of meteorological data)

- **What it is:** WMO format for point/profile observations (radiosondes, surface stations, aircraft, buoys, satellite soundings). Message-based like GRIB but for irregular observation data, not gridded fields.
- **Key library:** eccodes (`codes_bufr_new_from_file`, `codes_set`, `codes_get`). Decoding requires expanding descriptors: `codes_set(msgid, 'unpack', 1)`.
- **Common use:** Ingesting observation data for data assimilation, verification against station reports. Rarely created by researchers -- primarily a distribution format from NWP centers and WMO GTS.
- **As of:** March 2026.

## GeoTIFF / COG (Cloud-Optimized GeoTIFF)

- **What it is:** GeoTIFF extends TIFF with geospatial metadata (CRS, affine transform, tie points). COG adds internal tiling and overviews (image pyramids) for HTTP range-request access. The standard raster format for GIS and remote sensing.
- **Key libraries:** GDAL (C/C++ foundation), rasterio (Pythonic GDAL wrapper), rio-cogeo (COG creation/validation). GDAL also reads NetCDF, HDF5, GRIB -- it is the Swiss army knife of geospatial I/O.
- **COG creation:** `rio cogeo create input.tif output.tif --overview-level 5 --blocksize 512`. Or via rasterio: set `tiled=True`, `blockxsize=512`, `blockysize=512`, add overviews.
- **Limitations:** 2D raster only (no time dimension, no vertical levels without stacking files). For multi-dimensional weather data, NetCDF/Zarr is preferred. COG is ideal for single-time, single-level visualization products.
- **As of:** March 2026.

## Arrow / Parquet / GeoParquet

- **What it is:** Apache Arrow is an in-memory columnar format. Parquet is the on-disk columnar format. GeoParquet (v1.1, 2024) adds a standardized geometry column to Parquet, enabling geospatial queries with DuckDB, BigQuery, Snowflake.
- **Key libraries:** pyarrow, geopandas (reads/writes GeoParquet), duckdb (SQL on Parquet with spatial extension).
- **Use case in geoscience:** Station metadata, observation catalogs, point/polygon datasets, STAC catalogs. Not for gridded fields -- use Zarr/NetCDF for that.
- **As of:** March 2026.

## xarray: The Unifying Interface

- **What it is:** Python library providing labeled, multi-dimensional arrays (DataArray, Dataset) with metadata-aware operations. The primary interface for multi-format geoscience data access.
- **Backend engines:** `netcdf4`, `scipy`, `h5netcdf` (NetCDF), `cfgrib` (GRIB), `zarr` (Zarr), `rasterio` (GeoTIFF via rioxarray). Install the backend library and xarray auto-discovers it.
- **Lazy loading + Dask:** `xr.open_dataset(path, chunks={"time": 10})` returns a lazy Dask-backed dataset. Computation happens on `.compute()` or `.values`. Essential for datasets larger than memory.
- **Common pattern:** Read any format into xarray, process with xarray/Dask, write to Zarr for cloud storage or NetCDF4 for distribution.
- **As of:** March 2026.

## Format Conversion Quick Reference

| From | To | Tool | Notes |
|------|-----|------|-------|
| GRIB2 | NetCDF4 | cfgrib + xarray | `xr.open_dataset(f, engine="cfgrib").to_netcdf(out)` -- watch for parameter table issues |
| GRIB2 | Zarr | cfgrib + xarray | Read with cfgrib, set chunks, write with `to_zarr()` |
| NetCDF4 | Zarr | xarray | `xr.open_dataset(f).to_zarr(out)` -- set target_chunks for optimal layout |
| HDF5 | NetCDF4 | h5py + netCDF4 | Manual: read groups/datasets with h5py, write with netCDF4. Ensure CF compliance. |
| GeoTIFF | COG | rio-cogeo / GDAL | `rio cogeo create` or `gdal_translate -of COG` |
| NetCDF4/HDF5 | Virtual Zarr | kerchunk / VirtualiZarr | No data copy -- creates reference mapping for cloud access |
| Any | Parquet | Custom | Extract point/tabular data, write with pyarrow. Not for gridded data. |

## Compression Quick Reference

| Codec | Speed | Ratio | Best for | Library |
|-------|-------|-------|----------|---------|
| zlib/gzip | Slow | Good | NetCDF4 default, broad compatibility | netCDF4, h5py |
| zstd | Fast | Excellent | Zarr, high-throughput workloads | blosc, numcodecs |
| lz4 | Fastest | Moderate | Real-time pipelines, low latency | blosc, numcodecs |
| bitshuffle + zstd | Fast | Best for floats | Weather/climate float32 arrays | blosc, numcodecs |
| deflate (TIFF) | Slow | Good | GeoTIFF/COG | GDAL, rasterio |
| szip | Moderate | Good | HDF5 (NASA standard) | h5py |
