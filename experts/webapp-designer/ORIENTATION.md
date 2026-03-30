# Webapp Designer Orientation: Design-First Web Development

Actionable reference for the Webapp Designer expert. Opinionated design guidance, framework selection, and patterns for building beautiful, performant web applications with emphasis on scientific visualization, data dashboards, and interactive/game-like experiences.

Last updated: March 2026.

## Field Map

Modern web application design sits at the intersection of UI/UX design principles, frontend framework engineering, and domain-specific visualization. The key tension: frameworks move fast but design principles are stable. The expert's value is applying timeless design judgment through modern tools. Target applications include scientific visualization dashboards (like Worldscope/CesiumJS globe apps), data-rich interfaces, interactive simulations, and game-like web experiences.

## Design System Fundamentals

### Visual Hierarchy
- **Size, contrast, color, spacing** — in that order of impact. The most important element should be largest and highest-contrast.
- **F-pattern for content pages, Z-pattern for landing pages.** Dashboard layouts: primary content center-right, controls left sidebar or top bar, status/metadata bottom or right panel.
- **Whitespace is a design element.** Cramped UIs feel amateur. Use spacing scale: 4px base, multiples of 4 (8, 12, 16, 24, 32, 48, 64).
- **One focal point per view.** If everything is emphasized, nothing is.

### Color
- **Start with 1 primary + 1 neutral palette.** Add accent colors only for semantic meaning (success, warning, error, info).
- **Dark themes for data/viz apps.** Dark backgrounds make data visualizations pop and reduce eye strain for long sessions. Use `hsl()` for systematic color manipulation.
- **Contrast ratios:** 4.5:1 minimum for body text (WCAG AA), 3:1 for large text and UI components.
- **Scientific viz palettes:** Use perceptually uniform colormaps (viridis, plasma, inferno). Never use rainbow/jet — it distorts data perception. As of 2025, D3 ships with these built in.

### Typography
- **System font stack for UI:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` — fast, native feel.
- **Inter or Geist for custom:** Both are variable-weight, excellent for dashboards and technical UI. Free, well-hinted.
- **Monospace for data:** `'JetBrains Mono'`, `'Fira Code'`, or `'IBM Plex Mono'` for code and numerical data.
- **Type scale:** Use a modular scale (1.25 ratio is reliable). Body: 14–16px. Don't go below 12px for anything readable.

### Animation & Microinteractions
- **Duration:** 150–300ms for UI transitions. Under 100ms feels instant (use for hover). Over 500ms feels sluggish.
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` (Material standard) for most moves. `ease-out` for entrances, `ease-in` for exits.
- **What to animate:** State changes, route transitions, hover/focus feedback, loading states, data updates. Don't animate static content.
- **GSAP for complex sequences.** Framer Motion for React component animations. CSS transitions for simple hover/state changes. Don't mix animation systems in one project.

### Layout Patterns for Target Applications

**Scientific Dashboard (e.g., Worldscope-style):**
- Full-viewport, no scroll. Sidebar (240–300px) for controls, main area for visualization.
- Floating panels over the viz for contextual info. Semi-transparent backgrounds (e.g., `bg-black/70 backdrop-blur-sm`).
- Controls grouped by function, collapsible sections. Toggle switches over checkboxes for on/off states.
- Status bar at bottom: coordinates, zoom level, data timestamp, FPS.

**Data Explorer:**
- Split pane: filters/facets left, results center, detail right. Resizable panes.
- Table views: sticky headers, alternating row shading (subtle, 2–3% opacity difference), inline actions on hover.
- Charts: tooltip on hover with exact values, click to drill down, legend outside chart area.

**Game / Interactive Simulation:**
- Canvas/WebGL fills viewport. HUD overlays with pointer-events: none except on interactive elements.
- Minimal chrome — game UI should feel immersive. Controls at screen edges or as contextual popups.
- Performance budget: 60fps minimum. Use `requestAnimationFrame`, avoid DOM manipulation in game loop.

## Framework Selection Guide

Choose based on the project's primary need:

| Need | Recommendation | Why |
|------|---------------|-----|
| Complex state, large app | **React + Next.js** | Ecosystem depth, component libraries, SSR/SSG |
| Lightweight interactivity | **Svelte / SvelteKit** | Minimal bundle, reactive by default, less boilerplate |
| 3D globe / geospatial | **CesiumJS** (with React or vanilla) | Purpose-built, terrain, imagery layers, entity system |
| Custom 3D scenes | **Three.js** (+ React Three Fiber if React) | Dominant 3D-on-web library, huge ecosystem |
| Data visualization | **D3.js** for custom, **Observable Plot** for quick, **Plotly** for interactive dashboards | D3 = full control, Plot = fast, Plotly = least code |
| 2D games / sprites | **Pixi.js** or **Phaser** | Pixi for renderer, Phaser for full game framework |
| Styling | **Tailwind CSS** | Utility-first, design-system-friendly, tree-shakes |
| Component library | **shadcn/ui** (React) or **Melt UI** (Svelte) | Unstyled primitives you own, built on Radix/accessible |

**Default stack for new projects:** Next.js + Tailwind + shadcn/ui. Override when the project demands something else.

### Key Framework Facts (as of March 2026)

- **Next.js 15:** App Router is stable and default. Server Components by default. `use client` directive for interactive components.
- **Tailwind CSS v4:** New engine, CSS-first config (`@theme` in CSS instead of `tailwind.config.js`). JIT is the only mode.
- **shadcn/ui:** Not a package — you copy components into your project. Built on Radix UI primitives. Fully customizable.
- **Three.js r170+:** WebGPU renderer available alongside WebGL. React Three Fiber v9 matches.
- **Svelte 5:** Runes (`$state`, `$derived`, `$effect`) replace stores and reactive declarations. SvelteKit 2 stable.
- **D3.js v7:** ES modules, tree-shakeable. Observable Plot is D3's higher-level companion.

## Browser Tools & Visual QA

When Chrome MCP or browser automation tools are available, use this workflow:

**Development QA loop:**
1. Start/check dev server is running
2. Navigate to the page being worked on
3. Take a screenshot — evaluate layout, spacing, color, visual hierarchy
4. Check console for errors and warnings
5. Test responsive: resize viewport or set device emulation
6. Interact: click controls, verify state changes, check transitions

**What to look for in screenshots:**
- Alignment: are elements on the same grid line?
- Spacing: is whitespace consistent and intentional?
- Color: does the palette feel cohesive? Are contrast ratios sufficient?
- Typography: is the hierarchy clear? Is text readable at actual size?
- Empty states: what does the UI look like with no data?
- Loading states: are spinners/skeletons in place?

**Console checks:**
- React hydration mismatches
- Missing key props in lists
- Failed network requests (CORS, 404)
- WebGL context lost warnings
- Performance warnings (layout thrashing, forced reflows)

## Performance Budgets

| Metric | Target | Why |
|--------|--------|-----|
| LCP (Largest Contentful Paint) | < 2.5s | Core Web Vital |
| INP (Interaction to Next Paint) | < 200ms | Core Web Vital (replaced FID in March 2024) |
| CLS (Cumulative Layout Shift) | < 0.1 | Core Web Vital |
| Bundle size (initial JS) | < 200KB gzipped | Acceptable for complex apps |
| 3D/game frame rate | 60fps sustained | Below 30fps is unacceptable |
| Time to interactive (viz app) | < 4s | Users expect viz apps to be heavier |

**Quick wins:** Lazy-load below-fold content. Code-split routes. Compress textures (basis/ktx2 for WebGL). Use `will-change` sparingly. Prefer CSS transitions over JS animation for simple effects.

## Asset & Sound Guidance

**Icons:** Lucide (React/Svelte), Heroicons, or Phosphor. Pick one family per project for consistency. Avoid mixing icon styles.

**Images/textures:** For AI-generated assets, provide specific prompts: subject + style + color palette + mood + technical specs ("seamless texture, 512x512, dark theme, muted blues"). Use WebP format, provide srcset for responsive images.

**Sound:** Subtle audio feedback elevates interactive/game UIs. Short (50–200ms) tonal sounds for interactions. Lower pitch for errors, higher for success. Volume control and mute toggle are mandatory. Web Audio API for synthesis, preloaded `<audio>` for samples.

**Fonts:** Self-host with `font-display: swap`. Subset to used character ranges. Variable fonts save bandwidth over multiple weights.
