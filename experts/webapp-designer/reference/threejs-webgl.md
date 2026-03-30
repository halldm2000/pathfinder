### Three.js & WebGL

**What it is:** Three.js is the dominant 3D graphics library for the web. Wraps WebGL (and now WebGPU) in a scene-graph API. React Three Fiber (R3F) provides a React renderer for Three.js.

**Key details (as of March 2026):**
- **Three.js r170+:** WebGPU renderer (`WebGPURenderer`) available alongside `WebGLRenderer`. WebGPU enables compute shaders, better performance on modern hardware. WebGL fallback for broad compatibility.
- **React Three Fiber v9:** Declarative Three.js in React. `<Canvas>`, `<mesh>`, `<boxGeometry>` as JSX. Use `@react-three/drei` for helpers (OrbitControls, Environment, Text, Html overlays).
- **@react-three/postprocessing:** Bloom, SSAO, depth of field, tone mapping. Use `EffectComposer` for multi-pass effects.

**Scene setup pattern:**
```jsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'

function Scene() {
  return (
    <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
      <Environment preset="night" /> {/* or "city", "sunset", etc. */}
      <OrbitControls enableDamping dampingFactor={0.05} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      {/* Your meshes here */}
    </Canvas>
  )
}
```

**Design considerations for 3D UIs:**
- **Camera:** FOV 45–60° for natural perspective. Orthographic for technical/CAD views. Always enable damped orbit controls — instant stops feel jarring.
- **Lighting:** Start with environment map + one directional light. Add lights only when needed. PBR materials (`MeshStandardMaterial`) respond to environment maps realistically.
- **Background:** Dark gradient or environment map. Never plain black (feels empty) or plain white (washes out).
- **Post-processing:** Subtle bloom on emissive materials makes data viz glow. Tone mapping (ACES Filmic) for cinematic look. Don't overdo it — effects should enhance, not distract.
- **HTML overlays:** Use `@react-three/drei`'s `<Html>` component for labels and tooltips that track 3D objects. Set `occlude` to hide behind geometry.

**Performance patterns:**
- **Instancing:** For many identical objects (particles, data points), use `InstancedMesh`. One draw call instead of thousands.
- **LOD:** `THREE.LOD` swaps geometry at distance thresholds. Critical for large scenes.
- **Frustum culling:** On by default in Three.js. Ensure `geometry.computeBoundingSphere()` is called.
- **Frame loop control:** In R3F, use `frameloop="demand"` and `invalidate()` for scenes that don't animate continuously. Saves battery/GPU.
- **Texture management:** Dispose textures and geometries when no longer needed. Three.js doesn't garbage-collect GPU resources.
- **Stats:** Use `@react-three/drei`'s `<Stats>` during development to monitor FPS, draw calls, triangles.

**Custom shaders (GLSL):**
```javascript
const material = new THREE.ShaderMaterial({
  vertexShader: `...`,
  fragmentShader: `...`,
  uniforms: {
    uTime: { value: 0 },
    uDataTexture: { value: dataTexture },
    uColormap: { value: colormapTexture },
  },
  transparent: true,
});
```
Update uniforms in animation loop: `material.uniforms.uTime.value = clock.getElapsedTime()`

**When to use Three.js vs alternatives:**
- Custom 3D scenes, product configurators, data sculptures → Three.js
- 3D globe with geospatial data → CesiumJS (purpose-built, better for maps)
- 2D sprite-heavy games → Pixi.js (optimized for 2D)
- Simple 3D embed → Three.js directly (skip R3F overhead if no React needed)

As of: March 2026
