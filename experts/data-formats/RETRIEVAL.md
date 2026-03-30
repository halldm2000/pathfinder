# Data Formats Expert: Retrieval Strategy

This expert runs as a Claude Code project or Cowork session. Retrieval follows a strict three-tier hierarchy: orientation doc first, reference docs second, web search last. Most questions about format specifications, library APIs, and conversion patterns are answerable in seconds from local context.

## Three-Tier Hierarchy

### Tier 1: Orientation Doc (always loaded, instant)

Answer directly from ORIENTATION.md when the question involves:
- Format identity and purpose ("What is Zarr?", "How does GRIB differ from NetCDF?")
- Format comparisons (data model, metadata, chunking, compression, cloud access)
- Compression codec recommendations (quick reference table)
- Conversion quick reference (which tool for which direction)
- xarray as the unifying interface (backend engines, basic pattern)
- Field map and ecosystem structure
- Any fact explicitly stated in the orientation doc

**Rule: If the orientation doc has the fact, use it. Do not search.**

### Tier 2: Reference Docs (read on demand, milliseconds)

Read the relevant file from `reference/` when the question goes deeper than the orientation doc covers:
- "How do I read a GRIB file with cfgrib?" -> read `reference/grib.md`
- "Show me how to create a Zarr store with blosc compression" -> read `reference/netcdf-zarr.md`
- "How do I decode BUFR observations?" -> read `reference/hdf5-bufr.md`
- "How do I make a Cloud-Optimized GeoTIFF?" -> read `reference/geotiff-cog.md`
- "What's the best chunking for my Zarr store?" -> read `reference/netcdf-zarr.md`
- "How do I convert GRIB to Zarr with xarray?" -> read `reference/xarray-patterns.md` + `reference/grib.md`
- "How do I use kerchunk?" -> read `reference/netcdf-zarr.md`
- "Why can't cfgrib read my file?" -> read `reference/grib.md`
- Code examples, detailed API usage, specific library gotchas, conversion pipelines
- HDF5 compression plugins, NASA HDF-EOS file structures

**Available reference docs:**
- `reference/grib.md` -- GRIB2 format, eccodes, cfgrib, parameter tables, writing GRIB, gotchas
- `reference/netcdf-zarr.md` -- NetCDF4 creation, CF conventions, Zarr v2/v3, chunking strategy, kerchunk, VirtualiZarr, compression recommendations
- `reference/hdf5-bufr.md` -- HDF5 with h5py, compression plugins, NASA files, BUFR decoding
- `reference/geotiff-cog.md` -- GeoTIFF/COG reading and creation, rasterio, GDAL, VRT
- `reference/xarray-patterns.md` -- Multi-format reading, Dask lazy loading, writing, regridding, conversion pipelines, debugging

**Rule: Read the reference doc before web searching. If the reference doc answers the question, do not search.**

### Tier 3: Web Search (last resort, seconds)

Search the web only when:
- The question is about a **specific library version** released in the last 2-4 weeks
- The question asks for a **new library feature or deprecation** not covered in reference docs
- The question involves a **Zarr v3 API change** (the v3 transition is ongoing, APIs may shift)
- The question is about a **tool or library not in the reference corpus** (e.g., a new GRIB reader, a new compression codec)
- The user reports a **specific error** that may be version-related

**Rule: Do not web search for format specifications, standard library APIs, conversion patterns, chunking strategies, or compression recommendations. These are stable and covered by tiers 1-2.**

## When NOT to Search

- **Format specifications** -- GRIB2, NetCDF4, Zarr v2, HDF5, BUFR, GeoTIFF are stable specs. In reference docs.
- **Library APIs** (eccodes, cfgrib, netCDF4, h5py, zarr, rasterio, xarray) -- Core APIs change slowly. In reference docs.
- **CF Conventions** -- v1.11 is current. In orientation + reference docs.
- **Chunking and compression strategies** -- Domain knowledge, not version-dependent. In reference docs.
- **Conversion patterns** -- Stable pipelines. In reference docs.
- **Common error diagnosis** -- In reference docs (gotchas and debugging tables).

If a fact in the orientation or reference doc says "as of [date]" and the date is **within the last 3 months**, trust it. Only search if the date is older than 3 months or the user specifically asks about very recent changes.

## Search Patterns (when Tier 3 is warranted)

### For library version/release checks
1. PyPI: `site:pypi.org {library_name}` for latest release
2. GitHub releases: `site:github.com/{org}/{repo}/releases`
3. Changelogs: `site:github.com/{org}/{repo} CHANGELOG`

### For Zarr ecosystem updates
1. zarr-python: `site:github.com/zarr-developers/zarr-python`
2. Zarr spec: `site:zarr-specs.readthedocs.io`
3. VirtualiZarr: `site:github.com/zarr-developers/VirtualiZarr`

### For GRIB/eccodes updates
1. eccodes: `site:github.com/ecmwf/eccodes/releases`
2. cfgrib: `site:github.com/ecmwf/cfgrib/releases`

### For xarray ecosystem
1. xarray: `site:github.com/pydata/xarray/releases`
2. Dask: `site:github.com/dask/dask/releases`

## Freshness Protocol

1. **Format specs are stable.** GRIB2, NetCDF4, HDF5, GeoTIFF specs change rarely (years between revisions). Trust reference docs.
2. **Library APIs change at release cadence.** xarray, zarr-python, rasterio release quarterly-ish. Check on version-specific questions.
3. **Zarr v3 is the fastest-moving target.** The v2-to-v3 transition is ongoing as of March 2026. Search for v3-specific API questions.
4. **CF Conventions update annually.** v1.11 (Oct 2024) is current. Check if user asks about a very new convention.
5. **Compression codecs are stable.** blosc, zstd, lz4, zlib APIs are mature. Do not search.
