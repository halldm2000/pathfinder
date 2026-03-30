### Web Performance Optimization

**What it is:** Making web applications fast — fast to load, fast to interact with, fast to render. Performance is a design feature: a beautiful app that stutters or takes 5 seconds to load is not beautiful.

**Core Web Vitals (as of March 2026):**

| Metric | Good | Needs Work | Poor | Measures |
|--------|------|------------|------|----------|
| LCP | < 2.5s | 2.5–4s | > 4s | Loading: when largest content appears |
| INP | < 200ms | 200–500ms | > 500ms | Interactivity: response to user input |
| CLS | < 0.1 | 0.1–0.25 | > 0.25 | Stability: unexpected layout shifts |

Note: INP (Interaction to Next Paint) replaced FID in March 2024. It measures all interactions, not just first input.

**Loading performance:**

- **Code splitting:** Next.js does route-based splitting automatically. For heavy components, use `dynamic()` (Next.js) or `lazy()` (React) with Suspense.
```jsx
const HeavyViz = dynamic(() => import('./HeavyViz'), {
  loading: () => <Skeleton className="w-full h-96" />,
  ssr: false, // Skip SSR for WebGL/Canvas components
})
```
- **Bundle analysis:** `npx next build && npx @next/bundle-analyzer` — find what's bloating your bundle.
- **Tree shaking:** Import specific functions, not entire libraries. `import { scaleLinear } from 'd3-scale'` not `import * as d3 from 'd3'`.
- **Image optimization:** Next.js `<Image>` with `sizes` prop. Use `priority` for above-fold images. WebP/AVIF automatic.
- **Font optimization:** `next/font` self-hosts at build time. Subset to used ranges. Variable fonts save requests.

**Rendering performance:**

- **Avoid layout thrashing:** Don't read then write DOM in alternation. Batch reads, then batch writes.
```javascript
// BAD: read-write-read-write (forces reflow each time)
el.style.width = el.offsetWidth + 10 + 'px'
el2.style.width = el2.offsetWidth + 10 + 'px'

// GOOD: read all, then write all
const w1 = el.offsetWidth
const w2 = el2.offsetWidth
el.style.width = w1 + 10 + 'px'
el2.style.width = w2 + 10 + 'px'
```
- **CSS containment:** `contain: layout paint` on independent widgets — tells browser it can optimize rendering.
- **Virtual scrolling:** For lists > 100 items, use `@tanstack/react-virtual` or `svelte-virtual-list`. Only render visible items.
- **React-specific:** `React.memo` for expensive pure components. `useMemo`/`useCallback` only when profiler shows re-render cost. Don't optimize prematurely.

**WebGL/3D performance:**

- **Draw calls:** The #1 bottleneck. Combine geometries where possible. Use instancing for repeated objects.
- **Texture budget:** Total VRAM for textures. 4K textures at 4 channels = 64MB each. Use compressed textures (KTX2/Basis).
- **Shader complexity:** Fragment shaders run per pixel. At 1080p that's 2M executions per frame. Simplify where possible — move computation to vertex shader when feasible.
- **Render on demand:** `frameloop="demand"` in R3F, `RequestRenderMode` in CesiumJS. Only render when something changes. Saves GPU and battery.

**Monitoring in development:**
```javascript
// Quick FPS counter
let frames = 0, lastTime = performance.now()
function countFPS(now) {
  frames++
  if (now - lastTime >= 1000) {
    console.log(`FPS: ${frames}`)
    frames = 0
    lastTime = now
  }
  requestAnimationFrame(countFPS)
}
requestAnimationFrame(countFPS)
```

- Chrome DevTools Performance tab: record a session, look for long tasks (>50ms)
- Lighthouse: run in DevTools for full audit (set to mobile for worst-case)
- React DevTools Profiler: identify unnecessary re-renders

**Quick wins checklist:**
- [ ] Images: WebP/AVIF, proper `sizes`, lazy-load below fold
- [ ] Fonts: self-hosted, subset, `font-display: swap`
- [ ] JS: code-split heavy routes, tree-shake imports
- [ ] CSS: Tailwind (tree-shakes by default), remove unused styles
- [ ] 3D: render on demand, compress textures, instance repeated geometry
- [ ] Lists: virtualize if > 100 items
- [ ] Network: cache API responses (TanStack Query), prefetch likely navigations

As of: March 2026
