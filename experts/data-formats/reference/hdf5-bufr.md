### HDF5 and BUFR

**HDF5 (Hierarchical Data Format 5)**

**What it is:** General-purpose hierarchical binary container. The storage foundation for NetCDF4, but more flexible -- supports arbitrary group hierarchies, heterogeneous datasets, custom datatypes, and user-defined compression filters. Dominant in NASA Earth science (MODIS, VIIRS, ICESat-2, GPM) and high-energy physics.

**Key details:**
- Install: `pip install h5py`. Wraps the HDF5 C library.
- Data model: Groups (like directories), Datasets (typed n-d arrays), Attributes (key-value metadata on groups or datasets).
- Datasets support chunking, compression (gzip, szip, lzo via plugins), and virtual datasets (VDS -- map multiple files into one virtual dataset).
- Parallel I/O via MPI-IO: `h5py.File(name, "w", driver="mpio", comm=MPI.COMM_WORLD)`. Requires parallel-enabled HDF5 build.

**Reading HDF5:**
```python
import h5py
import numpy as np

with h5py.File("data.h5", "r") as f:
    # Explore structure
    def print_tree(name, obj):
        print(name, type(obj).__name__)
    f.visititems(print_tree)

    # Read a dataset
    temp = f["/forecast/temperature"][:]  # full read into numpy
    temp_slice = f["/forecast/temperature"][0, 100:200, 300:400]  # partial read

    # Read attributes
    units = f["/forecast/temperature"].attrs["units"]

    # Check chunking and compression
    ds = f["/forecast/temperature"]
    print(ds.chunks)       # chunk shape or None
    print(ds.compression)  # e.g., 'gzip'
    print(ds.compression_opts)  # e.g., 4
```

**Writing HDF5:**
```python
import h5py
import numpy as np

with h5py.File("output.h5", "w") as f:
    grp = f.create_group("forecast")

    ds = grp.create_dataset(
        "temperature",
        shape=(100, 721, 1440),
        dtype="float32",
        chunks=(1, 721, 1440),
        compression="gzip",
        compression_opts=4,
        fillvalue=np.nan
    )
    ds.attrs["units"] = "K"
    ds.attrs["standard_name"] = "air_temperature"

    ds[0, :, :] = np.random.randn(721, 1440) * 10 + 280
```

**HDF5 compression filters:**
- Built-in: `gzip` (level 0-9), `szip` (NASA standard), `lzf` (fast, HDF5 plugin)
- Plugin filters: blosc-hdf5, bitshuffle-hdf5. Registered in HDF5 filter pipeline. Set `HDF5_PLUGIN_PATH` to plugin directory.
- Example with blosc plugin:
```python
import hdf5plugin  # pip install hdf5plugin -- registers filters automatically

with h5py.File("compressed.h5", "w") as f:
    f.create_dataset(
        "data", data=arr,
        **hdf5plugin.Blosc(cname="zstd", clevel=3, shuffle=hdf5plugin.Blosc.BITSHUFFLE)
    )
```

**NASA HDF-EOS5 files:**
- MODIS: groups like `/MODIS_Grid_Daily_1km_LST/Data Fields/LST_Day_1km`
- GPM: `/Grid/precipitation`
- ICESat-2: deeply nested group structure per beam (`/gt1l/land_segments/canopy/`)
- Use `f.visititems()` to discover structure before accessing data.

**Common gotchas:**
1. **File locking.** HDF5 uses file-level locks by default. Concurrent reads from multiple processes fail unless `HDF5_USE_FILE_LOCKING=FALSE` or opened with `swmr=True` (Single Writer Multiple Reader).
2. **Memory-mapped I/O.** Not supported by h5py by default. Use `driver="core"` for in-memory access of small files.
3. **NetCDF4 compatibility.** Writing a valid NetCDF4 file with h5py requires: `_NCProperties` attribute on root, specific dimension scale conventions. Use netCDF4-python unless you have a specific reason not to.
4. **Large attribute limits.** Attributes larger than 64KB are stored in the B-tree, not the header. This can cause performance issues with very large string attributes.

---

**BUFR (Binary Universal Form for the Representation of meteorological data)**

**What it is:** WMO standard for encoding point observations and profiles. Used for radiosondes, surface stations (SYNOP/METAR), aircraft (AMDAR), buoys, satellite soundings, and other irregular observation data. Message-based format with self-describing structure via WMO descriptor tables.

**Key details:**
- BUFR messages contain: Indicator, Identification, Optional, Data Description, Data, End sections.
- Data is encoded using WMO Table B descriptors (element definitions) and Table D descriptors (sequences of elements). Descriptors are 6-digit numbers: FXXYYY where F=category, XX=class, YYY=entry.
- eccodes is the primary decoding library. NCEP also maintains bufrlib.

**Reading BUFR with eccodes:**
```python
import eccodes

with open("observations.bufr", "rb") as f:
    while True:
        msgid = eccodes.codes_bufr_new_from_file(f)
        if msgid is None:
            break

        # Must unpack before reading data values
        eccodes.codes_set(msgid, "unpack", 1)

        # Get observation metadata
        num_subsets = eccodes.codes_get(msgid, "numberOfSubsets")

        # Read specific elements
        lat = eccodes.codes_get(msgid, "latitude")
        lon = eccodes.codes_get(msgid, "longitude")
        temp = eccodes.codes_get(msgid, "airTemperature")
        pressure = eccodes.codes_get(msgid, "pressure")

        eccodes.codes_release(msgid)
```

**BUFR tools (command line):**
- `bufr_dump -p` -- plain text dump of message contents
- `bufr_ls` -- list message keys
- `bufr_get` -- extract specific keys
- `bufr_filter` -- filter by criteria

**Converting BUFR to tabular formats:**
```python
import eccodes
import pandas as pd

records = []
with open("synop.bufr", "rb") as f:
    while True:
        msgid = eccodes.codes_bufr_new_from_file(f)
        if msgid is None:
            break
        eccodes.codes_set(msgid, "unpack", 1)
        try:
            records.append({
                "lat": eccodes.codes_get(msgid, "latitude"),
                "lon": eccodes.codes_get(msgid, "longitude"),
                "time": eccodes.codes_get(msgid, "typicalDate"),
                "temperature": eccodes.codes_get(msgid, "airTemperature"),
                "pressure": eccodes.codes_get(msgid, "pressure"),
            })
        except eccodes.KeyValueNotFoundError:
            pass  # missing elements
        eccodes.codes_release(msgid)

df = pd.DataFrame(records)
```

**Common gotchas:**
1. **Must unpack.** `codes_set(msgid, "unpack", 1)` is required before reading data values. Without it, you get encoded values.
2. **Missing data.** BUFR uses a specific bit pattern for missing values. eccodes returns `CODES_MISSING_DOUBLE` (2.0e+100) for missing floats. Always check.
3. **Subsets.** One BUFR message can contain multiple subsets (observation stations). Iterate with `codes_set(msgid, "extractSubset", n)` or read with `/subsetNumber=N/` key prefix.
4. **Descriptor tables must match.** If the BUFR file uses local descriptors not in eccodes' tables, decoding fails. Update eccodes definitions or set `ECCODES_DEFINITION_PATH`.

**Sources:**
- HDF5: hdfgroup.org, docs.h5py.org
- hdf5plugin: github.com/silx-kit/hdf5plugin
- BUFR: community.wmo.int/en/activity-areas/wis/bufr
- eccodes BUFR: confluence.ecmwf.int/display/ECC/BUFR

As of: March 2026
