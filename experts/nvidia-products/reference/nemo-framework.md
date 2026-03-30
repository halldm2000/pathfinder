### NeMo Framework

**What it is:** End-to-end platform for training, fine-tuning, aligning, and deploying large language models and multimodal models at scale. NeMo handles the full lifecycle: data curation (NeMo Curator), pre-training, supervised fine-tuning, RLHF/DPO alignment, evaluation, and export to deployment (NIMs). NeMo 2.0 (released 2025) is a major rewrite with recipe-based configuration. Not the same as PhysicsNeMo -- NeMo targets language/multimodal workloads; PhysicsNeMo targets physics-ML.

**Key details:**
- Installation: `pip install nemo_toolkit[all]` or domain-specific extras
- NeMo 2.0: recipe-based system replacing YAML configs from NeMo 1.x
- License: Apache 2.0
- GitHub: github.com/NVIDIA/NeMo
- Supports: Llama 3.x, Mistral/Mixtral, Gemma, Nemotron, GPT, BERT, T5, custom architectures

**Training capabilities:**
- Distributed training: tensor parallelism (TP), pipeline parallelism (PP), expert parallelism (EP for MoE models), sequence parallelism, context parallelism (CP for long sequences)
- Scales to thousands of GPUs (tested on DGX SuperPOD configurations)
- Mixed precision: BF16, FP8 (via Transformer Engine on Hopper+)
- Flash Attention integration
- Megatron-LM core for efficient distributed training

**Fine-tuning methods:**
- Full fine-tuning (SFT): update all model weights
- LoRA (Low-Rank Adaptation): efficient fine-tuning, typically 0.1-1% of parameters
- P-Tuning: virtual prompt tuning
- Adapter modules: task-specific adapter layers
- QLoRA: quantized LoRA for memory-constrained environments
- Multi-task fine-tuning

**Alignment:**
- RLHF: PPO-based reinforcement learning from human feedback
- DPO: Direct Preference Optimization (simpler than RLHF, no reward model)
- SteerLM: attribute-conditioned RLHF (NVIDIA's approach)
- SPIN: Self-Play Fine-Tuning
- Reward model training from human preference data

**NeMo Guardrails:**
- Programmable safety rails for LLM applications
- Colang scripting language for defining conversation flows
- Input/output filtering, topical rails, fact-checking rails, jailbreak detection
- Works with any LLM (not NeMo-specific)
- Can be deployed as a middleware layer between user and any LLM API
- Open-source: github.com/NVIDIA/NeMo-Guardrails

**NeMo Curator:**
- Large-scale data curation pipeline for training data preparation
- Deduplication (exact and fuzzy), quality filtering, PII detection
- Language identification and classification
- Scales to trillion-token datasets on GPU clusters
- Used to curate training data for Nemotron models

**NeMo 2.0 recipe system:**
- Recipes define complete training configurations (model, data, optimizer, parallelism)
- Pre-built recipes for common models (Llama 3.1, Mistral, Nemotron)
- `nemo.collections.llm` for LLM recipes
- Replaces the YAML-heavy configuration system of NeMo 1.x
- Breaking changes from NeMo 1.x -- migration guide available

**Relationship to other products:**
- NeMo trains models, NIMs deploy them (training → deployment pipeline)
- NeMo Guardrails can wrap any NIM with safety rails
- NeMo uses Megatron-LM core (NVIDIA's distributed training library)
- NeMo Curator feeds curated data into NeMo training pipelines
- Transformer Engine (Hopper/Blackwell FP8 support) integrated into NeMo training
- NeMo is distinct from PhysicsNeMo -- different teams, different targets, shared name heritage

**Known issues / limitations:**
- NeMo 2.0 is a breaking change from NeMo 1.x -- old configs won't work
- Multi-node training requires NCCL and high-bandwidth interconnect (NVLink, InfiniBand)
- Memory requirements scale with model size and parallelism strategy
- Some features (e.g., expert parallelism for MoE) require specific NeMo versions
- Guardrails Colang language has a learning curve

**Headline metrics:**
- Nemotron-4 340B trained using NeMo on 768 DGX H100 nodes (6,144 GPUs)
- LoRA fine-tuning of Llama 3.1 70B: ~2-4x H100 GPUs, hours not days
- NeMo Curator: processed 30T+ tokens for Nemotron training data

**Sources:**
- GitHub: github.com/NVIDIA/NeMo
- Docs: docs.nvidia.com/nemo-framework/
- Guardrails: github.com/NVIDIA/NeMo-Guardrails
- Curator: github.com/NVIDIA/NeMo-Curator

As of: March 2026
