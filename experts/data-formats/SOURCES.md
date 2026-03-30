# Data Formats Expert: Sources

Sources for ingestion and ongoing monitoring. Organized by type and priority.

## Primary Sources (check weekly)
Last checked: never

### Core Libraries
- **xarray GitHub**: github.com/pydata/xarray (releases, changelog, new backend engines)
- **zarr-python GitHub**: github.com/zarr-developers/zarr-python (v3 transition, API changes)
- **eccodes GitHub**: github.com/ecmwf/eccodes (releases, new parameter tables, BUFR updates)
- **cfgrib GitHub**: github.com/ecmwf/cfgrib (releases, xarray integration changes)
- **rasterio GitHub**: github.com/rasterio/rasterio (releases, GDAL compatibility)
- **h5py GitHub**: github.com/h5py/h5py (releases, HDF5 version compatibility)

### Zarr Ecosystem (fast-moving)
- **Zarr specs**: zarr-specs.readthedocs.io (v3 specification updates)
- **kerchunk GitHub**: github.com/fsspec/kerchunk (reference file format changes)
- **VirtualiZarr GitHub**: github.com/zarr-developers/VirtualiZarr (new xarray integration)
- **rechunker GitHub**: github.com/pangeo-data/rechunker
- **Icechunk GitHub**: github.com/earth-mover/icechunk (transactional Zarr storage)

### Standards
- **CF Conventions**: cfconventions.org (standard name table updates, convention version changes)
- **GeoParquet spec**: geoparquet.org (version updates, adoption)
- **COG spec**: cogeo.org (best practices updates)

## Secondary Sources (check monthly)
Last checked: never

### Cloud Data Platforms
- **Pangeo**: pangeo.io (cloud-native data patterns, community conventions)
- **Microsoft Planetary Computer**: planetarycomputer.microsoft.com (STAC catalogs, data format choices)
- **Google ARCO ERA5**: cloud.google.com/datasets (Zarr format updates for ERA5 archive)
- **AWS Open Data**: registry.opendata.aws (new weather/climate datasets, format choices)

### Data Access Libraries
- **fsspec GitHub**: github.com/fsspec/filesystem_spec (new filesystem backends, caching)
- **numcodecs GitHub**: github.com/zarr-developers/numcodecs (new codecs, blosc updates)
- **netCDF4-python GitHub**: github.com/Unidata/netcdf4-python (releases, HDF5 version compat)
- **rio-cogeo GitHub**: github.com/cogeotiff/rio-cogeo (COG creation updates)
- **GDAL GitHub**: github.com/OSGeo/gdal (releases, new drivers, COG improvements)
- **rioxarray GitHub**: github.com/corteva/rioxarray

### Community and Conferences
- **Pangeo Discourse**: discourse.pangeo.io (format discussions, best practices)
- **SciPy Conference** (July) -- scientific Python, often has xarray/Zarr talks
- **AGU Fall Meeting** (December) -- data management sessions
- **EGU General Assembly** (April) -- ESSI division, data standards

## Ingestion Notes

- zarr-python v3 transition is the highest-priority monitoring target. API changes can break code guidance.
- xarray backend engine changes affect all format reading advice (e.g., v0.12.0 Earth2Studio switch from cfgrib to pygrib).
- CF Conventions updates (annual) affect metadata guidance.
- New compression codecs or filter combinations are worth capturing but change slowly.
- GDAL releases can add new COG features or change default behaviors.
- GeoParquet adoption is growing -- watch for new cloud platform support.
