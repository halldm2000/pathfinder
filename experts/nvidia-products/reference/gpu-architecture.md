### GPU Architecture: Hopper, Blackwell, and Beyond

**What this covers:** NVIDIA data center GPU architectures for AI training and inference. Focuses on the specs, capabilities, and tradeoffs that matter for choosing and deploying AI infrastructure. Consumer/gaming GPUs (GeForce) and professional workstation GPUs (RTX Pro) are out of scope.

## Hopper Generation (2022-2024)

**H100 SXM:**
- 80GB HBM3, 3.35 TB/s memory bandwidth
- 4th-gen Tensor Cores: FP8, FP16, BF16, TF32, FP64
- Transformer Engine: automatic FP8/FP16 mixed precision
- 989 TFLOPS FP8 Tensor, 67 TFLOPS FP64
- NVLink 4: 900 GB/s bidirectional (18 links)
- 700W TDP (SXM form factor)
- PCIe 5.0 x16
- Available in DGX H100 (8x H100, NVLink mesh)

**H200 SXM:**
- 141GB HBM3e, 4.8 TB/s bandwidth (1.4x H100)
- Same compute as H100 (Hopper architecture)
- Significant advantage for large model inference (more model fits in memory)
- Drop-in replacement for H100 in DGX/HGX systems
- Shipping since Q2 2024

**Grace Hopper (GH200):**
- Grace ARM CPU + H200 GPU on single board
- 480GB LPDDR5X CPU memory + 141GB HBM3e GPU memory
- NVLink-C2C: 900 GB/s coherent CPU-GPU interconnect (7x PCIe 5.0)
- Unified memory architecture: GPU can directly access CPU memory
- Ideal for workloads with large state (recommendation systems, graph neural networks, GNNs)
- DGX GH200: 256 GH200 Superchips connected via NVLink Switch

**Hopper key innovations:**
- First-generation Transformer Engine (FP8 training)
- NVLink 4 enabling multi-GPU memory pooling
- Confidential computing (hardware-encrypted GPU workloads)
- MIG (Multi-Instance GPU): partition one H100 into up to 7 isolated instances

## Blackwell Generation (2024-2026)

**B200:**
- 192GB HBM3e, 8 TB/s memory bandwidth
- 5th-gen Tensor Cores: FP4, FP6, FP8, plus standard precisions
- 2nd-gen Transformer Engine with FP4 support
- ~4.5 PFLOPS FP4 Tensor, ~2.25 PFLOPS FP8
- NVLink 5: 1.8 TB/s bidirectional per GPU
- 1000W TDP
- 2x H100 training performance, 5x inference performance per watt (NVIDIA claims)
- Available in DGX B200 (8x B200) and HGX B200

**GB200 (Grace Blackwell):**
- Grace CPU + 2x B200 GPUs on NVLink domain
- NVLink-C2C connects Grace to both B200s
- Building block for GB200 NVL72 rack-scale system
- Designed for trillion-parameter model training

**GB200 NVL72:**
- Liquid-cooled rack-scale system
- 36 Grace CPUs + 72 Blackwell GPUs
- NVLink domain: all 72 GPUs share 13.5TB HBM3e as unified memory pool
- Up to 1.4 EFLOPS FP4
- 120 kW per rack (liquid cooling required)
- Designed as building block for DGX SuperPODs
- Target workloads: trillion-parameter training, massive inference

**GB300:**
- Enhanced GB200 variant, announced CES 2025
- Extended HBM3e capacity (288GB per GPU expected)
- Targeting availability late 2025 / early 2026
- Specific specs not fully disclosed as of March 2026

**Blackwell key innovations:**
- FP4 precision: 2x throughput vs FP8 for inference with acceptable accuracy
- NVLink 5: doubles interconnect bandwidth vs Hopper
- 2nd-gen Transformer Engine: automatically selects optimal precision per layer
- Decompression engine: real-time database query acceleration
- RAS (Reliability) engine: chip-level health monitoring

## Comparison Table

| Spec | H100 SXM | H200 SXM | B200 | GB200 NVL72 (per GPU) |
|------|----------|----------|------|----------------------|
| HBM | 80GB HBM3 | 141GB HBM3e | 192GB HBM3e | 192GB HBM3e |
| Bandwidth | 3.35 TB/s | 4.8 TB/s | 8 TB/s | 8 TB/s |
| NVLink | 900 GB/s | 900 GB/s | 1.8 TB/s | 1.8 TB/s (shared domain) |
| FP8 Tensor | 989 TFLOPS | 989 TFLOPS | ~2.25 PFLOPS | ~2.25 PFLOPS |
| TDP | 700W | 700W | 1000W | ~1000W |
| Availability | Widely available | Available | Shipping/ramping | Shipping 2025 |

## Vera Rubin (Next Generation)

- Announced GTC 2025
- Expected 2026-2027
- Vera CPU: ARM-based successor to Grace
- Rubin GPU: next-gen architecture after Blackwell
- HBM4 expected
- Details sparse -- do not speculate beyond NVIDIA disclosures

## Interconnect: NVLink and Networking

**NVLink evolution:**
- NVLink 4 (Hopper): 900 GB/s per GPU, 18 links
- NVLink 5 (Blackwell): 1.8 TB/s per GPU, 18 links at 2x speed
- NVLink Switch: enables NVLink domains beyond 8 GPUs (up to 72 in NVL72, 576 in NVL576)
- NVLink-C2C: coherent CPU-GPU link (Grace Hopper, Grace Blackwell)

**Data center networking:**
- InfiniBand (ConnectX-7, Quantum-2): traditional HPC interconnect, 400 Gb/s per port
- Spectrum-X (Ethernet): NVIDIA's AI-optimized Ethernet with Spectrum-4 switches + BlueField-3 DPUs. Alternative to InfiniBand for AI clusters.
- Trend: Spectrum-X gaining share as hyperscalers prefer Ethernet

**Selection guidance:**
- Training large models (>70B): multi-GPU with NVLink mandatory
- Inference (7B-70B): H100/H200 sufficient for most workloads
- Maximum throughput / latest gen: B200 or GB200
- Memory-bound workloads: H200 (141GB) or B200 (192GB)
- Budget-constrained cloud: H100 instances still best price-performance for many workloads

**Sources:**
- NVIDIA Data Center GPUs: nvidia.com/en-us/data-center/
- DGX: nvidia.com/en-us/data-center/dgx-platform/
- GTC keynotes: 2024, 2025 (architecture announcements)
- NVIDIA technical briefs for each architecture

As of: March 2026
