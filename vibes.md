---
layout: page
title: Vibes
vibes:
  - SmLJqVLYFtM
  - 1Nzl-rUauIA
  - TUvi-4goP7s
  - xA-_8JJC-so
  - osVlUMRZ2so
  - 1wa1KDM0P6w
  - W3Pc7ZQggoE
  - EU8j-gDtC18
  - H8l7JA-LQVA
  - qIN4jQ7TgmY
  - TdBSoy9F9NA
  - jww3TshT9ZM
  - JPfE3JJkot0
  - nPiQJfyK_i8
  - 7Cfu39jnQhE
  - _WTCIK9SkKU
  - nPyihvohLPY
  - wbBSeyHYv8c
  - yUf8ErSyvys
  - gOgwZk_e4TA
  - k9e0caOz1ww
  - qUFBP2hI2jU
  - j1oCi5VrEtA
  - 3txqEEE0zeg
  - 0ILnF7p2eiw
  - sBZ78RBQ6ZI
  - eq2pja3_vaA
  - -TGNIh4XeaY
  - YaJ3exPculA
  - 8d82SrPn_Ss
  - ISUmbcFsWpM
---

> Some chill vibes to capture a mood.

<style>
  .vibes {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    margin: -0.5em;
  }

  .vibe {
    flex: 1;
    margin: 0.5em;
  }
</style>

<div class="vibes">
  {% for vibe in page.vibes %}
  <iframe class="vibe" src="https://www.youtube-nocookie.com/embed/{{vibe}}" width="560" height="315"
    frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>
  {% endfor %}
</div>
