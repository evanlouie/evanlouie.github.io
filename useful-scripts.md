---
layout: page
title: Useful Scripts
permalink: /useful-scripts/
---

Auto generate release notes based on git tags and remove any 'merge' commits.

```bash
git log $(git describe --tags --abbrev=0)..HEAD --oneline | grep -iv merge
```

Generate User Story report for whichever user stories are on screen in VSTS. Requires "Assigned To" to be on screen.

```javascript
Array.from(document.querySelectorAll(".grid-row"))
  .map(row => {
    const workItem = row.querySelector(".work-item-title-link");
    const owner = row.querySelector(".identity-picker-resolved-name").innerText;
    const { href, text } = workItem;
    const itemNumber = href.match(/\/(\d+)$/i)[1];
    return {
      itemNumber,
      href,
      text,
      owner
    };
  })
  .reduce(
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
  );
```
