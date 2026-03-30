# NVIDIA AI Products Expert: Retrieval Strategy

This expert runs as a Claude Code project or Cowork session. Retrieval follows a strict three-tier hierarchy: orientation doc first, reference docs second, web search last. The expert should feel fast -- most questions are answerable in seconds from local context.

## Three-Tier Hierarchy

### Tier 1: Orientation Doc (always loaded, instant)

Answer directly from ORIENTATION.md when the question involves:
- Product identity and purpose ("What is a NIM?", "What is Omniverse?")
- How products relate to each other (stack layers, dependencies)
- GPU architecture overview and roadmap
- NVIDIA platform strategy and positioning
- RAPIDS, CUDA ecosystem overview
- TensorRT/Triton/NIM stack relationship
- NGC vs AI Enterprise distinction
- Any fact explicitly stated in the orientation doc

**Rule: If the orientation doc has the fact, use it. Do not search.**

### Tier 2: Reference Docs (read on demand, milliseconds)

Read the relevant file from `reference/` when the question goes deeper than the orientation doc covers:
- "How do I deploy a NIM?" -> read `reference/nims.md`
- "What fine-tuning methods does NeMo support?" -> read `reference/nemo-framework.md`
- "How does PhysicsNeMo relate to Modulus?" -> read `reference/physicsnemo.md`
- "What are Cosmos world models?" -> read `reference/omniverse-cosmos.md`
- "What's the difference between H100 and B200?" -> read `reference/gpu-architecture.md`
- "How much memory does a 70B NIM need?" -> read `reference/nims.md`
- "What is NeMo Guardrails?" -> read `reference/nemo-framework.md`
- "What is Isaac Sim?" -> read `reference/omniverse-cosmos.md`
- Architecture deep-dives, deployment patterns, hardware specs, code examples

**Available reference docs:**
- `reference/nims.md` -- NIM architecture, deployment, catalog, API patterns, hardware requirements
- `reference/nemo-framework.md` -- NeMo training, fine-tuning, alignment, Guardrails, Curator
- `reference/physicsnemo.md` -- PhysicsNeMo v2.0, Modulus migration, Earth-2 and CFD domains
- `reference/omniverse-cosmos.md` -- Omniverse platform, USD, Isaac Sim, Cosmos world models
- `reference/gpu-architecture.md` -- H100, H200, B200, GB200, NVL72, interconnects, comparison table

**Rule: Read the reference doc before web searching. If the reference doc answers the question, do not search.**

### Tier 3: Web Search (last resort, seconds)

Search the web only when:
- The question is about events from the **last 2-4 weeks** (new product announcements, GTC news)
- The question asks for **specific version numbers, NIM catalog contents, or pricing** that change frequently
- The question is about a **topic not covered** by the orientation doc or any reference doc
- The question explicitly asks "what's the latest" or "has anything changed recently"
- **New NIM releases** not yet in the reference corpus
- **Competitive landscape updates** (AMD, Intel, cloud provider announcements)

**Rule: Do not web search for product architecture, stack relationships, GPU specs, deployment patterns, or comparative framework. These are stable and covered by tiers 1-2.**

## When NOT to Search

These categories should almost never trigger web search:

- **Product architecture and design** -- stable, covered by orientation + reference docs
- **How products relate to each other** -- stable, covered by orientation doc
- **GPU specs for Hopper and Blackwell** -- stable, in reference doc
- **NIM deployment patterns** -- reference doc has code examples
- **NeMo training/fine-tuning capabilities** -- reference doc covers this
- **PhysicsNeMo migration from Modulus** -- reference doc covers this
- **Omniverse components and USD** -- reference doc covers this
- **Cosmos model families** -- reference doc covers this

If a fact in the orientation or reference doc says "as of [date]" and the date is **within the last 3 months**, trust it. Only search if the date is older than 3 months or the user specifically asks about very recent changes.

## Search Patterns (when Tier 3 is warranted)

### For NVIDIA product announcements
1. NVIDIA blog: `site:blogs.nvidia.com` or `site:developer.nvidia.com/blog`
2. GTC news: `site:nvidia.com GTC 2026`
3. NGC: `site:catalog.ngc.nvidia.com`

### For NIM catalog updates
1. Build portal: `site:build.nvidia.com`
2. NIM docs: `site:docs.nvidia.com/nim`
3. NGC registry: `site:catalog.ngc.nvidia.com`

### For GPU / hardware updates
1. NVIDIA data center: `site:nvidia.com data-center`
2. AnandTech, ServeTheHome for independent benchmarks
3. Cloud provider instance announcements (AWS, Azure, GCP)

### For competitive landscape
1. AMD: `site:amd.com instinct` (MI300X, MI350)
2. Intel: `site:intel.com gaudi` (Gaudi 3)
3. Cloud custom silicon: Google TPU, AWS Trainium, Microsoft Maia

### For framework updates
1. GitHub releases: `site:github.com/NVIDIA/NeMo`, `site:github.com/NVIDIA/physicsnemo`
2. NVIDIA docs: `site:docs.nvidia.com`

## Cross-Expert Routing

When a question touches another expert's domain, route appropriately:
- **Earth-2 model architectures** (Atlas, CorrDiff, StormCast details): defer to earth2 expert
- **Hurricane/tropical cyclone science**: defer to hurricane expert
- **Solar physics, HelioFM/Surya**: defer to space-weather expert
- **UI design, CesiumJS, frontend**: defer to webapp-designer expert

This expert knows **where Earth-2 fits** in the NVIDIA platform stack and can explain Earth2Studio, PhysicsNeMo, and weather NIMs at the product level. For model architecture depth (how Atlas's latent space works, CorrDiff's diffusion process), consult the earth2 expert.

## Freshness Protocol

1. **Facts dated within the last 3 months are trusted.** Do not search for updates unless the user specifically asks.
2. **Facts older than 3 months are suspect.** Search before stating them.
3. **NIM catalog changes fastest.** Always flag catalog claims with "as of [date]."
4. **GPU availability ramps.** What's "announced" vs "shipping" vs "widely available" matters. Be precise.
5. **NVIDIA ships at GTC cadence.** Major announcements cluster around GTC (March), Computex (May-June), SC (November), CES (January). Search before/after these events.
