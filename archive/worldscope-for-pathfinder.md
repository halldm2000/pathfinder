# Worldscope — Companion App Summary for Pathfinder

> This document describes Worldscope from the perspective of an AI agent (like Pathfinder) that
> wants to use it as a downstream tool via MCP. It covers what Worldscope is, what it can do,
> and the full MCP tool surface available for orchestration.

## What Is Worldscope?

Worldscope is an interactive 3D globe platform for Earth data visualization. Built on CesiumJS, it renders a photorealistic globe with real-time data overlays — weather, earthquakes, tropical cyclones, aircraft, ships, satellites, NASA satellite imagery, and more. It was created as a demo and prototyping platform for NVIDIA Earth-2 digital twin technology.

**Think of it as Google Earth meets Windy.com, controllable by AI agents via MCP.**

### Key Characteristics
- **Web-based**: Runs in a browser (React 18 + TypeScript + CesiumJS 1.139)
- **AI-native**: Built from the ground up to be operated by AI agents via 120 MCP tools
- **Extensible**: 12 extensions (apps, data packs, themes) auto-discovered at startup
- **Multi-provider AI**: Supports Anthropic, OpenAI, Ollama, OpenRouter for in-app chat
- **Open source**: Apache 2.0 license

### What It Is NOT
- It is not an AI model — it visualizes data, it doesn't generate predictions
- It is not a backend — it's a frontend visualization tool (a Python backend is planned for Phase 4+)
- It has no knowledge of Pathfinder — it's a general-purpose tool that any MCP client can operate

---

## How to Connect

Worldscope exposes an MCP server with two transports:

### stdio (primary — for Claude Desktop, Claude Code, Cursor)
```json
{
  "mcpServers": {
    "worldscope": {
      "command": "npx",
      "args": ["worldscope-mcp"]
    }
  }
}
```

### HTTP (secondary — for remote clients, ChatGPT Desktop)
Runs on port 3002 when the dev server is active.

### Connection Flow
```
AI Client ←→ MCP Server (stdio/HTTP) ←→ WebSocket Broker (Vite:5173) ←→ Browser
```

The MCP server must be connected to a running Worldscope instance (browser) via the WebSocket broker. If the broker is not connected, tools will return an error asking the user to run `pnpm dev`.

---

## MCP Tool Catalog (120 Tools)

### Navigation & Camera (10 tools)

| Tool | Description |
|------|-------------|
| `core_go-to` | Fly camera to a named place or coordinates |
| `core_reset-view` | Reset to default home view |
| `core_zoom-in` | Zoom in one step |
| `core_zoom-out` | Zoom out one step |
| `core_zoom-to` | Set camera to specific altitude in km (0.3 = close, 5 = city, 500 = country, 5000 = continental) |
| `core_face` | Rotate camera to compass direction or heading in degrees |
| `core_look-at` | Position camera near a lat/lon target at specified distance and height, looking toward it |
| `core_orbit` | Start/stop orbiting around a target (lat/lon, distance, speed) |
| `core_set-view-mode` | Switch between 3D globe, 2D flat map, or 2.5D Columbus view |

**Useful sequences:**
- Fly to a storm and orbit it: `core_go-to("Hurricane Milton")` → `core_zoom-to(500)` → `core_orbit(lat, lon)`
- Ground-level view of a city: `core_look-at(lat, lon, distance=200, cameraHeight=30)`
- Establish continental context: `core_go-to("Europe")` → `core_zoom-to(3000)`

### Globe Appearance (13 tools)

| Tool | Description |
|------|-------------|
| `core_base-map` | Switch style: default, satellite, dark, light, road, voyager, topo, blank-black, blank-white |
| `core_toggle-buildings` | Switch photorealistic ↔ OSM buildings |
| `core_toggle-terrain` | Toggle 3D terrain ↔ flat |
| `core_toggle-lighting` | Toggle day/night lighting |
| `core_toggle-water` | Toggle animated ocean water |
| `core_toggle-shadows` | Toggle shadow mapping |
| `core_set-fog` | Control fog density (0–1) |
| `core_set-atmosphere` | Adjust atmosphere brightness and saturation (-1 to 1) |
| `core_set-glow` | Set atmospheric glow color, intensity, thickness |
| `core_reset-glow` | Reset glow to defaults |
| `core_set-time` | Set simulated time of day ("3pm", "midnight", "noon") |
| `core_wireframe` | Toggle wireframe mode |
| `core_presentation-mode` | Hide all UI for clean screenshots |

### Time & Playback (6 tools)

| Tool | Description |
|------|-------------|
| `core_set-date` | Set temporal layer date (YYYY-MM-DD) — affects GIBS satellite imagery and weather |
| `core_get-date` | Get current temporal date |
| `core_step-forward` | Step date forward by one day |
| `core_step-back` | Step date backward by one day |
| `core_playback` | Control time animation: play, pause, toggle. Speed: 0.5x, 1x, 2x, 4x |

**Useful for:** Reviewing satellite imagery over time, animating weather evolution, showing seasonal changes.

### Layer Management (14 tools)

| Tool | Description |
|------|-------------|
| `layers_toggle` | Toggle any data layer on/off by name or ID |
| `layers_list` | List all available layers and their current status |
| `layers_hide-all` | Turn off all data layers at once |
| `layers_set-opacity` | Set layer transparency (0 = invisible, 1 = opaque) |
| `layers_set-brightness` | Adjust layer brightness (0–3, default 1) |
| `layers_set-contrast` | Adjust layer contrast (0–3, default 1) |
| `layers_set-saturation` | Adjust layer saturation (0–3, default 1; 0 = grayscale) |
| `layers_set-color` | Set stroke color of vector layers (CSS colors or hex) |
| `layers_set-width` | Set stroke width of vector layers (0.5–10 px) |
| `layers_properties` | Show current visual properties of a layer |
| `layers_reset` | Reset layer properties to defaults |
| `layers_set-clustering` | Enable/disable entity clustering on GeoJSON layers |
| `labels_toggle` | Toggle road/city labels overlay |
| `openseamap_toggle` | Toggle nautical chart overlay |

### NASA GIBS Satellite Imagery (11 tools)

Worldscope integrates NASA's Global Imagery Browse Services — 1,100+ satellite imagery products.

**Preset Layers (4 tools):**
| Tool | Description |
|------|-------------|
| `gibs_toggle` | Toggle preset layers: satellite view (VIIRS true color), night lights, sea surface temperature, clouds |
| `gibs_list` | List preset GIBS layers |
| `gibs-extra_toggle` | Toggle extra layers: vegetation/NDVI, snow cover, aerosol/air quality, land surface temperature |
| `gibs-extra_list` | List extra GIBS layers |

**Full Catalog (5 tools):**
| Tool | Description |
|------|-------------|
| `gibs-catalog_search` | Search 1,100+ GIBS products by keyword, instrument, or category |
| `gibs-catalog_add` | Add any GIBS product to the globe by exact ID or search term |
| `gibs-catalog_remove` | Remove a GIBS product from the globe |
| `gibs-catalog_categories` | List all catalog categories: Atmosphere, Biosphere, Cryosphere, Oceans, etc. |
| `gibs-catalog_active` | List currently displayed GIBS layers |

**Useful sequences:**
- Show what a hurricane looks like from space: `gibs_toggle("satellite view", "show")` → `core_go-to("Hurricane Milton")` → `core_zoom-to(500)`
- Analyze vegetation health: `gibs-extra_toggle("vegetation", "show")` → `core_go-to("Amazon Rainforest")`
- Search for specific data: `gibs-catalog_search("fire")` → `gibs-catalog_add("MODIS_Terra_Thermal_Anomalies_Day")`

### Earthquake Tracking (8 tools)

Real-time USGS earthquake data with magnitude-scaled markers, color coding, and detailed metadata.

| Tool | Description |
|------|-------------|
| `earthquake_show` | Display today's earthquakes worldwide |
| `earthquake_hide` | Hide earthquake layer |
| `earthquake_query` | Filter: minMag, maxMag, nearLat/nearLon, radiusKm, minDepth, maxDepth, sort, limit |
| `earthquake_summary` | Statistics: total count, magnitude range, strongest, most active regions, tsunami alerts |
| `earthquake_select` | Select and fly to an earthquake (by sort: magnitude, time, depth, significance) |
| `earthquake_selected` | Get details about currently selected earthquake |
| `earthquake_deselect` | Clear selection |
| `earthquake_settings` | Set label threshold (minimum magnitude to show labels) |

**Useful sequences:**
- Show strongest quake today: `earthquake_show()` → `earthquake_select(sort="magnitude")`
- Find quakes near a location: `earthquake_query(nearLat=35.68, nearLon=139.69, radiusKm=500, minMag=3)`

### Tropical Cyclone Tracking (5 tools)

Global tropical cyclone data from GDACS with tracks, forecast cones, and wind speed info.

| Tool | Description |
|------|-------------|
| `hurricane_show` | Display all active tropical cyclones worldwide |
| `hurricane_hide` | Hide hurricane layer |
| `hurricane_query` | Filter: basin (atlantic, pacific, indian, etc.), minCategory, activeOnly, flyTo |
| `hurricane_summary` | Statistical summary of global cyclone activity |
| `hurricane_refresh` | Force refresh data (bypass cache) |

### Aircraft Tracking (5 tools)

Real-time aircraft positions from OpenSky Network, colored by altitude.

| Tool | Description |
|------|-------------|
| `flights_show` | Show real-time aircraft worldwide |
| `flights_hide` | Hide flight tracker |
| `flights_query` | Filter: callsign, country, minAlt/maxAlt, sort (altitude/speed/callsign) |
| `flights_summary` | Statistics: aircraft count, altitude distribution, top countries, average speed |
| `flights_cluster` | Toggle entity clustering (groups nearby aircraft) |

### Ship Tracking (4 tools)

Real-time vessel positions via AIS, colored by speed.

| Tool | Description |
|------|-------------|
| `ships_show` | Show real-time vessels worldwide |
| `ships_hide` | Hide ship tracker |
| `ships_query` | Filter: name, MMSI, minSpeed/maxSpeed, sort |
| `ships_summary` | Statistics: vessel count, speed distribution |

### Satellite Orbit Tracking (7 tools)

Real-time orbital positions and tracks for satellites.

| Tool | Description |
|------|-------------|
| `satellite_show` | Show orbiting satellites |
| `satellite_hide` | Hide satellite tracker |
| `satellite_track` | Focus on a specific satellite by name (e.g., "ISS", "Hubble") |
| `satellite_query` | Search by name, orbit type (LEO/MEO/GEO/HEO), altitude |
| `satellite_isolate` | Show only tracked satellite's orbit vs all orbits |
| `satellite_follow` | Lock camera above satellite and follow it |
| `satellite_cluster` | Toggle entity clustering |

### Weather (6 tools)

Current weather layers (being expanded significantly — see Weather App section below).

| Tool | Description |
|------|-------------|
| `weather_show` | Activate weather extension, show all layers |
| `weather_hide` | Hide all weather layers |
| `weather_show-radar` | Toggle live precipitation radar |
| `weather_show-precipitation` | Toggle satellite precipitation |
| `weather_show-clouds` | Toggle cloud cover |
| `weather_report` | Current weather status and camera location |

### Scene Queries (6 tools)

Read-only tools for understanding the current state of the globe.

| Tool | Description |
|------|-------------|
| `query_camera` | Get camera position (lat, lon, altitude, heading, pitch) |
| `query_layers` | List all layers and their on/off status |
| `query_scene` | Full scene state: camera, layers, base map, buildings, lighting |
| `query_screenshot` | Capture screenshot for AI visual analysis |
| `query_elevation` | Get terrain elevation at lat/lon |
| `query_console` | Read browser console errors (debugging) |

### File Import (2 tools)

| Tool | Description |
|------|-------------|
| `file_load` | Open file picker for KML, KMZ, CZML, GPX, GeoJSON |
| `file_clear` | Remove all loaded file data |

### Agent Communication (2 tools)

| Tool | Description |
|------|-------------|
| `core_post-message` | Post a message to shared agent message board (from: "pathfinder") |
| `core_read-messages` | Read recent messages from other agents |

### Extension Management (3 tools)

| Tool | Description |
|------|-------------|
| `core_list-apps` | List all extensions and their status |
| `core_activate-app` | Activate an extension by ID |
| `core_deactivate-app` | Deactivate an extension |

---

## Weather App (Planned — In Development)

A major new feature app inspired by Windy.com, adding:

- **Animated wind particles** on the globe (GPU-accelerated, 5K-100K particles)
- **Scalar field overlays**: temperature, precipitation, pressure, cloud cover, humidity
- **14-day forecast timeline** with scrubbing and playback
- **Multiple NWP models**: GFS, ECMWF IFS, ECMWF AIFS, ICON, JMA (via Open-Meteo)
- **AI weather models**: Pangu-Weather, FourCastNet, Atlas, GraphCast, CorrDiff, StormCast (via Earth2Studio backend)
- **Pressure level selection**: surface, 850, 700, 500, 300, 250, 200 hPa
- **Windy-style colormaps** with scientific alternatives (viridis)
- **Offline caching** for conference demos

### Planned Weather MCP Commands
When the weather app is complete, these additional tools will be available:
- `weather:show {variable}` — display a specific weather variable
- `weather:model {name}` — switch forecast model
- `weather:level {hPa}` — change pressure level
- `weather:time {timestamp}` — jump to forecast time
- `weather:wind` — toggle wind particle animation
- `weather:forecast {location}` — point forecast for a location
- `weather:run {ai-model}` — trigger AI model inference on backend
- `weather:list-models` — discover available models
- `weather:list-variables` — discover available variables
- `weather:status` — current weather app state
- All return structured JSON results

### Python Backend (Planned)
A FastAPI backend at `backend/` will handle:
- Earth2Studio AI model inference
- GRIB2/NetCDF/Zarr format decoding
- HEALPix regridding (via earth2grid)
- Data caching and tiling

The backend runs locally or offloads to a remote GPU machine (DGX Spark). Auto-discovered by the frontend with manual URL fallback.

---

## Orchestration Patterns for AI Agents

### Pattern 1: Narrated Demo
Fly the camera through a sequence of locations while toggling relevant data layers, building a visual narrative.

```
core_go-to("Pacific Ocean") → core_zoom-to(5000)
earthquake_show() → earthquake_select(sort="magnitude")
"The strongest earthquake today is a M6.2 in the Tonga Trench..."
core_orbit(lat, lon, distance=500)
query_screenshot() → [describe what's visible]
```

### Pattern 2: Multi-Layer Analysis
Combine satellite imagery with real-time data for contextual analysis.

```
gibs_toggle("satellite view", "show")
hurricane_show()
hurricane_query(basin="atlantic", activeOnly=true, flyTo=true)
gibs-catalog_search("cloud top temperature")
gibs-catalog_add("MODIS_Aqua_Cloud_Top_Temp_Night")
query_screenshot() → [AI analyzes the composite view]
```

### Pattern 3: Time Series Review
Step through dates to show temporal evolution.

```
core_go-to("California wildfires")
core_zoom-to(200)
gibs_toggle("satellite view", "show")
core_set-date("2025-01-07") → query_screenshot()
core_step-forward() → query_screenshot()
core_step-forward() → query_screenshot()
[AI narrates changes between frames]
```

### Pattern 4: Weather Model Comparison (Future)
When the weather app is complete, compare AI vs. NWP models.

```
weather:model("gfs") → weather:show("temperature") → weather:time("+48h")
query_screenshot() → [capture GFS view]
weather:model("atlas") → query_screenshot() → [capture Atlas view]
[AI compares and explains differences]
```

---

## Technical Notes

### Performance
- **Frame budget**: 16ms target (60fps), 33ms minimum (30fps)
- **Colormaps**: Perceptually uniform only (viridis default, no rainbow/jet)
- **Entity clustering**: All GeoJSON layers use EntityCluster (pixelRange=45, minimumClusterSize=3)
- **Quality presets**: low/medium/high/ultra affect shadow resolution, fog density, building detail

### Data Conventions
- All data displays must have legends/scale bars with units
- Dark mode is default; light mode is variant
- No secrets in client code — API tokens in `.env` only

### Extension System
Worldscope has 12 extensions across 8 kinds: app, data-pack, capability, globe, compute-backend, ai-provider, ai-skill, theme. Extensions are auto-discovered from directory patterns — adding a new extension never requires editing core files.
