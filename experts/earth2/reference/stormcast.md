### StormCast

**What it is:** Kilometer-scale regional generative weather model that emulates convection-allowing models (CAMs) using generative diffusion modeling. The first AI model to demonstrate skillful km-scale convective weather prediction, published in Science Advances (Jan 30, 2026). Being merged with StormScope into a unified regional generative modeling framework.

**Key details:**
- Generative diffusion approach: produces realistic convective-scale weather fields rather than blurred ensemble means
- Emulates convection-allowing models (like HRRR/WRF) at km-scale resolution
- Designed for regional domains where convective processes dominate (severe storms, mesoscale convective systems)
- Targets sovereign AI weather: enables underserved met agencies to run high-resolution regional forecasts

**Science Advances paper (Jan 30, 2026):**
- Authors: Pathak, Cohen, Garg, Harrington, Brenowitz, Durran, Mardani, Vahdat, Xu, Kashinath, Pritchard
- Demonstrates that generative diffusion models can reproduce the statistical properties of km-scale convective weather
- First peer-reviewed demonstration of CAM emulation via generative AI

**StormScope merge:**
- Being combined with StormScope into a unified "regional generative modeling" recipe
- StormScope brings observation-driven nowcasting (GOES + MRMS); StormCast brings global-model-conditioned regional forecasting
- Unified recipe targets GTC 2026

**First non-weather application:**
- University of Manchester demonstrated an air quality nowcast using StormCast (Feb 2026, validation pending)
- Significant because it shows the architecture generalizes beyond weather to other geophysical prediction tasks

**Relationship to other entities:** Merging with StormScope. Complements CorrDiff (CorrDiff does statistical downscaling; StormCast does full generative regional modeling). Can be paired with SDA for personalized regional forecasting from user observations. Built on PhysicsNeMo.

**Known issues / limitations:**
- Regional, not global — needs boundary conditions from a global model
- Currently in active development (merging with StormScope)
- Generative approach is computationally more expensive than deterministic regression at inference time
- Domain-specific training required for each region

**Sources:**
- Paper: Science Advances, Jan 30, 2026 (Pathak, Cohen, Garg et al.)
- Status: Active development, merging with StormScope

As of: March 2026
