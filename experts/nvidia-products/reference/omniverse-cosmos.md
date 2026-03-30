### Omniverse

**What it is:** NVIDIA's platform for building and operating industrial digital twins and 3D simulation pipelines. Built on Universal Scene Description (USD) as the universal interchange format. Connects design, simulation, and AI in a shared 3D environment. Used for factory planning (BMW), robotics (Amazon), autonomous vehicles, architecture, and visual effects.

**Key components (as of March 2026):**
- **Omniverse Kit:** SDK for building 3D applications and extensions. Based on USD and RTX rendering. Used to create custom industrial apps.
- **Omniverse Nucleus:** Collaboration server for USD assets. Enables real-time multi-user editing of 3D scenes.
- **Omniverse Cloud:** Cloud-hosted simulation and rendering. APIs launched at GTC 2024 for cloud-native access without local GPU.
- **Isaac Sim:** Robotics simulation built on Omniverse. Domain randomization, synthetic data generation, ROS/ROS2 integration. Used for training robot manipulation and navigation policies.
- **Drive Sim:** Autonomous vehicle simulation. Sensor simulation (lidar, camera, radar), scenario generation, V2X. Used by automotive OEMs and AV companies.
- **Audio2Face:** AI-driven facial animation from audio input. Used in gaming, virtual assistants, and film.
- **USD Composer:** Scene composition and layout tool.

**USD (Universal Scene Description):**
- Originally developed by Pixar, adopted by NVIDIA as the foundation for Omniverse
- Open standard for 3D scene interchange (geometry, materials, physics, semantics)
- OpenUSD Alliance (formed 2023): NVIDIA, Pixar, Apple, Adobe, Autodesk
- `.usd`, `.usda` (ASCII), `.usdc` (binary), `.usdz` (packaged) file formats
- Becoming the "HTML of 3D" -- the common language for digital twins

**Mega blueprint (GTC 2025):**
- Reference architecture for factory-scale digital twins
- Combines Omniverse (3D simulation) + Cosmos (world models) + Isaac (robotics)
- Physical AI loop: sense (digital twin) -> plan (Cosmos) -> act (robot) -> verify (Omniverse)
- Targets manufacturing, logistics, and energy industries

**Relationship to other NVIDIA products:**
- Omniverse + PhysicsNeMo: physics-ML models can run inside digital twin simulations
- Omniverse + Cosmos: Cosmos generates synthetic environments for Omniverse
- Omniverse + Isaac Sim + NIMs: robot training pipeline from simulation to deployment
- Omniverse + Drive Sim: AV validation against digital twin of real roads
- RTX GPUs accelerate Omniverse rendering; professional GPUs (RTX 6000 Ada) for workstation deployments

---

### Cosmos (World Foundation Models)

**What it is:** Family of world foundation models that generate synthetic video and 3D environments obeying physical laws. Designed for "physical AI" -- generating training data and simulation environments for robots, autonomous vehicles, and industrial systems. Announced December 2024, expanded at CES and GTC 2025. Open-weight models on Hugging Face.

**Model families (as of March 2026):**
- **Cosmos Tokenizer:** Image and video tokenization. Converts visual data to discrete/continuous tokens for generation models. Causal and non-causal variants. Temporal compression 8x, spatial 8x8.
- **Cosmos Predict:** World generation models. Two approaches:
  - Autoregressive: next-token prediction for world generation (4B, 7B, 14B variants)
  - Diffusion: diffusion-based video/world generation (7B, 14B variants)
  - Generates physically plausible video sequences from text/image prompts
- **Cosmos Transfer:** Controllable generation via conditioning signals -- segmentation maps, depth maps, edge maps. Enables precise control over generated environments.
- **Cosmos Reason:** Multimodal reasoning about physical scenes. Understands object properties, spatial relationships, physics. Powers decision-making in physical AI systems.
- **Cosmos Guardrail:** Safety filtering for generated content.

**Technical details:**
- Model sizes: 4B to 14B parameters
- Training: large-scale video datasets with physical consistency filtering
- Inference: runs on H100/A100 GPUs; larger models need multi-GPU
- License: Apache 2.0 for many model variants
- Distribution: Hugging Face (huggingface.co/collections/nvidia/cosmos), NGC

**Use cases:**
- **Robotics:** Generate diverse training scenarios for robot manipulation. Train in Cosmos-generated environments, deploy in real world.
- **Autonomous vehicles:** Synthesize edge-case driving scenarios (rain, night, pedestrians) for AV validation.
- **Industrial digital twins:** Generate photorealistic environments matching factory layouts for simulation.
- **Content creation:** Generate physics-aware video content for visualization and media.

**Relationship to Omniverse:**
- Cosmos generates synthetic environments; Omniverse provides the simulation infrastructure
- Mega blueprint chains: real-world data -> Cosmos (generate variations) -> Omniverse (simulate physics) -> train AI -> deploy
- Cosmos can generate visual assets that feed into USD-based Omniverse scenes
- Together they form NVIDIA's "physical AI" stack

**Known issues / limitations:**
- World models are a new category -- rapidly evolving, not yet production-hardened
- Generated physics can be approximate; not suitable for safety-critical simulation without validation
- Large models (14B) require significant GPU memory
- Video generation quality depends heavily on prompt engineering
- Competitive landscape moving fast (Google Veo, OpenAI Sora, Runway)

**Sources:**
- Cosmos: github.com/NVIDIA/Cosmos
- Hugging Face: huggingface.co/collections/nvidia/cosmos
- Omniverse: developer.nvidia.com/omniverse
- OpenUSD: openusd.org
- Isaac Sim: developer.nvidia.com/isaac-sim

As of: March 2026
