### React + Next.js Ecosystem

**What it is:** React is the dominant UI library for complex web applications. Next.js is its production framework — handles routing, SSR/SSG, API routes, and deployment. Together they're the default choice for large, stateful web apps.

**Key details (as of March 2026):**
- Next.js 15 App Router: file-based routing in `app/` directory. Layouts, loading states, error boundaries built into the file system.
- Server Components are the default. Add `'use client'` directive only for components that need browser APIs, state, or event handlers.
- Server Actions (`'use server'`) for form handling and mutations without API routes.
- Image optimization: `next/image` with automatic WebP/AVIF, lazy loading, blur placeholders.
- Font optimization: `next/font` — self-hosts Google Fonts at build time, zero layout shift.

**Design-relevant patterns:**
- **Component composition:** Build a design system bottom-up: primitives (Button, Input, Card) → composites (SearchBar, DataTable) → layouts (DashboardShell, SplitPane).
- **CSS approach:** Tailwind CSS via `className`. For dynamic styles, use `clsx` or `cn()` utility from shadcn/ui. Avoid inline style objects for anything but truly dynamic values (positions, dimensions from data).
- **State management:** React Context for theme/layout state. Zustand for complex client state (simpler than Redux, no boilerplate). Server state via TanStack Query (formerly React Query) for API data with caching.
- **Suspense boundaries:** Wrap data-fetching components in `<Suspense fallback={<Skeleton />}>` for streaming SSR and graceful loading states.

**shadcn/ui integration:**
```bash
npx shadcn@latest init
npx shadcn@latest add button card dialog dropdown-menu
```
Components are copied into `components/ui/`. You own them — customize freely. Built on Radix UI (accessible, unstyled primitives). Styled with Tailwind. Theme via CSS variables in `globals.css`.

**Common pitfalls:**
- Don't `'use client'` everything — push client boundaries as low as possible in the component tree.
- Don't fetch data in client components when Server Components can do it.
- Don't use `useEffect` for data fetching — use Server Components or TanStack Query.
- Don't skip loading/error states — they're free with the App Router file conventions.

**When NOT to use React/Next.js:**
- Simple interactive widget → Svelte (less overhead)
- Static site with minimal JS → Astro
- Full 3D/game → Three.js/Pixi.js direct (React Three Fiber adds overhead for game loops)

As of: March 2026
