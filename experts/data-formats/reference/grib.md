### GRIB2 Format and Tooling

**What it is:** WMO standard binary format for gridded meteorological data. Edition 2 (GRIB2, 2003) supersedes Edition 1 with improved compression (JPEG2000, PNG, CCSDS), flexible grid definitions, and extended parameter tables. Every operational NWP center distributes forecasts in GRIB2. The format is message-based: a GRIB file is a concatenation of independent messages, each containing one 2D field (one variable, one level, one time step).

**Key details:**
- Message structure: Indicator (GRIB magic bytes) -> Identification -> Grid Definition -> Product Definition -> Data Representation -> Bitmap -> Data -> End
- Parameter identification triple: `discipline` (0=meteorological), `parameterCategory`, `parameterNumber`. Example: temperature at pressure level = discipline 0, category 0, number 0.
- eccodes shortName/paramId: Convenience aliases. `shortName="2t"` = 2m temperature = paramId 167 (ECMWF table). Beware: shortNames are not universal across centers.
- Grid types: regular lat-lon, reduced Gaussian (ECMWF), Lambert conformal (HRRR), HEALPix (emerging). Template numbers in Section 3 define the grid.
- Packing: Simple (template 5.0), JPEG2000 (5.40000), CCSDS/AEC (5.42) -- increasingly used by ECMWF for better compression.

**Reading with eccodes (Python):**
```python
import eccodes

with open("forecast.grib2", "rb") as f:
    while True:
        msgid = eccodes.codes_grib_new_from_file(f)
        if msgid is None:
            break
        shortName = eccodes.codes_get(msgid, "shortName")
        paramId = eccodes.codes_get(msgid, "paramId")
        level = eccodes.codes_get(msgid, "level")
        values = eccodes.codes_get_values(msgid)
        Ni = eccodes.codes_get(msgid, "Ni")
        Nj = eccodes.codes_get(msgid, "Nj")
        data = values.reshape(Nj, Ni)
        eccodes.codes_release(msgid)
```

**Reading with cfgrib + xarray:**
```python
import xarray as xr

# Basic read -- cfgrib assembles messages into a hypercube
ds = xr.open_dataset("forecast.grib2", engine="cfgrib")

# Filter by shortName when file has multiple variables
ds = xr.open_dataset(
    "forecast.grib2",
    engine="cfgrib",
    backend_kwargs={"filter_by_keys": {"shortName": "2t"}}
)

# Multiple datasets for incompatible parameter sets
datasets = cfgrib.open_datasets("forecast.grib2")
```

**Writing with eccodes:**
```python
import eccodes
import numpy as np

sample_id = eccodes.codes_grib_new_from_samples("regular_ll_pl_grib2")
eccodes.codes_set(sample_id, "shortName", "t")
eccodes.codes_set(sample_id, "level", 500)
eccodes.codes_set(sample_id, "dataDate", 20260330)
eccodes.codes_set(sample_id, "dataTime", 0)
eccodes.codes_set_values(sample_id, data.flatten())
with open("output.grib2", "wb") as f:
    eccodes.codes_write(sample_id, f)
eccodes.codes_release(sample_id)
```

**Common gotchas:**
1. **cfgrib hypercube assembly fails** when messages have inconsistent keys. Error: "multiple values for unique key." Fix: use `filter_by_keys` to select a consistent subset, or use `open_datasets()` which returns multiple datasets.
2. **shortName ambiguity.** ECMWF uses paramId 167 for 2t; NCEP may encode it differently. Always check `grib_ls -p shortName,paramId,discipline,parameterCategory,parameterNumber file.grib2`.
3. **cfgrib cannot write GRIB.** Use eccodes for writing. cfgrib is read-only.
4. **Missing eccodes definition files.** If eccodes can't decode a variable, ensure `ECCODES_DEFINITION_PATH` is set and definitions are up to date.
5. **GRIB index files.** For large GRIB files, create an index: `eccodes.codes_index_new_from_file(f, keys)`. Much faster than sequential scanning.
6. **Earth2Studio v0.12.0+ uses pygrib** instead of cfgrib internally. If writing standalone code, either library works.

**GRIB tools (command line):**
- `grib_ls` -- list message keys
- `grib_dump` -- full message dump
- `grib_get` -- extract specific keys
- `grib_filter` -- filter/split messages by key criteria
- `grib_set` -- modify keys in place
- `grib_to_netcdf` -- convert to NetCDF (basic, loses some metadata)
- `wgrib2` -- NCEP tool, popular in US NWP community

**Relationship to other formats:** GRIB is the operational distribution format. Most analysis pipelines convert GRIB to NetCDF or Zarr for processing. AI weather models typically train on ERA5 (distributed as GRIB, often converted to NetCDF/Zarr). Earth2Studio handles GRIB reading internally when pulling from GFS/HRRR data sources.

**Sources:**
- eccodes: github.com/ecmwf/eccodes, confluence.ecmwf.int/display/ECC
- cfgrib: github.com/ecmwf/cfgrib
- WMO GRIB2 standard: community.wmo.int/en/activity-areas/wis/grib2
- Parameter tables: codes.ecmwf.int/grib/param-db/

As of: March 2026
