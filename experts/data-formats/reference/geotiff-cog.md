### GeoTIFF and Cloud-Optimized GeoTIFF (COG)

**What it is:** GeoTIFF extends the TIFF image format with embedded geospatial metadata -- coordinate reference system (CRS), affine transform, tie points, and GeoKeys. Cloud-Optimized GeoTIFF (COG) adds internal tiling and overviews (image pyramids) so that HTTP range requests can read any spatial subset without downloading the entire file. COG is the standard raster format for cloud-native geospatial (used by STAC catalogs, Google Earth Engine, Microsoft Planetary Computer).

**Key details:**
- GeoTIFF: OGC standard. Single-band or multi-band 2D raster. No time dimension, no vertical levels without stacking files.
- COG: Regular GeoTIFF plus three requirements: (1) tiled storage (not stripped), (2) overviews (reduced resolution copies), (3) optimized IFD (Image File Directory) layout at start of file.
- File sizes: Typical COGs range from MBs to low GBs. For multi-terabyte archives, COG works well with STAC catalogs for indexing.

**Key libraries:**
- **GDAL** (C/C++): Foundation library. Reads 200+ raster formats. Python bindings via `osgeo.gdal` (included with GDAL) or `osgeo` from `gdal` pip package.
- **rasterio** (Python): Pythonic GDAL wrapper. Preferred for Python workflows. `pip install rasterio`.
- **rio-cogeo**: COG creation and validation. `pip install rio-cogeo`.
- **rioxarray**: xarray extension for reading/writing rasters via rasterio. `pip install rioxarray`.

**Reading a GeoTIFF/COG:**
```python
import rasterio
import numpy as np

with rasterio.open("temperature.tif") as src:
    # Metadata
    print(src.crs)        # e.g., EPSG:4326
    print(src.transform)  # affine transform
    print(src.bounds)     # bounding box
    print(src.shape)      # (height, width)
    print(src.count)      # number of bands
    print(src.dtypes)     # data types per band

    # Read all data
    data = src.read()  # shape: (bands, height, width)

    # Read a spatial window
    from rasterio.windows import from_bounds
    window = from_bounds(-100, 30, -90, 40, src.transform)
    subset = src.read(1, window=window)  # band 1 only

# Read from cloud (HTTP range requests on COG)
with rasterio.open("https://example.com/cog.tif") as src:
    subset = src.read(1, window=window)  # only downloads needed tiles
```

**Reading via xarray (with rioxarray):**
```python
import xarray as xr
import rioxarray  # registers the "rasterio" engine

ds = xr.open_dataset("temperature.tif", engine="rasterio")
# or
da = rioxarray.open_rasterio("temperature.tif")
```

**Creating a GeoTIFF:**
```python
import rasterio
from rasterio.transform import from_bounds
import numpy as np

data = np.random.randn(721, 1440).astype("float32")

transform = from_bounds(-180, -90, 180, 90, 1440, 721)

with rasterio.open(
    "output.tif", "w",
    driver="GTiff",
    height=721, width=1440,
    count=1, dtype="float32",
    crs="EPSG:4326",
    transform=transform,
    nodata=np.nan,
) as dst:
    dst.write(data, 1)
    dst.update_tags(DESCRIPTION="Temperature field")
```

**Creating a Cloud-Optimized GeoTIFF:**
```python
import rasterio
from rasterio.transform import from_bounds
import numpy as np

data = np.random.randn(721, 1440).astype("float32")
transform = from_bounds(-180, -90, 180, 90, 1440, 721)

# COG profile: tiled, compressed, with overviews
profile = {
    "driver": "GTiff",
    "height": 721, "width": 1440,
    "count": 1, "dtype": "float32",
    "crs": "EPSG:4326",
    "transform": transform,
    "nodata": np.nan,
    "tiled": True,
    "blockxsize": 512,
    "blockysize": 512,
    "compress": "deflate",
    "predictor": 2,  # horizontal differencing for floats
}

with rasterio.open("output_cog.tif", "w", **profile) as dst:
    dst.write(data, 1)
    # Add overviews
    dst.build_overviews([2, 4, 8, 16], rasterio.enums.Resampling.average)
    dst.update_tags(ns="rio_overview", resampling="average")

# Validate COG compliance
# CLI: rio cogeo validate output_cog.tif
```

**Using rio-cogeo (simplest COG creation):**
```bash
# Convert existing GeoTIFF to COG
rio cogeo create input.tif output_cog.tif --overview-level 5 --blocksize 512

# Validate
rio cogeo validate output_cog.tif

# With GDAL directly
gdal_translate input.tif output_cog.tif -of COG -co COMPRESS=DEFLATE -co OVERVIEW_RESAMPLING=AVERAGE
```

**GDAL virtual rasters (VRT):**
```python
from osgeo import gdal

# Create a virtual mosaic from multiple files
vrt = gdal.BuildVRT("mosaic.vrt", ["tile1.tif", "tile2.tif", "tile3.tif"])
vrt = None  # flush to disk

# Read virtual mosaic as if it were one file
with rasterio.open("mosaic.vrt") as src:
    data = src.read(1)
```

**Common gotchas:**
1. **2D only.** GeoTIFF has no concept of time or vertical dimensions. For multi-time weather data, you need one file per timestep (indexed by STAC) or a different format (NetCDF, Zarr).
2. **CRS matters.** Always check and set CRS explicitly. A GeoTIFF without CRS metadata is just a TIFF. Use `rasterio.crs.CRS.from_epsg(4326)` for geographic coordinates.
3. **Compression choice.** DEFLATE is standard for COG. LZW also works. JPEG is lossy (only for visual/RGB). For float data, use DEFLATE with predictor=2 (horizontal differencing) or predictor=3 (floating point).
4. **Overview resampling.** Use `average` for continuous data (temperature, elevation), `nearest` for categorical data (land use), `mode` for classification maps.
5. **GDAL driver conflicts.** If both `osgeo.gdal` and `rasterio` are imported, ensure they use compatible GDAL versions. Best practice: use rasterio exclusively or osgeo.gdal exclusively, not both in the same script.
6. **Nodata handling.** Always set `nodata` in the profile. Without it, tools cannot distinguish missing data from valid zeros. Check with `src.nodata`.

**Relationship to other formats:** COG is ideal for single-time, single-level visualization products and GIS integration. For multi-dimensional analysis (time series, vertical profiles), use NetCDF or Zarr. Earth2Studio outputs Zarr, which can be post-processed to COG for visualization tile services. Worldscope tile servers could serve COG-derived tiles.

**Sources:**
- COG spec: cogeo.org
- rasterio: rasterio.readthedocs.io, github.com/rasterio/rasterio
- rio-cogeo: github.com/cogeotiff/rio-cogeo
- GDAL COG driver: gdal.org/drivers/raster/cog.html
- STAC spec: stacspec.org

As of: March 2026
