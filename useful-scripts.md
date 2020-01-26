---
layout: page
title: Useful Scripts
permalink: /useful-scripts/
---

### Create release notes from git logs

Auto generate release notes based on git tags and remove any 'merge' commits.

```bash
git log $(git describe --tags --abbrev=0)..HEAD --oneline | grep -iv merge
```

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

### Generate JSON Report of GitHub project board state

```javascript
let board = [...document.querySelectorAll(".project-column")].map(column => {
  return {
    name: column.querySelector(".js-project-column-name").innerHTML,
    cards: [...column.querySelectorAll(`[data-content-type="Issue"]`)].map(
      card => {
        const issueEl = card.querySelector(`[data-content-label="issue"]`);
        const issueNumberEl = card.querySelector(".js-issue-number");
        return {
          name: issueEl.innerHTML,
          link:
            issueEl.getAttribute("href") ??
            Error(`unable to prase 'href' from ${issueEl}`),
          issueNumber:
            Number(issueNumberEl.innerHTML.slice(1)) ||
            Error(`unable to parse Number() from ${issueNumberEl}`)
        };
      }
    )
  };
});

console.log(JSON.stringify(board, null, 2));
```

### Remove Wix Ads

```javascript
const removeAdsByJS = () =>
  Promise.all([
    document.querySelector("#WIX_ADS"),
    document.querySelector("#SITE_BACKGROUND"),
    document.querySelector("#SITE_ROOT")
  ]).then(([wixBanner, background, root]) => {
    wixBanner.parentElement.removeChild(wixBanner);
    background.style.top = 0;
    root.style.top = 0;
  });

const removeByCSS = () => {
  const wixAdsRemovalStyles = `
  #WIX_ADS {
    display: none !important;
  }

  #SITE_BACKGROUND {
    top: 0;
  }

  #SITE_ROOT {
    top: 0;
  }`;
  const head = document.head;
  const style = document.createElement("style");
  head.appendChild(style);
  style.type = "text/css";
  style.appendChild(document.createTextNode(wixAdsRemovalStyles));
};
```

### Scrape an entire website

```bash
wget --recursive --adjust-extension --page-requisites --convert-links https://www.evanlouie.com
```

```bash
wget \
     --recursive \
     --no-clobber \
     --page-requisites \
     --html-extension \
     --convert-links \
     --restrict-file-names=windows \
     --domains website.org \
     --no-parent \
         www.website.com
```

### Generate user story report from VSTS window

Generate User Story report for whichever user stories are on screen in VSTS.
Requires "Assigned To" to be on screen.

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

`zlib` headers aren't available by default:
https://github.com/pyenv/pyenv/issues/1219

```bash
CFLAGS="-I$(xcrun --show-sdk-path)/usr/include" pyenv install 3.5.6
```
