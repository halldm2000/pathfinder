### Animation & Interaction Design

**What it is:** Motion design for web UIs — transitions, microinteractions, scroll effects, and game-like physics. Animation makes interfaces feel alive and communicates state changes. It's a design tool, not decoration.

**Library selection (as of March 2026):**

| Library | Best for | Size |
|---------|----------|------|
| **CSS transitions/animations** | Simple hover, state changes | 0KB |
| **Framer Motion** | React component animations, layout | ~30KB |
| **GSAP** | Complex timelines, scroll-triggered, sequences | ~25KB (core) |
| **Lenis** | Smooth scroll | ~5KB |
| **Spring physics** | Natural-feeling motion (react-spring, motion) | varies |

**Rule: one animation system per project.** CSS for simple states + GSAP for complex sequences, OR Framer Motion for everything in React. Don't mix Framer Motion and GSAP — conflicting animation loops.

**Framer Motion patterns (React):**
```jsx
import { motion, AnimatePresence } from 'framer-motion'

// Enter/exit animations
<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      Content
    </motion.div>
  )}
</AnimatePresence>

// Layout animations (automatic)
<motion.div layout layoutId="shared-element" />

// Spring physics (natural feel)
<motion.div animate={{ x: 100 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} />
```

**GSAP patterns (any framework):**
```javascript
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

// Timeline
const tl = gsap.timeline()
tl.from('.hero-title', { opacity: 0, y: 50, duration: 0.6 })
  .from('.hero-subtitle', { opacity: 0, y: 30, duration: 0.4 }, '-=0.2')
  .from('.cta-button', { opacity: 0, scale: 0.9, duration: 0.3 }, '-=0.1')

// Scroll-triggered
gsap.from('.section', {
  scrollTrigger: { trigger: '.section', start: 'top 80%' },
  opacity: 0, y: 60, duration: 0.8, stagger: 0.15
})
```

**Microinteraction design rules:**
- **Button press:** Scale down 2–3% on active (`active:scale-[0.97]`), spring back. Subtle but tactile.
- **Hover:** Color shift + slight elevation (shadow increase). 150ms transition.
- **Toggle:** Slide + color change simultaneously. Include haptic feedback on mobile if available.
- **Loading:** Skeleton screens over spinners (less jarring). Pulse animation on skeletons.
- **Success/error:** Brief color flash + icon. Don't rely on color alone (accessibility).
- **Drag:** Element follows cursor with slight lag (spring physics). Drop target highlights on proximity.

**Scroll-driven patterns:**
- **Parallax:** Background moves slower than foreground. Use `transform: translate3d()` for GPU acceleration. Keep subtle — 10–20% rate difference.
- **Reveal on scroll:** Fade + slide up as elements enter viewport. Stagger siblings by 100–150ms.
- **Progress indicator:** Scroll position mapped to a progress bar or section indicator.
- **Sticky transitions:** Section headers stick, then transform/fade as next section pushes them out.

**Game loop pattern (for interactive/game UIs):**
```javascript
let lastTime = 0
function gameLoop(timestamp) {
  const deltaTime = (timestamp - lastTime) / 1000
  lastTime = timestamp

  update(deltaTime)  // Physics, logic
  render()           // Draw frame

  requestAnimationFrame(gameLoop)
}
requestAnimationFrame(gameLoop)
```
Keep update and render separate. Never do DOM reads in render. Target 16.67ms per frame (60fps).

**Performance rules:**
- Animate only `transform` and `opacity` — these are GPU-composited. Animating `width`, `height`, `top`, `left` triggers layout and is 10x slower.
- Use `will-change: transform` sparingly — on elements about to animate, remove after.
- `requestAnimationFrame` for JS animations. Never `setInterval`.
- Test on low-end devices. Reduce or disable animation when `prefers-reduced-motion: reduce` is set.

As of: March 2026
