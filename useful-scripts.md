---
layout: page
title: Useful Scripts
permalink: /useful-scripts/
---

Auto generate release notes based on git tags and remove any 'merge' commits.

```bash
git log $(git describe --tags --abbrev=0)..HEAD --oneline | grep -iv merge
```
