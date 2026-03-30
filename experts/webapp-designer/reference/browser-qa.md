### Browser Tools & Visual QA Workflow

**What it is:** Using Chrome MCP tools, screenshot capabilities, and console access to visually verify and debug web applications during development. This is the expert's "eyes" — it shouldn't trust that CSS looks right in its head, it should see it rendered.

**Available browser capabilities (when MCP tools are connected):**

Chrome MCP may provide:
- **Navigate:** Open URLs, go to specific pages
- **Screenshot:** Capture the current viewport
- **Console:** Read browser console output (errors, warnings, logs)
- **Interact:** Click elements, fill inputs, scroll, resize
- **Evaluate:** Run JavaScript in the page context
- **Network:** Monitor requests and responses

**Visual QA workflow — run after every significant UI change:**

1. **Screenshot the current state.** Look for:
   - Is the layout what you intended? Are elements aligned?
   - Is spacing consistent? Does whitespace feel intentional?
   - Are colors rendering as expected? (monitors vary, but obvious issues are obvious)
   - Is text readable at the actual rendered size?
   - Does the visual hierarchy guide the eye correctly?

2. **Check the console.** Look for:
   - Red errors (fix immediately)
   - Yellow warnings (assess — React key warnings, deprecations)
   - Failed network requests (CORS, 404, 500)
   - WebGL warnings (context lost, extension not supported)
   - Custom app warnings

3. **Test interactions:**
   - Click primary controls — do they respond visually?
   - Hover states — are they visible and consistent?
   - Keyboard navigation — can you Tab through controls?
   - Form submission — do error/success states appear?

4. **Responsive check:**
   - Resize viewport to 768px width (tablet) — does layout adapt?
   - Resize to 375px width (mobile) — does content reflow?
   - For viz/dashboard apps: ensure the main visualization fills available space

5. **Performance spot-check:**
   - Does the page load without visible layout shift?
   - Are animations smooth? (check for jank on scroll, transitions)
   - If 3D/WebGL: is the frame rate acceptable?

**Without browser tools — fallback QA:**

When Chrome MCP is not available, instruct the user:
- "Open the dev server and check [specific thing]. Screenshot or describe what you see."
- "Open DevTools console — any red errors?"
- "Try resizing the browser to tablet width — does the sidebar collapse?"

Always describe what the UI *should* look like so the user can verify:
- "You should see a dark sidebar (240px) on the left with grouped controls, the main viz area filling the remaining width, and a semi-transparent status bar at the bottom."

**Common visual bugs to check for:**
- **Overflow:** Content spilling outside containers (check `overflow-hidden` on parents)
- **Z-index stacking:** Dropdowns/tooltips appearing behind other elements
- **Font loading flash:** Text briefly showing in fallback font (ensure `font-display: swap` and preload critical fonts)
- **Image aspect ratio:** Images stretched or squished (use `object-fit: cover` or `object-contain`)
- **Scrollbar appearance:** Unexpected scrollbars on macOS vs Windows (test `overflow` settings)
- **Dark mode contrast:** Text vanishing against similar-toned backgrounds

**Dev server patterns:**
```bash
# Next.js
npm run dev          # localhost:3000

# Vite (Svelte, vanilla)
npm run dev          # localhost:5173

# Simple static
npx serve .          # localhost:3000
python3 -m http.server 8000  # localhost:8000
```

As of: March 2026
