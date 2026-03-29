### PhysicsNeMo (formerly NVIDIA Modulus)

**What it is:** Open-source framework for building, training, and fine-tuning physics-ML models. Renamed from "NVIDIA Modulus" (rebranding directed by Jensen Huang). v2.0.0 released March 2026 with breaking changes from the Modulus era. Two domain libraries: Earth-2 (weather/climate recipes) and PhysicsNeMo-CFD (computational fluid dynamics). Broader than Earth-2 alone — covers all physics-informed ML.

**Key details:**
- Installation: `pip install nvidia-physicsnemo`
- CUDA backend via extras: `pip install "nvidia-physicsnemo[cu12,nn-extras]"` or `[cu13,nn-extras]`
- Import: `import physicsnemo` (NOT `import modulus` — this is the most common migration error)
- Version: v2.0.0 (March 2026)
- License: Apache 2.0
- GitHub: github.com/NVIDIA/physicsnemo

**v2.0 migration from Modulus:**
- Migration guide: github.com/NVIDIA/physicsnemo/blob/main/v2.0-MIGRATION-GUIDE.md
- Package name changed: `modulus` → `nvidia-physicsnemo`
- Import changed: `import modulus` → `import physicsnemo`
- API changes in model loading, training loops, and configuration
- Earth2Studio v0.13.0 requires `nvidia-physicsnemo>=2.0`

**Key components:**
- Distributed scaling: multi-node data/model/domain parallelism
- GPU-accelerated ETL and data loaders (DALI integration)
- Physics-AI integration: geometric encoding, physics-guided algorithms
- Optimized architecture blocks (SFNO, DiT, etc.)
- Warp integration for differentiable physics
- Reference examples for weather/climate use cases (training recipes)

**Relationship to Earth2Studio:**
- PhysicsNeMo is for **training and fine-tuning** models
- Earth2Studio is for **inference and workflow orchestration**
- Earth2Studio depends on PhysicsNeMo (>=2.0) for model architectures and pretrained weights
- PhysicsNeMo also incorporates Earth2Studio capabilities for inference
- A managed productization team keeps both libraries in sync

**Relationship to other entities:** Foundation for all Earth-2 model training (Atlas, CorrDiff, StormScope, StormCast, FCN3, HealDA, cBottle). Earth2Studio handles inference workflows. Torch Harmonics (spherical transforms) is a key dependency for global models. Also used outside Earth-2 for CFD, structural mechanics, and other physics domains.

**Known issues / limitations:**
- v2.0 migration is a breaking change — old Modulus code will not work without updates
- CUDA compute capability >=8.0 required (A100+)
- `nn-extras` package needed for many model architectures
- Documentation is split between PhysicsNeMo docs and Earth2Studio docs

**Sources:**
- GitHub: github.com/NVIDIA/physicsnemo
- Docs: docs.nvidia.com/physicsnemo/latest/
- Migration: github.com/NVIDIA/physicsnemo/blob/main/v2.0-MIGRATION-GUIDE.md

As of: March 2026
