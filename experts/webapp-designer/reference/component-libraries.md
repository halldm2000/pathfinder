### Component Libraries & Design Systems

**What it is:** Pre-built UI components that provide accessible, consistent building blocks. The right library saves weeks; the wrong one fights you on every customization.

**Recommended libraries (as of March 2026):**

| Library | Framework | Philosophy | Best for |
|---------|-----------|------------|----------|
| **shadcn/ui** | React | Copy-paste, own the code | Custom design systems, full control |
| **Radix UI** | React | Unstyled primitives | Building your own component library |
| **Melt UI** | Svelte | Headless builders | Svelte projects needing accessibility |
| **Headless UI** | React/Vue | Unstyled, accessible | Simple projects, Tailwind-native |
| **Mantine** | React | Batteries-included | Rapid prototyping, data-heavy apps |
| **Ark UI** | React/Vue/Svelte | State machines, headless | Framework-agnostic projects |

**shadcn/ui deep dive (recommended default):**

Setup:
```bash
npx shadcn@latest init  # Sets up tailwind, cn() utility, CSS variables
npx shadcn@latest add button card dialog sheet tabs tooltip
```

File structure it creates:
```
components/
  ui/
    button.tsx      # You own this — customize freely
    card.tsx
    dialog.tsx
    ...
lib/
  utils.ts          # cn() utility for merging classes
```

Key components for dashboard UIs:
- `Sheet` — slide-out panels (mobile nav, detail views)
- `Dialog` — modal confirmations, settings
- `Tabs` — content switching without routing
- `DropdownMenu` — context menus, action menus
- `Tooltip` — hover info on dense UIs
- `Popover` — rich content on click
- `Command` — command palette (⌘K search)
- `Resizable` — split panes for data explorers
- `Sonner` (toast) — notifications

Theming: modify CSS variables in `globals.css`. All components inherit. Dark mode: define `.dark` variables.

**Building a design system from primitives:**

1. **Tokens:** Define in CSS variables — colors, spacing, radii, shadows, type scale.
2. **Primitives:** Button, Input, Select, Checkbox, Toggle, Card, Badge. Use shadcn/ui or Radix.
3. **Composites:** SearchBar (Input + Button), DataCard (Card + Badge + stats), NavItem (icon + label + active state).
4. **Layouts:** PageShell (sidebar + header + main), SplitPane (resizable columns), OverlayPanel (floating detail view).
5. **Patterns:** Loading states (skeleton per component), error states (inline message + retry), empty states (illustration + CTA).

**Naming convention:** PascalCase for components, kebab-case for files. Group by feature, not type:
```
features/
  dashboard/
    DashboardShell.tsx
    MetricsPanel.tsx
    ActivityFeed.tsx
  viz/
    VizCanvas.tsx
    VizControls.tsx
    ColorScaleBar.tsx
```

**Accessibility checklist per component:**
- Keyboard navigable (Tab, Enter, Escape, Arrow keys)
- Focus visible ring (never `outline: none` without replacement)
- ARIA roles and labels (Radix/shadcn handles most of this)
- Color not the sole indicator (add icons or text)
- Reduced motion support (`prefers-reduced-motion`)

As of: March 2026
