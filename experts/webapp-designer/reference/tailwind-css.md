### Tailwind CSS

**What it is:** Utility-first CSS framework. Instead of writing custom CSS, you compose utilities in HTML class attributes. Enables rapid, consistent styling with built-in design system constraints.

**Key details (as of March 2026):**
- **Tailwind v4:** CSS-first configuration. Define your theme in CSS with `@theme` instead of `tailwind.config.js`. JIT (just-in-time) is the only mode — all utilities generated on demand.
- **v4 migration:** `@apply` still works. `tailwind.config.js` still supported but deprecated for new projects. New `@theme` block in CSS replaces config file.

**Design system setup:**
```css
/* globals.css */
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.7 0.15 250);
  --color-surface: oklch(0.15 0.01 250);
  --color-surface-raised: oklch(0.2 0.01 250);
  --color-text: oklch(0.9 0.01 250);
  --color-text-muted: oklch(0.6 0.01 250);
  --radius-default: 0.5rem;
  --spacing-panel: 1rem;
}
```

**Dark theme pattern (recommended for viz apps):**
```html
<html class="dark">
<!-- Use dark: prefix for light overrides if needed -->
<div class="bg-surface text-text">
```

**Key utility patterns for UI design:**
- **Spacing:** `p-4` (1rem), `gap-3` (0.75rem), `space-y-2` (0.5rem between children). Stick to the scale: 1, 2, 3, 4, 6, 8, 12, 16.
- **Flexbox/Grid:** `flex items-center gap-2` for horizontal layouts. `grid grid-cols-[240px_1fr]` for sidebar+main.
- **Responsive:** `md:grid-cols-2 lg:grid-cols-3` — mobile-first breakpoints.
- **Glassmorphism (floating panels):** `bg-black/70 backdrop-blur-sm rounded-lg border border-white/10`
- **Transitions:** `transition-colors duration-200` for hover states. `transition-all duration-300` for layout shifts.
- **Focus states:** `focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none`

**Tailwind + shadcn/ui theming:**
shadcn/ui uses CSS variables for theming. Define your palette once, all components inherit:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --primary: 250 80% 60%;
  /* ... */
}
.dark {
  --background: 250 10% 8%;
  --foreground: 0 0% 95%;
  --primary: 250 80% 70%;
}
```

**Common pitfalls:**
- Don't use arbitrary values (`w-[347px]`) when a scale value works. Arbitrary values bypass the design system.
- Don't nest Tailwind classes in CSS `@apply` for everything — defeats the purpose. Use `@apply` only for base element styles.
- Don't forget `sr-only` for screen-reader-only text on icon buttons.
- Don't skip the `group` and `peer` utilities for parent/sibling-dependent styles.

**Performance:** Tailwind v4 produces minimal CSS. No purging step needed — it only generates what you use. Typical output: 10–30KB gzipped for a full app.

As of: March 2026
