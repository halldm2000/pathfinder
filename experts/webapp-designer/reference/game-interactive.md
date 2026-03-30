### Game & Interactive Web Experiences

**What it is:** Game-like web applications — real-time simulations, interactive visualizations with physics, sprite-based games, particle systems. These need different patterns than typical web apps: game loops, input systems, asset pipelines, and strict performance budgets.

**Library selection (as of March 2026):**

| Library | Best for | Rendering |
|---------|----------|-----------|
| **Pixi.js v8** | 2D sprites, particles, fast rendering | WebGL/WebGPU |
| **Phaser 3** | Full 2D game framework (physics, audio, scenes) | WebGL via Canvas |
| **Three.js** | 3D games, custom engines | WebGL/WebGPU |
| **PlayCanvas** | 3D games with visual editor | WebGL |
| **Rapier** | Physics (2D/3D), WASM-based | N/A (physics only) |
| **Howler.js** | Game audio, sprite sheets, spatial audio | Web Audio API |

**Architecture pattern — game shell in web app:**
```
App (React/Svelte)
├── GameCanvas (full viewport, pointer-events managed)
│   ├── Renderer (Pixi/Three.js — owns the loop)
│   ├── Input system (keyboard, mouse, touch, gamepad)
│   └── Game state (ECS or simple state machine)
├── HUD overlay (HTML/CSS, positioned absolute over canvas)
│   ├── Score, timer, health bar
│   └── Minimap, inventory
└── Menu system (HTML/CSS, replaces canvas when active)
    ├── Main menu, settings, pause screen
    └── Transitions between menu ↔ game
```

**Why HTML for HUD, not canvas-rendered text:** HTML text is crisper, accessible, easier to style, and doesn't cost draw calls. Canvas/WebGL for rendering the game world; HTML for everything the player reads.

**Input handling:**
```javascript
const keys = new Set()
window.addEventListener('keydown', (e) => keys.add(e.code))
window.addEventListener('keyup', (e) => keys.delete(e.code))

// In update loop:
if (keys.has('ArrowLeft')) player.vx -= acceleration * dt
if (keys.has('Space') && player.grounded) player.vy = jumpForce
```
- Poll in game loop, not in event handlers. Event handlers just update state.
- Support both WASD and arrow keys. Add gamepad via Gamepad API.
- Touch: virtual joystick (nipplejs library) or swipe/tap zones.

**Pixi.js v8 setup:**
```javascript
import { Application, Sprite, Assets } from 'pixi.js'

const app = new Application()
await app.init({
  width: 800, height: 600,
  backgroundAlpha: 0,  // Transparent for overlay on web page
  antialias: true,
})
document.getElementById('game').appendChild(app.canvas)

const texture = await Assets.load('sprite.png')
const sprite = new Sprite(texture)
app.stage.addChild(sprite)

app.ticker.add((ticker) => {
  sprite.x += speed * ticker.deltaTime
})
```

**State management for games:**
- Simple: finite state machine (idle → running → jumping → falling → idle)
- Complex: Entity Component System (ECS) — bitECS for JS, or manual with typed arrays
- Never use React state for per-frame game state. React re-renders are too slow. Use refs or external stores.

**Asset pipeline:**
- **Sprites:** Use texture atlases (TexturePacker, free alternatives). Single image with JSON describing sub-regions. One draw call per atlas instead of per sprite.
- **Audio:** Preload all sounds during loading screen. Use audio sprites (single file, multiple sounds by offset). Howler.js handles this well.
- **Loading:** Show progress bar. Load critical assets first, defer decorative assets. Use `Assets.load()` in Pixi, `THREE.LoadingManager` in Three.js.

**Performance for 60fps:**
- Object pooling: pre-allocate bullets/particles, recycle instead of create/destroy
- Spatial partitioning: grid or quadtree for collision detection when >100 entities
- Offscreen culling: don't render what's not visible
- Delta time: always multiply movement by `dt` — don't tie logic to frame rate
- Memory: avoid allocations in hot loop (no `new Vector2()` per frame — reuse)
- Profile: Chrome DevTools Performance tab → identify long frames

**Sound design for web games:**
- Interaction sounds: 50–100ms, tonal. Click (light tap), hover (subtle whoosh), error (low thud).
- Ambient: looping background. Crossfade between scenes. Start quiet, user can increase.
- Feedback: pitch up for combos/streaks, pitch down for damage/loss. Vary pitch ±5% per play to avoid repetitiveness.
- **Always provide a mute button.** Default to muted on page load (browsers require user gesture for audio anyway).

As of: March 2026
