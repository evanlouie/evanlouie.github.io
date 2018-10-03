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
