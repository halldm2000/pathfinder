### Surya / HelioFM (Heliophysics Foundation Model)

**What it is:** A 360-million-parameter spatiotemporal transformer trained on 200+ TB of Solar Dynamics Observatory (SDO) data spanning 9 years. Surya is the operational name; HelioFM is the project name used in NVIDIA contexts. Led by NASA IMPACT (Marshall Space Flight Center) in collaboration with IBM Research, NVIDIA (compute), SwRI, Princeton, and NCAR/HAO. The first large-scale foundation model purpose-built for heliophysics.

**Key details:**
- Architecture: Spatiotemporal transformer with spectral gating (frequency-domain feature extraction) and long-short range attention (captures both local active region dynamics and global solar field evolution). Pretrained on next-frame solar image prediction, then fine-tuned with autoregressive rollout for multi-step forecasting stability.
- Training data: SDO/AIA multi-wavelength EUV imagery. 200+ TB covering ~9 years of continuous solar observation (2010-2019 range). 4096x4096 pixel full-disk images across multiple AIA channels.
- Compute: Trained on NVIDIA GPUs through the NSF National AI Research Resource (NAIRR) Pilot program.
- Forecast horizon: Full-disk solar activity prediction up to 2 hours ahead. This is the direct prediction capability; downstream models extend to longer horizons.
- Flare prediction: Surpasses existing benchmarks by ~16% on standard metrics. Predicts flare occurrence and location from evolving full-disk imagery rather than static magnetogram snapshots.
- Downstream tasks: CME detection and characterization, solar wind speed forecasting, EUV irradiance prediction, active region evolution tracking.

**How to use it:**
- Hugging Face: Model weights available for download and inference.
- GitHub: NASA-IMPACT/Surya repository with training code, inference examples, and downstream task implementations.
- IBM TerraTorch: Fine-tuning interface for adapting Surya to specific downstream tasks without retraining from scratch.
- Input: SDO/AIA multi-channel imagery (standard FITS format or preprocessed tensors).
- Output: Predicted future solar disk states, flare probability maps, feature classification.

**Relationship to other entities:**
- Part of the NVIDIA Earth-2 model family listing (HelioFM) alongside Atlas, CorrDiff, etc., but architecturally independent -- it predicts solar activity, not terrestrial weather.
- Complementary to Earth-2 atmospheric models: Surya forecasts what the Sun will do; Earth-2 models forecast how Earth's atmosphere responds. A complete pipeline would chain solar prediction into geomagnetic coupling into ionospheric effects.
- Builds on a lineage of SDO ML work: earlier CNN flare classifiers and CME detectors used SDO data but were task-specific. Surya is the foundation model approach -- pretrain broadly, fine-tune for specific tasks.

**Known issues / limitations:**
- 2-hour direct forecast horizon is short relative to CME transit times (1-4 days). Extended forecasting requires chained/downstream models.
- Training on SDO data means the model has limited exposure to extreme events (only one solar maximum in the training window, Cycle 24 which was historically weak).
- Solar farside activity is invisible to SDO -- events that emerge from behind the limb have no training signal until they appear.
- No published benchmark scorecard with head-to-head comparisons against operational SWPC forecasts as of March 2026. The 16% improvement is reported against prior ML baselines, not against human forecaster performance.

**Headline verification scores:**
- Flare prediction: ~16% improvement over prior state-of-the-art ML baselines (benchmark dataset not specified in initial reporting). No TSS or HSS values published for direct comparison with operational benchmarks as of March 2026.
- Full-disk prediction: Quantitative metrics under evaluation. Qualitative results show accurate prediction of active region evolution and coronal hole dynamics.

**Sources:**
- Paper: arXiv:2508.14112 (Surya: Foundation Model for Heliophysics)
- NASA feature: science.data.nasa.gov/features-events/inside-surya-solar-ai-model
- IBM blog: research.ibm.com/blog/surya-heliophysics-ai-model-sun
- GitHub: github.com/NASA-IMPACT/Surya
- Project site: heliofm.org

As of: March 2026
