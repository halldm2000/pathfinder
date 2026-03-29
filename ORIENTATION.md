# Pathfinder Orientation: The State of AI Expert Systems

This document is the briefing book for the Pathfinder expert-builder. It contains the current state of knowledge about building effective AI domain experts, distilled for use as in-context reference material.

## The Core Problem

Large language models have broad knowledge but lack depth, precision, and currency in any specific domain. Users who need expert-level assistance (a researcher asking about a specific model's resolution, an engineer debugging an API call, a decision-maker comparing tools) get answers that are approximately right but not reliably precise.

The standard approach, retrieval-augmented generation (RAG), treats this as a knowledge gap: stuff more documents into the model's context. This works but is inefficient. Most of the retrieved content covers things the model already knows from training. The real gaps are narrower: specific numbers, recent changes, precise configurations, and domain-specific judgment about what matters.

## The Context Engineering Approach

Pathfinder treats expert-building as context engineering rather than knowledge engineering. The distinction:

Knowledge engineering asks "how do we give the model all the information it needs?" This leads to large corpora, aggressive retrieval, and high token costs.

Context engineering asks "what is the minimum, highest-quality context that makes the model maximally effective in this domain?" This leads to three layered interventions, each targeting a different failure mode.

**Layer 1: Persona (system prompt).** Targets the attention allocation problem. The model has relevant knowledge in its weights but distributes attention across all topics equally in a general conversation. A domain-specific persona activates relevant knowledge, sets appropriate priors for depth and precision, and encodes domain-specific judgment (what to emphasize, what to flag as uncertain, what mistakes to avoid). This is the highest-leverage intervention because it reshapes every response without consuming retrieval tokens.

**Layer 2: Orientation document (in-context reference).** Targets the staleness and precision problems. A curated 2,000-5,000 token document loaded into every conversation. It corrects facts the model's training got wrong, provides the current state of a fast-moving field, and gives the model an explicit structure (key entities, their relationships, recent changes) to reason against. Think of it as a cheat sheet, not an encyclopedia.

**Layer 3: Retrieval (RAG).** Targets the specificity problem. When the model needs an exact API signature, a quoted passage from a paper, or a detailed specification that is too granular for the orientation document, it queries a vector index. This should fire on a minority of interactions, not every one. If retrieval is needed for most queries, the orientation document is not doing its job.

**Layer 4: Monitoring.** Targets the currency problem. Watches external sources (arXiv, blogs, release notes, social media) for new developments. New content flows into the orientation document (for high-importance updates) and the retrieval index (for details). This is what makes the expert self-maintaining rather than a snapshot that decays.

## Persona Design: What Works

Effective personas share these traits:

**Tight scope boundaries.** "You are an expert in X" is not enough. The persona must specify what is in scope, what is adjacent (answer with caveats), and what is out of scope (redirect). Unbounded experts hallucinate more because the model tries to be helpful beyond its configured knowledge.

**Explicit reasoning instructions.** Not just "be precise," but specific guidance: "When comparing models, always list input requirements, output resolution, computational cost, and known limitations. Do not recommend a model without stating what it cannot do." These instructions shape the structure of every response.

**Documented failure modes.** Every domain has things LLMs get predictably wrong. The persona should list them as explicit warnings: "Do not confuse X with Y. The commonly cited figure of Z is outdated; the current value is W." These are the highest-value sentences in the entire persona because they prevent the most damaging errors.

**Calibrated confidence.** The persona should instruct the model to distinguish between facts it is confident about (because they are in the orientation doc), facts it is less sure about (from training, possibly stale), and things it does not know. Vague hedging ("it might be around 25km") is worse than explicit uncertainty ("my training data says 25km, but this may be outdated; check the latest model card").

## Orientation Documents: What Works

The orientation document is the hardest artifact to write well because it requires ruthless curation. Every token must earn its place.

**Structure matters more than completeness.** The model needs to scan the document quickly to find relevant context. Use clear headers, consistent formatting for entities (name, key facts, relationships), and a predictable structure. Do not bury critical facts in prose paragraphs.

**Prioritize facts the model gets wrong.** If the model reliably knows that "FourCastNet is a weather prediction model," that sentence is wasted tokens. If the model commonly confuses CorrDiff's training resolution with its inference resolution, that distinction earns a prominent place.

**Include relationships, not just entities.** "CorrDiff is a model" is less useful than "CorrDiff is a generative super-resolution model that takes coarse global forecast fields (from FourCastNet or GFS) as input and produces high-resolution regional output. It does not produce forecasts independently." The relationship to other entities is often what the model gets wrong.

**Date everything.** "CorrDiff runs at 2km resolution" is less useful than "As of March 2026, CorrDiff produces 2km resolution output over CONUS, up from the originally published 25km." The date signals to the model that this is a correction of potentially stale training data.

**Flag contradictions.** If different sources disagree, say so explicitly rather than picking one. The model can then present both perspectives rather than confidently stating whichever one its training favored.

## Retrieval Strategy: What Works

**Chunk at semantic boundaries.** Do not split in the middle of a paragraph or code block. Respect section headers, function definitions, and logical breaks. A chunk that starts mid-thought is nearly useless for retrieval.

**Attach rich metadata.** Every chunk needs: source URL, document title, section header chain (breadcrumbs), ingestion date, source type (paper, docs, blog, tweet, user correction). This metadata is what makes citations possible and lets the model assess source quality.

**Prefer fewer, higher-quality chunks.** Returning 20 chunks to "be safe" floods the context with marginally relevant content and pushes out the orientation document's carefully curated material. Three to five highly relevant chunks is usually better.

**User corrections get priority.** Content added via the `teach` mechanism should be boosted in retrieval ranking. If a user explicitly corrected a fact, that correction is more likely to be relevant to future queries on the same topic than a random paragraph from a paper.

**Reindex, do not just append.** When the orientation document is updated, existing chunks that contradict it should be flagged or downranked. Stale chunks in the retrieval index are how experts give confident-but-outdated answers, which is the worst failure mode.

## Monitoring: What Works

**Watch primary sources, not aggregators.** The official NVIDIA blog is a better source for Earth-2 updates than a tech news site summarizing the blog post. Primary sources are more precise, more timely, and less likely to introduce errors.

**Define "meaningful update" per source.** An arXiv paper with a new model architecture is meaningful. A blog post that rehashes an existing paper is noise. The monitoring system (or the agent doing monitoring) needs criteria for what to ingest versus what to skip.

**Updates flow into the right layer.** A major new model release should update the orientation document (it changes the field structure). A bug fix in an API should go into the retrieval index (it is a detail). A correction to a known fact should update the orientation document AND flag contradicting chunks in the index.

**Frequency matches the domain.** AI research moves weekly. Oceanographic data updates monthly. Regulatory frameworks change quarterly. The monitoring schedule should match the domain's pace, not a fixed interval.

## What This Means for Implementation

The simplest useful implementation of a Pathfinder expert requires no MCP server, no RAG infrastructure, and no monitoring daemon. It is two markdown files (persona + orientation) that you paste into a conversation. This is the v0.

The next step (v1) adds an MCP server that serves the persona as a prompt, the orientation as a resource, and a retrieval index as a tool. This automates what the user would otherwise do by hand (paste the files, then manually search for details).

The full implementation (v2+) adds monitoring, automatic orientation document updates, an ingestion pipeline for new sources, the `teach` mechanism for user corrections, and export as distributable packages.

Each step adds genuine value. But the v0 (two files) captures most of the benefit. The diminishing returns curve is steep.
