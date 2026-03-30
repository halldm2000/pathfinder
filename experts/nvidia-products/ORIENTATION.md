# NVIDIA AI Products Expert Orientation

Reference material for the NVIDIA AI Products expert. Anchors fast-moving product details with dates, corrects common conflations, and maps the full NVIDIA AI stack. Omits facts the model reliably knows (basic CUDA concepts, well-known GPU history, etc.).

Last verified: March 2026. Claude's training data extends through early 2025.

## Field Map

NVIDIA's AI platform spans four layers: silicon (GPUs, DGX/HGX systems, networking), frameworks (NeMo, PhysicsNeMo, RAPIDS, cuDNN), inference (TensorRT, Triton, NIMs), and applications (Omniverse, Cosmos, domain-specific solutions like Earth-2). The unifying strategy since GTC 2024 is "full-stack AI" -- NVIDIA provides every layer from chip to cloud API. NIMs (NVIDIA Inference Microservices) are the primary delivery mechanism for pre-trained models as of 2024-2025, packaging model + runtime + optimization into Docker containers with standard OpenAI-compatible APIs. NVIDIA AI Enterprise is the commercial umbrella providing enterprise support, security scanning, and certified deployment paths. As of March 2026, NVIDIA is the dominant AI compute provider; the competitive landscape is shifting as AMD MI300X gains cloud traction and hyperscalers deploy custom silicon (Google TPU v5p, AWS Trainium2, Microsoft Maia).

## NIM Microservices (as of March 2026)

NVIDIA Inference Microservices. Containerized, optimized, API-ready model deployments. Ship as Docker containers via NGC (nvcr.io). OpenAI-compatible REST APIs for most LLM NIMs. Key categories: LLM (Llama 3.1, Mistral, Mixtral, Nemotron), vision-language (VILA, LLaVA), embedding (NV-Embed), speech (RIVA/Parakeet), biology (ESMFold, DiffDock, MolMIM), weather (CorrDiff, FourCastNet). Each NIM bundles: model weights, TensorRT-LLM optimization, Triton backend, health/metrics endpoints. Deployment: single GPU to multi-node. Licensing: some NIMs free for evaluation, production requires AI Enterprise license. Build custom NIMs with NIM Agent Blueprints. See `reference/nims.md` for architecture and deployment details.

## NeMo Framework (as of March 2026)

End-to-end platform for training, fine-tuning, and deploying large language models and multimodal models. Key capabilities: distributed training (tensor/pipeline/expert parallelism to thousands of GPUs), supervised fine-tuning (SFT), parameter-efficient fine-tuning (LoRA, P-Tuning, adapters), RLHF/DPO alignment, NeMo Guardrails (programmable safety rails for LLM applications). NeMo 2.0 (released 2025) uses a recipe-based configuration system. Supports Llama, Mistral, Mixtral, Gemma, Nemotron, custom architectures. Integrated with NeMo Curator for data curation at scale. Not the same as PhysicsNeMo -- NeMo is for language/multimodal, PhysicsNeMo is for physics-ML. See `reference/nemo-framework.md`.

## PhysicsNeMo (as of March 2026)

Open-source framework for physics-informed machine learning. Renamed from "NVIDIA Modulus" (v2.0.0, March 2026). `pip install nvidia-physicsnemo`. Import: `import physicsnemo` (not `import modulus`). Foundation for all Earth-2 model training. Two domain libraries: Earth-2 (weather/climate recipes) and PhysicsNeMo-CFD (computational fluid dynamics). Features: distributed parallelism to 1024+ GPUs, physics-guided training algorithms, optimized architecture blocks (SFNO, DiT), Warp integration for differentiable physics. Also used outside weather for industrial CFD, structural mechanics, and other physics domains. See `reference/physicsnemo.md`.

## Omniverse (as of March 2026)

Platform for building and operating industrial digital twins and 3D simulation. Built on Universal Scene Description (USD) as the interchange format. Key components: Omniverse Cloud (cloud-hosted simulation), Omniverse Kit (SDK for building extensions and apps), Nucleus (collaboration server for USD assets), Isaac Sim (robotics simulation), Drive Sim (autonomous vehicle simulation). Digital twin deployments: BMW factories, Siemens energy, Amazon robotics. Omniverse Cloud APIs launched at GTC 2024 for cloud-native access. Mega blueprint (GTC 2025): reference architecture for building factory-scale digital twins with Omniverse + Cosmos. See `reference/omniverse-cosmos.md`.

## Cosmos (as of March 2026)

World Foundation Models for physical AI -- generating synthetic video and 3D environments that obey physics. Announced December 2024, expanded at CES 2025. Open-weight models on Hugging Face. Model families: Cosmos Tokenizer (image/video tokenization), Cosmos Predict (autoregressive + diffusion world generation), Cosmos Transfer (control via segmentation maps, depth, edge), Cosmos Reason (multimodal reasoning about physical scenes). Target applications: robotics training data, autonomous driving simulation, industrial digital twins. Integrates with Omniverse for 3D content pipelines. Cosmos-1.0 models range from 4B to 14B parameters. Apache 2.0 license for many models. See `reference/omniverse-cosmos.md`.

## RAPIDS (as of March 2026)

GPU-accelerated data science ecosystem. Core libraries: cuDF (DataFrames, pandas-compatible API with `cudf.pandas` zero-code-change accelerator), cuML (ML algorithms: clustering, regression, dimensionality reduction), cuGraph (graph analytics), cuSpatial (geospatial), cuVS (vector search, powers many vector DBs), Morpheus (cybersecurity AI). cuDF 25.02+: pandas 2.x compatibility, Polars GPU engine (beta). cuML: drop-in scikit-learn replacement for GPU. Integration: Spark RAPIDS Accelerator (GPU-accelerated Spark), Dask-cuDF (distributed GPU DataFrames). Not just for Python -- RAPIDS Memory Manager (RMM) underpins GPU memory allocation across the NVIDIA AI stack.

## TensorRT and Triton Inference Server

**TensorRT** (as of TensorRT 10.x, 2025): Deep learning inference optimizer and runtime. Converts models from PyTorch/TF/ONNX to optimized engines with: layer fusion, quantization (INT8, FP8, INT4), kernel auto-tuning, dynamic batching. TensorRT-LLM: specialized for LLM inference (KV-cache management, in-flight batching, paged attention, speculative decoding). Powers all LLM NIMs. TensorRT-LLM supports multi-GPU via tensor parallelism.

**Triton Inference Server** (as of 2.x series): Model serving platform. Supports multiple backends (TensorRT, PyTorch, TensorFlow, ONNX, Python, vLLM). Features: dynamic batching, model ensembles (pipeline multiple models), concurrent model execution, model versioning, metrics (Prometheus). Used inside NIMs as the serving layer. Also deployed standalone for custom inference pipelines.

**Stack relationship:** TensorRT optimizes the model. Triton serves it. NIMs package both with the model into a deployable container. These are layers, not alternatives.

## DGX and HGX Systems (as of March 2026)

**DGX B200:** 8x B200 GPUs, 1.4TB HBM3e total. Up to 72 PFLOPS FP4. NVLink 5 (1.8TB/s bisection). Ships as DGX SuperPOD building blocks. Successor to DGX H100.

**DGX GB200 NVL72:** Liquid-cooled rack-scale system. 36 Grace CPUs + 72 Blackwell GPUs connected via NVLink domain. 13.5TB HBM3e shared memory pool. Up to 1.4 EFLOPS FP4. Designed for trillion-parameter model training.

**DGX SuperPOD:** Cluster of DGX nodes (B200 or GB200) + networking. Reference architecture for AI factories. InfiniBand or Ethernet (Spectrum-X) interconnect.

**HGX:** Board-level GPU platform (8 GPUs + NVLink) for OEM server integration. HGX H100, HGX B200 variants.

**DGX Cloud:** Cloud-hosted DGX infrastructure via Azure, GCP, Oracle, Lambda. Reserve GPU clusters with NVIDIA-managed software stack.

## GPU Architecture Roadmap (as of March 2026)

**Hopper (H100/H200):** Current workhorse. 80GB HBM3 (H100) or 141GB HBM3e (H200). 4th-gen Tensor Cores with FP8. Transformer Engine. Released 2022-2023. Widely available in cloud.

**Blackwell (B200/B300/GB200/GB300):** Current generation, shipping since late 2024, ramping 2025. B200: 192GB HBM3e, 2nd-gen Transformer Engine, FP4 support, 2x H100 perf/watt for LLM inference. GB200: Grace CPU + 2x B200 on NVLink. GB200 NVL72: rack-scale. GB300: enhanced variant announced CES 2025 with extended HBM3e, targeting late 2025 availability.

**Vera Rubin (next gen):** Announced GTC 2025. Expected 2026-2027. New GPU architecture + Vera CPU (ARM-based successor to Grace). Details sparse -- do not speculate beyond what NVIDIA has disclosed.

**NVLink evolution:** NVLink 4 (Hopper, 900 GB/s), NVLink 5 (Blackwell, 1.8 TB/s per GPU). NVLink domain in GB200 NVL72 enables all 72 GPUs to share memory.

See `reference/gpu-architecture.md` for detailed specs and comparisons.

## NGC Catalog and AI Enterprise

**NGC** (NVIDIA GPU Cloud catalog): Repository of GPU-optimized containers, pre-trained models, Helm charts, and SDKs. Free tier for containers and models. Accessed via nvcr.io (container registry) and NGC CLI. Houses all NIMs, NeMo models, RAPIDS containers, Triton images.

**NVIDIA AI Enterprise** (as of 5.x, 2025): Enterprise software platform. Includes: production licenses for NIMs, NeMo, RAPIDS; security scanning and CVE patching; certified deployment on VMware, Red Hat, major clouds; enterprise support (SLAs); AI Workbench (developer environment). Licensing model: per-GPU subscription. Required for production NIM deployment beyond evaluation. Not the same as NGC -- NGC is the catalog, AI Enterprise is the support/licensing/security layer on top.

## CUDA Ecosystem

CUDA 12.x is current (CUDA 12.6 as of late 2025). CUDA 13 expected alongside Vera Rubin. Key ecosystem components beyond the toolkit: cuBLAS (linear algebra), cuDNN (deep learning primitives, v9.x), cuFFT, cuSPARSE, NCCL (multi-GPU communication), NVML (GPU management), Nsight (profiling). CUDA compatibility: forward-compatible drivers allow running newer CUDA toolkit on older drivers within the same major version.
