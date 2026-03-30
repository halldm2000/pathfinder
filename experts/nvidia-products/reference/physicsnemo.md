### PhysicsNeMo (formerly NVIDIA Modulus)

**What it is:** Open-source framework for building, training, and fine-tuning physics-informed machine learning models. Renamed from "NVIDIA Modulus" -- rebranding directed by Jensen Huang. v2.0.0 released March 2026 with breaking changes. Two domain libraries: Earth-2 (weather/climate recipes) and PhysicsNeMo-CFD (computational fluid dynamics). Broader than Earth-2 alone -- covers all physics-informed ML including industrial CFD, structural mechanics, electromagnetics, and fluid dynamics.

**Key details:**
- Installation: `pip install nvidia-physicsnemo`
- CUDA backend via extras: `pip install "nvidia-physicsnemo[cu12,nn-extras]"` or `[cu13,nn-extras]`
- Import: `import physicsnemo` (NOT `import modulus` -- most common migration error)
- Version: v2.0.0 (March 2026)
- License: Apache 2.0
- GitHub: github.com/NVIDIA/physicsnemo
- CUDA compute capability >=8.0 required (A100+)

**v2.0 migration from Modulus:**
- Migration guide: github.com/NVIDIA/physicsnemo/blob/main/v2.0-MIGRATION-GUIDE.md
- Package name: `modulus` -> `nvidia-physicsnemo`
- Import: `import modulus` -> `import physicsnemo`
- API changes in model loading, training loops, configuration
- Earth2Studio v0.13.0 requires `nvidia-physicsnemo>=2.0`

**Key capabilities:**
- Distributed scaling: multi-node data/model/domain parallelism to 1024+ GPUs
- GPU-accelerated ETL and data loaders (DALI integration)
- Physics-AI integration: geometric encoding, physics-guided training algorithms
- Optimized architecture blocks: SFNO (Spherical Fourier Neural Operator), DiT (Diffusion Transformer), MeshGraphNet, FNO variants
- Warp integration for differentiable physics simulation
- Training recipes: pre-built configurations for weather models, CFD, and other physics domains

**Earth-2 domain library:**
- Training recipes for all Earth-2 models (Atlas, CorrDiff, StormCast, StormScope, FCN3, HealDA, cBottle)
- End-to-end training pipelines from raw data to model checkpoint
- Distributed training configurations for multi-GPU/multi-node setups
- Validation and evaluation utilities

**PhysicsNeMo-CFD domain library:**
- Computational fluid dynamics applications
- DoMINO: domain-aware multi-input neural operator for industrial CFD
- MeshGraphNet for mesh-based physics simulation
- Automotive aerodynamics, HVAC, and manufacturing applications

**Relationship to other NVIDIA products:**
- PhysicsNeMo trains models; Earth2Studio runs inference on weather models
- Earth2Studio depends on PhysicsNeMo (>=2.0) for model architectures and weights
- Omniverse uses PhysicsNeMo-trained models for physics-informed digital twins
- TensorRT can optimize PhysicsNeMo models for deployment
- NIMs package some PhysicsNeMo models (CorrDiff NIM, FourCastNet NIM)

**Relationship to NeMo:**
- Different products despite similar names
- NeMo: LLM and multimodal training (language)
- PhysicsNeMo: physics-ML training (scientific simulation)
- Different teams, different repos, different install paths
- Shared NVIDIA heritage and some distributed training infrastructure

**Known issues / limitations:**
- v2.0 is a breaking change -- old Modulus code requires migration
- CUDA compute >=8.0 (A100+); many features need >=8.9 (H100+)
- `nn-extras` package needed for many model architectures
- Documentation split between PhysicsNeMo docs and Earth2Studio docs
- Some training recipes require multi-node setups with NVLink/InfiniBand

**Sources:**
- GitHub: github.com/NVIDIA/physicsnemo
- Docs: docs.nvidia.com/physicsnemo/latest/
- Migration: github.com/NVIDIA/physicsnemo/blob/main/v2.0-MIGRATION-GUIDE.md

As of: March 2026
