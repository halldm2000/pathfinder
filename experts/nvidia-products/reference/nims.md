### NIM Microservices

**What it is:** NVIDIA Inference Microservices -- containerized, optimized, API-ready model deployments. Each NIM packages a pre-trained model with TensorRT-LLM optimization and Triton Inference Server into a single Docker container that exposes standard REST APIs. The goal is zero-friction model deployment: pull a container, run it, call the API. Announced GTC 2024, rapidly expanding catalog through 2025-2026.

**Architecture:**
- Container image from NGC (nvcr.io/nim/*)
- Model weights embedded or downloaded on first run
- TensorRT-LLM or TensorRT backend for optimized inference
- Triton Inference Server as the serving layer
- OpenAI-compatible API for LLM NIMs (chat completions, embeddings)
- Health, readiness, and Prometheus metrics endpoints
- Supports GPU auto-detection and automatic optimization profile selection

**Deployment patterns:**
- Single GPU: `docker run --gpus all nvcr.io/nim/{model}:{version}`
- Multi-GPU: tensor parallelism via `NIM_TENSOR_PARALLELISM` env var
- Kubernetes: Helm charts on NGC, NVIDIA GPU Operator for node setup
- Cloud: DGX Cloud, Azure AI, GCP Vertex, AWS SageMaker integrations
- Air-gapped: pre-download container + model artifacts
- Custom NIMs: NIM Agent Blueprints framework for building your own

**Available NIM categories (as of March 2026):**
- **LLM:** Llama 3.1 (8B/70B/405B), Llama 3.2, Mistral/Mixtral, Nemotron (340B, 4-mini), Phi-3
- **Vision-Language:** VILA, LLaVA, Cosmos-Reason
- **Embedding/Reranking:** NV-Embed-v2 (MTEB #1 at launch), NV-Rerankv1
- **Speech:** Parakeet (ASR), RIVA (TTS, translation)
- **Biology/Drug Discovery:** ESMFold, DiffDock, MolMIM, BioNeMo NIMs
- **Weather:** CorrDiff NIM (500x faster than CPU NWP), FourCastNet NIM
- **Video/3D:** Cosmos world model NIMs
- **RAG/Agents:** NIM Agent Blueprints for multi-model pipelines

**API pattern (LLM NIMs):**
```python
from openai import OpenAI

client = OpenAI(base_url="http://localhost:8000/v1", api_key="not-used")
response = client.chat.completions.create(
    model="meta/llama-3.1-70b-instruct",
    messages=[{"role": "user", "content": "Explain NVLink."}],
    max_tokens=512
)
```

**Hardware requirements (typical):**
- 8B LLM: 1x A100/H100 (40GB+)
- 70B LLM: 2-4x A100/H100 or 1x H200
- 405B LLM: 8x H100 (full DGX node) or 4x H200
- CorrDiff NIM: 1x A100/H100
- Requirements vary by quantization level (FP16 vs FP8 vs INT4)

**Licensing:**
- Evaluation: free via NGC for testing/development
- Production: NVIDIA AI Enterprise subscription required
- Self-hosted: customer's infrastructure with AI Enterprise license
- Cloud-hosted: available through partner cloud marketplaces
- Some community models (Llama, Mistral) have their own model licenses separate from the NIM license

**Relationship to other products:** NIMs sit at the top of the inference stack. TensorRT optimizes the model inside the NIM. Triton serves it. NGC hosts the container. AI Enterprise licenses production use. NeMo trains/fine-tunes the models that NIMs deploy.

**Known issues / limitations:**
- NIM catalog changes monthly -- never assume a specific NIM exists without checking
- Container sizes are large (10-50GB+) due to embedded weights and runtimes
- Not all models have NIM packaging -- check build.nvidia.com for current catalog
- GPU memory is the primary constraint for model selection
- Custom fine-tuned model deployment requires NIM Agent Blueprints workflow

**Sources:**
- Catalog: build.nvidia.com
- Docs: docs.nvidia.com/nim/
- NGC: nvcr.io
- Blog: developer.nvidia.com/blog/tag/nim

As of: March 2026
