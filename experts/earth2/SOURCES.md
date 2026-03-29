# Earth-2 Expert: Sources

Sources for ingestion and ongoing monitoring. Organized by type and priority.

## Primary Sources (check weekly or more)

### NVIDIA Earth-2
- **Earth2Studio GitHub**: github.com/NVIDIA/earth2studio (releases, changelogs, new models)
- **PhysicsNeMo GitHub**: github.com/NVIDIA/physicsnemo (releases, migration guides)
- **Earth2Studio docs**: nvidia.github.io/earth2studio/
- **NVIDIA Earth-2 Hugging Face**: huggingface.co/collections/nvidia/earth-2 (model checkpoints, cards)
- **NVIDIA Technical Blog (Earth-2 tag)**: blogs.nvidia.com/blog/tag/earth-2/
- **PhysicsNeMo docs**: docs.nvidia.com/physicsnemo/latest/

### AI Weather/Climate Research
- **arXiv cs.LG + physics.ao-ph**: arxiv.org (search: "AI weather", "machine learning weather prediction", "neural weather", "climate emulator")
- **ECMWF news & blog**: ecmwf.int/en/about/media-centre/news (AIFS updates, Anemoi releases, AI Weather Quest)
- **Google DeepMind blog**: deepmind.google/blog/ (GraphCast, GenCast updates)
- **Allen AI climate blog**: allenai.org/blog (ACE2, SamudrACE updates)

### Benchmarks & Evaluation
- **WeatherBench 2**: sites.research.google/gr/weatherbench/ (leaderboard updates)
- **ECMWF AI Weather Quest**: ecmwf.int AI Weather Quest pages (sub-seasonal competition results)

## Secondary Sources (check monthly)

### Operational Deployment
- **NOAA announcements**: noaa.gov/news-release (AI model deployments, new capabilities)
- **WMO AI resources**: wmo.int (AI guidance, standards)
- **National met service blogs**: UK Met Office, BoM Australia, KMA Korea (AI adoption updates)

### Key Research Groups
- **Microsoft Research (Aurora)**: github.com/microsoft/aurora
- **Google DeepMind (GraphCast/GenCast)**: github.com/google-deepmind/graphcast
- **FuXi team (CMA)**: github.com/tpys/FuXi
- **WindBorne Systems**: windbornesystems.com/blog (WeatherMesh updates)
- **Silurian AI**: silurian.ai (GFT foundation model)
- **ECMWF Anemoi**: github.com/ecmwf (anemoi-inference, forecast-in-a-box)

### Conferences (major AI weather/climate venues)
- **AMS Annual Meeting** (January) -- largest weather/climate meeting, Earth-2 launch venue
- **AGU Fall Meeting** (December) -- major geoscience conference
- **EGU General Assembly** (April) -- European geoscience
- **NeurIPS / ICML / ICLR** -- ML conferences with weather/climate tracks
- **SC (Supercomputing)** (November) -- HPC, NIM releases
- **GTC** (March) -- NVIDIA flagship, Earth-2 demos and training

### Academic Journals
- Nature, Science, Nature Communications, Science Advances (high-impact model papers)
- JAMES (Journal of Advances in Modeling Earth Systems)
- GMD (Geoscientific Model Development)
- npj Climate and Atmospheric Science
- Geophysical Research Letters

## Ingestion Notes

- Earth2Studio and PhysicsNeMo releases are highest priority: breaking changes affect all code guidance.
- arXiv papers move fast; a model can go from preprint to benchmark leader in weeks.
- When a new model claims SOTA, verify against WeatherBench 2 or check if evaluation uses the same protocol.
- ECMWF AIFS updates are operationally significant because AIFS is the baseline for many comparisons.
- Conference presentation slides often contain information weeks before papers are published.
