---
layout: page
title: Useful Scripts
permalink: /useful-scripts/
---

### A Debug `Deployment` for Istio K8s Cluster

```yaml
# Single pod Ubuntu deployment that will not terminate
# Annotated to allow full Egress traffic when in an Istio mesh
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ubuntu-deployment
  labels:
    app: ubuntu
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ubuntu
  template:
    metadata:
      annotations:
        traffic.sidecar.istio.io/excludeOutboundIPRanges: 0.0.0.0/0 # Allow all Egress traffic https://github.com/istio/istio/issues/9304
      labels:
        app: ubuntu
    spec:
      containers:
        - name: ubuntu
          image: ubuntu:latest
          imagePullPolicy: Always
          command: ["/bin/bash", "-c", "--"]
          args: ["while true; do sleep 30; done;"]
```

### Create release notes from git logs

Auto generate release notes based on git tags and remove any 'merge' commits.

```bash
git log $(git describe --tags --abbrev=0)..HEAD --oneline | grep -iv merge
```

### Generate user story report from VSTS window

Generate User Story report for whichever user stories are on screen in VSTS. Requires "Assigned To" to be on screen.

```typescript
JSON.stringify(
  Array.from(document.querySelectorAll(".grid-row"))
    .map(row => {
      const workItemEl = row.querySelector<HTMLAnchorElement>(
        ".work-item-title-link"
      );
      const ownerEl = row.querySelector<HTMLSpanElement>(
        ".identity-picker-resolved-name"
      );
      const itemNumberMatch =
        workItemEl && workItemEl.href && workItemEl.href.match(/\/(\d+)$/i);

      return {
        itemNumber: itemNumberMatch ? itemNumberMatch[1] : -1,
        href: workItemEl ? workItemEl.href : "Work item not found",
        text: workItemEl ? workItemEl.text : "Work item not found",
        owner: ownerEl ? ownerEl.innerText : "No owner found"
      };
    })
    .reduce<{ activeLearning: any[]; fox: any[] }>(
      (carry, row) => {
        const { owner, itemNumber, text, href } = row;
        const entry = `[${itemNumber}] ${text}`;
        return [/evan/i, /nath/i, /yvon/i].findIndex(
          regex => !!owner.match(regex)
        ) >= 0
          ? { ...carry, fox: [...carry.fox, entry] }
          : { ...carry, activeLearning: [...carry.activeLearning, entry] };
      },
      { activeLearning: [], fox: [] }
    )
);
```

### Pyenv on Mojave

`zlib` headers aren't available by default: https://github.com/pyenv/pyenv/issues/1219

```bash
CFLAGS="-I$(xcrun --show-sdk-path)/usr/include" pyenv install 3.5.6
```
