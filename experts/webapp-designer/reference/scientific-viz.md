### Scientific Visualization on the Web

**What it is:** Rendering scientific data — weather fields, volumetric data, geospatial overlays, simulation output — in the browser. Requires specialized libraries and careful attention to perceptual accuracy and performance.

**Library landscape (as of March 2026):**

| Library | Best for | Rendering | Complexity |
|---------|----------|-----------|------------|
| **D3.js v7** | 2D charts, custom data viz | SVG/Canvas | High (full control) |
| **Observable Plot** | Quick exploratory charts | SVG | Low (D3's high-level companion) |
| **Plotly.js** | Interactive dashboards, 3D surfaces | SVG/WebGL | Low (declarative API) |
| **Three.js r170+** | Custom 3D scenes, volumes, particles | WebGL/WebGPU | High |
| **CesiumJS** | 3D globe, geospatial, terrain | WebGL | Medium (purpose-built) |
| **Deck.gl** | Large-scale geospatial overlays | WebGL | Medium (layer-based) |
| **Regl** | Low-level WebGL, custom shaders | WebGL | High (thin wrapper) |

**Colormap rules for scientific data:**
- **Never use rainbow/jet.** It distorts perception — creates false boundaries, hides gradients, and is inaccessible to colorblind users.
- **Perceptually uniform:** viridis (default), plasma (high contrast), inferno (dark background), magma (gentle). All in D3 (`d3.interpolateViridis`).
- **Diverging data** (anomalies, departures from mean): Use two-hue diverging maps (e.g., blue-white-red for temperature anomaly). Ensure the midpoint is perceptually neutral.
- **Categorical:** Use qualitative palettes with maximum perceptual distance (D3 `schemeTableau10`). Limit to 8–10 categories — beyond that, use a different encoding.

**WebGL/Three.js patterns for scientific data:**

*Data textures:* Upload scalar fields as `DataTexture` (float or half-float). Sample in fragment shader with custom colormap. This is the fastest path for large 2D fields.

```javascript
const texture = new THREE.DataTexture(
  float32Array, width, height,
  THREE.RedFormat, THREE.FloatType
);
texture.needsUpdate = true;
```

*Volume rendering:* Ray marching in a fragment shader through a 3D texture. Use `THREE.Data3DTexture`. Transfer function maps density → color + opacity.

*Particle systems:* GPU-driven particles via instanced meshes or transform feedback. For wind visualization: seed particles, advect by velocity field each frame, fade trails.

**CesiumJS integration patterns:**
- `ImageryProvider` for 2D overlays on the globe (weather fields, satellite imagery)
- `Entity` system for discrete objects (markers, tracks, labels)
- `Primitive` + custom `Appearance` for GPU-accelerated custom rendering
- `CallbackProperty` for animated/time-varying data
- Performance: use `RequestRenderMode` (render only on change) for non-animated scenes

**Performance for large datasets:**
- Downsample for overview, full resolution on zoom. Level-of-detail (LOD) is essential.
- Use Web Workers for data parsing and processing — keep the main thread free for rendering.
- Prefer typed arrays (`Float32Array`) over JS arrays for numerical data.
- Texture compression: KTX2/Basis for GPU textures (3–6x smaller).
- For datasets > 100MB: stream/tile, don't load all at once.

As of: March 2026
