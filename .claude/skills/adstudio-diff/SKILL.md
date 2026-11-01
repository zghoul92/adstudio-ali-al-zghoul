---
name: adstudio-diff
description: Compare AdStudio against its approved product requirements and public reference workflows.
---
# AdStudio Diff

## Mission
Measure feature completeness against AdStudio's own requirements, not pixel-copy a competitor.

## Method
Maintain `docs/product/features.csv` with columns: id, feature, priority (must/should/could), status (done/partial/missing/out-of-scope), evidence, test.
Score must/should/could transparently; partial counts as half only when evidence supports it. Out-of-scope features are excluded and explained.

## Compare
Compare task completion, accessibility, mobile usability, image fidelity, reliability, generation latency, and quota clarity. Reference public competitor flows only to identify user expectations; never copy proprietary assets or implementation.
