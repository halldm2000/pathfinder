# Webapp Designer: Retrieval Strategy

## Three-Tier Hierarchy

### Tier 1: Orientation Doc (always loaded)
Covers: design principles (hierarchy, color, typography, animation), framework selection guide, layout patterns for target app types, performance budgets, asset guidance, browser QA workflow.

**Use for:** "Which framework should I use for X?", "How should I lay out a dashboard?", "What's the right color approach for a data viz app?", general design questions.

### Tier 2: Reference Docs (read on demand)
9 reference docs covering deep knowledge on specific tools and techniques:

| File | Covers | Read when |
|------|--------|-----------|
| `react-nextjs.md` | React, Next.js 15, Server Components, shadcn/ui setup | Building a React/Next.js app, component patterns |
| `tailwind-css.md` | Tailwind v4, CSS-first config, dark theme, utility patterns | Styling questions, Tailwind setup, theming |
| `scientific-viz.md` | D3, Three.js, CesiumJS, Deck.gl, colormaps, WebGL data textures | Scientific visualization, data rendering |
| `threejs-webgl.md` | Three.js, React Three Fiber, shaders, 3D scene design | 3D scenes, custom rendering, WebGL |
| `animation-interaction.md` | Framer Motion, GSAP, microinteractions, scroll effects, game loops | Animation, transitions, interactive motion |
| `component-libraries.md` | shadcn/ui, Radix, Melt UI, design system construction | Component selection, design system setup |
| `game-interactive.md` | Pixi.js, Phaser, game architecture, input, audio, asset pipeline | Game-like web apps, real-time interaction |
| `browser-qa.md` | Chrome MCP workflow, visual QA checklist, common visual bugs | Visual debugging, screenshot QA, console checks |
| `performance.md` | Core Web Vitals, loading, rendering, WebGL perf, optimization | Performance issues, optimization, profiling |

**Typical query pattern:** 1–2 reference docs loaded per question. Design question → orientation doc is sufficient. Implementation question → orientation doc + relevant reference doc.

### Tier 3: Web Search (last resort)
**Use for:** Framework version changes after early 2025, new library releases, specific API details not in reference docs, CSS tricks for edge cases, community patterns and examples.

**If web search happens for >20% of questions,** the reference docs need expansion. Common expansion candidates: SVG patterns, accessibility deep-dive, deployment/hosting patterns, specific CSS layout techniques.

## Search Patterns

**Framework question:** Check orientation doc framework table → if more depth needed, read the relevant framework reference doc → web search only for version-specific API details.

**Design question:** Orientation doc design system section is usually sufficient. For domain-specific design patterns (e.g., "how should a weather dashboard lay out controls?"), combine orientation doc layout patterns with domain knowledge from the user.

**"How do I do X in [library]?"** Read the library's reference doc first. If the reference doc has a code example, use it. Web search only if the reference doc doesn't cover that specific API.

**Bug/issue:** Browser QA reference doc for the debugging workflow. Console errors → relevant framework reference doc for known pitfalls. Web search for specific error messages.
